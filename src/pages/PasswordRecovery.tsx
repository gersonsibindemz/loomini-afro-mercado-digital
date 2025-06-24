
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useNotifications } from '../components/NotificationSystem';

const PasswordRecovery = () => {
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Este campo é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      addNotification({
        type: 'success',
        title: 'Email enviado!',
        message: 'Verifique sua caixa de entrada para redefinir sua senha'
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro no envio',
        message: 'Ocorreu um erro ao enviar o email. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-loomini-gradient-light py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Entrar', path: '/login' },
            { label: 'Recuperar Senha' }
          ]} />
          
          <div className="max-w-md mx-auto">
            <div className="loomini-card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-loomini-dark mb-4">
                Email Enviado!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Enviamos um link para redefinir sua senha para:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-medium text-loomini-dark">{email}</p>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. 
                O link expira em 24 horas.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full px-4 py-2 text-loomini-blue border border-loomini-blue rounded-lg hover:bg-loomini-blue hover:text-white transition-colors duration-200"
                >
                  Enviar para outro email
                </button>
                
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-gray-600 hover:text-loomini-blue transition-colors duration-200"
                >
                  Voltar ao login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[
          { label: 'Entrar', path: '/login' },
          { label: 'Recuperar Senha' }
        ]} />
        
        <div className="max-w-md mx-auto">
          <div className="loomini-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 loomini-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">eL</span>
              </div>
              <h1 className="text-2xl font-bold text-loomini-dark mb-2">
                Recuperar Senha
              </h1>
              <p className="text-gray-600">
                Digite seu email para receber um link de recuperação
              </p>
            </div>

            {/* Recovery Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className={`loomini-input pl-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="loomini-button w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Link de Recuperação</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Lembrou da senha?{' '}
                <Link 
                  to="/login" 
                  className="text-loomini-blue hover:text-loomini-purple font-medium transition-colors duration-200"
                >
                  Voltar ao login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
