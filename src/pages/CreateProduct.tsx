
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const CreateProduct = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'criador') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Você precisa ser um criador para acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Funcionalidade de criação de produtos em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;
