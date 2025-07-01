
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  messages: any[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  showQuickActions: boolean;
  quickActionButtons: string[];
  onQuickAction: (action: string) => void;
  onEscalation: () => void;
  formatMessage: (text: string) => React.ReactNode;
}

const MobileChatOverlay: React.FC<MobileChatOverlayProps> = ({
  isOpen,
  onClose,
  messages,
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  showQuickActions,
  quickActionButtons,
  onQuickAction,
  onEscalation,
  formatMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] bg-white flex flex-col">
      {/* Mobile Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <span className="font-semibold">Assistente e-Loomini</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-700 rounded-full"
          aria-label="Fechar chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm">{formatMessage(message.text)}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2 text-sm">Assistente está digitando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">Ações rápidas:</div>
          <div className="flex flex-wrap gap-2">
            {quickActionButtons.map((action) => (
              <button
                key={action}
                onClick={() => onQuickAction(action)}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Escalation Button */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <button
          onClick={onEscalation}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Phone size={16} />
          <span>Falar com Humano</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Enviar mensagem"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatOverlay;
