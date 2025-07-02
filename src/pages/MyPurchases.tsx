
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import PurchasesHeader from '@/components/purchases/PurchasesHeader';
import PurchasesSearch from '@/components/purchases/PurchasesSearch';
import PurchaseCard from '@/components/purchases/PurchaseCard';
import EmptyPurchases from '@/components/purchases/EmptyPurchases';

const MyPurchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Load purchases from localStorage
    const savedPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    setPurchases(savedPurchases);
    setFilteredPurchases(savedPurchases);
  }, []);

  useEffect(() => {
    // Filter purchases based on search term and type
    let filtered = purchases;

    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(purchase => purchase.type === filterType);
    }

    setFilteredPurchases(filtered);
  }, [purchases, searchTerm, filterType]);

  const handleAccessProduct = (purchase) => {
    if (purchase.type === 'course') {
      navigate(`/curso/${purchase.id}`);
    } else {
      navigate(`/ebook/${purchase.id}`);
    }
  };

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
              key={purchase.purchaseId}
              purchase={purchase}
              onAccessProduct={handleAccessProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
