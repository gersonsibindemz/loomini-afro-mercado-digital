
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  BookOpen, 
  Star, 
  Download,
  Eye,
  UserPlus,
  LogOut,
  Calendar
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency } from '../utils/currency';

const BuyerDashboard = () => {
  // Mock user data
  const user = {
    name: 'João Silva',
    totalPurchases: 12,
    completedCourses: 8,
    averageRating: 4.5
  };

  const recentPurchases = [
    {
      id: 1,
      title: 'Curso de Marketing Digital Completo',
      category: 'Marketing',
      price: formatCurrency(15000),
      purchaseDate: '2024-01-20',
      type: 'curso',
      downloadUrl: '#',
      accessUrl: '#'
    },
    {
      id: 2,
      title: 'E-book: Empreendedorismo em África',
      category: 'Negócios',
      price: formatCurrency(5000),
      purchaseDate: '2024-01-18',
      type: 'ebook',
      downloadUrl: '#',
      accessUrl: '#'
    },
    {
      id: 3,
      title: 'Templates para Redes Sociais',
      category: 'Design',
      price: formatCurrency(8000),
      purchaseDate: '2024-01-15',
      type: 'template',
      downloadUrl: '#',
      accessUrl: '#'
    }
  ];

  const handleLogout = () => {
    // Mock logout functionality
    console.log('Fazendo logout...');
  };

  const handleBecomCreator = () => {
    // Mock become creator functionality
    console.log('Alterando para criador...');
  };

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Painel do Comprador' }]} />
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-loomini-dark mb-2">
            Olá, {user.name}!
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
              {user.totalPurchases}
            </h3>
            <p className="text-gray-600 text-sm">
              Produtos Comprados
            </p>
          </div>

          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-loomini-dark mb-1">
              {user.completedCourses}
            </h3>
            <p className="text-gray-600 text-sm">
              Cursos Concluídos
            </p>
          </div>

          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-loomini-dark mb-1">
              {user.averageRating}
            </h3>
            <p className="text-gray-600 text-sm">
              Avaliação Média Dada
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
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-loomini-dark mb-1">
                    {purchase.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {purchase.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Última compra: {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-loomini-blue mb-1">
                      {purchase.price}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {purchase.type === 'curso' ? (
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

          {recentPurchases.length === 0 && (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma compra encontrada</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/minhas-compras" 
            className="loomini-card p-6 text-center hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-loomini-dark mb-2">
              Ver Todas as Compras
            </h3>
            <p className="text-gray-600 text-sm">
              Acesse todos os seus produtos comprados
            </p>
          </Link>

          <button 
            onClick={handleBecomCreator}
            className="loomini-card p-6 text-center hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <UserPlus className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-loomini-dark mb-2">
              Tornar-me Criador
            </h3>
            <p className="text-gray-600 text-sm">
              Comece a vender seus produtos digitais
            </p>
          </button>

          <button 
            onClick={handleLogout}
            className="loomini-card p-6 text-center hover:shadow-lg transition-shadow duration-200 group border-red-100 hover:border-red-200"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Sair
            </h3>
            <p className="text-gray-600 text-sm">
              Fazer logout da sua conta
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
