import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Book, Save } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useProducts, CreateProductData } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Badge } from "/dev-server/src/components/ui/badge";

interface EbookFormData {
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  pages: string;
  currency: string;
  language: string;
  difficulty: string;
  coverImage: File | null;
}

const EbookCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProduct, isCreating } = useProducts();
  const { uploadImage, isUploading } = useImageUpload();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const form = useForm<EbookFormData>({
    defaultValues: {
      title: '',
      category: '',
      shortDescription: '',
      fullDescription: '',
      price: '',
      pages: '',
      currency: 'MZN',
      language: 'Português',
      difficulty: 'Iniciante',
      coverImage: null,
    }
  });

  const categories = [
    'Marketing', 'Negócios', 'Tecnologia', 'Finanças', 'Design',
    'Agricultura', 'Educação', 'Saúde', 'Idiomas', 'Desenvolvimento Pessoal',
    'Música e Produção', 'Arte', 'Moda', 'Espiritualidade', 'Modelos Prontos'
  ];

  const languages = ['Português', 'Inglês', 'Francês', 'Espanhol', 'Bantu', 'Outro'];
  const difficulties = ['Iniciante', 'Intermediário', 'Avançado'];
  const currencies = ['MZN', 'AOA'];

  const handleImageUpload = async (file: File) => {
    if (file && file.type.startsWith('image/') && user) {
      form.setValue('coverImage', file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const imageUrl = await uploadImage(file, user.id);
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (data: EbookFormData) => {
    if (!user) {
      alert('Você precisa estar logado para criar um produto');
      return;
    }

    if (!data.coverImage) {
      alert('Por favor, adicione uma capa para o e-book');
      return;
    }

    // Prepare product data according to CreateProductData interface
    const productData: CreateProductData = {
      title: data.title,
      description_short: data.shortDescription,
      description_full: data.fullDescription,
      price: parseFloat(data.price),
      currency: data.currency,
      category: data.category,
      language: data.language,
      level: data.difficulty,
      type: 'ebook',
      pages: parseInt(data.pages),
      cover_image_url: uploadedImageUrl // Use uploaded image URL
    };

    createProduct(productData, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Criar Produto', path: '/criar-produto' },
          { label: 'E-book' }
        ]} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-loomini-dark mb-2">
              Criar E-book
            </h1>
            <p className="text-gray-600">
              Preencha as informações do seu e-book digital
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link 
              to="/criar-produto"
              className="flex items-center space-x-2 text-gray-600 hover:text-loomini-blue transition-colors duration-200"
            >
              <span>Trocar Tipo de Produto</span>
            </Link>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span>Informações Básicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Guia Completo de Marketing Digital"
                          className="loomini-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <FormControl>
                        <select {...field} className="loomini-input">
                          <option value="">Selecione uma categoria</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Curta *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Resumo em uma linha do seu e-book"
                          className="loomini-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Completa *</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Descreva detalhadamente o conteúdo do seu e-book..."
                          className="loomini-input min-h-[120px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Upload da Capa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Capa do E-book</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Capa do E-book * (formato quadrado recomendado)</FormLabel>
                      <FormControl>
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                            dragActive ? 'border-loomini-blue bg-blue-50' : 'border-gray-300'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                              <p className="text-blue-600">Carregando imagem...</p>
                            </div>
                          ) : coverPreview ? (
                            <div className="relative inline-block">
                              <img
                                src={coverPreview}
                                alt="Preview da capa"
                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCoverPreview(null);
                                  setUploadedImageUrl(null);
                                  form.setValue('coverImage', null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {uploadedImageUrl && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                  <Badge className="bg-green-500 text-white text-xs">
                                    Upload concluído!
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">
                                Arraste a imagem aqui ou clique para selecionar
                              </p>
                              <p className="text-sm text-gray-500">
                                Formato recomendado: 800x800px, máximo 5MB
                              </p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preços e Detalhes */}
            <Card>
              <CardHeader>
                <CardTitle>Preços e Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="loomini-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moeda</FormLabel>
                        <FormControl>
                          <select {...field} className="loomini-input">
                            {currencies.map(curr => (
                              <option key={curr} value={curr}>{curr}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Páginas *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Ex: 120"
                            className="loomini-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma</FormLabel>
                        <FormControl>
                          <select {...field} className="loomini-input">
                            {languages.map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Dificuldade</FormLabel>
                      <FormControl>
                        <select {...field} className="loomini-input">
                          {difficulties.map(diff => (
                            <option key={diff} value={diff}>{diff}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link
                to="/criar-produto"
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancelar</span>
              </Link>

              <Button
                type="submit"
                disabled={isCreating || isUploading}
                className="loomini-button flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Criando E-book...</span>
                  </>
                ) : isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando imagem...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Criar E-book</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EbookCreation;
