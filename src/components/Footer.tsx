import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-loomini-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 loomini-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">eL</span>
              </div>
              <span className="text-2xl font-bold">e-Loomini</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">A maior plataforma de produtos digitais para criadores independentes. Compre e venda cursos, e-books, templates e muito mais.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-loomini-purple transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-loomini-purple transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-loomini-purple transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-loomini-purple transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/top-vendedores" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Top Vendedores
                </Link>
              </li>
              <li>
                <Link to="/novidades" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Novidades
                </Link>
              </li>
              <li>
                <Link to="/promocoes" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Promoções
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Criadores */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Para Criadores</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cadastro-produto" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Vender Produtos
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Recursos
                </Link>
              </li>
              <li>
                <Link to="/guias" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Guias
                </Link>
              </li>
              <li>
                <Link to="/comunidade" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Comunidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ajuda" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-300 hover:text-loomini-purple transition-colors duration-200 text-sm">
                  Privacidade
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="w-4 h-4" />
                <span>suporte@e-loomini.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone className="w-4 h-4" />
                <span>+258 84 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Maputo, Moçambique</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 e-Loomini. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">Aceito em:</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">MZN</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">AOA</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">BRL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;