# KAiM Systems Compliance Assistant Backend

This server provides the backend API for the KAiM Systems Compliance Assistant, which uses OpenAI's Assistant API.

## Configuration

1. Make sure you have Node.js installed (v14.x or later)
2. Install dependencies by running `npm install` in this directory
3. Create a `.env` file based on `.env.example` and add your OpenAI API key
4. Start the server with `npm start`

## OpenAI Assistant

The backend uses OpenAI's Assistant API with assistant ID: `asst_dpRr7Xj66ivUtIChztNiW7mV`.

### API Endpoints

- **POST /api/chat**
  - Handles conversations with the OpenAI Assistant
  - Parameters:
    - `message`: The user's message
    - `primaryStandard`: The primary compliance standard selected (e.g., "NIST 800.53")
    - `secondaryStandard`: (Optional) A secondary standard to compare with
    - `threadId`: (Optional) For continuing previous conversations

- **POST /api/feedback**
  - Records user feedback about assistant responses
  - Parameters:
    - `chatId`: Identifier for the chat session
    - `rating`: Numeric rating (1-5)
    - `comment`: (Optional) Additional feedback

## Deployment

To deploy this server:

1. Set up a Node.js environment on your hosting provider
2. Configure environment variables (especially OPENAI_API_KEY)
3. Start the server using PM2 or similar process manager:
   ```
   npm install -g pm2
   pm2 start server.js
   ```

## Development

For local development:

1. Install dependencies: `npm install`
2. Start in development mode: `npm run dev`
3. The server will run at http://localhost:3001 by default
