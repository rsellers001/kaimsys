# OpenAI Assistant Setup for KAiM Systems Website

This guide explains how to set up and configure the OpenAI Assistant for the KAiM Systems Compliance Assistant feature.

## Assistant Configuration

The website now uses OpenAI Assistant ID: `asst_dpRr7Xj66ivUtIChztNiW7mV`

### What's Been Changed

1. **Server-side Changes**:
   - Created `assistantService.js` - A service module that handles interactions with the OpenAI Assistant API
   - Updated `server.js` - Modified to use the Assistant API instead of the Chat Completions API
   - Added conversation threading support to maintain context across chat sessions

2. **Client-side Changes**:
   - Updated `compliance-assistant.html` - Modified to call the server API and handle Assistant responses
   - Added thread ID tracking to maintain conversation context

## Configuration Steps

1. **Set up your OpenAI API Key**:
   - Create a `.env` file in the server directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your-api-key-here`

2. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Start the Server**:
   ```bash
   node server.js
   ```

4. **Update .windsurfrules (if applicable)**:
   If you're using a `.windsurfrules` file for configuration, add the following:

   ```json
   {
     "ignoreFiles": [
       "node_modules",
       ".git",
       "AWSCLIV2.pkg",
       "*.log"
     ],
     "deploySettings": {
       "targetBucket": "kaimsys",
       "region": "us-east-1",
       "publicDirectory": "public"
     },
     "aiSettings": {
       "assistantId": "asst_dpRr7Xj66ivUtIChztNiW7mV",
       "apiKeyEnvVar": "OPENAI_API_KEY"
     },
     "navigationStructure": {
       "mainPages": [
         "index.html",
         "about.html",
         "services.html",
         "products.html",
         "compliance-assistant.html",
         "compliance-guide.html"
       ]
     }
   }
   ```

## Deployment Checklist

- [ ] OpenAI API key added to server environment
- [ ] Dependencies installed
- [ ] Server running and responding to requests
- [ ] Compliance Assistant correctly using the specified Assistant ID
- [ ] Conversation threading working properly

## Troubleshooting

If you encounter issues:

1. Check the server logs for error messages
2. Verify your OpenAI API key is valid and has access to the Assistant API
3. Ensure the Assistant ID is correct
4. Check network requests in the browser developer tools

For further assistance, refer to the [OpenAI Assistant API documentation](https://platform.openai.com/docs/assistants/overview).
