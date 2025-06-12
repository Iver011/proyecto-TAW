// types/survey.ts

export interface SurveyResponse {
  id: number;
  submittedAt: string;
  answers: Answer[];
  userId?: number;
}

export interface Answer {
  id: number;
  questionId: number;
  textAnswer?: string;
  numericAnswer?: number;
  dateAnswer?: string;
  selectedOptionId?: number;
}

export interface Question {
  id: number;
  text: string;
  title?: string;
  description?: string;
  type: QuestionType;
  surveyId: number;
  options?: QuestionOption[];
  required?: boolean;
  order?: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  value: string;
  questionId: number;
}

export interface SurveyInfo {
    id: string;
  active: boolean;
  title: string;
  description?: string;
  totalResponses: number;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export type QuestionType = 
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'DATE'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'RATING'
  | 'BOOLEAN';

export interface QuestionAnalytics {
  questionId: number;
  totalResponses: number;
  textAnswers: string[];
  numericAnswers: number[];
  dateAnswers: string[];
  selectedOptions: number[];
  responseRate: number;
}

export interface ChartData {
  type: 'numeric' | 'options' | 'dates' | 'text';
  data: any[];
  stats?: NumericStats;
  responses?: string[];
}

export interface NumericStats {
  promedio: number;
  maximo: number;
  minimo: number;
  total: number;
}

export interface GeneralStats {
  totalQuestions: number;
  totalResponses: number;
  averageResponseRate: number;
  lastResponseDate: Date | null;
  questionIds: number[];
}

export interface UseSurveyDataReturn {
  surveyData: SurveyResponse[];
  questionsData: Record<number, Question>;
  surveyInfo: SurveyInfo | null;
  questionAnalytics: Record<number, QuestionAnalytics>;
  generalStats: GeneralStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isReady: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}