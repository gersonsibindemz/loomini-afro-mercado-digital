
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, FileText, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSimpleProgress } from '@/hooks/useSimpleProgress';

const CourseViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [fullName, setFullName] = useState('');
  
  const {
    progress,
    isLoading,
    updateProgress,
    requestCertificate,
    certificateRequests,
    isUpdatingProgress,
    isRequestingCertificate
  } = useSimpleProgress(id || '');

  // Mock course data
  const course = {
    id: id || 'curso-1',
    title: 'Curso Completo de Marketing Digital',
    description: 'Aprenda as estratégias mais eficazes do marketing digital',
    instructor: 'Ana Silva',
    duration: '10 horas',
    totalLessons: 8,
    modules: [
      {
        id: 'module-1',
        title: 'Fundamentos do Marketing Digital',
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introdução ao Marketing Digital',
            duration: '15 min',
            videoUrl: 'https://example.com/video1.mp4',
            completed: false
          },
          {
            id: 'lesson-2', 
            title: 'Principais Canais Digitais',
            duration: '20 min',
            videoUrl: 'https://example.com/video2.mp4',
            completed: false
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Estratégias de Conteúdo',
        lessons: [
          {
            id: 'lesson-3',
            title: 'Criação de Conteúdo',
            duration: '25 min',
            videoUrl: 'https://example.com/video3.mp4',
            completed: false
          },
          {
            id: 'lesson-4',
            title: 'Planejamento Editorial',
            duration: '18 min',
            videoUrl: 'https://example.com/video4.mp4',
            completed: false
          }
        ]
      }
    ]
  };

  const allLessons = course.modules.flatMap(module => module.lessons);
  const currentLesson = allLessons[currentLessonIndex];
  const completedLessons = progress.filter(p => p.completed).length;
  const progressPercentage = (completedLessons / allLessons.length) * 100;

  const handleVideoEnd = () => {
    if (currentLesson) {
      updateProgress(currentLesson.id, 100, true);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleLessonSelect = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex);
  };

  const handleRequestCertificate = async () => {
    if (!fullName.trim()) return;
    
    try {
      await requestCertificate(fullName);
      setShowCertificateForm(false);
      setFullName('');
    } catch (error) {
      console.error('Erro ao solicitar certificado:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
  };

  const canRequestCertificate = progressPercentage >= 80;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/minhas-compras')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">por {course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {completedLessons} de {allLessons.length} aulas concluídas
              </div>
              <Progress value={progressPercentage} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">{currentLesson?.title}</h3>
                    <p className="text-sm opacity-75">Duração: {currentLesson?.duration}</p>
                    <Button
                      onClick={handleVideoEnd}
                      className="mt-4"
                      disabled={isUpdatingProgress}
                    >
                      {isUpdatingProgress ? 'Marcando...' : 'Marcar como Concluída'}
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePreviousLesson}
                      disabled={currentLessonIndex === 0}
                    >
                      Aula Anterior
                    </Button>
                    <Button
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === allLessons.length - 1}
                    >
                      Próxima Aula
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificate Section */}
            {canRequestCertificate && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Certificado de Conclusão</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Parabéns! Você concluiu {Math.round(progressPercentage)}% do curso e pode solicitar seu certificado.
                  </p>
                  {!showCertificateForm ? (
                    <Button onClick={() => setShowCertificateForm(true)}>
                      Solicitar Certificado
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome completo para o certificado:
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Digite seu nome completo"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleRequestCertificate}
                          disabled={!fullName.trim() || isRequestingCertificate}
                        >
                          {isRequestingCertificate ? 'Solicitando...' : 'Confirmar Solicitação'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCertificateForm(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Curso</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border-b last:border-b-0">
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-medium text-sm text-gray-900">{module.title}</h4>
                      </div>
                      {module.lessons.map((lesson, lessonIndex) => {
                        const globalLessonIndex = course.modules
                          .slice(0, moduleIndex)
                          .reduce((acc, mod) => acc + mod.lessons.length, 0) + lessonIndex;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(globalLessonIndex)}
                            className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                              currentLessonIndex === globalLessonIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {isLessonCompleted(lesson.id) ? (
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-gray-500">{lesson.duration}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
