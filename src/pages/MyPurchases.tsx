
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Download, 
  Eye, 
  Calendar,
  User,
  DollarSign,
  Book,
  Play,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MyPurchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'course', 'ebook'

  useEffect(() => {
    // Load purchases from localStorage
    const savedPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    setPurchases(savedPurchases);
    setFilteredPurchases(savedPurchases);
  }, []);

  useEffect(() => {
    // Filter purchases based on search term and type
    let filtered = purchases;

    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(purchase => purchase.type === filterType);
    }

    setFilteredPurchases(filtered);
  }, [purchases, searchTerm, filterType]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price, currency) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const handleAccessProduct = (purchase) => {
    if (purchase.type === 'course') {
      // Navegar para a sala do curso
      navigate(`/curso/${purchase.id}`);
    } else {
      // Para e-books, pode navegar para uma página de leitura ou download
      navigate(`/ebook/${purchase.id}`);
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Minhas Compras</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma compra ainda</h3>
              <p className="text-gray-600 mb-6">
                Você ainda não fez nenhuma compra. Explore nossos produtos e comece a aprender!
              </p>
              <Link to="/produtos">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minhas Compras</h1>
        <p className="text-gray-600">
          {purchases.length} {purchases.length === 1 ? 'produto comprado' : 'produtos comprados'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Pesquisar nas minhas compras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filterType === 'course' ? 'default' : 'outline'}
            onClick={() => setFilterType('course')}
            size="sm"
          >
            Cursos
          </Button>
          <Button
            variant={filterType === 'ebook' ? 'default' : 'outline'}
            onClick={() => setFilterType('ebook')}
            size="sm"
          >
            E-books
          </Button>
        </div>
      </div>

      {/* Purchase Grid */}
      {filteredPurchases.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">
              Nenhuma compra encontrada com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((purchase) => (
            <Card key={purchase.purchaseId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Product Image */}
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={purchase.cover} 
                    alt={purchase.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {purchase.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    {purchase.type === 'course' ? (
                      <Play className="w-3 h-3 mr-1" />
                    ) : (
                      <Book className="w-3 h-3 mr-1" />
                    )}
                    {purchase.type === 'course' ? 'Curso' : 'E-book'}
                  </div>
                </div>

                {/* Product Title */}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {purchase.title}
                </h3>

                {/* Purchase Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Comprado em {formatDate(purchase.purchaseDate)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    por {purchase.creator}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pago: {formatPrice(purchase.price, purchase.currency)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleAccessProduct(purchase)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Acessar Produto
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download de Materiais
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
