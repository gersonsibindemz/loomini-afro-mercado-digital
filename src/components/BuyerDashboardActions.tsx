
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, BookOpen, User, Star, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BuyerDashboardActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Explorar Produtos',
      description: 'Descubra novos e-books e cursos',
      icon: Search,
      color: 'bg-blue-500',
      action: () => navigate('/produtos')
    },
    {
      title: 'Minhas Compras',
      description: 'Acesse produtos adquiridos',
      icon: ShoppingBag,
      color: 'bg-green-500',
      action: () => navigate('/minhas-compras')
    },
    {
      title: 'Tornar-me Criador',
      description: 'Comece a vender seus conhecimentos',
      icon: User,
      color: 'bg-purple-500',
      action: () => navigate('/painel-criador')
    },
    {
      title: 'Avaliar Produtos',
      description: 'Deixe sua avaliação e comentários',
      icon: Star,
      color: 'bg-yellow-500',
      action: () => navigate('/minhas-compras')
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {actions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.action}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuyerDashboardActions;
