
import { useCallback } from 'react';
import { useNotifications } from '@/components/NotificationSystem';

export interface AppError extends Error {
  code?: string;
  context?: Record<string, unknown>;
  userMessage?: string;
}

interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  context?: Record<string, unknown>;
}

export const useErrorHandler = () => {
  const { addNotification } = useNotifications();

  const handleError = useCallback((
    error: Error | AppError | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showNotification = true,
      logToConsole = true,
      context = {}
    } = options;

    // Normalize error
    let normalizedError: AppError;
    if (error instanceof Error) {
      normalizedError = error as AppError;
    } else {
      normalizedError = { 
        name: 'UnknownError',
        message: String(error)
      } as AppError;
    }

    // Add context
    normalizedError.context = { ...normalizedError.context, ...context };

    // Log to console
    if (logToConsole) {
      console.error('Error handled:', normalizedError);
    }

    // Show notification
    if (showNotification) {
      const userMessage = normalizedError.userMessage || getDefaultUserMessage(normalizedError);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: userMessage
      });
    }

    return normalizedError;
  }, [addNotification]);

  const createError = useCallback((
    message: string,
    code?: string,
    userMessage?: string,
    context?: Record<string, unknown>
  ): AppError => {
    const error = new Error(message) as AppError;
    error.code = code;
    error.userMessage = userMessage;
    error.context = context;
    return error;
  }, []);

  const wrapAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorOptions?: ErrorHandlerOptions
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, errorOptions);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    createError,
    wrapAsync
  };
};

function getDefaultUserMessage(error: AppError): string {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }

  // Authentication errors
  if (error.code?.includes('auth') || error.message.includes('unauthorized')) {
    return 'Erro de autenticação. Faça login novamente.';
  }

  // Database errors
  if (error.message.includes('supabase') || error.message.includes('database')) {
    return 'Erro no servidor. Tente novamente em alguns instantes.';
  }

  // Validation errors
  if (error.code?.includes('validation')) {
    return 'Dados inválidos. Verifique as informações e tente novamente.';
  }

  // Generic fallback
  return 'Algo deu errado. Tente novamente em alguns instantes.';
}
