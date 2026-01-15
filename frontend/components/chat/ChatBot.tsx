'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
}

export default function ChatBot({ className = '' }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(true); // Open by default!
  const [isExpanded, setIsExpanded] = useState(false); // Full screen mode
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const response = await api.getChatSuggestions();
        if (response.success) {
          setSuggestions(response.data);
        }
      } catch (error) {
        console.error('Failed to load suggestions:', error);
        // Fallback suggestions
        setSuggestions([
          "What is inflation and how does it affect me?",
          "Explain the NIFTY 50 index",
          "How are stock markets and inflation related?",
          "Why do currency exchange rates fluctuate?",
          "What causes market crashes?",
          "How to read economic indicators?"
        ]);
      }
    };
    loadSuggestions();
  }, []);

  // Add welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `👋 **Welcome to Economic Insights!**

I'm your AI assistant, here to help you understand the data you're exploring.

**I can explain:**
• 📊 Inflation trends and what they mean for you
• 📈 Stock market movements and patterns
• 💱 Currency exchange rate dynamics
• 🔗 How different economic indicators connect
• 🌍 Comparisons between countries

**Try asking me something!** 👇`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(text);
      
      if (response.success) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(response.data.timestamp)
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "😅 Oops! I couldn't process that. The servers might be warming up. Try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: `🔄 **Chat cleared!** 

Ready for your next question. What would you like to know about the economic data?`,
      timestamp: new Date()
    }]);
    setShowSuggestions(true);
  };

  // Format message content with markdown-like styling
  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return `<li class="ml-4 mb-1">${line.substring(2)}</li>`;
        }
        return line;
      })
      .join('<br/>');
  };

  // Collapsed state - show prominent tab on side
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-50
          bg-gradient-to-b from-blue-600 via-purple-600 to-blue-700
          text-white
          px-3 py-8
          rounded-l-2xl
          shadow-2xl
          hover:px-5
          transition-all duration-300
          flex flex-col items-center gap-3
          border-l-4 border-white/20
          group
          ${className}
        `}
        title="Open AI Assistant"
      >
        <span className="text-2xl">🤖</span>
        <span className="writing-vertical text-sm font-semibold tracking-wider">
          AI ASSISTANT
        </span>
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 
                        w-4 h-8 bg-green-500 rounded-l-full
                        animate-pulse shadow-lg shadow-green-500/50" />
        <style jsx>{`
          .writing-vertical {
            writing-mode: vertical-rl;
            text-orientation: mixed;
          }
        `}</style>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop for expanded mode */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div 
        className={`
          fixed z-50
          bg-white dark:bg-gray-900
          shadow-2xl
          border-l border-gray-200 dark:border-gray-700
          flex flex-col
          transition-all duration-500 ease-out
          ${isExpanded 
            ? 'inset-4 rounded-3xl' 
            : 'right-0 top-0 bottom-0 w-[420px] rounded-l-3xl'
          }
          ${className}
        `}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-5 py-4 
                     bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 
                     text-white rounded-tl-3xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-3xl">🤖</span>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Economic Insights AI</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                Powered by AI • Ask anything
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              title="Hide panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 
                       border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span>🌍</span> 35+ Countries
          </span>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span>📊</span> Live Data
          </span>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span>🧠</span> AI Powered
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                               flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                  🤖
                </div>
              )}
              <div
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3
                  ${message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-md'
                  }
                `}
              >
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                <div className={`text-[10px] mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 
                               flex items-center justify-center text-white text-sm ml-2 flex-shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                             flex items-center justify-center text-white text-sm mr-2">
                🤖
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && messages.length <= 1 && (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                💡 Popular questions:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.slice(0, 6).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left text-sm px-4 py-3 
                             bg-gradient-to-r from-blue-50 to-purple-50 
                             dark:from-gray-800 dark:to-gray-800
                             text-gray-700 dark:text-gray-300
                             rounded-xl 
                             hover:from-blue-100 hover:to-purple-100 
                             dark:hover:from-gray-700 dark:hover:to-gray-700
                             transition-all duration-200
                             border border-gray-200 dark:border-gray-700
                             hover:border-blue-300 dark:hover:border-blue-600
                             hover:shadow-md
                             flex items-center gap-2"
                  >
                    <span className="text-blue-500">→</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-bl-3xl">
          <div className="flex gap-3 items-center">
            <button
              onClick={clearChat}
              className="p-2.5 text-gray-400 hover:text-red-500 
                       hover:bg-red-50 dark:hover:bg-red-900/20 
                       rounded-xl transition-all"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the economic data..."
                disabled={isLoading}
                className="w-full px-5 py-3 
                         bg-white dark:bg-gray-900 
                         text-gray-900 dark:text-white
                         rounded-2xl text-sm
                         border-2 border-gray-200 dark:border-gray-700
                         focus:border-blue-500 dark:focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/20
                         disabled:opacity-50
                         transition-all
                         pr-12"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2
                         p-2 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-xl
                         hover:from-blue-700 hover:to-purple-700 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-lg shadow-blue-500/30
                         hover:shadow-xl hover:shadow-blue-500/40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Press Enter to send • AI responses may take a moment
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
