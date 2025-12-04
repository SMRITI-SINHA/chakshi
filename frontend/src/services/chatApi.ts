import axios, { AxiosInstance } from 'axios';
import { ChatMessage, ChatbotResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ChatApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[]
  ): Promise<ChatbotResponse> {
    try {
      const response = await this.api.post<ChatbotResponse>('/chat', {
        message,
        conversationHistory,
      });
      return response.data;
    } catch (error: any) {
      console.error('Chat API error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to send message. Please try again.'
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const chatApi = new ChatApiService();
