
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/components/NotificationSystem';

export interface AnalyticsData {
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { title: string; sales: number; revenue: number }[];
  recentSales: {
    product_title: string;
    amount_paid: number;
    purchase_date: string;
    buyer_name: string;
  }[];
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const {
    data: analytics,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['analytics', user?.id],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!user) throw new Error('Usuário não autenticado');

      // Get total revenue and sales
      const { data: totalData, error: totalError } = await supabase
        .from('purchases')
        .select(`
          amount_paid,
          product:products!inner(creator_id)
        `)
        .eq('product.creator_id', user.id);

      if (totalError) throw totalError;

      const totalRevenue = totalData?.reduce((sum, purchase) => sum + purchase.amount_paid, 0) || 0;
      const totalSales = totalData?.length || 0;

      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id);

      // Get monthly revenue (last 12 months)
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('purchases')
        .select(`
          amount_paid,
          purchase_date,
          product:products!inner(creator_id)
        `)
        .eq('product.creator_id', user.id)
        .gte('purchase_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

      if (monthlyError) throw monthlyError;

      const monthlyRevenue = monthlyData?.reduce((acc, purchase) => {
        const month = new Date(purchase.purchase_date).toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'short' 
        });
        acc[month] = (acc[month] || 0) + purchase.amount_paid;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get top products
      const { data: topProductsData, error: topProductsError } = await supabase
        .from('purchases')
        .select(`
          amount_paid,
          product:products!inner(title, creator_id)
        `)
        .eq('product.creator_id', user.id);

      if (topProductsError) throw topProductsError;

      const productStats = topProductsData?.reduce((acc, purchase) => {
        const title = purchase.product.title;
        if (!acc[title]) {
          acc[title] = { sales: 0, revenue: 0 };
        }
        acc[title].sales++;
        acc[title].revenue += purchase.amount_paid;
        return acc;
      }, {} as Record<string, { sales: number; revenue: number }>) || {};

      const topProducts = Object.entries(productStats)
        .map(([title, stats]) => ({ title, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Get recent sales
      const { data: recentSalesData, error: recentSalesError } = await supabase
        .from('purchases')
        .select(`
          amount_paid,
          purchase_date,
          product:products!inner(title, creator_id),
          user:users!inner(first_name, last_name)
        `)
        .eq('product.creator_id', user.id)
        .order('purchase_date', { ascending: false })
        .limit(10);

      if (recentSalesError) throw recentSalesError;

      const recentSales = recentSalesData?.map(sale => ({
        product_title: sale.product.title,
        amount_paid: sale.amount_paid,
        purchase_date: sale.purchase_date,
        buyer_name: `${sale.user.first_name} ${sale.user.last_name}`
      })) || [];

      return {
        totalRevenue,
        totalSales,
        totalProducts: totalProducts || 0,
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
          month,
          revenue
        })),
        topProducts,
        recentSales
      };
    },
    enabled: !!user,
    retry: 2,
    staleTime: 10 * 60 * 1000
  });

  useEffect(() => {
    if (isError && error) {
      addNotification({
        type: 'error',
        title: 'Erro ao carregar analytics',
        message: 'Não foi possível carregar os dados de analytics. Tente novamente.'
      });
    }
  }, [isError, error, addNotification]);

  return {
    analytics,
    isLoading,
    error
  };
};
