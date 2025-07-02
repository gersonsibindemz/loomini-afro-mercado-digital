
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Module {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  order_index: number;
}

interface CourseSidebarProps {
  courseTitle: string;
  modules: Module[];
  progress: any[];
  courseCompletionPercentage: number;
  currentLessonId: string;
  canRequestCertificate: boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  onLessonSelect: (lessonId: string) => void;
  onCertificateRequest: (fullName: string) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseTitle,
  modules,
  progress,
  courseCompletionPercentage,
  currentLessonId,
  canRequestCertificate,
  isModuleCompleted,
  onLessonSelect,
  onCertificateRequest
}) => {
  const navigate = useNavigate();
  const [certificateDialogOpen, setCertificateDialogOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState('');

  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const isLessonCompleted = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId);
    return lessonProgress?.completed || false;
  };

  const handleCertificateRequest = () => {
    if (!fullName.trim()) return;
    onCertificateRequest(fullName);
    setCertificateDialogOpen(false);
    setFullName('');
  };

  return (
    <div className="w-96 bg-white shadow-lg overflow-y-auto">
      <div className="p-6 border-b">
        <Button
          variant="ghost"
          onClick={() => navigate('/minhas-compras')}
          className="mb-4 p-0 h-auto text-sm"
        >
          ← Voltar para Minhas Compras
        </Button>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{courseTitle}</h1>
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

      <div className="p-6">
        <Accordion type="multiple" defaultValue={modules.map(m => m.id)}>
          {modules.map((module) => (
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
                        onClick={() => onLessonSelect(lesson.id)}
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
  );
};

export default CourseSidebar;
