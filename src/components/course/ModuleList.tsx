
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  CheckCircle, 
  Circle, 
  Clock, 
  Play 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Module, Lesson } from '@/types/course';

interface ModuleListProps {
  modules: Module[];
  currentLesson: Lesson | null;
  onLessonSelect: (lesson: Lesson) => void;
  isLessonCompleted: (lessonId: string) => boolean;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  currentLesson,
  onLessonSelect,
  isLessonCompleted
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const expanded: Record<string, boolean> = {};
    modules.forEach(module => {
      expanded[module.id] = true;
    });
    return expanded;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isModuleCompleted = (module: Module) => {
    return module.lessons.every(lesson => isLessonCompleted(lesson.id));
  };

  return (
    <div className="w-80 bg-white border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4">Conteúdo do Curso</h2>
        
        <div className="space-y-2">
          {modules.map((module, moduleIndex) => (
            <Collapsible
              key={module.id}
              open={expandedModules[module.id]}
              onOpenChange={() => toggleModule(module.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isModuleCompleted(module) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isModuleCompleted(module) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        moduleIndex + 1
                      )}
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
                      onClick={() => onLessonSelect(lesson)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLesson?.id === lesson.id 
                          ? 'bg-blue-50 border-l-4 border-blue-600' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isLessonCompleted(lesson.id) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{lesson.title}</p>
                            {lesson.duration && (
                              <p className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.duration}
                              </p>
                            )}
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
  );
};
