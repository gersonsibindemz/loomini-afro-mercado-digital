
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  DollarSign, 
  Book, 
  Play, 
  Eye, 
  Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Purchase {
  id: string;
  purchaseId: string;
  title: string;
  creator: string;
  category: string;
  type: 'course' | 'ebook';
  cover: string;
  purchaseDate: string;
  price: number;
  currency: string;
}

interface PurchaseCardProps {
  purchase: Purchase;
  onAccessProduct: (purchase: Purchase) => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ purchase, onAccessProduct }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
            onClick={() => onAccessProduct(purchase)}
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
  );
};

export default PurchaseCard;
