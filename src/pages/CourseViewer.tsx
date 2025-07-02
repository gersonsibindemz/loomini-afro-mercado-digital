
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, Maximize, ChevronLeft, ChevronRight, CheckCircle, Download, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useNotifications } from '@/components/NotificationSystem';
import { Separator } from '@/components/ui/separator';

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [fullName, setFullName] = useState('');

  // Mock course data - in real app, this would come from API
  const course = {
    id: id,
    title: 'Curso Completo de Marketing Digital',
    description: 'Aprenda todas as estratégias de marketing digital do básico ao avançado',
    modules: [
      {
        id: '1',
        title: 'Introdução ao Marketing Digital',
        order_index: 1,
        lessons: [
          {
            id: '1-1',
            title: 'O que é Marketing Digital',
            description: 'Conceitos fundamentais do marketing digital',
            duration: '15:30',
            video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            order_index: 1,
            materials: [
              { id: '1', name: 'Slides - Introdução.pdf', file_type: 'pdf', file_url: '#' }
            ]
          },
          {
            id: '1-2',
            title: 'Ferramentas Essenciais',
            description: 'Principais ferramentas para começar',
            duration: '20:45',
            video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            order_index: 2,
            materials: []
          }
        ]
      },
      {
        id: '2',
        title: 'Estratégias de Conteúdo',
        order_index: 2,
        lessons: [
          {
            id: '2-1',
            title: 'Criação de Conteúdo',
            description: 'Como criar conteúdo que converte',
            duration: '25:15',
            video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            order_index: 1,
            materials: [
              { id: '2', name: 'Template - Calendário Editorial.xlsx', file_type: 'xlsx', file_url: '#' }
            ]
          }
        ]
      }
    ]
  };

  const {
    progress,
    updateProgress,
    requestCertificate,
    isLoading: progressLoading,
    courseCompletionPercentage,
    isModuleCompleted,
    canRequestCertificate
  } = useCourseProgress(id!);

  // Get all lessons for navigation
  const allLessons = course.modules.flatMap(module => 
    module.lessons.map(lesson => ({ ...lesson, moduleId: module.id, moduleTitle: module.title }))
  );

  const currentLesson = allLessons.find(lesson => lesson.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);

  useEffect(() => {
    if (allLessons.length > 0 && !currentLessonId) {
      setCurrentLessonId(allLessons[0].id);
    }
  }, [allLessons, currentLessonId]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    
    if (duration > 0) {
      const watchPercentage = Math.round((time / duration) * 100);
      const lessonProgress = progress.find(p => p.lesson_id === currentLessonId);
      
      if (!lessonProgress || lessonProgress.watch_percentage < watchPercentage) {
        updateProgress(currentLessonId, watchPercentage);
      }
    }
  };

  const markAsCompleted = () => {
    if (currentTime / duration >= 0.9) {
      updateProgress(currentLessonId, 100, true);
      addNotification({
        type: 'success',
        title: 'Aula Concluída!',
        message: 'Parabéns por completar esta aula.'
      });
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const handleCertificateRequest = async () => {
    if (!fullName.trim()) {
      addNotification({
        type: 'error',
        title: 'Nome Obrigatório',
        message: 'Por favor, insira seu nome completo para o certificado.'
      });
      return;
    }

    await requestCertificate(fullName);
    setCertificateDialogOpen(false);
    setFullName('');
    addNotification({
      type: 'success',
      title: 'Certificado Solicitado!',
      message: 'Certificado solicitado! Será enviado em até 5 dias úteis.'
    });
  };

  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const isLessonCompleted = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId);
    return lessonProgress?.completed || false;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Course Sidebar */}
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b">
          <Button
            variant="ghost"
            onClick={() => navigate('/minhas-compras')}
            className="mb-4 p-0 h-auto text-sm"
          >
            ← Voltar para Minhas Compras
          </Button>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progresso do Curso</span>
              <span>{courseCompletionPercentage}%</span>
            </div>
            <Progress value={courseCompletionPercentage} className="h-2" />
          </div>
          
          {canRequestCertificate && (
            <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  <Award className="w-4 h-4 mr-2" />
                  Solicitar Certificado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Certificado de Conclusão</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo (como aparecerá no certificado)</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setCertificateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCertificateRequest}>
                      Solicitar Certificado
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Modules and Lessons */}
        <div className="p-6">
          <Accordion type="multiple" defaultValue={course.modules.map(m => m.id)}>
            {course.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span className="font-medium">{module.title}</span>
                    {isModuleCompleted(module.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 mt-2">
                    {module.lessons.map((lesson) => {
                      const lessonProgress = getLessonProgress(lesson.id);
                      const completed = isLessonCompleted(lesson.id);
                      const isActive = currentLessonId === lesson.id;
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            isActive ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => setCurrentLessonId(lesson.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                              )}
                              <div>
                                <h4 className="font-medium text-sm">{lesson.title}</h4>
                                <p className="text-xs text-gray-600">{lesson.duration}</p>
                              </div>
                            </div>
                          </div>
                          {lessonProgress && !completed && (
                            <div className="mt-2">
                              <Progress value={lessonProgress.watch_percentage} className="h-1" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentLesson && (
          <>
            {/* Video Player */}
            <div className="bg-black relative">
              <div className="aspect-video relative">
                <video
                  className="w-full h-full"
                  src={currentLesson.video_url}
                  poster="/placeholder.svg"
                  onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls
                />
              </div>
            </div>

            {/* Lesson Info and Controls */}
            <div className="bg-white p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
                  <p className="text-gray-600 mt-1">{currentLesson.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline">{currentLesson.moduleTitle}</Badge>
                    <span className="text-sm text-gray-500">Duração: {currentLesson.duration}</span>
                  </div>
                </div>
                
                {duration > 0 && currentTime / duration >= 0.9 && !isLessonCompleted(currentLessonId) && (
                  <Button onClick={markAsCompleted} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Aula Anterior
                </Button>

                <div className="text-sm text-gray-600">
                  Aula {currentLessonIndex + 1} de {allLessons.length}
                </div>

                <Button
                  variant="outline"
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                >
                  Próxima Aula
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Materials */}
            {currentLesson.materials && currentLesson.materials.length > 0 && (
              <div className="bg-white p-6">
                <h3 className="text-lg font-semibold mb-4">Materiais de Apoio</h3>
                <div className="space-y-2">
                  {currentLesson.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{material.name}</h4>
                          <p className="text-sm text-gray-600">{material.file_type.toUpperCase()}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseViewer;
