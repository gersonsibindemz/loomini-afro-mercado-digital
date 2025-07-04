
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/types/course';

interface CourseHeaderProps {
  course: Course;
  progress: number;
  onBack: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  progress,
  onBack
}) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{course.title}</h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">
              Progresso do Curso
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
