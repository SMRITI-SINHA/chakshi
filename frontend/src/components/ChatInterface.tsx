import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '../hooks/useChat';
import { chatApi } from '../services/chatApi';

export const ChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } =
    useChat();
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>(
    'checking'
  );

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await chatApi.healthCheck();
      setApiStatus(isHealthy ? 'online' : 'offline');
    };
    checkHealth();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Scale size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Chakshi Law Chatbot
                </h1>
                <p className="text-sm text-gray-600">
                  eCourts India Case Information Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* API Status Indicator */}
              <div className="flex items-center gap-2">
                {apiStatus === 'online' && (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </>
                )}
                {apiStatus === 'offline' && (
                  <>
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm text-red-600">Offline</span>
                  </>
                )}
                {apiStatus === 'checking' && (
                  <span className="text-sm text-gray-500">Checking...</span>
                )}
              </div>

              {/* Clear Chat Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <AnimatePresence mode="sync">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
