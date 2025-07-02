import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useNotifications } from '../components/NotificationSystem';

const Login = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    if (!formData.email) {
      newErrors.email = 'Este campo é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Este campo é obrigatório';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simular autenticação
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular login bem-sucedido
      const userRole: 'comprador' | 'criador' = Math.random() > 0.5 ? 'comprador' : 'criador'; // This would come from actual authentication
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        role: userRole,
        name: 'Usuário'
      }));

      addNotification({
        type: 'success',
        title: 'Login realizado com sucesso!',
        message: 'Bem-vindo de volta ao e-Loomini'
      });

      // Redirect directly to role-specific dashboard
      const dashboardRoute = userRole === 'criador' ? '/painel-criador' : '/painel-comprador';
      setTimeout(() => {
        navigate(dashboardRoute);
      }, 1000);

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: 'Email ou senha incorretos'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro quando usuário começar a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Entrar' }]} />
        
        <div className="max-w-md mx-auto">
          <div className="loomini-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 loomini-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">eL</span>
              </div>
              <h1 className="text-2xl font-bold text-loomini-dark mb-2">
                Bem-vindo de volta!
              </h1>
              <p className="text-gray-600">
                Entre na sua conta para continuar
              </p>
            </div>

            {/* Login Form */}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`loomini-input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`loomini-input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Sua senha"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-loomini-blue focus:ring-loomini-blue"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
                <Link 
                  to="/recuperar-senha" 
                  className="text-sm text-loomini-blue hover:text-loomini-purple transition-colors duration-200"
                >
                  Esqueceu a senha?
                </Link>
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
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="text-loomini-blue hover:text-loomini-purple font-medium transition-colors duration-200"
                >
                  Registar-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
