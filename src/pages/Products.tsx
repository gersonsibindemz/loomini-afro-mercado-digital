import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
interface Product {
  id: number;
  title: string;
  creator: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  type: 'Curso' | 'E-book' | 'Template' | 'Software';
  badge?: string;
}
const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedRegion, setSelectedRegion] = useState('Moçambique');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const categories = ['Todos', 'Marketing', 'Negócios', 'Tecnologia', 'Finanças', 'Design', 'Agricultura', 'Educação', 'Saúde', 'Idiomas', 'Desenvolvimento Pessoal', 'Música e Produção', 'Arte', 'Moda', 'Espiritualidade', 'Modelos Prontos'];
  const mockProducts: Product[] = [{
    id: 1,
    title: "Curso Completo de Marketing Digital",
    creator: "Ana Silva",
    price: 2500,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "Marketing",
    type: "Curso",
    badge: "Bestseller"
  }, {
    id: 2,
    title: "E-book: Empreendedorismo em África",
    creator: "João Mateus",
    price: 850,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    category: "Negócios",
    type: "E-book",
    badge: "Novo"
  }, {
    id: 3,
    title: "Templates para Redes Sociais",
    creator: "Maria Costa",
    price: 1200,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    category: "Design",
    type: "Template"
  }, {
    id: 4,
    title: "Curso de Programação Python",
    creator: "Carlos Santos",
    price: 1800,
    rating: 4.6,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    category: "Tecnologia",
    type: "Curso"
  }, {
    id: 5,
    title: "Gestão Financeira Pessoal",
    creator: "Lucia Fernandes",
    price: 900,
    rating: 4.5,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    category: "Finanças",
    type: "E-book"
  }, {
    id: 6,
    title: "Agricultura Sustentável em África",
    creator: "Miguel Rodrigues",
    price: 1500,
    rating: 4.4,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    category: "Agricultura",
    type: "Curso"
  }];
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.creator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const ProductCard = ({
    product
  }: {
    product: Product;
  }) => <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" />
        {product.badge && <Badge className="absolute top-3 left-3 loomini-gradient text-white">
            {product.badge}
          </Badge>}
        <Badge variant="secondary" className="absolute top-3 right-3">
          {product.type}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-loomini-dark mb-2 group-hover:text-loomini-blue transition-colors duration-200 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-gray-600 mb-3 text-sm">por {product.creator}</p>
        
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
            <span className="text-xl font-bold text-loomini-blue">
              {formatCurrency(product.price, selectedRegion)}
            </span>
            {product.originalPrice && <span className="text-gray-400 line-through text-sm">
                {formatCurrency(product.originalPrice, selectedRegion)}
              </span>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full loomini-button">
            Ver Detalhes
          </Button>
          <Button variant="outline" className="w-full text-slate-50 bg-rose-900 hover:bg-rose-800">
            Comprar Agora
          </Button>
        </div>
      </CardContent>
    </Card>;
  return <div className="min-h-screen bg-gray-50">
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
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="Pesquisar produtos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-xl text-gray-800 text-lg" />
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
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <h4 className="font-medium text-loomini-dark mb-3">Filtrar por categoria</h4>
                  <div className="space-y-2">
                    {categories.map(category => <button key={category} onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${selectedCategory === category ? 'bg-loomini-gradient text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {category}
                      </button>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length === 0 ? 'Nenhum produto encontrado' : `${filteredProducts.length} produtos encontrados`}
              </p>
            </div>

            {paginatedProducts.length === 0 ? <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar seus filtros ou termo de pesquisa
                </p>
              </div> : <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button variant="outline" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                      Anterior
                    </Button>
                    
                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, i) => <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </Button>)}
                    </div>
                    
                    <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                      Próximo
                    </Button>
                  </div>}
              </>}
          </div>
        </div>
      </div>
    </div>;
};
export default Products;