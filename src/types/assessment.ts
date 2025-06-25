
export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true-false';
  question: string;
  correctAnswer: boolean;
}

export interface OpenQuestion {
  id: string;
  type: 'open';
  question: string;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | OpenQuestion;

export interface Assessment {
  id: string;
  moduleId: string;
  questions: Question[];
  enabled: boolean;
}

export const QUESTION_TYPES = {
  'multiple-choice': 'Múltipla Escolha',
  'true-false': 'Verdadeiro/Falso',
  'open': 'Resposta Aberta'
} as const;

export type QuestionType = keyof typeof QUESTION_TYPES;
