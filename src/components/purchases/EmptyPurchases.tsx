
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const EmptyPurchases: React.FC = () => {
  return (
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
  );
};

export default EmptyPurchases;
