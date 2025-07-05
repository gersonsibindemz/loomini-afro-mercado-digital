
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play,
  Book,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import ProductHeader from '@/components/product/ProductHeader';
import ProductStats from '@/components/product/ProductStats';
import ProductMetadata from '@/components/product/ProductMetadata';
import ProductPurchase from '@/components/product/ProductPurchase';
import { usePurchases } from '@/hooks/usePurchases';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products } = useProducts();
  const { createPurchase, isPurchasing, hasPurchased } = usePurchases();
  
  const [product, setProduct] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      // Find product from the products list
      const foundProduct = products.find(p => p.id === id);
      if (!foundProduct) {
        navigate('/not-found');
        return;
      }
      
      setProduct(foundProduct);
      
      // Load modules and lessons for courses
      if (foundProduct.type === 'course') {
        try {
          const { data: modulesData, error } = await supabase
            .from('modules')
            .select(`
              *,
              lessons(*)
            `)
            .eq('product_id', id)
            .order('order_index');
            
          if (error) {
            console.error('Error loading modules:', error);
          } else {
            setModules(modulesData || []);
          }
        } catch (error) {
          console.error('Error loading course modules:', error);
        }
      }
      
      setIsLoading(false);
    };

    loadProductData();
  }, [id, products, navigate]);

  const handlePurchase = async () => {
    if (!product) return;
    
    createPurchase({ 
      productId: product.id, 
      amount: product.price 
    });
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Produto não encontrado
          </h2>
          <Button onClick={() => navigate('/produtos')}>
            Ver Produtos
          </Button>
        </div>
      </div>
    );
  }

  const alreadyPurchased = hasPurchased(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <ProductStats
          students={0} // This would need to be calculated from purchases
          rating={0} // This would need to be calculated from reviews
          reviews={0}
          cover={product.cover_image_url || '/placeholder.svg'}
          title={product.title}
        />

        <div className="space-y-6">
          <ProductHeader
            product={product}
            onBack={() => navigate(-1)}
          />

          <ProductMetadata
            language={product.language}
            level={product.level}
            type={product.type}
            pages={product.pages}
          />

          <ProductPurchase
            price={product.price}
            currency={product.currency}
            isLoading={isPurchasing}
            isFavorited={isFavorited}
            onPurchase={handlePurchase}
            onToggleFavorite={() => setIsFavorited(!isFavorited)}
            alreadyPurchased={alreadyPurchased}
          />
        </div>
      </div>

      {/* Course Modules */}
      {product.type === 'course' && modules.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Módulos do Curso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map((module) => (
                <Collapsible 
                  key={module.id}
                  open={expandedModules[module.id]}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {module.order_index}
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold">{module.title}</h4>
                          <p className="text-sm text-gray-600">
                            {module.lessons?.length || 0} aulas
                          </p>
                        </div>
                      </div>
                      {expandedModules[module.id] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="ml-4 mt-2 space-y-2">
                      <p className="text-sm text-gray-600 mb-3">
                        Conteúdo do módulo:
                      </p>
                      {module.lessons?.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2 px-4 bg-white border rounded">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Aula {index + 1}: {lesson.title}</span>
                          </div>
                          {lesson.duration && (
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                          )}
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500 italic">Nenhuma aula disponível</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* E-book Info */}
      {product.type === 'ebook' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="w-5 h-5" />
              <span>Informações do E-book</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Detalhes</h4>
                <p className="text-gray-600 mb-4">{product.pages || 'N/A'} páginas</p>
                <p className="text-gray-600 mb-4">{product.description_full || product.description_short}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Formato</h4>
                <p className="text-gray-600 mb-4">PDF de alta qualidade</p>
                <div className="text-sm text-gray-500">
                  Compatível com todos os dispositivos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductDetails;
