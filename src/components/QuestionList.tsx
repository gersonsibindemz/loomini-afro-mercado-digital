
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Question, QUESTION_TYPES } from '../types/assessment';

interface QuestionListProps {
  questions: Question[];
  onRemoveQuestion: (questionId: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onRemoveQuestion }) => {
  const getQuestionTypeBadge = (type: Question['type']) => {
    const badges = {
      'multiple-choice': { label: 'Múltipla', color: 'bg-blue-100 text-blue-800' },
      'true-false': { label: 'V/F', color: 'bg-green-100 text-green-800' },
      'open': { label: 'Aberta', color: 'bg-orange-100 text-orange-800' }
    };
    
    const badge = badges[type];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const renderQuestionPreview = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="mt-2 space-y-1">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  index === question.correctAnswer ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={index === question.correctAnswer ? 'font-medium text-green-700' : 'text-gray-600'}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        );
      case 'true-false':
        return (
          <div className="mt-2 text-sm">
            <span className="text-gray-600">Resposta correta: </span>
            <span className="font-medium text-green-700">
              {question.correctAnswer ? 'Verdadeiro' : 'Falso'}
            </span>
          </div>
        );
      case 'open':
        return (
          <div className="mt-2 text-sm text-gray-600">
            (Resposta será avaliada manualmente)
          </div>
        );
      default:
        return null;
    }
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800">
          Perguntas do Teste ({questions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      Pergunta {index + 1}:
                    </span>
                    {getQuestionTypeBadge(question.type)}
                  </div>
                  <p className="text-gray-700 mb-2">{question.question}</p>
                  {renderQuestionPreview(question)}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover Pergunta</AlertDialogTitle>
                      <AlertDialogDescription>
                        Confirmar exclusão da pergunta "{question.question.substring(0, 50)}..."?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRemoveQuestion(question.id)}>
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionList;
