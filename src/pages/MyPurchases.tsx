
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import PurchasesHeader from '@/components/purchases/PurchasesHeader';
import PurchasesSearch from '@/components/purchases/PurchasesSearch';
import PurchaseCard from '@/components/purchases/PurchaseCard';
import EmptyPurchases from '@/components/purchases/EmptyPurchases';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuth } from '@/contexts/AuthContext';

const MyPurchases = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { purchases, isLoading } = usePurchases();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  // Filter purchases based on search term and type
  const filteredPurchases = React.useMemo(() => {
    let filtered = purchases;

    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.product?.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(purchase => purchase.product?.type === filterType);
    }

    return filtered;
  }, [purchases, searchTerm, filterType]);

  const handleAccessProduct = (purchase: any) => {
    if (purchase.product?.type === 'course') {
      navigate(`/curso/${purchase.product_id}`);
    } else if (purchase.product?.type === 'ebook') {
      navigate(`/ebook/${purchase.product_id}`);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas compras...</p>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500 mb-4">
              Você precisa estar logado para ver suas compras.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Fazer Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state if no purchases
  if (purchases.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PurchasesHeader totalPurchases={0} />
        <EmptyPurchases />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PurchasesHeader totalPurchases={purchases.length} />
      
      <PurchasesSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {filteredPurchases.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">
              Nenhuma compra encontrada com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((purchase) => (
            <PurchaseCard
              key={purchase.id}
              purchase={{
                id: purchase.product_id,
                purchaseId: purchase.id,
                title: purchase.product?.title || 'Produto sem título',
                creator: 'Instrutor', // This would need to be fetched from creator data
                category: purchase.product?.type === 'course' ? 'Curso' : 'E-book',
                type: purchase.product?.type || 'course',
                cover: purchase.product?.cover_image_url || '/placeholder.svg',
                purchaseDate: purchase.purchase_date || new Date().toISOString(),
                price: purchase.amount_paid,
                currency: purchase.currency
              }}
              onAccessProduct={handleAccessProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
