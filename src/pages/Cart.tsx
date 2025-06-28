
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, CreditCard, ArrowLeft } from 'lucide-react';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, removeFromCart, clearCart, getTotalPrice } = useShoppingCart();
  const { createPurchase, isPurchasing } = usePurchases();
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Acesso necessário",
        description: "Faça login para finalizar a compra.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para continuar.",
        variant: "destructive"
      });
      return;
    }

    setProcessingPayment(true);

    try {
      // Process each item as a separate purchase
      for (const item of items) {
        await createPurchase({
          productId: item.id,
          amount: item.price
        });
      }

      // Clear cart after successful purchases
      clearCart();
      
      toast({
        title: "Compra realizada com sucesso!",
        description: "Produtos adicionados à sua biblioteca.",
      });

      // Redirect to purchases page
      setTimeout(() => {
        navigate('/minhas-compras');
      }, 1500);

    } catch (error) {
      toast({
        title: "Erro na compra",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-500 mb-6">
              Explore nossos produtos e adicione-os ao carrinho
            </p>
            <Button 
              onClick={() => navigate('/produtos')}
              className="loomini-button"
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/produtos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar Comprando
          </Button>
          <h1 className="text-3xl font-bold text-loomini-dark">
            Carrinho de Compras
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Itens no Carrinho ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {item.cover_image_url && (
                      <img 
                        src={item.cover_image_url} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-loomini-dark">
                        {item.title}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {item.type === 'ebook' ? 'E-book' : 'Curso'}
                      </Badge>
                      <p className="text-lg font-bold text-loomini-blue mt-2">
                        {formatCurrency(item.price, 'Moçambique')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo da Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getTotalPrice(), 'Moçambique')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de processamento:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-loomini-blue">
                      {formatCurrency(getTotalPrice(), 'Moçambique')}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={handleCheckout}
                      disabled={processingPayment || isPurchasing}
                      className="w-full loomini-button"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {processingPayment || isPurchasing ? 'Processando...' : 'Finalizar Compra'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={clearCart}
                      className="w-full"
                    >
                      Limpar Carrinho
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      💡 <strong>Garantia:</strong> Acesso imediato após a compra. 
                      Suporte 24/7 disponível.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
