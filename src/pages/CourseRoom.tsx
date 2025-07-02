
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Book, 
  CheckCircle, 
  Circle,
  ChevronRight,
  ChevronDown,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock course data - em produção viria do banco de dados
const mockCourses = {
  'curso-1': {
    id: 'curso-1',
    title: 'Desenvolvimento Web Completo',
    instructor: 'João Santos',
    totalDuration: '40 horas',
    completedLessons: 3,
    totalLessons: 15,
    modules: [
      {
        id: 1,
        title: 'Fundamentos do HTML',
        completed: true,
        lessons: [
          { 
            id: 'l1', 
            title: 'Introdução ao HTML', 
            duration: '15 min', 
            completed: true,
            videoUrl: 'https://example.com/video1.mp4'
          },
          { 
            id: 'l2', 
            title: 'Tags e Elementos', 
            duration: '20 min', 
            completed: true,
            videoUrl: 'https://example.com/video2.mp4'
          },
          { 
            id: 'l3', 
            title: 'Estrutura de uma Página', 
            duration: '25 min', 
            completed: true,
            videoUrl: 'https://example.com/video3.mp4'
          }
        ]
      },
      {
        id: 2,
        title: 'CSS e Estilização',
        completed: false,
        lessons: [
          { 
            id: 'l4', 
            title: 'Seletores CSS', 
            duration: '18 min', 
            completed: false,
            videoUrl: 'https://example.com/video4.mp4'
          },
          { 
            id: 'l5', 
            title: 'Flexbox e Grid', 
            duration: '30 min', 
            completed: false,
            videoUrl: 'https://example.com/video5.mp4'
          },
          { 
            id: 'l6', 
            title: 'Responsividade', 
            duration: '25 min', 
            completed: false,
            videoUrl: 'https://example.com/video6.mp4'
          }
        ]
      }
    ]
  }
};

const CourseRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Verificar se o usuário tem acesso ao curso
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const hasPurchased = purchases.some(purchase => purchase.id === id);
    
    if (!hasPurchased) {
      navigate('/minhas-compras', { 
        state: { message: 'Você precisa comprar este curso para acessá-lo.' }
      });
      return;
    }

    // Carregar dados do curso
    const courseData = mockCourses[id];
    if (courseData) {
      setCourse(courseData);
      // Definir primeira aula como padrão
      const firstLesson = courseData.modules[0]?.lessons[0];
      if (firstLesson) {
        setCurrentLesson(firstLesson);
      }
      
      // Calcular progresso
      const totalLessons = courseData.modules.reduce((total, module) => total + module.lessons.length, 0);
      const completedLessons = courseData.modules.reduce((total, module) => 
        total + module.lessons.filter(lesson => lesson.completed).length, 0
      );
      setProgress((completedLessons / totalLessons) * 100);
      
      // Expandir módulos por padrão
      const expanded = {};
      courseData.modules.forEach(module => {
        expanded[module.id] = true;
      });
      setExpandedModules(expanded);
    }
  }, [id, navigate]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
  };

  const markLessonComplete = (lessonId) => {
    if (!course) return;
    
    // Atualizar status da aula
    const updatedCourse = { ...course };
    updatedCourse.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (lesson.id === lessonId) {
          lesson.completed = true;
        }
      });
    });
    
    setCourse(updatedCourse);
    
    // Recalcular progresso
    const totalLessons = updatedCourse.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = updatedCourse.modules.reduce((total, module) => 
      total + module.lessons.filter(lesson => lesson.completed).length, 0
    );
    setProgress((completedLessons / totalLessons) * 100);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/minhas-compras')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{course.title}</h1>
                <p className="text-sm text-gray-600">por {course.instructor}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                Progresso do Curso
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={progress} className="w-32" />
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar com módulos */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-4">Conteúdo do Curso</h2>
            
            <div className="space-y-2">
              {course.modules.map((module) => (
                <Collapsible
                  key={module.id}
                  open={expandedModules[module.id]}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          module.completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {module.completed ? <CheckCircle className="w-4 h-4" /> : module.id}
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <p className="text-xs text-gray-500">
                            {module.lessons.length} aulas
                          </p>
                        </div>
                      </div>
                      {expandedModules[module.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="ml-2 mt-2 space-y-1">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            currentLesson?.id === lesson.id 
                              ? 'bg-blue-50 border-l-4 border-blue-600' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{lesson.title}</p>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>
                            {currentLesson?.id === lesson.id && (
                              <Play className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>

        {/* Área principal do vídeo */}
        <div className="flex-1 p-6">
          {currentLesson ? (
            <div className="space-y-4">
              {/* Player de vídeo */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    {/* Simulação de player de vídeo */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                          {isPlaying ? (
                            <Pause className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8" />
                          )}
                        </div>
                        <p className="text-lg font-medium">{currentLesson.title}</p>
                        <p className="text-sm opacity-75">{currentLesson.duration}</p>
                      </div>
                    </div>
                    
                    {/* Controles do player */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-white hover:bg-white hover:bg-opacity-20"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </Button>
                        <div className="flex-1 bg-gray-600 h-1 rounded">
                          <div className="bg-blue-600 h-1 rounded w-1/3"></div>
                        </div>
                        <span className="text-white text-sm">{currentLesson.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações da aula */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                      <p className="text-gray-600 mt-1">
                        Duração: {currentLesson.duration}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!currentLesson.completed && (
                        <Button
                          onClick={() => markLessonComplete(currentLesson.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar como Concluída
                        </Button>
                      )}
                      {currentLesson.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Concluída
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      Nesta aula você aprenderá os conceitos fundamentais sobre {currentLesson.title.toLowerCase()}. 
                      Siga as explicações e pratique os exercícios para fixar o conhecimento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Selecione uma aula
                </h3>
                <p className="text-gray-600">
                  Escolha uma aula no menu lateral para começar a estudar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRoom;
