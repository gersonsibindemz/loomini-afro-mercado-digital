
import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdvancedSearch, SearchFilters } from '@/hooks/useAdvancedSearch';
import { ProductListSkeleton } from './LoadingSkeleton';

const categories = [
  'Todos', 'Marketing', 'Negócios', 'Tecnologia', 'Finanças', 'Design',
  'Agricultura', 'Educação', 'Saúde', 'Idiomas', 'Desenvolvimento Pessoal',
  'Música e Produção', 'Arte', 'Moda', 'Espiritualidade', 'Modelos Prontos'
];

const languages = ['Todos', 'Português', 'Inglês', 'Francês', 'Espanhol'];
const levels = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

export const AdvancedSearch = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const {
    filters,
    updateFilters,
    resetFilters,
    products,
    totalCount,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading
  } = useAdvancedSearch();

  const handleSearch = () => {
    updateFilters({ searchTerm: searchInput });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'searchTerm') return value.trim() !== '';
    if (['category', 'language', 'level'].includes(key)) return value !== 'Todos';
    if (key === 'type') return value !== 'all';
    if (key === 'minPrice') return value > 0;
    if (key === 'maxPrice') return value < 100000;
    if (key === 'minRating') return value > 0;
    return false;
  }).length;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          Pesquisar
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros Avançados
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-5 h-5">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Filtros Avançados
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpar Filtros
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilters({ type: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">Todos</option>
                  <option value="course">Cursos</option>
                  <option value="ebook">E-books</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-2">Idioma</label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilters({ language: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium mb-2">Nível</label>
                <select
                  value={filters.level}
                  onChange={(e) => updateFilters({ level: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Preço Mínimo (MZN)</label>
                <Input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: Number(e.target.value) })}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preço Máximo (MZN)</label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">Ordenar Por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="w-full p-2 border rounded-lg max-w-xs"
              >
                <option value="relevance">Relevância</option>
                <option value="newest">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {totalCount === 0 ? 'Nenhum produto encontrado' : `${totalCount} produtos encontrados`}
          </p>
        </div>

        {isLoading ? (
          <ProductListSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar seus filtros ou termo de pesquisa
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description_short}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
                    </span>
                    <Badge variant="outline">{product.type}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                <div className="flex space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>

                <span className="text-sm text-gray-500 ml-4">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
