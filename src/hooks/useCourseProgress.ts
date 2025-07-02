
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/components/NotificationSystem';

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
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  // Fetch user progress for the course
  const { data: progress = [], isLoading, error, isError } = useQuery({
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
    staleTime: 30 * 1000 // 30 seconds
  });

  // Mock certificate requests for now (until DB is refreshed)
  const certificateRequests: CertificateRequest[] = [];

  useEffect(() => {
    if (isError && error) {
      addNotification({
        type: 'error',
        title: 'Erro ao carregar progresso',
        message: 'Não foi possível carregar o progresso do curso.'
      });
    }
  }, [isError, error, addNotification]);

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
      console.error('Error updating progress:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao salvar progresso',
        message: 'Não foi possível salvar o progresso da aula.'
      });
    }
  });

  // Mock certificate request for now
  const requestCertificateMutation = useMutation({
    mutationFn: async (fullName: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Mock implementation - in real app this would save to database
      console.log('Certificate requested for:', fullName);
      return { success: true };
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Certificado Solicitado!',
        message: 'Certificado solicitado! Será enviado em até 5 dias úteis.'
      });
    },
    onError: (error: any) => {
      console.error('Error requesting certificate:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao solicitar certificado',
        message: 'Não foi possível solicitar o certificado.'
      });
    }
  });

  // Mock course structure for calculations
  const mockModules = [
    {
      id: '1',
      lessons: ['1-1', '1-2']
    },
    {
      id: '2', 
      lessons: ['2-1']
    }
  ];

  // Calculate course completion percentage
  const totalLessons = mockModules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = progress.filter(p => p.completed).length;
  const courseCompletionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Check if a module is completed
  const isModuleCompleted = (moduleId: string) => {
    const module = mockModules.find(m => m.id === moduleId);
    if (!module) return false;
    
    return module.lessons.every(lessonId => 
      progress.some(p => p.lesson_id === lessonId && p.completed)
    );
  };

  // Check if user can request certificate (all modules completed)
  const canRequestCertificate = mockModules.every(module => isModuleCompleted(module.id)) &&
                                certificateRequests.length === 0;

  return {
    progress,
    isLoading,
    error,
    courseCompletionPercentage,
    updateProgress: (lessonId: string, watchPercentage: number, completed?: boolean) =>
      updateProgressMutation.mutate({ lessonId, watchPercentage, completed }),
    requestCertificate: (fullName: string) => requestCertificateMutation.mutate(fullName),
    isModuleCompleted,
    canRequestCertificate,
    certificateRequests,
    isUpdatingProgress: updateProgressMutation.isPending,
    isRequestingCertificate: requestCertificateMutation.isPending
  };
};
