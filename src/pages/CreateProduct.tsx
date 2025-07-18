
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { createProduct, isCreating } = useProducts();
  
  const [formData, setFormData] = useState({
    title: '',
    description_short: '',
    description_full: '',
    price: '',
    category: '',
    level: '',
    type: 'course' as 'course' | 'ebook',
    pages: '',
    language: 'Português',
    currency: 'MZN'
  });

  if (!user || profile?.role !== 'criador') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Você precisa ser um criador para acessar esta página.
            </p>
            <Button onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      pages: formData.type === 'ebook' && formData.pages ? parseInt(formData.pages) : undefined
    };

    createProduct(productData);
  };

  const categories = [
    'Marketing',
    'Negócios', 
    'Tecnologia',
    'Finanças',
    'Design',
    'Agricultura',
    'Educação',
    'Saúde',
    'Idiomas',
    'Desenvolvimento Pessoal',
    'Música e Produção',
    'Arte',
    'Moda',
    'Espiritualidade'
  ];

  const levels = ['Iniciante', 'Intermediário', 'Avançado'];
  const currencies = [
    { value: 'MZN', label: 'Metical (MZN)' },
    { value: 'USD', label: 'Dólar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="type">Tipo de Produto</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Curso</SelectItem>
                    <SelectItem value="ebook">E-book</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título do produto"
                required
              />
            </div>

            <div>
              <Label htmlFor="description_short">Descrição Curta</Label>
              <Textarea
                id="description_short"
                value={formData.description_short}
                onChange={(e) => handleInputChange('description_short', e.target.value)}
                placeholder="Breve descrição do produto"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="description_full">Descrição Completa</Label>
              <Textarea
                id="description_full"
                value={formData.description_full}
                onChange={(e) => handleInputChange('description_full', e.target.value)}
                placeholder="Descrição detalhada do produto"
                rows={6}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Moeda</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Nível</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'ebook' && (
              <div>
                <Label htmlFor="pages">Número de Páginas</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  value={formData.pages}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  placeholder="Ex: 120"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/creator/dashboard')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? 'Criando...' : 'Criar Produto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;
