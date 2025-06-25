
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import QuestionCreationForm from './QuestionCreationForm';
import QuestionList from './QuestionList';
import { Question, Assessment } from '../types/assessment';

interface AssessmentToggleProps {
  moduleId: string;
  assessment: Assessment | null;
  onAssessmentChange: (assessment: Assessment | null) => void;
}

const AssessmentToggle: React.FC<AssessmentToggleProps> = ({ 
  moduleId, 
  assessment, 
  onAssessmentChange 
}) => {
  const [isEnabled, setIsEnabled] = useState(assessment?.enabled || false);
  const [questions, setQuestions] = useState<Question[]>(assessment?.questions || []);

  const handleToggleAssessment = (enabled: boolean) => {
    setIsEnabled(enabled);
    
    if (enabled) {
      const newAssessment: Assessment = {
        id: assessment?.id || Math.random().toString(36).substr(2, 9),
        moduleId,
        questions: questions,
        enabled: true
      };
      onAssessmentChange(newAssessment);
    } else {
      onAssessmentChange(null);
    }
  };

  const handleAddQuestion = (question: Question) => {
    const updatedQuestions = [...questions, question];
    setQuestions(updatedQuestions);
    
    const updatedAssessment: Assessment = {
      id: assessment?.id || Math.random().toString(36).substr(2, 9),
      moduleId,
      questions: updatedQuestions,
      enabled: true
    };
    onAssessmentChange(updatedAssessment);
  };

  const handleRemoveQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    
    const updatedAssessment: Assessment = {
      id: assessment?.id || Math.random().toString(36).substr(2, 9),
      moduleId,
      questions: updatedQuestions,
      enabled: true
    };
    onAssessmentChange(updatedAssessment);
  };

  return (
    <div className="space-y-6">
      {/* Assessment Toggle */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <span>Seção de Avaliação</span>
            {isEnabled && questions.length > 0 && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeAssessment"
              checked={isEnabled}
              onCheckedChange={handleToggleAssessment}
            />
            <Label htmlFor="includeAssessment" className="text-sm font-medium">
              Incluir Avaliação
            </Label>
          </div>
          
          {isEnabled && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 text-sm">
                {questions.length > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">
                      ✓ Avaliação incluída - {questions.length} perguntas
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">
                      Nenhuma pergunta adicionada ainda
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Creation Form */}
      {isEnabled && (
        <div className="space-y-6">
          <QuestionCreationForm onAddQuestion={handleAddQuestion} />
          <QuestionList 
            questions={questions} 
            onRemoveQuestion={handleRemoveQuestion} 
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentToggle;
