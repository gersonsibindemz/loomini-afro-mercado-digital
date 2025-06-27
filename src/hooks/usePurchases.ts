
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext';

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  purchase_date: string;
  amount_paid: number;
  currency: string;
  product?: {
    title: string;
    description_short: string;
    cover_image_url?: string;
    type: 'ebook' | 'course';
  };
}

export const usePurchases = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const {
    data: purchases,
    isLoading,
    error
  } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          product:products(
            title,
            description_short,
            cover_image_url,
            type
          )
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar compras:', error);
        throw new Error('Erro ao carregar dados');
      }

      return data as Purchase[];
    },
    enabled: !!user
  });

  const createPurchase = useMutation({
    mutationFn: async ({ productId, amount }: { productId: string; amount: number }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('purchases')
        .insert([{
          user_id: user.id,
          product_id: productId,
          amount_paid: amount
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('Você já possui este produto');
        }
        console.error('Erro ao criar compra:', error);
        throw new Error('Erro ao processar compra. Tente novamente');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      addNotification({
        type: 'success',
        title: 'Compra realizada com sucesso!',
        message: 'O produto foi adicionado à sua biblioteca'
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro na compra',
        message: error.message
      });
    }
  });

  const hasPurchased = (productId: string): boolean => {
    return purchases?.some(purchase => purchase.product_id === productId) || false;
  };

  return {
    purchases: purchases || [],
    isLoading,
    error,
    createPurchase: createPurchase.mutate,
    isPurchasing: createPurchase.isPending,
    hasPurchased
  };
};
