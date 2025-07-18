
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCourse } from '@/contexts/CourseContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useLessonNavigation } from '@/hooks/useLessonNavigation';
import { usePurchases } from '@/hooks/usePurchases';
import { CourseHeader } from '@/components/course/CourseHeader';
import { ModuleList } from '@/components/course/ModuleList';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { LessonInfo } from '@/components/course/LessonInfo';
import { LessonNavigation } from '@/components/course/LessonNavigation';

const CourseRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPurchased } = usePurchases();
  const { 
    currentCourse, 
    modules, 
    currentLesson, 
    isLoading, 
    error, 
    loadCourse, 
    setCurrentLesson 
  } = useCourse();
  const { 
    courseProgress, 
    loadCourseProgress, 
    markLessonComplete, 
    isLessonCompleted 
  } = useProgress();
  
  const {
    goToNextLesson,
    goToPreviousLesson,
    hasNextLesson,
    hasPreviousLesson,
    setCurrentLessonId
  } = useLessonNavigation(modules);

  useEffect(() => {
    if (id) {
      // Check if user has purchased this course
      if (!hasPurchased(id)) {
        navigate('/minhas-compras', { 
          state: { message: 'Você precisa comprar este curso para acessá-lo.' }
        });
        return;
      }

      loadCourse(id);
      loadCourseProgress(id);
    }
  }, [id, hasPurchased, loadCourse, loadCourseProgress, navigate]);

  useEffect(() => {
    if (currentLesson) {
      setCurrentLessonId(currentLesson.id);
    }
  }, [currentLesson, setCurrentLessonId]);

  const handleLessonSelect = (lesson: any) => {
    setCurrentLesson(lesson);
  };

  const handleNextLesson = () => {
    const nextLesson = goToNextLesson();
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  };

  const handlePreviousLesson = () => {
    const previousLesson = goToPreviousLesson();
    if (previousLesson) {
      setCurrentLesson(previousLesson);
    }
  };

  const handleMarkComplete = async () => {
    if (currentLesson) {
      await markLessonComplete(currentLesson.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Curso não encontrado
            </h2>
            <p className="text-red-600 mb-4">
              {error || 'Este curso não foi encontrado ou você não tem acesso a ele.'}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Possíveis motivos:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Você não comprou este curso ainda</li>
                <li>O curso foi removido ou está indisponível</li>
                <li>Houve um erro ao carregar os dados</li>
              </ul>
            </div>
          </div>
          <div className="space-x-4">
            <Button onClick={() => navigate('/minhas-compras')}>
              Minhas Compras
            </Button>
            <Button variant="outline" onClick={() => navigate('/produtos')}>
              Ver Cursos Disponíveis
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseHeader 
        course={currentCourse}
        progress={courseProgress?.progressPercentage || 0}
        onBack={() => navigate('/minhas-compras')}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <ModuleList
          modules={modules}
          currentLesson={currentLesson}
          onLessonSelect={handleLessonSelect}
          isLessonCompleted={isLessonCompleted}
        />

        <div className="flex-1 p-6">
          {currentLesson ? (
            <div className="space-y-4">
              <VideoPlayer 
                lesson={currentLesson}
                onComplete={handleMarkComplete}
              />
              
              <LessonInfo 
                lesson={currentLesson}
                isCompleted={isLessonCompleted(currentLesson.id)}
                onMarkComplete={handleMarkComplete}
              />

              <LessonNavigation
                onPrevious={handlePreviousLesson}
                onNext={handleNextLesson}
                hasNext={hasNextLesson()}
                hasPrevious={hasPreviousLesson()}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
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
