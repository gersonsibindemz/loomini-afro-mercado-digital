
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string | null;
}

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
}

interface ProgressContextType {
  courseProgress: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
  markLessonComplete: (lessonId: string) => Promise<void>;
  loadCourseProgress: (courseId: string) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
  clearProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadCourseProgress = async (courseId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get all lessons for the course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          modules (
            product_id
          )
        `)
        .eq('modules.product_id', courseId);

      if (lessonsError) {
        throw new Error('Erro ao carregar aulas do curso');
      }

      const totalLessons = lessonsData?.length || 0;
      const lessonIds = lessonsData?.map(lesson => lesson.id) || [];

      // Get user progress for these lessons
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id, completed_at')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds);

      if (progressError) {
        throw new Error('Erro ao carregar progresso do usuário');
      }

      const completedLessons = progressData?.map(p => p.lesson_id) || [];
      const progressPercentage = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

      setCourseProgress({
        courseId,
        completedLessons,
        totalLessons,
        progressPercentage
      });

    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      // Check if already completed
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (existingProgress) {
        console.log('Aula já marcada como completa');
        return;
      }

      // Mark as complete
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId
        });

      if (error) {
        throw new Error('Erro ao marcar aula como completa');
      }

      // Update local state
      if (courseProgress) {
        const updatedCompletedLessons = [...courseProgress.completedLessons, lessonId];
        const updatedProgressPercentage = (updatedCompletedLessons.length / courseProgress.totalLessons) * 100;

        setCourseProgress({
          ...courseProgress,
          completedLessons: updatedCompletedLessons,
          progressPercentage: updatedProgressPercentage
        });
      }

    } catch (err) {
      console.error('Erro ao marcar progresso:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar progresso');
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return courseProgress?.completedLessons.includes(lessonId) || false;
  };

  const clearProgress = () => {
    setCourseProgress(null);
    setError(null);
  };

  return (
    <ProgressContext.Provider value={{
      courseProgress,
      isLoading,
      error,
      markLessonComplete,
      loadCourseProgress,
      isLessonCompleted,
      clearProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress deve ser usado dentro de um ProgressProvider');
  }
  return context;
};
