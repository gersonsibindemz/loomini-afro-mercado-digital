
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  showText = true, 
  size = 'md',
  className = '' 
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Progresso do Curso
          </span>
          <span className="text-sm font-medium text-gray-900">
            {current}/{total} ({percentage}%)
          </span>
        </div>
      )}
      
      <Progress 
        value={percentage} 
        className={`w-full ${sizeClasses[size]}`}
      />
      
      {showText && (
        <div className="mt-1 text-xs text-gray-500">
          {current === total ? 'Curso concluído!' : `${total - current} aulas restantes`}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
