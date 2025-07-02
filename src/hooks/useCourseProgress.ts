
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from './useErrorHandler';

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  watch_percentage: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CertificateRequest {
  id: string;
  user_id: string;
  course_id: string;
  full_name: string;
  completion_date: string;
  status: string;
  requested_at: string;
}

export const useCourseProgress = (courseId: string) => {
  const { user } = useAuth();
  const { handleError, wrapAsync } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch user progress for the course
  const { data: progress = [], isLoading, error } = useQuery({
    queryKey: ['course-progress', courseId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!user && !!courseId,
    retry: 2,
    staleTime: 30 * 1000
  });

  // Mock certificate requests (will be replaced when DB is updated)
  const certificateRequests: CertificateRequest[] = [];

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, watchPercentage, completed = false }: {
      lessonId: string;
      watchPercentage: number;
      completed?: boolean;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          watch_percentage: watchPercentage,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-progress', courseId, user?.id] });
    },
    onError: (error: any) => {
      handleError(error, {
        context: { courseId, operation: 'updateProgress' }
      });
    }
  });

  // Certificate request mutation (mocked for now)
  const requestCertificateMutation = useMutation({
    mutationFn: async (fullName: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Mock implementation
      console.log('Certificate requested for:', fullName);
      return { success: true };
    },
    onSuccess: () => {
      // Handle success notification in component
    },
    onError: (error: any) => {
      handleError(error, {
        context: { courseId, operation: 'requestCertificate' }
      });
    }
  });

  return {
    progress,
    isLoading,
    error,
    updateProgress: (lessonId: string, watchPercentage: number, completed?: boolean) =>
      updateProgressMutation.mutate({ lessonId, watchPercentage, completed }),
    requestCertificate: (fullName: string) => requestCertificateMutation.mutate(fullName),
    certificateRequests,
    isUpdatingProgress: updateProgressMutation.isPending,
    isRequestingCertificate: requestCertificateMutation.isPending
  };
};
