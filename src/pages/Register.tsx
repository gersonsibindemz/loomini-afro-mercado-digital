
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'buyer',
    agreeTerms: false,
    agreeMarketing: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempt:', formData);
    // Implementar lógica de cadastro
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const passwordRequirements = [
    { text: 'Pelo menos 8 caracteres', met: formData.password.length >= 8 },
    { text: 'Uma letra maiúscula', met: /[A-Z]/.test(formData.password) },
    { text: 'Uma letra minúscula', met: /[a-z]/.test(formData.password) },
    { text: 'Um número', met: /\d/.test(formData.password) }
  ];

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Cadastrar' }]} />
        
        <div className="max-w-md mx-auto">
          <div className="loomini-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 loomini-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">eL</span>
              </div>
              <h1 className="text-2xl font-bold text-loomini-dark mb-2">
                Criar Conta
              </h1>
              <p className="text-gray-600">
                Junte-se à comunidade de criadores digitais
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="loomini-input pl-10"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="loomini-input pl-10"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="loomini-input"
                  required
                >
                  <option value="buyer">Comprador - Quero comprar produtos</option>
                  <option value="seller">Vendedor - Quero vender produtos</option>
                  <option value="both">Ambos - Comprar e vender</option>
                </select>
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
                    className="loomini-input pl-10 pr-10"
                    placeholder="Crie uma senha forte"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check 
                          className={`w-4 h-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} 
                        />
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="loomini-input pl-10 pr-10"
                    placeholder="Confirme sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">As senhas não coincidem</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 rounded border-gray-300 text-loomini-blue focus:ring-loomini-blue"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    Concordo com os{' '}
                    <Link to="/termos" className="text-loomini-blue hover:text-loomini-purple">
                      Termos de Uso
                    </Link>
                    {' '}e{' '}
                    <Link to="/privacidade" className="text-loomini-blue hover:text-loomini-purple">
                      Política de Privacidade
                    </Link>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                    className="mt-1 rounded border-gray-300 text-loomini-blue focus:ring-loomini-blue"
                  />
                  <span className="text-sm text-gray-600">
                    Quero receber ofertas especiais e novidades por e-mail
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.agreeTerms || formData.password !== formData.confirmPassword}
                className="loomini-button w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Criar Conta</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  className="text-loomini-blue hover:text-loomini-purple font-medium transition-colors duration-200"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
