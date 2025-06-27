
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts';

export interface SearchFilters {
  searchTerm: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  language: string;
  level: string;
  type: 'all' | 'ebook' | 'course';
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: 'Todos',
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    language: 'Todos',
    level: 'Todos',
    type: 'all',
    sortBy: 'relevance'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    data: searchResults,
    isLoading,
    error
  } = useQuery({
    queryKey: ['advanced-search', filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          reviews!inner(rating)
        `)
        .eq('status', 'published');

      // Full-text search
      if (filters.searchTerm.trim()) {
        query = query.textSearch('search_vector', filters.searchTerm, {
          type: 'websearch',
          config: 'portuguese'
        });
      }

      // Category filter
      if (filters.category !== 'Todos') {
        query = query.eq('category', filters.category);
      }

      // Price range
      query = query.gte('price', filters.minPrice).lte('price', filters.maxPrice);

      // Language filter
      if (filters.language !== 'Todos') {
        query = query.eq('language', filters.language);
      }

      // Level filter
      if (filters.level !== 'Todos') {
        query = query.eq('level', filters.level);
      }

      // Type filter
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Erro na busca:', error);
        throw new Error('Erro ao pesquisar produtos');
      }

      return {
        products: data as Product[],
        totalCount: count || 0
      };
    }
  });

  const totalPages = Math.ceil((searchResults?.totalCount || 0) / itemsPerPage);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'Todos',
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0,
      language: 'Todos',
      level: 'Todos',
      type: 'all',
      sortBy: 'relevance'
    });
    setCurrentPage(1);
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    products: searchResults?.products || [],
    totalCount: searchResults?.totalCount || 0,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    error
  };
};
