
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}

export interface CreateReviewData {
  product_id: string;
  rating: number;
  comment?: string;
}

export const useReviews = (productId: string) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users(first_name, last_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar avaliações:', error);
        throw new Error('Erro ao carregar avaliações');
      }

      return data as Review[];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (isError && error) {
      addNotification({
        type: 'error',
        title: 'Erro ao carregar avaliações',
        message: 'Não foi possível carregar as avaliações. Tente novamente.'
      });
    }
  }, [isError, error, addNotification]);

  const createReview = useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...reviewData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar avaliação:', error);
        throw new Error('Erro ao salvar avaliação');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      addNotification({
        type: 'success',
        title: 'Avaliação enviada!',
        message: 'Sua avaliação foi registrada com sucesso'
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao avaliar',
        message: error.message
      });
    }
  });

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return {
    reviews: reviews || [],
    averageRating,
    totalReviews: reviews?.length || 0,
    isLoading,
    error,
    createReview: createReview.mutate,
    isCreatingReview: createReview.isPending
  };
};
