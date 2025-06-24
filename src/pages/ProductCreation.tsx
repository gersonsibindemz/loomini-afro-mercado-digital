
import React, { useState } from 'react';
import { Upload, X, Plus, Eye, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency, parseCurrency, getCurrencyInfo } from '../utils/currency';

const ProductCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('Moçambique');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    comparePrice: '',
    tags: [],
    files: [],
    preview: [],
    coverImage: null,
    gallery: [],
    language: 'pt',
    difficulty: 'beginner',
    duration: '',
    requirements: '',
    whatYouWillLearn: [''],
    targetAudience: '',
    faq: [{ question: '', answer: '' }],
    supportIncludes: []
  });

  const categories = {
    'cursos-online': {
      name: 'Cursos Online',
      subcategories: ['Marketing Digital', 'Design Gráfico', 'Programação', 'Idiomas', 'Negócios']
    },
    'ebooks': {
      name: 'E-books',
      subcategories: ['Ficção', 'Não-ficção', 'Autoajuda', 'Técnico', 'Infantil']
    },
    'templates': {
      name: 'Templates',
      subcategories: ['Apresentações', 'Redes Sociais', 'Websites', 'Documentos', 'Logotipos']
    },
    'software': {
      name: 'Software',
      subcategories: ['Aplicativos Mobile', 'Plugins', 'Scripts', 'Ferramentas', 'Jogos']
    },
    'musica-audio': {
      name: 'Música & Áudio',
      subcategories: ['Instrumentais', 'Samples', 'Loops', 'Efeitos Sonoros', 'Podcasts']
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (field: string, files: FileList) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...fileArray]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data:', formData);
    // Implementar lógica de criação do produto
  };

  const currencyInfo = getCurrencyInfo(selectedRegion);

  return (
    <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Cadastrar Produto' }
        ]} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-loomini-dark mb-2">
              Cadastrar Produto Digital
            </h1>
            <p className="text-gray-600">
              Preencha as informações do seu produto para disponibilizá-lo na plataforma
            </p>
          </div>
          
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-gray-600 hover:text-loomini-blue transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step <= currentStep 
                  ? 'loomini-gradient text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'loomini-gradient' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="loomini-card p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-loomini-dark mb-6">
                  Informações Básicas
                </h2>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Produto *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="loomini-input"
                    placeholder="Ex: Curso Completo de Marketing Digital"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="loomini-input min-h-[120px] resize-none"
                    placeholder="Descreva seu produto digital de forma detalhada..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/500 caracteres
                  </p>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        handleInputChange('category', e.target.value);
                        handleInputChange('subcategory', '');
                      }}
                      className="loomini-input"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {Object.entries(categories).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategoria *
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      className="loomini-input"
                      disabled={!formData.category}
                      required
                    >
                      <option value="">Selecione uma subcategoria</option>
                      {formData.category && categories[formData.category]?.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Language & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="loomini-input"
                    >
                      <option value="pt">Português</option>
                      <option value="en">Inglês</option>
                      <option value="fr">Francês</option>
                      <option value="es">Espanhol</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de Dificuldade
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="loomini-input"
                    >
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                      <option value="all">Todos os níveis</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (palavras-chave)
                  </label>
                  <input
                    type="text"
                    className="loomini-input"
                    placeholder="Digite tags separadas por vírgula (ex: marketing, digital, negócios)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.tags.includes(value)) {
                          handleInputChange('tags', [...formData.tags, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center bg-loomini-gradient-light text-loomini-blue px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeFromArray('tags', index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-loomini-dark mb-6">
                  Preços e Detalhes
                </h2>

                {/* Region Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Região de Venda
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="loomini-input"
                  >
                    <option value="Moçambique">🇲🇿 Moçambique (MZN)</option>
                    <option value="Angola">🇦🇴 Angola (AOA)</option>
                    <option value="Brasil">🇧🇷 Brasil (BRL)</option>
                  </select>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Venda * ({currencyInfo?.symbol})
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="loomini-input"
                      placeholder="0,00"
                      required
                    />
                    {formData.price && (
                      <p className="text-sm text-gray-500 mt-1">
                        Equivale a: {formatCurrency(parseCurrency(formData.price), selectedRegion)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Comparação ({currencyInfo?.symbol})
                    </label>
                    <input
                      type="text"
                      value={formData.comparePrice}
                      onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                      className="loomini-input"
                      placeholder="0,00 (opcional)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Preço original para mostrar desconto
                    </p>
                  </div>
                </div>

                {/* Duration & Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração/Tamanho
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="loomini-input"
                      placeholder="Ex: 5 horas, 200 páginas, 50 MB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pré-requisitos
                    </label>
                    <input
                      type="text"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      className="loomini-input"
                      placeholder="Ex: Conhecimento básico de informática"
                    />
                  </div>
                </div>

                {/* What You Will Learn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que o cliente vai aprender/receber
                  </label>
                  {formData.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('whatYouWillLearn', index, e.target.value)}
                        className="loomini-input flex-1"
                        placeholder="Ex: Como criar campanhas eficazes no Facebook"
                      />
                      {formData.whatYouWillLearn.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFromArray('whatYouWillLearn', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArray('whatYouWillLearn')}
                    className="flex items-center space-x-2 text-loomini-blue hover:text-loomini-purple transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar item</span>
                  </button>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Público-alvo
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="loomini-input min-h-[80px] resize-none"
                    placeholder="Para quem é direcionado este produto?"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Files & Media */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-loomini-dark mb-6">
                  Arquivos e Mídia
                </h2>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem de Capa *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Arraste e solte sua imagem aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Formato recomendado: 1200x800px, máximo 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload('coverImage', e.target.files)}
                    />
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galeria de Imagens (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">
                      Adicione imagens extras do seu produto
                    </p>
                    <p className="text-sm text-gray-500">
                      Até 5 imagens, máximo 3MB cada
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload('gallery', e.target.files)}
                    />
                  </div>
                </div>

                {/* Product Files */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivos do Produto *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Faça upload dos arquivos que o cliente receberá
                    </p>
                    <p className="text-sm text-gray-500">
                      Formatos aceitos: PDF, ZIP, MP4, MP3, DOCX, etc.
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload('files', e.target.files)}
                    />
                  </div>
                  
                  {formData.files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Arquivos Selecionados:</h4>
                      <div className="space-y-2">
                        {formData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFromArray('files', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Files */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivos de Preview (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">
                      Adicione amostras grátis do seu produto
                    </p>
                    <p className="text-sm text-gray-500">
                      Ajuda os clientes a conhecerem seu produto antes da compra
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload('preview', e.target.files)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Final Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-loomini-dark mb-6">
                  Detalhes Finais
                </h2>

                {/* FAQ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perguntas Frequentes
                  </label>
                  {formData.faq.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index].question = e.target.value;
                          handleInputChange('faq', newFaq);
                        }}
                        className="loomini-input mb-3"
                        placeholder="Pergunta"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index].answer = e.target.value;
                          handleInputChange('faq', newFaq);
                        }}
                        className="loomini-input min-h-[80px] resize-none"
                        placeholder="Resposta"
                      />
                      {formData.faq.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newFaq = formData.faq.filter((_, i) => i !== index);
                            handleInputChange('faq', newFaq);
                          }}
                          className="mt-2 text-red-500 hover:text-red-700 text-sm"
                        >
                          Remover FAQ
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq = [...formData.faq, { question: '', answer: '' }];
                      handleInputChange('faq', newFaq);
                    }}
                    className="flex items-center space-x-2 text-loomini-blue hover:text-loomini-purple transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar FAQ</span>
                  </button>
                </div>

                {/* Support Includes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que está incluído no suporte?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Suporte por e-mail',
                      'Atualizações gratuitas',
                      'Acesso vitalício',
                      'Certificado de conclusão',
                      'Comunidade exclusiva',
                      'Suporte técnico'
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.supportIncludes.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('supportIncludes', [...formData.supportIncludes, option]);
                            } else {
                              handleInputChange('supportIncludes', formData.supportIncludes.filter(item => item !== option));
                            }
                          }}
                          className="rounded border-gray-300 text-loomini-blue focus:ring-loomini-blue mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Termos e Condições
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-loomini-blue focus:ring-loomini-blue"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        Confirmo que possuo todos os direitos sobre o conteúdo deste produto
                      </span>
                    </label>
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-loomini-blue focus:ring-loomini-blue"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        Concordo com os termos de uso da plataforma e política de vendas
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Rascunho</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="loomini-button flex items-center space-x-2"
                  >
                    <span>Próximo</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="loomini-button flex items-center space-x-2"
                  >
                    <span>Publicar Produto</span>
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreation;
