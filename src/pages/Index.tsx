
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Book, Users, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Book className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Loomini</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Olá, {user.user_metadata?.first_name || 'Usuário'}!
                  </span>
                  <Button asChild>
                    <Link to="/dashboard">
                      Ir para Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Cadastrar</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Marketplace de
            <span className="text-blue-600 block">Produtos Digitais</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra, compre e venda produtos digitais incríveis. E-books, cursos online 
            e muito mais em uma plataforma segura e fácil de usar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/produtos" className="flex items-center">
                Explorar Produtos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Começar a Vender</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o Loomini?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para criadores e compradores de conteúdo digital
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Book className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Produtos de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  E-books, cursos e materiais digitais cuidadosamente selecionados
                  por especialistas em cada área.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Comunidade Ativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conecte-se com outros criadores e compradores. Compartilhe conhecimento
                  e cresça junto com nossa comunidade.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Trophy className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Certificações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receba certificados de conclusão para cursos e demonstre
                  suas habilidades adquiridas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram o poder do aprendizado digital
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Criar Conta Grátis
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Book className="w-6 h-6" />
            <span className="text-xl font-bold">Loomini</span>
          </div>
          <p className="text-gray-400">
            © 2024 Loomini. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
