interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

interface NetworkError extends Error {
  isNetworkError: boolean;
  status?: number;
  isRetryable: boolean;
}

export class AppError extends Error {
  public code: string;
  public userMessage: string;
  public isOperational: boolean;
  public timestamp: Date;

  constructor(
    message: string, 
    code: string = 'UNKNOWN_ERROR', 
    userMessage: string = 'Ocorreu um erro inesperado',
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.userMessage = userMessage;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    this.name = 'AppError';
  }
}

// Async operation wrapper with error handling
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operação falhou'
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    console.error(errorMessage, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

// Retry mechanism for failed operations
export async function retryAsync<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxAttempts, delay, backoff = 1, onRetry } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Wait before retry with exponential backoff
      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

// Network error handling
export function createNetworkError(error: any, url?: string): NetworkError {
  const networkError = new Error(
    `Erro de rede: ${error.message || 'Falha na conexão'}`
  ) as NetworkError;
  
  networkError.isNetworkError = true;
  networkError.isRetryable = true;
  
  if (error.status) {
    networkError.status = error.status;
    networkError.isRetryable = error.status >= 500 || error.status === 408 || error.status === 429;
  }
  
  return networkError;
}

// Form validation error handling
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export function createValidationError(field: string, message: string, code: string = 'VALIDATION_ERROR'): ValidationError {
  return { field, message, code };
}

// Generic error handler for UI components
export function handleComponentError(error: Error, componentName: string): string {
  console.error(`Erro em ${componentName}:`, error);
  
  if (error instanceof AppError) {
    return error.userMessage;
  }
  
  if (error.message.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Operação demorou muito para responder. Tente novamente.';
  }
  
  return 'Algo deu errado. Tente novamente em alguns instantes.';
}

// Local storage with error handling
export const safeStorage = {
  getItem: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key: ${key}`, error);
      return defaultValue;
    }
  },

  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erro ao escrever localStorage key: ${key}`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover localStorage key: ${key}`, error);
      return false;
    }
  }
};

// Offline detection
export function isOnline(): boolean {
  return navigator.onLine;
}

export function onlineStatusHandler(callback: (isOnline: boolean) => void) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// Error reporting
export interface ErrorReport {
  errorId: string;
  timestamp: string;
  error: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
}

export function reportError(error: Error, additionalInfo?: Record<string, any>): string {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const report: ErrorReport = {
    errorId,
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalInfo
  };

  // Store locally
  try {
    const existingReports = JSON.parse(localStorage.getItem('error_reports') || '[]');
    existingReports.push(report);
    
    // Keep only last 100 reports
    if (existingReports.length > 100) {
      existingReports.splice(0, existingReports.length - 100);
    }
    
    localStorage.setItem('error_reports', JSON.stringify(existingReports));
  } catch (storageError) {
    console.error('Falha ao armazenar relatório de erro:', storageError);
  }

  console.error('Erro reportado:', report);
  return errorId;
}
