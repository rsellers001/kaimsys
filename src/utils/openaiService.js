import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable compliance expert specializing in:
- NIST 800.53
- COBIT
- SOX
- GDPR
and other regulatory standards.

Provide accurate, clear, and concise answers about compliance requirements, controls, and best practices.
Always cite the specific standard and control/requirement you're referencing.`;

export const generateComplianceResponse = async (userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new error;
  }
};
