
import React from 'react';
import { Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductStatsProps {
  students: number;
  rating: number;
  reviews: number;
  cover: string;
  title: string;
}

const ProductStats: React.FC<ProductStatsProps> = ({ 
  students, 
  rating, 
  reviews, 
  cover, 
  title 
}) => {
  return (
    <div className="space-y-6">
      <div className="aspect-square lg:aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={cover} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Estudantes</p>
              <p className="font-bold text-lg">{students.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <div>
              <p className="text-sm text-gray-600">Avaliação</p>
              <p className="font-bold text-lg">
                {rating} ({reviews} avaliações)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductStats;
