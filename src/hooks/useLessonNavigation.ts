
import { useState, useCallback } from 'react';
import { Module, Lesson } from '@/types/course';

interface NavigationResult {
  lesson: Lesson | null;
  moduleIndex: number;
  lessonIndex: number;
}

export const useLessonNavigation = (modules: Module[]) => {
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const getCurrentLessonInfo = useCallback((): NavigationResult | null => {
    if (!currentLessonId || !modules.length) return null;

    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const module = modules[moduleIndex];
      const lessonIndex = module.lessons.findIndex(lesson => lesson.id === currentLessonId);
      
      if (lessonIndex !== -1) {
        return {
          lesson: module.lessons[lessonIndex],
          moduleIndex,
          lessonIndex
        };
      }
    }

    return null;
  }, [currentLessonId, modules]);

  const goToNextLesson = useCallback((): Lesson | null => {
    const currentInfo = getCurrentLessonInfo();
    if (!currentInfo) return null;

    const { moduleIndex, lessonIndex } = currentInfo;
    const currentModule = modules[moduleIndex];

    // Check if there's a next lesson in the current module
    if (lessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[lessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      return nextLesson;
    }

    // Check if there's a next module
    if (moduleIndex < modules.length - 1) {
      const nextModule = modules[moduleIndex + 1];
      if (nextModule.lessons.length > 0) {
        const nextLesson = nextModule.lessons[0];
        setCurrentLessonId(nextLesson.id);
        return nextLesson;
      }
    }

    return null; // No next lesson available
  }, [getCurrentLessonInfo, modules]);

  const goToPreviousLesson = useCallback((): Lesson | null => {
    const currentInfo = getCurrentLessonInfo();
    if (!currentInfo) return null;

    const { moduleIndex, lessonIndex } = currentInfo;

    // Check if there's a previous lesson in the current module
    if (lessonIndex > 0) {
      const currentModule = modules[moduleIndex];
      const previousLesson = currentModule.lessons[lessonIndex - 1];
      setCurrentLessonId(previousLesson.id);
      return previousLesson;
    }

    // Check if there's a previous module
    if (moduleIndex > 0) {
      const previousModule = modules[moduleIndex - 1];
      if (previousModule.lessons.length > 0) {
        const previousLesson = previousModule.lessons[previousModule.lessons.length - 1];
        setCurrentLessonId(previousLesson.id);
        return previousLesson;
      }
    }

    return null; // No previous lesson available
  }, [getCurrentLessonInfo, modules]);

  const goToLesson = useCallback((lessonId: string): Lesson | null => {
    // Find the lesson in modules
    for (const module of modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLessonId(lessonId);
        return lesson;
      }
    }
    return null;
  }, [modules]);

  const hasNextLesson = useCallback((): boolean => {
    const currentInfo = getCurrentLessonInfo();
    if (!currentInfo) return false;

    const { moduleIndex, lessonIndex } = currentInfo;
    const currentModule = modules[moduleIndex];

    // Check current module
    if (lessonIndex < currentModule.lessons.length - 1) {
      return true;
    }

    // Check next modules
    for (let i = moduleIndex + 1; i < modules.length; i++) {
      if (modules[i].lessons.length > 0) {
        return true;
      }
    }

    return false;
  }, [getCurrentLessonInfo, modules]);

  const hasPreviousLesson = useCallback((): boolean => {
    const currentInfo = getCurrentLessonInfo();
    if (!currentInfo) return false;

    const { moduleIndex, lessonIndex } = currentInfo;

    // Check current module
    if (lessonIndex > 0) {
      return true;
    }

    // Check previous modules
    for (let i = moduleIndex - 1; i >= 0; i--) {
      if (modules[i].lessons.length > 0) {
        return true;
      }
    }

    return false;
  }, [getCurrentLessonInfo, modules]);

  return {
    currentLessonId,
    setCurrentLessonId,
    goToNextLesson,
    goToPreviousLesson,
    goToLesson,
    hasNextLesson,
    hasPreviousLesson,
    getCurrentLessonInfo
  };
};
