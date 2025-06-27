
import { useState, useEffect } from 'react';
import { useNotifications } from '@/components/NotificationSystem';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  cover_image_url?: string;
  type: 'ebook' | 'course';
}

export const useShoppingCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { addNotification } = useNotifications();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('e-loomini-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('e-loomini-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('e-loomini-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    const existingItem = items.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      addNotification({
        type: 'warning',
        title: 'Item já no carrinho',
        message: 'Este produto já está no seu carrinho'
      });
      return;
    }

    setItems(prev => [...prev, item]);
    addNotification({
      type: 'success',
      title: 'Adicionado ao carrinho',
      message: `${item.title} foi adicionado ao carrinho`
    });
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find(cartItem => cartItem.id === itemId);
    setItems(prev => prev.filter(cartItem => cartItem.id !== itemId));
    
    if (item) {
      addNotification({
        type: 'info',
        title: 'Removido do carrinho',
        message: `${item.title} foi removido do carrinho`
      });
    }
  };

  const clearCart = () => {
    setItems([]);
    addNotification({
      type: 'info',
      title: 'Carrinho limpo',
      message: 'Todos os itens foram removidos do carrinho'
    });
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return items.length;
  };

  const isInCart = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getItemCount,
    isInCart
  };
};
