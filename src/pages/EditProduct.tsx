
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorProducts } from '@/hooks/useProducts';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { products, updateProduct, isUpdating } = useCreatorProducts();
  
  const [product, setProduct] = useState(null);
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
    currency: 'MZN',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          title: foundProduct.title || '',
          description_short: foundProduct.description_short || '',
          description_full: foundProduct.description_full || '',
          price: foundProduct.price?.toString() || '',
          category: foundProduct.category || '',
          level: foundProduct.level || '',
          type: foundProduct.type || 'course',
          pages: foundProduct.pages?.toString() || '',
          language: foundProduct.language || 'Português',
          currency: foundProduct.currency || 'MZN',
          status: foundProduct.status || 'draft'
        });
      }
    }
  }, [products, id]);

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

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Produto não encontrado.
            </p>
            <Button onClick={() => navigate('/creator/dashboard')}>
              Voltar ao Dashboard
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
    
    const updates = {
      ...formData,
      price: parseFloat(formData.price),
      pages: formData.type === 'ebook' && formData.pages ? parseInt(formData.pages) : null,
      status: formData.status as 'draft' | 'published' | 'archived'
    };

    updateProduct({ id: product.id, updates });
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
  const statuses = ['draft', 'published', 'archived'];
  const currencies = [
    { value: 'MZN', label: 'Metical (MZN)' },
    { value: 'USD', label: 'Dólar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Produto: {product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
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

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
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
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
