
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { CourseProgress } from '@/types/course';

interface ProgressContextType {
  courseProgress: CourseProgress | null;
  loadCourseProgress: (courseId: string) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadCourseProgress = async (courseId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Load user progress for this course
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          lesson_id,
          lessons (
            module_id,
            modules (
              product_id
            )
          )
        `)
        .eq('user_id', user.id);

      if (progressError) {
        console.error('Error loading progress:', progressError);
        return;
      }

      // Filter progress for this specific course
      const courseProgressData = progressData?.filter(progress => 
        progress.lessons?.modules?.product_id === courseId
      ) || [];

      const completedLessonIds = courseProgressData.map(p => p.lesson_id);
      setCompletedLessons(completedLessonIds);

      // Get total lessons count for this course
      const { data: courseLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          modules!inner (
            product_id
          )
        `)
        .eq('modules.product_id', courseId);

      if (lessonsError) {
        console.error('Error loading course lessons:', lessonsError);
        return;
      }

      const totalLessons = courseLessons?.length || 0;
      const completedCount = completedLessonIds.length;
      const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

      setCourseProgress({
        courseId,
        completedLessons: completedLessonIds,
        totalLessons,
        progressPercentage
      });

    } catch (error) {
      console.error('Error loading course progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      // Insert or update user progress
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId
        });

      // Update local state
      setCompletedLessons(prev => {
        if (!prev.includes(lessonId)) {
          return [...prev, lessonId];
        }
        return prev;
      });

      // Update course progress
      if (courseProgress) {
        const newCompletedCount = completedLessons.includes(lessonId) 
          ? completedLessons.length 
          : completedLessons.length + 1;
        const newProgressPercentage = courseProgress.totalLessons > 0 
          ? (newCompletedCount / courseProgress.totalLessons) * 100 
          : 0;

        setCourseProgress(prev => prev ? {
          ...prev,
          completedLessons: completedLessons.includes(lessonId) 
            ? prev.completedLessons 
            : [...prev.completedLessons, lessonId],
          progressPercentage: newProgressPercentage
        } : null);
      }

    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return completedLessons.includes(lessonId);
  };

  return (
    <ProgressContext.Provider value={{
      courseProgress,
      loadCourseProgress,
      markLessonComplete,
      isLessonCompleted,
      isLoading
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
