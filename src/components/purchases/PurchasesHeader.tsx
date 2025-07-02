
import React from 'react';

interface PurchasesHeaderProps {
  totalPurchases: number;
}

const PurchasesHeader: React.FC<PurchasesHeaderProps> = ({ totalPurchases }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Minhas Compras</h1>
      <p className="text-gray-600">
        {totalPurchases} {totalPurchases === 1 ? 'produto comprado' : 'produtos comprados'}
      </p>
    </div>
  );
};

export default PurchasesHeader;
