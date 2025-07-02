
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CourseData {
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

export const useCourseData = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async (): Promise<CourseData> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', courseId)
        .eq('type', 'course')
        .single();

      if (error) {
        throw new Error('Erro ao carregar dados do curso');
      }

      return data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) {
        throw new Error('Erro ao carregar módulos do curso');
      }

      return data || [];
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserCourses = (userId: string) => {
  return useQuery({
    queryKey: ['user-courses', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          products (
            id,
            title,
            description_short,
            cover_image_url,
            type,
            level,
            category
          )
        `)
        .eq('user_id', userId);

      if (error) {
        throw new Error('Erro ao carregar cursos do usuário');
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};
