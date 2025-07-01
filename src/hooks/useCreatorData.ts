
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/components/NotificationSystem';

export const useCreatorData = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const { data: products, isLoading: isLoadingProducts, error: productsError, isError: isProductsError } = useQuery({
    queryKey: ['creator-products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

  const { data: sales, isLoading: isLoadingSales, error: salesError, isError: isSalesError } = useQuery({
    queryKey: ['creator-sales', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          products!inner(
            title,
            creator_id
          )
        `)
        .eq('products.creator_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (isProductsError && productsError) {
      addNotification({
        type: 'error',
        title: 'Erro ao carregar produtos',
        message: 'Não foi possível carregar seus produtos. Tente novamente.'
      });
    }
  }, [isProductsError, productsError, addNotification]);

  useEffect(() => {
    if (isSalesError && salesError) {
      addNotification({
        type: 'error',
        title: 'Erro ao carregar vendas',
        message: 'Não foi possível carregar suas vendas. Tente novamente.'
      });
    }
  }, [isSalesError, salesError, addNotification]);

  const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.amount_paid), 0) || 0;
  const totalSales = sales?.length || 0;
  const totalProducts = products?.length || 0;

  return {
    products,
    sales,
    totalRevenue,
    totalSales,
    totalProducts,
    isLoading: isLoadingProducts || isLoadingSales
  };
};
