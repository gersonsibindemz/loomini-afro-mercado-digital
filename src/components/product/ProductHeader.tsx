
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  category: string;
  title: string;
  creator: string;
  fullDescription: string;
}

interface ProductHeaderProps {
  product: Product;
  onBack: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product, onBack }) => {
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="space-y-6">
        <Badge variant="secondary" className="text-sm">
          {product.category}
        </Badge>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>
          <p className="text-gray-600 mb-4">por {product.creator}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Sobre este {product.type === 'course' ? 'curso' : 'e-book'}
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.fullDescription}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductHeader;
