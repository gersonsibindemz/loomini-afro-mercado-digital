
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question, QuestionType, QUESTION_TYPES } from '../types/assessment';

interface QuestionCreationFormProps {
  onAddQuestion: (question: Question) => void;
}

const QuestionCreationForm: React.FC<QuestionCreationFormProps> = ({ onAddQuestion }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateQuestion = () => {
    const newErrors: { [key: string]: string } = {};

    if (!questionText.trim()) {
      newErrors.question = 'Pergunta é obrigatória';
    }

    if (questionType === 'multiple-choice') {
      const emptyOptions = options.filter(opt => !opt.trim());
      if (emptyOptions.length > 0) {
        newErrors.options = 'Preencha todas as opções';
      }
      if (correctAnswer === undefined || correctAnswer === null) {
        newErrors.correctAnswer = 'Selecione a resposta correta';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;

    let newQuestion: Question;

    switch (questionType) {
      case 'multiple-choice':
        newQuestion = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'multiple-choice',
          question: questionText,
          options: options.map(opt => opt.trim()),
          correctAnswer
        };
        break;
      case 'true-false':
        newQuestion = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'true-false',
          question: questionText,
          correctAnswer: trueFalseAnswer
        };
        break;
      case 'open':
        newQuestion = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'open',
          question: questionText
        };
        break;
      default:
        return;
    }

    onAddQuestion(newQuestion);
    
    // Reset form
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setTrueFalseAnswer(true);
    setErrors({});
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="text-purple-800">Criação de Perguntas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Type Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Tipo de Pergunta</Label>
          <RadioGroup
            value={questionType}
            onValueChange={(value) => setQuestionType(value as QuestionType)}
            className="flex flex-wrap gap-6"
          >
            {Object.entries(QUESTION_TYPES).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} />
                <Label htmlFor={key} className="text-sm">
                  {label}
                  {key === 'open' && (
                    <span className="text-xs text-gray-500 ml-1">(avaliação manual)</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Question Text */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Texto da Pergunta *
          </Label>
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Digite sua pergunta aqui..."
            className={errors.question ? 'border-red-500' : ''}
          />
          {errors.question && (
            <p className="text-red-500 text-xs mt-1">{errors.question}</p>
          )}
        </div>

        {/* Type-specific interfaces */}
        {questionType === 'multiple-choice' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Opções de Resposta</Label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    checked={correctAnswer === index}
                    onClick={() => setCorrectAnswer(index)}
                  />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            {errors.options && (
              <p className="text-red-500 text-xs">{errors.options}</p>
            )}
            {errors.correctAnswer && (
              <p className="text-red-500 text-xs">{errors.correctAnswer}</p>
            )}
            <p className="text-xs text-gray-600">
              Selecione a resposta correta clicando no círculo ao lado da opção
            </p>
          </div>
        )}

        {questionType === 'true-false' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Resposta Correta</Label>
            <RadioGroup
              value={trueFalseAnswer.toString()}
              onValueChange={(value) => setTrueFalseAnswer(value === 'true')}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true">Verdadeiro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false">Falso</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <Button
          onClick={handleAddQuestion}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pergunta
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionCreationForm;
