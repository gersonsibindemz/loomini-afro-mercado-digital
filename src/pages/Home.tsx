
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Users, Globe, Star, ArrowRight, Play } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { products, isLoading } = useProducts();
  const { createPurchase, isPurchasing, hasPurchased } = usePurchases();

  // Get featured products (first 5 published products)
  const featuredProducts = products.slice(0, 5);

  const stats = [{
    number: `${products.length}+`,
    label: "Produtos Digitais",
    icon: "📦"
  }, {
    number: "5K+",
    label: "Criadores Ativos",
    icon: "👥"
  }, {
    number: "25K+",
    label: "Vendas Realizadas",
    icon: "💰"
  }, {
    number: "3",
    label: "Países Atendidos",
    icon: "🌍"
  }];

  const handleViewDetails = (product: any) => {
    navigate(`/produto/${product.id}`);
  };

  const handlePurchase = async (product: any) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para comprar produtos.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (hasPurchased(product.id)) {
      toast({
        title: "Produto já adquirido",
        description: "Você já possui este produto.",
        variant: "destructive"
      });
      return;
    }

    try {
      createPurchase({ 
        productId: product.id, 
        amount: product.price 
      });
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="loomini-gradient text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Transforme Seu Talento em
            <span className="block text-yellow-300">Renda Digital</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fade-in">
            A maior plataforma de produtos digitais para criadores independentes. 
            Venda cursos, e-books, templates e muito mais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Link to="/register" className="bg-white text-loomini-blue px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg">
              Começar a Vender
            </Link>
            <Link to="/produtos" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-loomini-blue transition-all duration-200">
              Explorar Produtos
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative animate-fade-in">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Pesquisar produtos..." className="w-full pl-12 pr-6 py-4 rounded-xl text-gray-800 text-lg focus:ring-4 focus:ring-white/20 focus:outline-none" />
            <Link to="/produtos" className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-loomini-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Pesquisar
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-loomini-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-loomini-gradient-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-loomini-dark mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os produtos digitais mais populares criados por talentosos criadores independentes
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {featuredProducts.map(product => (
                <div key={product.id} className="loomini-card group cursor-pointer">
                  <div className="relative overflow-hidden rounded-t-xl" onClick={() => handleViewDetails(product)}>
                    <img 
                      src={product.cover_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop"} 
                      alt={product.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
                    />
                    <span className="absolute top-3 left-3 bg-loomini-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.type === 'course' ? 'Curso' : 'E-book'}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-loomini-dark mb-2 group-hover:text-loomini-blue transition-colors duration-200 cursor-pointer line-clamp-2" onClick={() => handleViewDetails(product)}>
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      {product.description_short}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-loomini-blue">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => handleViewDetails(product)} 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhum produto disponível no momento.
              </p>
              <Link to="/creator/product/new" className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Cadastrar Primeiro Produto
              </Link>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/produtos" className="loomini-button inline-flex items-center space-x-2">
                <span>Ver Todos os Produtos</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 loomini-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para Monetizar seu Conhecimento?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a milhares de criadores que já estão gerando renda com produtos digitais
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/creator/product/new" className="bg-white text-loomini-blue px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg inline-flex items-center justify-center space-x-2">
              <span>Cadastrar Produto</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/produtos" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-loomini-blue transition-all duration-200 inline-flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Explorar Produtos</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
