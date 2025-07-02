
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Course {
  id: string;
  title: string;
  description_short: string;
  description_full: string;
  cover_image_url: string | null;
  creator_id: string;
  type: 'course' | 'ebook';
  status: 'draft' | 'published' | 'archived';
  price: number;
  currency: string;
  level: string;
  category: string;
  language: string;
}

interface Module {
  id: string;
  title: string;
  product_id: string;
  order_index: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  module_id: string;
  order_index: number;
  video_url: string | null;
  duration: string | null;
}

interface CourseContextType {
  currentCourse: Course | null;
  modules: Module[];
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
  loadCourse: (courseId: string) => Promise<void>;
  setCurrentLesson: (lesson: Lesson) => void;
  clearCourse: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadCourse = async (courseId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from('products')
        .select('*')
        .eq('id', courseId)
        .eq('type', 'course')
        .single();

      if (courseError) {
        throw new Error('Erro ao carregar curso');
      }

      setCurrentCourse(courseData);

      // Load modules with lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (
            id,
            title,
            description,
            module_id,
            order_index,
            video_url,
            duration
          )
        `)
        .eq('product_id', courseId)
        .order('order_index');

      if (modulesError) {
        throw new Error('Erro ao carregar módulos');
      }

      setModules(modulesData || []);

      // Set first lesson as current if available
      if (modulesData && modulesData.length > 0) {
        const firstModule = modulesData[0];
        if (firstModule.lessons && firstModule.lessons.length > 0) {
          setCurrentLesson(firstModule.lessons[0]);
        }
      }

    } catch (err) {
      console.error('Erro ao carregar curso:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCourse = () => {
    setCurrentCourse(null);
    setModules([]);
    setCurrentLesson(null);
    setError(null);
  };

  return (
    <CourseContext.Provider value={{
      currentCourse,
      modules,
      currentLesson,
      isLoading,
      error,
      loadCourse,
      setCurrentLesson,
      clearCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse deve ser usado dentro de um CourseProvider');
  }
  return context;
};
