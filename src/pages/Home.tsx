import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Users, Globe, Star, ArrowRight, Play } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useToast } from '@/hooks/use-toast';
const Home = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const featuredProducts = [{
    id: 1,
    title: "Curso Completo de Marketing Digital",
    author: "Ana Silva",
    creator: "Ana Silva",
    price: 2500,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    badge: "Bestseller",
    category: "Marketing",
    type: "Curso" as const
  }, {
    id: 2,
    title: "E-book: Empreendedorismo em África",
    author: "João Mateus",
    creator: "João Mateus",
    price: 850,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    badge: "Novo",
    category: "Negócios",
    type: "E-book" as const
  }, {
    id: 3,
    title: "Templates para Redes Sociais",
    author: "Maria Costa",
    creator: "Maria Costa",
    price: 1200,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    category: "Design",
    type: "Template" as const
  }];
  const categories = [{
    name: "Cursos Online",
    count: 234,
    icon: "📚"
  }, {
    name: "E-books",
    count: 456,
    icon: "📖"
  }, {
    name: "Templates",
    count: 123,
    icon: "🎨"
  }, {
    name: "Software",
    count: 67,
    icon: "💻"
  }, {
    name: "Música",
    count: 89,
    icon: "🎵"
  }, {
    name: "Videos",
    count: 145,
    icon: "🎬"
  }];
  const stats = [{
    number: "10K+",
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
    navigate(`/produto/${product.type === 'Curso' ? 'curso-1' : 'ebook-1'}`, {
      state: {
        product
      }
    });
  };
  const handlePurchase = async (product: any) => {
    try {
      // Simulate purchase processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to localStorage (simulate purchase)
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const newPurchase = {
        ...product,
        purchaseDate: new Date().toISOString(),
        purchaseId: Math.random().toString(36).substr(2, 9),
        currency: 'MZN',
        cover: product.image
      };
      purchases.push(newPurchase);
      localStorage.setItem('purchases', JSON.stringify(purchases));
      toast({
        title: "Compra realizada com sucesso!",
        description: "Produto adicionado à sua biblioteca."
      });

      // Redirect to purchases page
      setTimeout(() => {
        navigate('/minhas-compras');
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro na compra",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen">
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
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-loomini-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => <div key={product.id} className="loomini-card group cursor-pointer">
                <div className="relative overflow-hidden rounded-t-xl" onClick={() => handleViewDetails(product)}>
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" />
                  {product.badge && <span className="absolute top-3 left-3 bg-loomini-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-loomini-dark mb-2 group-hover:text-loomini-blue transition-colors duration-200 cursor-pointer" onClick={() => handleViewDetails(product)}>
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-3">por {product.author}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} avaliações)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-loomini-blue">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && <span className="text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button onClick={() => handleViewDetails(product)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Ver Detalhes
                    </button>
                    
                  </div>
                </div>
              </div>)}
          </div>

          <div className="text-center mt-12">
            <Link to="/produtos" className="loomini-button inline-flex items-center space-x-2">
              <span>Ver Todos os Produtos</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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
            <Link to="/cadastro-produto" className="bg-white text-loomini-blue px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg inline-flex items-center justify-center space-x-2">
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
    </div>;
};
export default Home;