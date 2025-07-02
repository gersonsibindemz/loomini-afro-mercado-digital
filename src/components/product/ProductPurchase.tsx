
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPurchaseProps {
  price: number;
  currency: string;
  isLoading: boolean;
  isFavorited: boolean;
  onPurchase: () => void;
  onToggleFavorite: () => void;
}

const ProductPurchase: React.FC<ProductPurchaseProps> = ({
  price,
  currency,
  isLoading,
  isFavorited,
  onPurchase,
  onToggleFavorite
}) => {
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-3xl font-bold text-green-600">
        {formatPrice(price, currency)}
      </div>
      
      <div className="flex space-x-3">
        <Button 
          onClick={onPurchase}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
        >
          {isLoading ? 'Processando compra...' : 'Comprar Agora'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onToggleFavorite}
          className={`px-4 ${isFavorited ? 'text-red-500 border-red-500' : ''}`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default ProductPurchase;
