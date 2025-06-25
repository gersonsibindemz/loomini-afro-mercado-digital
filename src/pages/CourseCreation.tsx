import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Video, Save, Plus, Trash2, FileText, Play, Clock } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import AssessmentToggle from '../components/AssessmentToggle';
import { Assessment } from '../types/assessment';
interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
}
interface SupportMaterial {
  id: string;
  name: string;
}
interface Module {
  id: string;
  name: string;
  lessons: Lesson[];
  materials: SupportMaterial[];
  assessment: Assessment | null;
}
interface CourseFormData {
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  currency: string;
  language: string;
  difficulty: string;
  coverImage: File | null;
  modules: Module[];
}
const CourseCreation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [newLesson, setNewLesson] = useState<{
    [moduleId: string]: Partial<Lesson>;
  }>({});
  const [newMaterial, setNewMaterial] = useState<{
    [moduleId: string]: string;
  }>({});
  const form = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      category: '',
      shortDescription: '',
      fullDescription: '',
      price: '',
      currency: 'MZN',
      language: 'Português',
      difficulty: 'Iniciante',
      coverImage: null,
      modules: []
    }
  });
  const categories = ['Marketing', 'Negócios', 'Tecnologia', 'Finanças', 'Design', 'Agricultura', 'Educação', 'Saúde', 'Idiomas', 'Desenvolvimento Pessoal', 'Música e Produção', 'Arte', 'Moda', 'Espiritualidade', 'Modelos Prontos'];
  const languages = ['Português', 'Inglês', 'Francês', 'Espanhol', 'Bantu', 'Outro'];
  const difficulties = ['Iniciante', 'Intermediário', 'Avançado'];
  const currencies = ['MZN', 'AOA'];
  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      form.setValue('coverImage', file);
      const reader = new FileReader();
      reader.onload = e => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
  const addModule = () => {
    if (!newModuleName.trim()) return;
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      name: newModuleName,
      lessons: [],
      materials: [],
      assessment: null
    };
    setModules(prev => [...prev, newModule]);
    setNewModuleName('');
  };
  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };
  const handleAssessmentChange = (moduleId: string, assessment: Assessment | null) => {
    setModules(prev => prev.map(module => module.id === moduleId ? {
      ...module,
      assessment
    } : module));
  };
  const addLesson = (moduleId: string) => {
    const lessonData = newLesson[moduleId];
    if (!lessonData?.title || !lessonData?.duration) return;
    const lesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: lessonData.title,
      duration: lessonData.duration,
      description: lessonData.description || '',
      videoUrl: lessonData.videoUrl || ''
    };
    setModules(prev => prev.map(module => module.id === moduleId ? {
      ...module,
      lessons: [...module.lessons, lesson]
    } : module));
    setNewLesson(prev => ({
      ...prev,
      [moduleId]: {}
    }));
  };
  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(module => module.id === moduleId ? {
      ...module,
      lessons: module.lessons.filter(l => l.id !== lessonId)
    } : module));
  };
  const addMaterial = (moduleId: string) => {
    const materialName = newMaterial[moduleId];
    if (!materialName?.trim()) return;
    const material: SupportMaterial = {
      id: Math.random().toString(36).substr(2, 9),
      name: materialName
    };
    setModules(prev => prev.map(module => module.id === moduleId ? {
      ...module,
      materials: [...module.materials, material]
    } : module));
    setNewMaterial(prev => ({
      ...prev,
      [moduleId]: ''
    }));
  };
  const removeMaterial = (moduleId: string, materialId: string) => {
    setModules(prev => prev.map(module => module.id === moduleId ? {
      ...module,
      materials: module.materials.filter(m => m.id !== materialId)
    } : module));
  };
  const onSubmit = async (data: CourseFormData) => {
    // Enhanced validation
    if (modules.length === 0) {
      alert('Curso deve ter pelo menos 1 módulo completo');
      return;
    }
    const invalidModules = modules.filter(m => !m.name || m.lessons.length === 0);
    if (invalidModules.length > 0) {
      alert('Módulo deve ter título e pelo menos 1 aula');
      return;
    }

    // Check for incomplete assessments
    const incompleteAssessments = modules.filter(m => m.assessment?.enabled && (!m.assessment.questions || m.assessment.questions.length === 0));
    if (incompleteAssessments.length > 0) {
      alert('Avaliação do módulo incompleta - adicione pelo menos uma pergunta');
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    const courseData = {
      ...data,
      modules
    };
    console.log('Course data:', courseData);
    alert('Curso criado com sucesso!');
    navigate('/painel-criador');
    setIsSubmitting(false);
  };
  const getTotalLessons = () => modules.reduce((total, module) => total + module.lessons.length, 0);
  const getTotalMaterials = () => modules.reduce((total, module) => total + module.materials.length, 0);
  const getTotalQuestions = () => modules.reduce((total, module) => total + (module.assessment?.questions?.length || 0), 0);
  return <div className="min-h-screen bg-loomini-gradient-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumb items={[{
        label: 'Dashboard',
        path: '/dashboard'
      }, {
        label: 'Criar Produto',
        path: '/criar-produto'
      }, {
        label: 'Curso'
      }]} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-slate-300">
          <div>
            <h1 className="text-3xl font-bold text-loomini-dark mb-2">
              Criar Curso
            </h1>
            <p className="text-gray-600">
              Configure seu curso com módulos, aulas e avaliações
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to="/criar-produto" className="flex items-center space-x-2 text-gray-600 hover:text-loomini-blue transition-colors duration-200">
              <span>Trocar Tipo de Produto</span>
            </Link>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Informações Básicas */}
            <Card className="bg-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Informações Básicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="title" render={({
                field
              }) => <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Curso Completo de Marketing Digital" className="loomini-input bg-slate-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="category" render={({
                field
              }) => <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <FormControl>
                        <select {...field} className="loomini-input">
                          <option value="">Selecione uma categoria</option>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="shortDescription" render={({
                field
              }) => <FormItem>
                      <FormLabel>Descrição Curta *</FormLabel>
                      <FormControl>
                        <Input placeholder="Resumo em uma linha do seu curso" className="loomini-input bg-slate-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="fullDescription" render={({
                field
              }) => <FormItem>
                      <FormLabel>O que os alunos aprenderão *</FormLabel>
                      <FormControl>
                        <textarea {...field} placeholder="Descreva os resultados de aprendizagem e habilidades que os alunos desenvolverão..." className="loomini-input min-h-[120px] resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </CardContent>
            </Card>

            {/* Upload da Capa */}
            <Card>
              <CardHeader className="bg-slate-200">
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Capa do Curso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-200">
                <FormField control={form.control} name="coverImage" render={() => <FormItem>
                      <FormLabel>Capa do Curso * (formato 16:9 recomendado)</FormLabel>
                      <FormControl>
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${dragActive ? 'border-loomini-blue bg-blue-50' : 'border-gray-300'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                          {coverPreview ? <div className="relative inline-block">
                              <img src={coverPreview} alt="Preview da capa" className="w-64 h-36 object-cover rounded-lg mx-auto" />
                              <button type="button" onClick={() => {
                        setCoverPreview(null);
                        form.setValue('coverImage', null);
                      }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </div> : <>
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">
                                Selecione uma imagem 16:9 para a capa
                              </p>
                              <p className="text-sm text-gray-500">
                                Formato recomendado: 1280x720px, máximo 5MB
                              </p>
                            </>}
                          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </CardContent>
            </Card>

            {/* Construtor de Módulos */}
            <Card className="bg-slate-200">
              <CardHeader className="bg-slate-200">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Construtor de Módulos</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {modules.length} módulos, {getTotalLessons()} aulas, {getTotalMaterials()} materiais
                    {getTotalQuestions() > 0 && `, ${getTotalQuestions()} perguntas`}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 bg-slate-200">
                {/* Add Module Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Adicionar Módulo</h3>
                  <div className="flex space-x-3">
                    <Input value={newModuleName} onChange={e => setNewModuleName(e.target.value)} placeholder="Nome do Módulo" className="flex-1 bg-slate-500" />
                    <Button type="button" onClick={addModule} disabled={!newModuleName.trim()} className="loomini-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Módulo
                    </Button>
                  </div>
                </div>

                {/* Modules List */}
                {modules.length > 0 && <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Módulos do Curso ({modules.length})</h3>
                    <Accordion type="multiple" className="w-full">
                      {modules.map((module, moduleIndex) => <AccordionItem key={module.id} value={module.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center justify-between w-full mr-4">
                              <span className="font-medium">{module.name}</span>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{module.lessons.length} aulas, {module.materials.length} materiais</span>
                                {module.assessment?.enabled && module.assessment.questions.length > 0 && <span className="text-purple-600 font-medium">
                                    ✓ {module.assessment.questions.length} perguntas
                                  </span>}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-6">
                            {/* Add Lesson */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                              <h4 className="font-medium">Adicionar Aula</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Título da Aula *" value={newLesson[module.id]?.title || ''} onChange={e => setNewLesson(prev => ({
                            ...prev,
                            [module.id]: {
                              ...prev[module.id],
                              title: e.target.value
                            }
                          }))} />
                                <Input placeholder="Duração * (ex: 15 min)" value={newLesson[module.id]?.duration || ''} onChange={e => setNewLesson(prev => ({
                            ...prev,
                            [module.id]: {
                              ...prev[module.id],
                              duration: e.target.value
                            }
                          }))} />
                                <Input placeholder="URL do Vídeo (opcional)" value={newLesson[module.id]?.videoUrl || ''} onChange={e => setNewLesson(prev => ({
                            ...prev,
                            [module.id]: {
                              ...prev[module.id],
                              videoUrl: e.target.value
                            }
                          }))} />
                                <Input placeholder="Descrição da Aula (opcional)" value={newLesson[module.id]?.description || ''} onChange={e => setNewLesson(prev => ({
                            ...prev,
                            [module.id]: {
                              ...prev[module.id],
                              description: e.target.value
                            }
                          }))} />
                              </div>
                              <Button type="button" onClick={() => addLesson(module.id)} disabled={!newLesson[module.id]?.title || !newLesson[module.id]?.duration} size="sm" className="loomini-button">
                                <Plus className="w-3 h-3 mr-2" />
                                Adicionar Aula
                              </Button>
                            </div>

                            {/* Lessons List */}
                            {module.lessons.length > 0 && <div>
                                <h4 className="font-medium mb-3">Aulas do Módulo:</h4>
                                <div className="space-y-2">
                                  {module.lessons.map((lesson, lessonIndex) => <div key={lesson.id} className="flex items-center justify-between bg-white p-3 rounded border">
                                      <div className="flex items-center space-x-3">
                                        <Play className="w-4 h-4 text-loomini-blue" />
                                        <div>
                                          <span className="font-medium">
                                            Aula {lessonIndex + 1}: {lesson.title}
                                          </span>
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{lesson.duration}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Remover Aula</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Confirmar exclusão da aula "{lesson.title}"?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => removeLesson(module.id, lesson.id)}>
                                              Remover
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>)}
                                </div>
                              </div>}

                            {/* Add Support Material */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                              <h4 className="font-medium">Materiais de Apoio</h4>
                              <div className="flex space-x-3">
                                <Input placeholder="Nome do material" value={newMaterial[module.id] || ''} onChange={e => setNewMaterial(prev => ({
                            ...prev,
                            [module.id]: e.target.value
                          }))} />
                                <Button type="button" onClick={() => addMaterial(module.id)} disabled={!newMaterial[module.id]?.trim()} size="sm" className="loomini-button">
                                  Adicionar Material
                                </Button>
                              </div>
                            </div>

                            {/* Materials List */}
                            {module.materials.length > 0 && <div>
                                <h4 className="font-medium mb-3">{module.materials.length} materiais adicionados</h4>
                                <div className="space-y-2">
                                  {module.materials.map(material => <div key={material.id} className="flex items-center justify-between bg-white p-3 rounded border">
                                      <div className="flex items-center space-x-3">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span>{material.name}</span>
                                      </div>
                                      <Button type="button" variant="outline" size="sm" onClick={() => removeMaterial(module.id, material.id)} className="text-red-600 hover:text-red-700">
                                        Remover da Lista
                                      </Button>
                                    </div>)}
                                </div>
                              </div>}

                            {/* Assessment Section */}
                            <AssessmentToggle moduleId={module.id} assessment={module.assessment} onAssessmentChange={assessment => handleAssessmentChange(module.id, assessment)} />

                            {/* Remove Module */}
                            <div className="pt-4 border-t">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remover Módulo
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remover Módulo</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Confirmar exclusão do módulo "{module.name}" e todas suas aulas?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeModule(module.id)}>
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </AccordionContent>
                        </AccordionItem>)}
                    </Accordion>
                  </div>}
              </CardContent>
            </Card>

            {/* Preços e Detalhes */}
            <Card className="bg-slate-200">
              <CardHeader>
                <CardTitle>Preços e Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 bg-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="price" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Preço *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" className="loomini-input bg-slate-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="currency" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Moeda</FormLabel>
                        <FormControl>
                          <select {...field} className="loomini-input">
                            {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="language" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Idioma</FormLabel>
                        <FormControl>
                          <select {...field} className="loomini-input">
                            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="difficulty" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nível de Dificuldade</FormLabel>
                        <FormControl>
                          <select {...field} className="loomini-input">
                            {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
              </CardContent>
            </Card>

            {/* Prévia das aulas criadas */}
            {modules.length > 0 && <Card>
                <CardHeader>
                  <CardTitle>Prévia das aulas criadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.map((module, moduleIndex) => <div key={module.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">
                          Módulo {moduleIndex + 1}: {module.name}
                        </h3>
                        <div className="text-sm text-gray-600 mb-3 flex items-center space-x-4">
                          <span>{module.lessons.length} aulas</span>
                          <span>{module.materials.length} materiais</span>
                          {module.assessment?.enabled && <span className="text-purple-600 font-medium">
                              ✓ {module.assessment.questions.length} perguntas
                            </span>}
                        </div>
                        {module.lessons.map((lesson, lessonIndex) => <div key={lesson.id} className="ml-4 py-1">
                            <span className="text-sm">
                              Aula {lessonIndex + 1}: {lesson.title} - {lesson.duration}
                            </span>
                          </div>)}
                      </div>)}
                  </div>
                </CardContent>
              </Card>}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link to="/criar-produto" className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <ArrowLeft className="w-4 h-4" />
                <span>Cancelar</span>
              </Link>

              <Button type="submit" disabled={isSubmitting} className="loomini-button flex items-center space-x-2">
                {isSubmitting ? <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Criando Curso...</span>
                  </> : <>
                    <Save className="w-4 h-4" />
                    <span>Criar Curso</span>
                  </>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>;
};
export default CourseCreation;