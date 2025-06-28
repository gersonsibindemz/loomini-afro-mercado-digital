
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useBuyerData = () => {
  const { user } = useAuth();

  const { data: purchases, isLoading } = useQuery({
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
    enabled: !!user
  });

  const totalSpent = purchases?.reduce((sum, purchase) => sum + Number(purchase.amount_paid), 0) || 0;
  const totalPurchases = purchases?.length || 0;

  return {
    purchases,
    totalSpent,
    totalPurchases,
    isLoading
  };
};
