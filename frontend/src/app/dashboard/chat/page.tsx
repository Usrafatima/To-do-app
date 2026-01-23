"use client";

import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { sendChatMessage, ChatResponse } from '../../../lib/apiClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage({
        message: inputValue,
        conversation_id: conversationId,
      });

      const assistantResponseContent = response.response;
      let displayContent = assistantResponseContent;

      try {
        const parsedResponse = JSON.parse(assistantResponseContent);
        // Check if the parsed response has the expected structure
        if (parsedResponse && parsedResponse.action && parsedResponse.parameters && parsedResponse.parameters.message) {
          displayContent = parsedResponse.parameters.message;
        }
      } catch (jsonError) {
        // Not a JSON string, or not in the expected format, display as is
        console.warn("Backend response was not a valid JSON action, or missing 'message' parameter:", jsonError);
      }

      const assistantMessage: Message = { role: 'assistant', content: displayContent };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setConversationId(response.conversation_id);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      const errorBotMessage: Message = { role: 'assistant', content: `Sorry, something went wrong: ${errorMessage}` };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-xl font-bold">Chat with AI Assistant</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-lg px-4 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-lg px-4 py-2 rounded-lg bg-gray-700">
                    <p className="animate-pulse">The assistant is thinking...</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="text-white" />
          </button>
        </form>
      </footer>
    </div>
  );
}
