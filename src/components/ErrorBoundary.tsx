import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface ErrorReport {
  timestamp: string;
  userAgent: string;
  url: string;
  error: string;
  stack?: string;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Log error details
    this.logError(error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport: ErrorReport = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        error: error.message,
        stack: error.stack,
        errorId: this.state.errorId || 'unknown'
      };

      // Store in localStorage for later retrieval
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorReport);
      
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(existingErrors));
      
      // In a real app, you might send this to a logging service
      console.warn('Erro registrado:', errorReport);
    } catch (loggingError) {
      console.error('Falha ao registrar erro:', loggingError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        errorId: undefined 
      });
    } else {
      // Reload the page as last resort
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    };
    
    // Create mailto link with error details
    const subject = encodeURIComponent(`Erro na aplicação - ${this.state.errorId}`);
    const body = encodeURIComponent(`
Detalhes do erro:
ID: ${errorDetails.errorId}
Timestamp: ${errorDetails.timestamp}
Erro: ${errorDetails.error}

Stack trace:
${errorDetails.stack || 'Não disponível'}
    `);
    
    window.open(`mailto:suporte@loomini.com?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">
                Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Ocorreu um erro inesperado na aplicação. Tente uma das opções abaixo para continuar.
              </p>
              
              <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                <strong>ID do erro:</strong> {this.state.errorId}
              </div>
              
              {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 p-3 rounded text-sm">
                  <summary className="cursor-pointer font-medium text-red-600 mb-2">
                    Detalhes técnicos
                  </summary>
                  <div className="font-mono text-xs text-red-600 whitespace-pre-wrap">
                    <strong>Erro:</strong> {this.state.error.message}
                    {this.state.error.stack && (
                      <>
                        <br /><br />
                        <strong>Stack trace:</strong>
                        <br />
                        {this.state.error.stack}
                      </>
                    )}
                  </div>
                </details>
              )}
              
              <div className="space-y-2">
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente ({this.maxRetries - this.retryCount} tentativas restantes)
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir para Página Inicial
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={this.handleReportError}
                  className="w-full text-sm"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Reportar Erro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for programmatically triggering error boundary
export const useErrorHandler = () => {
  return (error: Error) => {
    throw error;
  };
};
