
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Video, ArrowLeft, Star } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ProductTypeSelection = () => {
  return (
    <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Criar Produto' }
        ]} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-loomini-dark mb-4">
            Que tipo de produto você quer criar?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha o formato ideal para o seu conteúdo. Cada tipo tem seu próprio formulário otimizado.
          </p>
        </div>

        {/* Product Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* E-book Card */}
          <Link 
            to="/criar-ebook"
            className="group loomini-card p-8 hover:border-loomini-blue transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-20 h-20 loomini-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Book className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-loomini-dark mb-3 group-hover:text-loomini-blue transition-colors duration-300">
                E-book
              </h2>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                Livros digitais, guias e materiais em PDF. Ideal para compartilhar conhecimento de forma organizada.
              </p>
              
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <Star className="w-3 h-3 mr-1" />
                Formulário Simples
              </div>
              
              <div className="text-loomini-blue font-semibold group-hover:text-loomini-purple transition-colors duration-300">
                Criar E-book →
              </div>
            </div>
          </Link>

          {/* Course Card */}
          <Link 
            to="/criar-curso"
            className="group loomini-card p-8 hover:border-loomini-blue transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-20 h-20 loomini-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-loomini-dark mb-3 group-hover:text-loomini-blue transition-colors duration-300">
                Curso
              </h2>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                Cursos em vídeo com módulos e aulas estruturadas. Perfeito para ensinar passo a passo.
              </p>
              
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                <Star className="w-3 h-3 mr-1" />
                Formulário Completo
              </div>
              
              <div className="text-loomini-blue font-semibold group-hover:text-loomini-purple transition-colors duration-300">
                Criar Curso →
              </div>
            </div>
          </Link>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-loomini-blue transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeSelection;
