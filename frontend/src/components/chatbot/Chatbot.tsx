"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiSend, FiMic } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa'; // Import the robot icon
import { sendChatMessage, ChatResponse, ApiError } from '../../lib/apiClient';

// Define the shape of a message for type safety
interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAuthError?: boolean;
}

// MessageBubble sub-component for displaying a single message
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const router = useRouter();
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        <p>{message.content}</p>
        {message.isAuthError && (
            <button
                onClick={() => router.push('/login')}
                className="mt-2 text-blue-400 hover:text-blue-300 font-bold underline focus:outline-none"
            >
                Login
            </button>
        )}
      </div>
    </div>
  );
};

export default function Chatbot({ onTaskActionCompleted }: { onTaskActionCompleted: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // State for voice input
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Default to English, but captures Roman/Urdu reasonably well for transcription
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInputValue = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage({
        message: currentInputValue,
        conversation_id: conversationId,
      });

      // Backend now sends JSON in response.response, parse it
      let parsedBackendResponse;
      try {
        parsedBackendResponse = JSON.parse(response.response);
      } catch (jsonError) {
        console.error("Failed to parse backend JSON response:", jsonError);
        const errorBotMessage: Message = { role: 'assistant', content: `Sorry, I received an unreadable response from the server.` };
        setMessages(prevMessages => [...prevMessages, errorBotMessage]);
        return; // Exit if response isn't JSON
      }

      // Check if the backend executed a task action and returned a confirmation
      if (parsedBackendResponse.action === "none" && parsedBackendResponse.parameters && parsedBackendResponse.parameters.message) {
        const messageText = parsedBackendResponse.parameters.message;
        const assistantMessage: Message = { role: 'assistant', content: messageText };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);

        // If the message indicates a task action was completed, trigger refetch
        // We can be more robust here if the backend sends a specific flag, but checking text works for now per requirements
        onTaskActionCompleted();
        
      } else {
        // Fallback for unexpected JSON structure or direct text from backend if no action
        const assistantMessage: Message = { role: 'assistant', content: response.response };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      }

      setConversationId(response.conversation_id);

    } catch (error: any) {
      if ((error instanceof ApiError && error.status === 401) || error.status === 401) {
        const authMessage: Message = { 
          role: 'assistant', 
          content: "You have to be signed in with your Google account to use the chatbot.",
          isAuthError: true
        };
        setMessages(prevMessages => [...prevMessages, authMessage]);
      } else {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        const errorBotMessage: Message = { role: 'assistant', content: `Sorry, something went wrong: ${errorMessage}` };
        setMessages(prevMessages => [...prevMessages, errorBotMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any); // Type assertion to satisfy FormEvent requirement
    }
  };

  return (
    // Root container with fixed positioning, responsive for mobile and desktop
    <div className="fixed inset-x-0 bottom-0 md:bottom-4 md:right-8 z-50 flex justify-end md:items-end">
      {/* Chat Window - conditionally rendered and responsive */}
      {isOpen && (
        <div
          id="chat-window"
          role="region"
          aria-label="Chat window"
          className={`w-full h-1/2 md:w-96 md:h-[32rem] bg-white/10 backdrop-blur-md rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 id="chat-title" className="text-lg font-bold text-white">AI Assistant</h2>
            <button onClick={toggleChat} className="text-white/70 hover:text-white" aria-label="Close chat" aria-controls="chat-window" aria-expanded={isOpen}>
              <FiX size={24} />
            </button>
          </header>

          {/* Message Area */}
          <main role="log" aria-live="polite" className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                          <MessageBubble key={index} message={msg} />
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-md px-4 py-2 rounded-lg bg-gray-700">
                              <p className="animate-pulse">The assistant is thinking...</p> {/* Descriptive loading indicator */}
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </main>
          <footer className="p-4 border-t border-white/20">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type or speak..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  disabled={isLoading}
                  aria-label="Message input"
                  aria-controls="chat-window"
              />
               <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
                  aria-label="Voice input"
                  title="Speak"
                >
                  <FiMic size={20} />
                </button>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
              >
                  <FiSend className="text-white" />
              </button>
              </form>
          </footer>
        </div>
      )}

      {/* Launcher button - conditionally rendered */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-transform duration-200 ease-in-out
          before:content-[''] before:absolute before:inset-0 before:rounded-full before:p-px before:bg-gradient-to-r before:from-neon-blue before:via-neon-cyan before:to-neon-purple before:mask-image:linear-gradient(to_bottom_right,white,white_50%,transparent_50%,transparent) before:mask-composite:exclude
          animate-neon-pulse"
          aria-label="Toggle chat"
          aria-controls="chat-window"
          aria-expanded={isOpen}
        >
          <FaRobot size={28} /> {/* Robot icon */}
        </button>
      )}
    </div>
  );
}

// Add these to your global CSS (e.g., globals.css or directly in a <style> tag if using styled-jsx)
/*
@keyframes neon-pulse {
  0%, 100% {
    box-shadow: 0 0 5px theme(colors.blue.500), 0 0 10px theme(colors.cyan.400), 0 0 15px theme(colors.purple.500);
  }
  50% {
    box-shadow: 0 0 15px theme(colors.blue.500), 0 0 25px theme(colors.cyan.400), 0 0 35px theme(colors.purple.500);
  }
}

.animate-neon-pulse {
  animation: neon-pulse 2s infinite alternate;
}

.from-neon-blue { --tw-from-color: #00F; }
.via-neon-cyan { --tw-via-color: #0FF; }
.to-neon-purple { --tw-to-color: #F0F; }
*/