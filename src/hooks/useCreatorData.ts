
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCreatorData = () => {
  const { user } = useAuth();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
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
    enabled: !!user
  });

  const { data: sales, isLoading: isLoadingSales } = useQuery({
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
    enabled: !!user
  });

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
