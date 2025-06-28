import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingCart, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useShoppingCart } from '@/hooks/useShoppingCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getItemCount } = useShoppingCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const cartItemCount = getItemCount();

  const navigationItems = [
    { label: 'Início', path: '/' },
    { label: 'Produtos', path: '/produtos' },
  ];

  if (user) {
    navigationItems.push(
      { label: 'Minhas Compras', path: '/minhas-compras' },
      { label: 'Dashboard', path: '/dashboard' }
    );
  }

  const mobileMenu = (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 text-gray-700 hover:text-loomini-blue"
          >
            {item.label}
          </Link>
        ))}

        <div className="px-3 py-2 space-y-2">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full"
              >
                Entrar
              </Button>
              <Button
                size="sm"
                className="w-full loomini-button"
                onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold loomini-gradient bg-clip-text text-transparent">
              e-Loomini
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-loomini-blue transition-colors ${location.pathname === '/' ? 'text-loomini-blue font-semibold' : ''}`}
            >
              Início
            </Link>
            <Link 
              to="/produtos" 
              className={`text-gray-700 hover:text-loomini-blue transition-colors ${location.pathname === '/produtos' ? 'text-loomini-blue font-semibold' : ''}`}
            >
              Produtos
            </Link>
            {user && (
              <>
                <Link 
                  to="/minhas-compras" 
                  className={`text-gray-700 hover:text-loomini-blue transition-colors ${location.pathname === '/minhas-compras' ? 'text-loomini-blue font-semibold' : ''}`}
                >
                  Minhas Compras
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`text-gray-700 hover:text-loomini-blue transition-colors ${location.pathname === '/dashboard' ? 'text-loomini-blue font-semibold' : ''}`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/carrinho')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Olá, {user.user_metadata?.first_name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button size="sm" className="loomini-button" onClick={() => navigate('/register')}>
                  Cadastrar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/carrinho')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-loomini-blue"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:text-loomini-blue"
              >
                Início
              </Link>
              <Link 
                to="/produtos" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:text-loomini-blue"
              >
                Produtos
              </Link>
              {user && (
                <>
                  <Link 
                    to="/minhas-compras" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:text-loomini-blue"
                  >
                    Minhas Compras
                  </Link>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:text-loomini-blue"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              
              <div className="px-3 py-2 space-y-2">
                {user ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Entrar
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full loomini-button" 
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                    >
                      Cadastrar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
