
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Eye,
  Plus,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const stats = [
    {
      title: 'Vendas Totais',
      value: formatCurrency(45780),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Produtos Vendidos',
      value: '143',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBag
    },
    {
      title: 'Visualizações',
      value: '2,547',
      change: '+23.1%',
      changeType: 'positive',
      icon: Eye
    },
    {
      title: 'Taxa de Conversão',
      value: '5.6%',
      change: '-2.3%',
      changeType: 'negative',
      icon: TrendingUp
    }
  ];

  const recentProducts = [
    {
      id: 1,
      name: 'Curso de Marketing Digital',
      sales: 23,
      revenue: formatCurrency(11500),
      views: 456,
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'E-book Empreendedorismo',
      sales: 18,
      revenue: formatCurrency(15300),
      views: 234,
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Templates Social Media',
      sales: 31,
      revenue: formatCurrency(18960),
      views: 678,
      status: 'Ativo'
    }
  ];

  const recentOrders = [
    {
      id: '#LM-2024-001',
      customer: 'Ana Silva',
      product: 'Curso de Marketing Digital',
      amount: formatCurrency(500),
      date: '2024-01-15',
      status: 'Concluído'
    },
    {
      id: '#LM-2024-002',
      customer: 'João Santos',
      product: 'E-book Empreendedorismo',
      amount: formatCurrency(850),
      date: '2024-01-14',
      status: 'Processando'
    },
    {
      id: '#LM-2024-003',
      customer: 'Maria Costa',
      product: 'Templates Social Media',
      amount: formatCurrency(1200),
      date: '2024-01-13',
      status: 'Concluído'
    }
  ];

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-loomini-dark mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Bem-vindo de volta! Aqui está um resumo do seu desempenho.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-loomini-blue focus:border-transparent"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            
            <Link 
              to="/cadastro-produto" 
              className="loomini-button flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="loomini-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-loomini-dark mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-loomini-dark">
                Meus Produtos
              </h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-loomini-dark mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{product.sales} vendas</span>
                      <span>{product.views} visualizações</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-loomini-blue mb-1">
                      {product.revenue}
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {product.status}
                    </span>
                  </div>
                  
                  <button className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/meus-produtos" 
                className="text-loomini-blue hover:text-loomini-purple font-medium transition-colors duration-200"
              >
                Ver todos os produtos
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="loomini-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-loomini-dark">
                Vendas Recentes
              </h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono text-sm text-gray-500">
                        {order.id}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Concluído' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-loomini-dark mb-1">
                      {order.customer}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.product}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-loomini-blue mb-1">
                      {order.amount}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/vendas" 
                className="text-loomini-blue hover:text-loomini-purple font-medium transition-colors duration-200"
              >
                Ver todas as vendas
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/cadastro-produto" 
            className="loomini-card p-6 text-center hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="w-16 h-16 loomini-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-loomini-dark mb-2">
              Adicionar Produto
            </h3>
            <p className="text-gray-600 text-sm">
              Cadastre um novo produto digital para venda
            </p>
          </Link>

          <Link 
            to="/analytics" 
            className="loomini-card p-6 text-center hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-loomini-dark mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Veja relatórios detalhados de desempenho
            </p>
          </Link>

          <Link 
            to="/perfil" 
            className="loomini-card p-6 text-center hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-loomini-dark mb-2">
              Meu Perfil
            </h3>
            <p className="text-gray-600 text-sm">
              Gerencie suas informações pessoais
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
