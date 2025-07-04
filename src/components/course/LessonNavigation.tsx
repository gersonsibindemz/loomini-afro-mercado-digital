
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LessonNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  onPrevious,
  onNext,
  hasNext,
  hasPrevious
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Aula Anterior</span>
          </Button>

          <div className="text-sm text-gray-600">
            Navegue entre as aulas usando os botões
          </div>

          <Button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <span>Próxima Aula</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
