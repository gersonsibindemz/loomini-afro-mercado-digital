
import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FallbackComponentProps {
  type: 'loading' | 'error' | 'offline' | 'empty' | 'component-error';
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
  showRetry?: boolean;
}

export const FallbackComponent: React.FC<FallbackComponentProps> = ({
  type,
  title,
  message,
  onRetry,
  children,
  showRetry = true
}) => {
  const getFallbackContent = () => {
    switch (type) {
      case 'loading':
        return {
          icon: <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>,
          title: title || 'Carregando...',
          message: message || 'Por favor, aguarde enquanto carregamos o conteúdo.',
          showRetry: false
        };

      case 'error':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          title: title || 'Erro',
          message: message || 'Algo deu errado. Tente novamente.',
          showRetry: true
        };

      case 'offline':
        return {
          icon: <WifiOff className="h-8 w-8 text-orange-500" />,
          title: title || 'Sem Conexão',
          message: message || 'Verifique sua conexão com a internet e tente novamente.',
          showRetry: true
        };

      case 'empty':
        return {
          icon: <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm">∅</span>
          </div>,
          title: title || 'Nenhum conteúdo',
          message: message || 'Não há nada para mostrar aqui.',
          showRetry: false
        };

      case 'component-error':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          title: title || 'Componente com erro',
          message: message || 'Este componente não pôde ser carregado.',
          showRetry: true
        };

      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-gray-500" />,
          title: title || 'Status desconhecido',
          message: message || 'Estado não reconhecido.',
          showRetry: false
        };
    }
  };

  const content = getFallbackContent();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          {content.icon}
        </div>
        <CardTitle className="text-gray-800">
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          {content.message}
        </p>
        
        {children && (
          <div className="border-t pt-4">
            {children}
          </div>
        )}
        
        {(content.showRetry && showRetry && onRetry) && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Specific fallback components for common scenarios
export const LoadingFallback: React.FC<{ message?: string }> = ({ message }) => (
  <FallbackComponent 
    type="loading" 
    message={message}
  />
);

export const ErrorFallback: React.FC<{ 
  message?: string; 
  onRetry?: () => void;
  showRetry?: boolean;
}> = ({ message, onRetry, showRetry = true }) => (
  <FallbackComponent 
    type="error" 
    message={message}
    onRetry={onRetry}
    showRetry={showRetry}
  />
);

export const OfflineFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <FallbackComponent 
    type="offline"
    onRetry={onRetry}
  />
);

export const EmptyFallback: React.FC<{ 
  title?: string; 
  message?: string;
  children?: ReactNode;
}> = ({ title, message, children }) => (
  <FallbackComponent 
    type="empty"
    title={title}
    message={message}
    showRetry={false}
  >
    {children}
  </FallbackComponent>
);

export const ComponentErrorFallback: React.FC<{ 
  componentName?: string;
  onRetry?: () => void;
}> = ({ componentName, onRetry }) => (
  <FallbackComponent 
    type="component-error"
    title={`Erro no ${componentName || 'Componente'}`}
    message="Este componente não pôde ser carregado corretamente."
    onRetry={onRetry}
  />
);
