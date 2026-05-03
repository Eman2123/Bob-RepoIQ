const axios = require('axios');

class ChatService {
  constructor() {
    this.watsonxUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    this.apiKey = process.env.WATSONX_API_KEY;
    this.projectId = process.env.WATSONX_PROJECT_ID;
  }

  // Get IBM Cloud IAM token
  async getIAMToken() {
    try {
      const response = await axios.post(
        'https://iam.cloud.ibm.com/identity/token',
        new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: this.apiKey
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error(`Failed to get IAM token: ${error.message}`);
    }
  }

  // Chat with Bob using IBM watsonx.ai Granite model
  async chat(message, codeContext = '', chatHistory = []) {
    try {
      // Build conversation context
      let conversationContext = 'You are Bob, a highly skilled software engineer assistant. ';
      
      if (codeContext) {
        conversationContext += `\n\nCode Context:\n${codeContext}\n\n`;
      }

      if (chatHistory.length > 0) {
        conversationContext += 'Previous conversation:\n';
        chatHistory.forEach(msg => {
          conversationContext += `${msg.sender === 'user' ? 'User' : 'Bob'}: ${msg.text}\n`;
        });
      }

      conversationContext += `\nUser: ${message}\nBob:`;

      // Get IBM Cloud IAM token
      const token = await this.getIAMToken();

      // Call watsonx.ai API with Granite model
      const response = await axios.post(
        `${this.watsonxUrl}/ml/v1/text/generation?version=2023-05-29`,
        {
          input: conversationContext,
          model_id: 'ibm/granite-13b-chat-v2',
          project_id: this.projectId,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            top_k: 50,
            stop_sequences: ['\nUser:', '\n\n']
          }
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const reply = response.data.results[0].generated_text.trim();
      
      return {
        message: reply,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Chat error:', error);
      
      // Return fallback response
      return {
        message: 'I\'m here to help! I can answer questions about your code, explain functions, suggest improvements, and more. What would you like to know?',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get code explanation
  async explainCode(code, language = 'javascript') {
    try {
      const prompt = `Explain the following ${language} code in plain English, suitable for non-technical stakeholders:\n\n${code}\n\nExplanation:`;
      
      const token = await this.getIAMToken();

      const response = await axios.post(
        `${this.watsonxUrl}/ml/v1/text/generation?version=2023-05-29`,
        {
          input: prompt,
          model_id: 'ibm/granite-13b-chat-v2',
          project_id: this.projectId,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.5,
            top_p: 1,
            top_k: 50
          }
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data.results[0].generated_text.trim();
    } catch (error) {
      console.error('Code explanation error:', error);
      return 'This code performs operations related to the application logic. For a detailed explanation, please try again or contact support.';
    }
  }
}

module.exports = new ChatService();

// Made with Bob