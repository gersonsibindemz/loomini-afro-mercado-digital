
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePurchases } from '@/hooks/usePurchases';
import { useProducts } from '@/hooks/useProducts';

const EbookViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPurchased } = usePurchases();
  const { products } = useProducts();
  const [ebook, setEbook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEbook = async () => {
      if (!id) return;
      
      // Check if user has purchased this ebook
      if (!hasPurchased(id)) {
        navigate('/minhas-compras', { 
          state: { message: 'Você precisa comprar este e-book para acessá-lo.' }
        });
        return;
      }

      // Find the ebook in products
      const foundEbook = products.find(p => p.id === id && p.type === 'ebook');
      
      if (!foundEbook) {
        navigate('/minhas-compras', { 
          state: { message: 'E-book não encontrado.' }
        });
        return;
      }

      setEbook(foundEbook);
      setIsLoading(false);
    };

    loadEbook();
  }, [id, navigate, hasPurchased, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando e-book...</p>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            E-book não encontrado
          </h2>
          <Button onClick={() => navigate('/minhas-compras')}>
            Minhas Compras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/minhas-compras')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{ebook.title}</h1>
                <p className="text-sm text-gray-600">{ebook.description_short}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* E-book Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Informações do E-book</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={ebook.cover_image_url || '/placeholder.svg'} 
                  alt={ebook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <p className="text-gray-900">{ebook.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoria</label>
                  <p className="text-gray-900">{ebook.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Idioma</label>
                  <p className="text-gray-900">{ebook.language}</p>
                </div>
                
                {ebook.pages && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Páginas</label>
                    <p className="text-gray-900">{ebook.pages} páginas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acessar Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pronto para Ler!</h3>
                <p className="text-gray-600 mb-6">
                  Seu e-book está disponível para leitura e download.
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Abrir para Leitura
                </Button>
                
                <Button variant="outline" className="w-full" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-1">💡 Dica</h4>
                <p className="text-sm text-amber-700">
                  Você pode fazer o download do PDF para ler offline em qualquer dispositivo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {ebook.description_full && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Sobre este E-book</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {ebook.description_full}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EbookViewer;
