require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const { OpenAI } = require('openai');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3001;

// Redis client setup
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Cache middleware
const cacheMiddleware = async (req, res, next) => {
  const cacheKey = `chat:${JSON.stringify(req.body)}`;
  try {
    const cachedResponse = await redisClient.get(cacheKey);
    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }
    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error('Cache error:', error);
    next();
  }
};

// Validation middleware
const validateChatRequest = [
  body('message').notEmpty().trim(),
  body('primaryStandard').notEmpty(),
  body('secondaryStandard').optional(),
];

// Chat endpoint
app.post('/api/chat', validateChatRequest, cacheMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { message, primaryStandard, secondaryStandard } = req.body;

  try {
    const systemPrompt = `You are a knowledgeable compliance expert. Focus primarily on ${primaryStandard}${
      secondaryStandard ? ` and relate it to ${secondaryStandard} where relevant` : ''
    }. Provide accurate, clear, and concise answers about compliance requirements, controls, and best practices. Always cite specific standards and controls.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = {
      response: completion.choices[0].message.content,
      timestamp: new Date(),
    };

    // Cache the response
    if (req.cacheKey) {
      await redisClient.set(req.cacheKey, JSON.stringify(response), {
        EX: 3600 // Cache for 1 hour
      });
    }

    res.json(response);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Feedback endpoint
app.post('/api/feedback', [
  body('chatId').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { chatId, rating, comment } = req.body;

  try {
    await redisClient.hSet(`feedback:${chatId}`, {
      rating,
      comment,
      timestamp: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Feedback Error:', error);
    res.status(500).json({ error: 'Error saving feedback' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
