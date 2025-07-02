
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Download, Star, Calendar, User, BookOpen, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBuyerData } from '@/hooks/useBuyerData';
import { formatCurrency } from '@/utils/currency';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MyPurchases = () => {
  const navigate = useNavigate();
  const { purchases, isLoading } = useBuyerData();

  const handleAccessProduct = (product: any) => {
    if (product.type === 'course') {
      navigate(`/curso/${product.id}`);
    } else {
      // For ebooks, download or view
      window.open(product.cover_image_url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-loomini-gradient-light">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-loomini-gradient-light">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Compras</h1>
            <p className="text-gray-600">Acesse todos os produtos que você adquiriu</p>
          </div>

          {purchases && purchases.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {purchases.map((purchase: any) => (
                <Card key={purchase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={purchase.products.cover_image_url || '/placeholder.svg'}
                      alt={purchase.products.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={purchase.products.type === 'course' ? 'default' : 'secondary'}
                    >
                      {purchase.products.type === 'course' ? (
                        <>
                          <Video className="w-3 h-3 mr-1" />
                          Curso
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3 h-3 mr-1" />
                          E-book
                        </>
                      )}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {purchase.products.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        {purchase.products.users?.first_name} {purchase.products.users?.last_name}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Comprado em {new Date(purchase.purchase_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="text-lg font-semibold text-loomini-blue">
                      {formatCurrency(purchase.amount_paid, purchase.currency)}
                    </div>

                    {purchase.products.type === 'course' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progresso do Curso</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    )}

                    <Button 
                      onClick={() => handleAccessProduct(purchase.products)}
                      className="w-full bg-loomini-blue hover:bg-loomini-blue/90"
                    >
                      {purchase.products.type === 'course' ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Assistir Curso
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Baixar E-book
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/produto/${purchase.products.id}`)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Avaliar Produto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma compra realizada</h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não fez nenhuma compra. Explore nossos produtos!
                </p>
                <Button 
                  onClick={() => navigate('/produtos')}
                  className="bg-loomini-blue hover:bg-loomini-blue/90"
                >
                  Explorar Produtos
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyPurchases;
