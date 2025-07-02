
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, CheckCircle, Clock } from 'lucide-react';

interface LessonCardProps {
  id: string;
  title: string;
  description?: string | null;
  duration?: string | null;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  description,
  duration,
  isCompleted = false,
  isActive = false,
  onClick
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${isCompleted ? 'bg-green-50' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Play className="w-5 h-5 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${
              isActive ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {title}
            </h4>
            
            {description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {description}
              </p>
            )}
            
            {duration && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {duration}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
