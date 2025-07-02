
import { useMemo } from 'react';
import { UserProgress } from './useCourseProgress';

// Mock course structure - in real app this would come from API
const MOCK_COURSE_STRUCTURE = {
  modules: [
    {
      id: '1',
      title: 'Introdução ao Marketing Digital',
      lessons: ['1-1', '1-2']
    },
    {
      id: '2', 
      title: 'Estratégias de Conteúdo',
      lessons: ['2-1']
    }
  ]
};

export const useCourseCompletion = (progress: UserProgress[], certificateRequestsCount: number) => {
  const calculations = useMemo(() => {
    const totalLessons = MOCK_COURSE_STRUCTURE.modules.reduce(
      (acc, module) => acc + module.lessons.length, 
      0
    );
    
    const completedLessons = progress.filter(p => p.completed).length;
    const courseCompletionPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    const isModuleCompleted = (moduleId: string) => {
      const module = MOCK_COURSE_STRUCTURE.modules.find(m => m.id === moduleId);
      if (!module) return false;
      
      return module.lessons.every(lessonId => 
        progress.some(p => p.lesson_id === lessonId && p.completed)
      );
    };

    const canRequestCertificate = MOCK_COURSE_STRUCTURE.modules.every(
      module => isModuleCompleted(module.id)
    ) && certificateRequestsCount === 0;

    return {
      courseCompletionPercentage,
      isModuleCompleted,
      canRequestCertificate,
      totalLessons,
      completedLessons
    };
  }, [progress, certificateRequestsCount]);

  return calculations;
};
