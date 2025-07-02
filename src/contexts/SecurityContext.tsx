
import React, { createContext, useContext, ReactNode } from 'react';

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
    
    // Create a temporary DOM element to safely extract text content
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input;
    let sanitized = tempDiv.innerHTML;
    
    // Remove potentially dangerous patterns
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
    
    return sanitized;
  };

  const validateEmail = (email: string): boolean => {
    if (!email || email.length > 254) return false;
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      
      // Check for dangerous protocols
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i
      ];
      
      return !suspiciousPatterns.some(pattern => pattern.test(url));
    } catch {
      return false;
    }
  };

  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    if (!file || !allowedTypes || allowedTypes.length === 0) return false;
    
    // Check MIME type
    if (!allowedTypes.includes(file.type)) return false;
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) return false;
    
    // Check file extension
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Dangerous file extensions
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.cpl', '.dll',
      '.vbs', '.js', '.jar', '.app', '.deb', '.pkg', '.dmg'
    ];
    
    return !dangerousExtensions.includes(fileExtension);
  };

  const sanitizeHtml = (html: string): string => {
    if (!html) return '';
    
    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Define allowed tags and attributes
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const allowedAttributes: string[] = [];
    
    // Remove all script tags and dangerous elements
    const scriptTags = tempDiv.querySelectorAll('script, object, embed, iframe, form, input, button');
    scriptTags.forEach(tag => tag.remove());
    
    // Remove all attributes except allowed ones
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(element => {
      // Remove all attributes
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        if (!allowedAttributes.includes(attr.name.toLowerCase())) {
          element.removeAttribute(attr.name);
        }
      });
      
      // Remove disallowed tags
      if (!allowedTags.includes(element.tagName.toLowerCase())) {
        // Replace with text content
        const textNode = document.createTextNode(element.textContent || '');
        element.parentNode?.replaceChild(textNode, element);
      }
    });
    
    return tempDiv.innerHTML;
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
