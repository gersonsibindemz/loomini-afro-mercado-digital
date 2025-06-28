
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBuyerData } from '@/hooks/useBuyerData';
import BuyerDashboardActions from '@/components/BuyerDashboardActions';
import { 
  ShoppingBag, 
  BookOpen, 
  Star, 
  Download,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency } from '../utils/currency';

const BuyerDashboard = () => {
  const { profile, signOut } = useAuth();
  const { purchases, totalSpent, totalPurchases, isLoading } = useBuyerData();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-loomini-gradient-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-loomini-blue border-2 border-loomini-blue border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Painel do Comprador' }]} />
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-loomini-dark mb-2">
            Olá, {profile?.first_name}!
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta ao seu painel pessoal.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-loomini-dark mb-1">
              {totalPurchases}
            </h3>
            <p className="text-gray-600 text-sm">
              Produtos Comprados
            </p>
          </div>

          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-loomini-dark mb-1">
              {formatCurrency(totalSpent)}
            </h3>
            <p className="text-gray-600 text-sm">
              Total Investido
            </p>
          </div>

          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-loomini-dark mb-1">
              {purchases?.length || 0}
            </h3>
            <p className="text-gray-600 text-sm">
              Compras Realizadas
            </p>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="loomini-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-loomini-dark">
              Compras Recentes
            </h2>
            <Link 
              to="/minhas-compras" 
              className="text-loomini-blue hover:text-loomini-purple font-medium transition-colors duration-200"
            >
              Ver Todas as Compras
            </Link>
          </div>

          <div className="space-y-4">
            {purchases?.slice(0, 3).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-loomini-dark mb-1">
                    {purchase.products?.title || 'Produto'}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {purchase.products?.type || 'Produto'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(purchase.purchase_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-loomini-blue mb-1">
                      {formatCurrency(Number(purchase.amount_paid))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {purchase.products?.type === 'curso' ? (
                      <button className="px-4 py-2 bg-loomini-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Acessar</span>
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!purchases || purchases.length === 0) && (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma compra encontrada</p>
            </div>
          )}
        </div>

        {/* Buyer Actions Component */}
        <BuyerDashboardActions />
      </div>
    </div>
  );
};

export default BuyerDashboard;
