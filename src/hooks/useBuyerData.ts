
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/components/NotificationSystem';

export const useBuyerData = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const { data: purchases, isLoading, error, isError } = useQuery({
    queryKey: ['buyer-purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          products(
            id,
            title,
            type,
            cover_image_url,
            creator_id,
            users!products_creator_id_fkey(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (isError && error) {
      addNotification({
        type: 'error',
        title: 'Erro ao carregar compras',
        message: 'Não foi possível carregar suas compras. Tente novamente.'
      });
    }
  }, [isError, error, addNotification]);

  const totalSpent = purchases?.reduce((sum, purchase) => sum + Number(purchase.amount_paid), 0) || 0;
  const totalPurchases = purchases?.length || 0;

  return {
    purchases,
    totalSpent,
    totalPurchases,
    isLoading
  };
};
