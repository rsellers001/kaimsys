const { OpenAI } = require('openai');
require('dotenv').config();

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the assistant ID
const ASSISTANT_ID = 'asst_mdHmmLAhyOprNvM3MhX6Tm6K';

// Helper functions for working with the assistant
const assistantService = {
  // Create a new thread for a conversation
  async createThread() {
    try {
      const thread = await openai.beta.threads.create();
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  },

  // Add a message to a thread
  async addMessage(threadId, message, metadata = {}) {
    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
        metadata
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Run the assistant on a thread
  async runAssistant(threadId) {
    try {
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID
      });
      return run.id;
    } catch (error) {
      console.error('Error running assistant:', error);
      throw error;
    }
  },

  // Check the status of a run
  async checkRunStatus(threadId, runId) {
    try {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      return run.status;
    } catch (error) {
      console.error('Error checking run status:', error);
      throw error;
    }
  },

  // Get the assistant's response from a thread
  async getMessages(threadId) {
    try {
      const messages = await openai.beta.threads.messages.list(threadId);
      return messages.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Helper function to poll for completion
  async waitForCompletion(threadId, runId, maxRetries = 60, retryInterval = 1000) {
    let retries = 0;
    
    while (retries < maxRetries) {
      const status = await this.checkRunStatus(threadId, runId);
      
      if (status === 'completed') {
        return 'completed';
      } else if (status === 'failed' || status === 'cancelled' || status === 'expired') {
        throw new Error(`Run ended with status: ${status}`);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      retries += 1;
    }
    
    throw new Error('Timed out waiting for assistant response');
  },

  // Complete helper function for chat
  async chat(message, threadId = null) {
    try {
      // Create a new thread if not provided
      if (!threadId) {
        threadId = await this.createThread();
      }

      // Add message to thread
      await this.addMessage(threadId, message);
      
      // Run the assistant (no special instructions needed as the assistant is pre-configured)
      const runId = await this.runAssistant(threadId);
      
      // Wait for completion
      await this.waitForCompletion(threadId, runId);
      
      // Get messages
      const messages = await this.getMessages(threadId);
      
      // Return thread ID and newest assistant message
      return {
        threadId,
        message: messages.find(msg => msg.role === 'assistant')
      };
    } catch (error) {
      console.error('Error in chat flow:', error);
      throw error;
    }
  }
};

module.exports = assistantService;
