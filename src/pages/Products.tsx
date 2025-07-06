import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, ChevronDown, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, isInCart, getItemCount } = useShoppingCart();
  const { products, isLoading } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedRegion, setSelectedRegion] = useState('Moçambique');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Get unique categories from real products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return ['Todos', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleViewDetails = (product: any) => {
    navigate(`/produto/${product.id}`);
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      cover_image_url: product.cover_image_url,
      type: product.type
    };

    addToCart(cartItem);
  };

  const ProductCard = ({ product }: { product: any }) => {
    const inCart = isInCart(product.id);
    
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden bg-lime-50">
        <div 
          className="relative overflow-hidden"
          onClick={() => handleViewDetails(product)}
        >
          <img 
            src={product.cover_image_url || '/placeholder.svg'} 
            alt={product.title} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
          />
          <Badge variant="secondary" className="absolute top-3 right-3">
            {product.type === 'course' ? 'Curso' : 'E-book'}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
          
          <h3 
            className="text-lg font-semibold text-loomini-dark mb-2 group-hover:text-loomini-blue transition-colors duration-200 line-clamp-2 cursor-pointer"
            onClick={() => handleViewDetails(product)}
          >
            {product.title}
          </h3>
          
          <p className="text-gray-600 mb-3 text-sm">{product.description_short}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-loomini-blue">
                {formatCurrency(product.price, selectedRegion)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full loomini-button"
              onClick={() => handleViewDetails(product)}
            >
              Ver Detalhes
            </Button>
            <Button 
              variant="outline" 
              className={`w-full ${inCart ? 'bg-green-50 text-green-700 border-green-300' : 'text-slate-50 bg-rose-900 hover:bg-rose-800'}`}
              onClick={() => {
                if (inCart) {
                  navigate('/carrinho');
                } else {
                  handleAddToCart(product);
                }
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {inCart ? 'Ver no Carrinho' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="loomini-gradient text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transforme Seu Talento em
            <span className="block text-yellow-300">Renda Digital</span>
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            A maior plataforma de produtos digitais para criadores independentes. 
            Venda cursos, e-books, templates e muito mais.
          </p>
          
          {/* Cart indicator */}
          {getItemCount() > 0 && (
            <div className="mb-4">
              <Button 
                onClick={() => navigate('/carrinho')}
                variant="outline"
                className="bg-white text-loomini-blue border-white hover:bg-gray-100"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho ({getItemCount()})
              </Button>
            </div>
          )}
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Pesquisar produtos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-gray-800 text-lg bg-blue-300 rounded-none" 
            />
            <Button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-loomini-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Pesquisar
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-loomini-dark">Filtros</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <h4 className="font-medium text-loomini-dark mb-3">Filtrar por categoria</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          selectedCategory === category 
                            ? 'bg-loomini-gradient text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length === 0 
                  ? 'Nenhum produto encontrado' 
                  : `${filteredProducts.length} produtos encontrados`
                }
              </p>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar seus filtros ou termo de pesquisa
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
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
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
