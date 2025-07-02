import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { SecurityProvider } from "./components/SecurityProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CourseProvider } from "./contexts/CourseContext";
import { ProgressProvider } from "./contexts/ProgressContext";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotificationSystem, { useNotifications } from "./components/NotificationSystem";
import ChatAssistant from "./components/ChatAssistant";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import MyPurchases from "./pages/MyPurchases";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";
import Dashboard from "./pages/Dashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import ProductCreation from "./pages/ProductCreation";
import ProductTypeSelection from "./pages/ProductTypeSelection";
import EbookCreation from "./pages/EbookCreation";
import CourseCreation from "./pages/CourseCreation";
import NotFound from "./pages/NotFound";

// Error handling
import { reportError } from "./utils/errorHandling";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      }
    },
    mutations: {
      retry: 1
    }
  }
});

const AppContent = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <SecurityProvider>
      <div className="min-h-screen flex flex-col">
        <ErrorBoundary showDetails={true}>
          <Header />
        </ErrorBoundary>
        
        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/produto/:id" element={<ProductDetails />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/minhas-compras" element={<MyPurchases />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recuperar-senha" element={<PasswordRecovery />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/painel-comprador" element={<BuyerDashboard />} />
              <Route path="/painel-criador" element={<CreatorDashboard />} />
              <Route path="/cadastro-produto" element={<ProductCreation />} />
              <Route path="/criar-produto" element={<ProductTypeSelection />} />
              <Route path="/criar-ebook" element={<EbookCreation />} />
              <Route path="/criar-curso" element={<CourseCreation />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        
        <NotificationSystem 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
        
        <ChatAssistant />
      </div>
    </SecurityProvider>
  );
};

const App = () => {
  const handleGlobalError = (error: Error, errorInfo: any) => {
    console.error('Global app error:', error, errorInfo);
    reportError(error, { errorInfo, location: 'App' });
  };

  return (
    <ErrorBoundary onError={handleGlobalError} showDetails={true}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ErrorBoundary onError={(error) => reportError(error, { location: 'AuthProvider' })}>
            <AuthProvider>
              <CourseProvider>
                <ProgressProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </ProgressProvider>
              </CourseProvider>
            </AuthProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  reportError(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    { type: 'unhandledrejection' }
  );
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  reportError(
    event.error instanceof Error ? event.error : new Error(event.message),
    { 
      type: 'uncaughterror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  );
});

export default App;
