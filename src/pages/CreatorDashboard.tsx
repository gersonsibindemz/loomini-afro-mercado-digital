import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, Eye, Plus, Filter, Download, MoreHorizontal, Edit, Trash2, Star, ToggleLeft, AlertTriangle } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency } from '../utils/currency';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
const CreatorDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const stats = [{
    title: 'Receita Total',
    value: formatCurrency(45780),
    change: '+12.5%',
    changeType: 'positive',
    icon: DollarSign
  }, {
    title: 'Vendas Totais',
    value: '143',
    change: '+8.2%',
    changeType: 'positive',
    icon: ShoppingBag
  }, {
    title: 'Produtos Ativos',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: Eye
  }, {
    title: 'Estudantes',
    value: '2,547',
    change: '+23.1%',
    changeType: 'positive',
    icon: Users
  }];
  const products = [{
    id: 1,
    name: 'Curso de Marketing Digital',
    category: 'Marketing',
    price: formatCurrency(25000),
    sales: 23,
    revenue: formatCurrency(575000),
    rating: 4.8,
    status: 'Ativo'
  }, {
    id: 2,
    name: 'E-book Empreendedorismo',
    category: 'Negócios',
    price: formatCurrency(12000),
    sales: 18,
    revenue: formatCurrency(216000),
    rating: 4.6,
    status: 'Ativo'
  }, {
    id: 3,
    name: 'Templates Social Media',
    category: 'Design',
    price: formatCurrency(8000),
    sales: 31,
    revenue: formatCurrency(248000),
    rating: 4.9,
    status: 'Ativo'
  }, {
    id: 4,
    name: 'Guia de Investimentos',
    category: 'Finanças',
    price: formatCurrency(35000),
    sales: 12,
    revenue: formatCurrency(420000),
    rating: 4.5,
    status: 'Rascunho'
  }];
  const handleDeleteProduct = (productId: number, productName: string) => {
    console.log(`Excluindo produto ${productId}: ${productName}`);
    // Mock delete functionality with success message
    setTimeout(() => {
      console.log('Produto excluído com sucesso!');
    }, 1000);
  };
  const handleSwitchToBuyer = () => {
    console.log('Alternando para painel do comprador...');
  };
  return <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{
        label: 'Painel do Criador'
      }]} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-loomini-dark mb-2">
              Painel do Criador
            </h1>
            <p className="text-gray-600">
              Gerencie seus produtos e monitore suas vendas.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-loomini-blue focus:border-transparent">
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            
            <Button onClick={handleSwitchToBuyer} variant="outline" className="flex items-center space-x-2">
              <ToggleLeft className="w-4 h-4" />
              <span>Alternar para Painel Comprador</span>
            </Button>

            <Link to="/cadastro-produto" className="loomini-button flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Criar Novo Produto</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => <div key={index} className="loomini-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <stat.icon className={`w-6 h-6 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-loomini-dark mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.title}
              </p>
            </div>)}
        </div>

        {/* Products Table */}
        <div className="loomini-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-loomini-dark">
              Meus Produtos
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-sky-700">Produto</TableHead>
                  <TableHead className="bg-sky-700">Categoria</TableHead>
                  <TableHead className="bg-sky-700">Preço</TableHead>
                  <TableHead className="bg-sky-700">Vendas</TableHead>
                  <TableHead className="bg-sky-700">Receita</TableHead>
                  <TableHead className="bg-sky-700">Avaliação</TableHead>
                  <TableHead className="bg-sky-700">Status</TableHead>
                  <TableHead className="bg-sky-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-loomini-blue">
                      {product.price}
                    </TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {product.revenue}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span>Confirmar exclusão do produto?</span>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o produto "{product.name}"? 
                                Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProduct(product.id, product.name)} className="bg-red-600 hover:bg-red-700">
                                Confirmar Exclusão
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>

          {products.length === 0 && <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum produto encontrado</p>
              <p className="text-sm text-gray-400">
                {products.length} produtos encontrados
              </p>
            </div>}

          {products.length > 0 && <div className="mt-6 text-center text-sm text-gray-500">
              {products.length} produtos encontrados
            </div>}
        </div>
      </div>
    </div>;
};
export default CreatorDashboard;