
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SecurityProvider } from '@/contexts/SecurityContext';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PasswordRecovery from '@/pages/PasswordRecovery';
import Dashboard from '@/pages/Dashboard';
import BuyerDashboard from '@/pages/BuyerDashboard';
import CreatorDashboard from '@/pages/CreatorDashboard';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import ProductCreation from '@/pages/ProductCreation';
import ProductTypeSelection from '@/pages/ProductTypeSelection';
import EbookCreation from '@/pages/EbookCreation';
import CourseCreation from '@/pages/CourseCreation';
import Cart from '@/pages/Cart';
import MyPurchases from '@/pages/MyPurchases';
import NotFound from '@/pages/NotFound';
import ChatAssistant from '@/components/ChatAssistant';
import { NotificationProvider } from '@/components/NotificationSystem';
import CourseViewer from '@/pages/CourseViewer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SecurityProvider>
          <BrowserRouter>
            <NotificationProvider>
              <div className="min-h-screen bg-white">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/password-recovery" element={<PasswordRecovery />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/painel-comprador" element={<BuyerDashboard />} />
                  <Route path="/painel-criador" element={<CreatorDashboard />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/produto/:id" element={<ProductDetails />} />
                  <Route path="/criar-produto" element={<ProductCreation />} />
                  <Route path="/selecionar-tipo-produto" element={<ProductTypeSelection />} />
                  <Route path="/criar-ebook" element={<EbookCreation />} />
                  <Route path="/criar-curso" element={<CourseCreation />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/minhas-compras" element={<MyPurchases />} />
                  <Route path="/curso/:id" element={<CourseViewer />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ChatAssistant />
              </div>
            </NotificationProvider>
          </BrowserRouter>
        </SecurityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
