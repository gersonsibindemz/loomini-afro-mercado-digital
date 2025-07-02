
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useCourseCompletion } from '@/hooks/useCourseCompletion';
import { useNotifications } from '@/components/NotificationSystem';
import CoursePlayer from '@/components/CoursePlayer';
import CourseSidebar from '@/components/CourseSidebar';

// Mock course data
const MOCK_COURSE = {
  id: '1',
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

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    progress,
    updateProgress,
    requestCertificate,
    isLoading: progressLoading,
    certificateRequests
  } = useCourseProgress(id!);

  const {
    courseCompletionPercentage,
    isModuleCompleted,
    canRequestCertificate
  } = useCourseCompletion(progress, certificateRequests.length);

  // Get all lessons for navigation
  const allLessons = MOCK_COURSE.modules.flatMap(module => 
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

  const handleCertificateRequest = async (fullName: string) => {
    await requestCertificate(fullName);
    addNotification({
      type: 'success',
      title: 'Certificado Solicitado!',
      message: 'Certificado solicitado! Será enviado em até 5 dias úteis.'
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    const lessonProgress = progress.find(p => p.lesson_id === lessonId);
    return lessonProgress?.completed || false;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CourseSidebar
        courseTitle={MOCK_COURSE.title}
        modules={MOCK_COURSE.modules}
        progress={progress}
        courseCompletionPercentage={courseCompletionPercentage}
        currentLessonId={currentLessonId}
        canRequestCertificate={canRequestCertificate}
        isModuleCompleted={isModuleCompleted}
        onLessonSelect={setCurrentLessonId}
        onCertificateRequest={handleCertificateRequest}
      />

      <div className="flex-1 flex flex-col">
        {currentLesson && (
          <>
            <CoursePlayer
              videoUrl={currentLesson.video_url}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={setDuration}
              onPlayStateChange={setIsPlaying}
            />

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
