
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProviders } from "@/contexts/AppProviders";
import { NotificationProvider } from "@/components/NotificationSystem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomePage = lazy(() => import("@/pages/Home"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const ProductsPage = lazy(() => import("@/pages/Products"));
const ProductDetailsPage = lazy(() => import("@/pages/ProductDetails"));
const MyPurchasesPage = lazy(() => import("@/pages/MyPurchases"));
const CourseRoomPage = lazy(() => import("@/pages/CourseRoom"));
const EbookViewerPage = lazy(() => import("@/pages/EbookViewer"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const BuyerDashboardPage = lazy(() => import("@/pages/BuyerDashboard"));
const CreatorDashboardPage = lazy(() => import("@/pages/CreatorDashboard"));
const CreateProductPage = lazy(() => import("@/pages/CreateProduct"));
const EditProductPage = lazy(() => import("@/pages/EditProduct"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppProviders>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/produtos" element={<ProductsPage />} />
                      <Route path="/produto/:id" element={<ProductDetailsPage />} />
                      <Route path="/minhas-compras" element={<MyPurchasesPage />} />
                      <Route path="/curso/:id" element={<CourseRoomPage />} />
                      <Route path="/ebook/:id" element={<EbookViewerPage />} />
                      <Route path="/perfil" element={<ProfilePage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/painel-comprador" element={<BuyerDashboardPage />} />
                      <Route path="/painel-criador" element={<CreatorDashboardPage />} />
                      <Route path="/creator/dashboard" element={<CreatorDashboardPage />} />
                      <Route path="/creator/product/new" element={<CreateProductPage />} />
                      <Route path="/creator/product/edit/:id" element={<EditProductPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </AppProviders>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
