
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lesson } from '@/types/course';

interface LessonInfoProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
}

export const LessonInfo: React.FC<LessonInfoProps> = ({
  lesson,
  isCompleted,
  onMarkComplete
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{lesson.title}</CardTitle>
            {lesson.duration && (
              <p className="text-gray-600 mt-1">
                Duração: {lesson.duration}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isCompleted && (
              <Button
                onClick={onMarkComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como Concluída
              </Button>
            )}
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Concluída
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p className="text-gray-700">
            {lesson.description || 
              `Nesta aula você aprenderá os conceitos fundamentais sobre ${lesson.title.toLowerCase()}. 
              Siga as explicações e pratique os exercícios para fixar o conhecimento.`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
