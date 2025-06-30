
import React, { createContext, useContext, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface SecurityContextType {
  sanitizeInput: (input: string) => string;
  validateEmail: (email: string) => boolean;
  validateUrl: (url: string) => boolean;
  validateFileType: (file: File, allowedTypes: string[]) => boolean;
  sanitizeHtml: (html: string) => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const sanitizeInput = (input: string): string => {
    if (!input) return '';
    
    // Remove potentially dangerous characters and scripts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
  };

  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
      ALLOWED_ATTR: []
    });
  };

  const value = {
    sanitizeInput,
    validateEmail,
    validateUrl,
    validateFileType,
    sanitizeHtml
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
