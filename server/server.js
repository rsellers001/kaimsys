require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const { body, validationResult } = require('express-validator');
const assistantService = require('./assistantService');

const app = express();
const port = process.env.PORT || 3001;

// Redis client setup - making it optional for easier deployment
let redisClient = null;
let redisEnabled = false;

if (process.env.REDIS_URL) {
  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL
    });
    redisClient.connect()
      .then(() => {
        console.log('Redis connected successfully');
        redisEnabled = true;
      })
      .catch(err => {
        console.log('Redis connection failed, continuing without caching:', err.message);
      });
  } catch (error) {
    console.log('Redis setup failed, continuing without caching:', error.message);
  }
}

// Using Assistant Service which has OpenAI setup inside

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Cache middleware - only active if Redis is connected
const cacheMiddleware = async (req, res, next) => {
  if (!redisEnabled || !redisClient) {
    return next();
  }
  
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

// Chat endpoint using the OpenAI Assistant API
app.post('/api/chat', validateChatRequest, cacheMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { message, primaryStandard, secondaryStandard, threadId } = req.body;

  try {
    // Use the assistantService to handle the chat
    const result = await assistantService.chat(message, primaryStandard, secondaryStandard, threadId);
    
    const response = {
      response: result.message.content[0].text.value,
      timestamp: new Date(),
      threadId: result.threadId // Return threadId for continuity in conversation
    };

    // Cache the response if Redis is enabled
    if (redisEnabled && redisClient && req.cacheKey) {
      try {
        await redisClient.set(req.cacheKey, JSON.stringify(response), {
          EX: 3600 // Cache for 1 hour
        });
      } catch (error) {
        console.error('Error caching response:', error);
        // Continue without caching
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Assistant API Error:', error);
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
    if (redisEnabled && redisClient) {
      await redisClient.hSet(`feedback:${chatId}`, {
        rating,
        comment,
        timestamp: new Date().toISOString()
      });
    }
    // Always return success even if Redis is not available
    res.json({ success: true });
  } catch (error) {
    console.error('Feedback Error:', error);
    // Still return success to the client
    res.json({ success: true, cached: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
