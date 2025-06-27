
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  creator_id: string;
  title: string;
  description_short: string;
  description_full?: string;
  price: number;
  currency: string;
  category: string;
  language: string;
  level: string;
  cover_image_url?: string;
  type: 'ebook' | 'course';
  pages?: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export interface CreateProductData {
  title: string;
  description_short: string;
  description_full?: string;
  price: number;
  currency?: string;
  category: string;
  language?: string;
  level: string;
  type: 'ebook' | 'course';
  pages?: number;
  cover_image_url?: string;
}

export const useProducts = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar produtos:', error);
        throw new Error('Erro ao carregar dados');
      }

      return data as Product[];
    }
  });

  const createProduct = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Prepare data with creator_id from authenticated user
      const dataToInsert = {
        ...productData,
        creator_id: user.id,
        currency: productData.currency || 'MZN',
        language: productData.language || 'Português'
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar produto:', error);
        throw new Error('Erro ao salvar. Tente novamente');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['creator-products'] });
      addNotification({
        type: 'success',
        title: 'Produto criado!',
        message: 'Dados salvos com sucesso'
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao criar produto',
        message: error.message
      });
    }
  });

  return {
    products: products || [],
    isLoading,
    error,
    createProduct: createProduct.mutate,
    isCreating: createProduct.isPending
  };
};

export const useCreatorProducts = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error
  } = useQuery({
    queryKey: ['creator-products', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar produtos do criador:', error);
        throw new Error('Erro ao carregar dados');
      }

      return data as Product[];
    },
    enabled: !!user
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw new Error('Erro ao salvar. Tente novamente');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['creator-products'] });
      addNotification({
        type: 'success',
        title: 'Produto atualizado!',
        message: 'Dados salvos com sucesso'
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao atualizar',
        message: error.message
      });
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        throw new Error('Erro ao deletar. Tente novamente');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['creator-products'] });
      addNotification({
        type: 'success',
        title: 'Produto deletado',
        message: 'Produto removido com sucesso'
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao deletar',
        message: error.message
      });
    }
  });

  return {
    products: products || [],
    isLoading,
    error,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending
  };
};
