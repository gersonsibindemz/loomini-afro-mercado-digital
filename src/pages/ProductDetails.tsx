
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import ProductHeader from '@/components/product/ProductHeader';
import ProductStats from '@/components/product/ProductStats';
import ProductMetadata from '@/components/product/ProductMetadata';
import ProductPurchase from '@/components/product/ProductPurchase';
import { calculateTotalDuration } from '@/utils/productUtils';

// Mock product data
const mockProducts = {
  'ebook-1': {
    id: 'ebook-1',
    type: 'ebook',
    title: 'Guia Completo de Marketing Digital',
    category: 'Marketing',
    description: 'Um guia abrangente sobre estratégias de marketing digital para pequenas e médias empresas.',
    fullDescription: 'Este e-book é uma compilação completa das melhores práticas de marketing digital, desenvolvido especificamente para o mercado africano. Com exemplos práticos e estratégias testadas, você aprenderá como construir uma presença digital sólida para seu negócio.\n\nO conteúdo inclui: estratégias de SEO, marketing de conteúdo, gestão de redes sociais, campanhas de email marketing, análise de métricas e ROI, e muito mais.',
    creator: 'Ana Silva',
    price: 2500,
    currency: 'MZN',
    language: 'Português',
    level: 'Iniciante',
    pages: 120,
    cover: '/placeholder.svg',
    students: 1250,
    rating: 4.8,
    reviews: 89,
    createdAt: '2024-01-15'
  },
  'curso-1': {
    id: 'curso-1',
    type: 'course',
    title: 'Desenvolvimento Web Completo',
    category: 'Tecnologia',
    description: 'Aprenda desenvolvimento web do zero ao avançado. HTML, CSS, JavaScript, React e muito mais.',
    fullDescription: 'Um curso completo de desenvolvimento web que vai te levar do básico ao avançado. Você aprenderá as tecnologias mais importantes do mercado e desenvolverá projetos reais que poderá adicionar ao seu portfólio.\n\nAo final do curso, você será capaz de criar aplicações web completas e estará pronto para o mercado de trabalho.',
    creator: 'João Santos',
    price: 15000,
    currency: 'MZN',
    language: 'Português',
    level: 'Intermediário',
    duration: '40 horas',
    cover: '/placeholder.svg',
    students: 892,
    rating: 4.9,
    reviews: 156,
    createdAt: '2024-02-10',
    modules: [
      {
        id: 1,
        title: 'Fundamentos do HTML',
        lessons: [
          { title: 'Introdução ao HTML', duration: '15 min' },
          { title: 'Tags e Elementos', duration: '20 min' },
          { title: 'Estrutura de uma Página', duration: '25 min' }
        ]
      },
      {
        id: 2,
        title: 'CSS e Estilização',
        lessons: [
          { title: 'Seletores CSS', duration: '18 min' },
          { title: 'Flexbox e Grid', duration: '30 min' },
          { title: 'Responsividade', duration: '25 min' }
        ]
      },
      {
        id: 3,
        title: 'JavaScript Básico',
        lessons: [
          { title: 'Variáveis e Tipos', duration: '20 min' },
          { title: 'Funções e Eventos', duration: '35 min' },
          { title: 'DOM Manipulation', duration: '40 min' }
        ]
      }
    ]
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const foundProduct = mockProducts[id];
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/not-found');
    }
  }, [id, navigate]);

  const handlePurchase = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const newPurchase = {
      ...product,
      purchaseDate: new Date().toISOString(),
      purchaseId: Math.random().toString(36).substr(2, 9)
    };
    purchases.push(newPurchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    setIsLoading(false);
    
    toast({
      title: "Compra realizada com sucesso!",
      description: "Produto adicionado à sua biblioteca.",
    });
    
    setTimeout(() => {
      navigate('/minhas-compras');
    }, 1500);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <ProductStats
          students={product.students}
          rating={product.rating}
          reviews={product.reviews}
          cover={product.cover}
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
            duration={product.type === 'course' ? calculateTotalDuration(product.modules) : undefined}
            pages={product.pages}
          />

          <ProductPurchase
            price={product.price}
            currency={product.currency}
            isLoading={isLoading}
            isFavorited={isFavorited}
            onPurchase={handlePurchase}
            onToggleFavorite={() => setIsFavorited(!isFavorited)}
          />
        </div>
      </div>

      {/* Course Modules or E-book Info */}
      {product.type === 'course' && product.modules && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Módulos do Curso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.modules.map((module) => (
                <Collapsible 
                  key={module.id}
                  open={expandedModules[module.id]}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {module.id}
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold">{module.title}</h4>
                          <p className="text-sm text-gray-600">
                            {module.lessons.length} aulas
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
                        Prévia do Conteúdo (apenas títulos):
                      </p>
                      {module.lessons.map((lesson, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-4 bg-white border rounded">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Aula {index + 1}: {lesson.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {product.type === 'ebook' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="w-5 h-5" />
              <span>Informações do Livro</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Detalhes</h4>
                <p className="text-gray-600 mb-4">{product.pages} páginas</p>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Visualizar primeiras páginas
                </Button>
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
