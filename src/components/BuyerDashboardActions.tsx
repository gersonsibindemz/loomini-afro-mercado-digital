
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Crown } from 'lucide-react';

const BuyerDashboardActions = () => {
  const { switchRole, profile } = useAuth();

  const handleBecomeCreator = async () => {
    try {
      await switchRole('criador');
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  if (profile?.role !== 'comprador') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span>Torne-se um Criador</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Quer vender seus próprios produtos digitais? Torne-se um criador e comece a monetizar seu conhecimento!
        </p>
        <Button onClick={handleBecomeCreator} className="loomini-button">
          <UserPlus className="w-4 h-4 mr-2" />
          Tornar-me Criador
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuyerDashboardActions;
