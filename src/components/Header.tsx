import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Globe, User, ShoppingBag } from 'lucide-react';
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Moçambique');
  const location = useLocation();
  const regions = [{
    name: 'Moçambique',
    currency: 'MZN',
    flag: '🇲🇿'
  }, {
    name: 'Angola',
    currency: 'AOA',
    flag: '🇦🇴'
  }, {
    name: 'Brasil',
    currency: 'BRL',
    flag: '🇧🇷'
  }];
  const isActive = (path: string) => location.pathname === path;
  return <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 loomini-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">eL</span>
            </div>
            <span className="text-2xl font-bold text-loomini-dark">e-Loomini</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            
            <Link to="/produtos" className={`text-sm font-medium transition-colors duration-200 ${isActive('/produtos') ? 'text-loomini-blue' : 'text-gray-600 hover:text-loomini-blue'}`}>
              Produtos
            </Link>
            
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              
              
            </div>
          </div>

          {/* Region Selector & Actions */}
          <div className="flex items-center space-x-4">
            {/* Region Selector */}
            <div className="relative">
              <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-loomini-blue focus:border-transparent cursor-pointer">
                {regions.map(region => <option key={region.name} value={region.name}>
                    {region.flag} {region.name}
                  </option>)}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/dashboard" className="p-2 text-gray-600 hover:text-loomini-blue transition-colors duration-200">
                <ShoppingBag className="w-5 h-5" />
              </Link>
              <Link to="/login" className="px-4 py-2 text-loomini-blue border border-loomini-blue rounded-lg hover:bg-loomini-blue hover:text-white transition-all duration-200">
                Entrar
              </Link>
              <Link to="/register" className="loomini-button">
                Cadastrar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-loomini-blue transition-colors duration-200">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-gray-100 py-4 animate-fade-in">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Procurar produtos..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-loomini-blue focus:border-transparent" />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-4">
              <Link to="/" className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${isActive('/') ? 'bg-loomini-gradient-light text-loomini-blue' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                Início
              </Link>
              <Link to="/produtos" className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${isActive('/produtos') ? 'bg-loomini-gradient-light text-loomini-blue' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                Produtos
              </Link>
              <Link to="/categorias" className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${isActive('/categorias') ? 'bg-loomini-gradient-light text-loomini-blue' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                Categorias
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="space-y-2">
              <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag className="w-5 h-5" />
                <span>Meus Produtos</span>
              </Link>
              <Link to="/login" className="block px-4 py-2 text-center border border-loomini-blue text-loomini-blue rounded-lg hover:bg-loomini-blue hover:text-white transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Entrar
              </Link>
              <Link to="/register" className="block px-4 py-2 text-center loomini-button" onClick={() => setIsMobileMenuOpen(false)}>
                Cadastrar
              </Link>
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;