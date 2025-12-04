import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatbotResponse } from '../types';
import { chatApi } from '../services/chatApi';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial greeting message
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'initial',
      role: 'assistant',
      content: `# Welcome to Chakshi Law Chatbot! ⚖️

I can help you find case information from eCourts India.

**What I can do:**
• Search by CNR number (fastest!)
• Find cases by party names
• Look up cases by case number
• Search by advocate name
• View court orders and cause lists
• Caveat search

**Just tell me what you're looking for, and I'll help you find it!**

Don't worry if you don't have all the details - I'll ask questions to help narrow down the search.`,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Send to API
        const response: ChatbotResponse = await chatApi.sendMessage(
          content,
          [...messages, userMessage]
        );

        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          data: response.results || null,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        setError(err.message);

        // Add error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ **Error:** ${err.message}\n\nPlease try again or rephrase your question.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}
