
import { useState, useEffect, useCallback, useRef } from 'react';
import { safeAsync, retryAsync, AppError } from '@/utils/errorHandling';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseSafeAsyncOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useSafeAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseSafeAsyncOptions = {}
) {
  const {
    immediate = true,
    retries = 0,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const isMountedRef = useRef(true);
  const currentRequestRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    const requestId = ++currentRequestRef.current;
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let result: T;
      
      if (retries > 0) {
        result = await retryAsync(asyncFunction, {
          maxAttempts: retries + 1,
          delay: retryDelay,
          onRetry: (attempt, error) => {
            console.warn(`Tentativa ${attempt} falhou:`, error.message);
          }
        });
      } else {
        const { data, error } = await safeAsync(asyncFunction);
        if (error) throw error;
        result = data!;
      }

      // Only update state if this is still the current request and component is mounted
      if (requestId === currentRequestRef.current && isMountedRef.current) {
        setState({
          data: result,
          loading: false,
          error: null
        });
        
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(
        error instanceof Error ? error.message : String(error),
        'ASYNC_ERROR',
        'Falha ao carregar dados'
      );

      // Only update state if this is still the current request and component is mounted
      if (requestId === currentRequestRef.current && isMountedRef.current) {
        setState({
          data: null,
          loading: false,
          error: appError
        });
        
        if (onError) {
          onError(appError);
        }
      }
    }
  }, [asyncFunction, retries, retryDelay, onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies, execute, immediate]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

// Hook for handling form submissions safely
export function useSafeSubmit<T>(
  submitFunction: (data: any) => Promise<T>,
  options: UseSafeAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const submit = useCallback(async (formData: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await safeAsync(() => submitFunction(formData));
      
      if (error) throw error;

      setState({
        data: data!,
        loading: false,
        error: null
      });

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return { success: true, data };
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(
        error instanceof Error ? error.message : String(error),
        'SUBMIT_ERROR',
        'Falha ao enviar formulário'
      );

      setState({
        data: null,
        loading: false,
        error: appError
      });

      if (options.onError) {
        options.onError(appError);
      }

      return { success: false, error: appError };
    }
  }, [submitFunction, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    submit,
    reset
  };
}
