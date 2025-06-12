import { useState, useEffect, useMemo, useCallback } from 'react';
import { getQuestions, GetSurvey, getStadistics, FormDTO } from '@/actions/forms';

// Tipos corregidos basados en tu estructura real
export interface SurveyResponse {
  id: number;
  surveyId: number;
  respondentEmail: string;
  submittedAt: string | null;
  answers: Answer[];
}

export interface Answer {
  id: number | null;
  questionId: number;
  surveyResponseId: number | null;
  textAnswer: string | null;
  numericAnswer: number | null;
  dateAnswer: string | null;
  selectedOptionId: number | null;
}

export interface Question {
  id: number;
  surveyId: number;
  text: string;
  questionType: string; // Cambiado de 'type' a 'questionType'
  orderIndex: number;
  required: boolean;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  orderIndex: number;
}

export interface QuestionAnalytics {
  questionId: number;
  totalResponses: number;
  textAnswers: string[];
  numericAnswers: number[];
  dateAnswers: string[];
  selectedOptions: number[];
  responseRate: number;
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
  surveyInfo: FormDTO | null;
  questionAnalytics: Record<number, QuestionAnalytics>;
  generalStats: GeneralStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isReady: boolean;
}

export const useSurveyData = (
  surveyId: number | null, 
  token?: string
): UseSurveyDataReturn => {
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [questionsData, setQuestionsData] = useState<Record<number, Question>>({});
  const [surveyInfo, setSurveyInfo] = useState<FormDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todos los datos
  const loadSurveyData = useCallback(async (): Promise<void> => {
    if (!surveyId || surveyId <= 0) {
      setError('ID de encuesta no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo para mejor rendimiento
      const [responses, questions, info] = await Promise.allSettled([
        getStadistics(surveyId, token),
        getQuestions(surveyId, token),
        GetSurvey(surveyId, token)
      ]);

      // Procesar respuestas
      if (responses.status === 'fulfilled') {
        const responsesData = responses.value || [];
        // Validar que la respuesta sea un array
        if (Array.isArray(responsesData)) {
          setSurveyData(responsesData);
        } else {
          console.warn('Las respuestas no son un array:', responsesData);
          setSurveyData([]);
        }
      } else {
        console.error('Error loading responses:', responses.reason);
        setSurveyData([]);
      }

      // Procesar preguntas en un mapa para acceso rápido
      if (questions.status === 'fulfilled') {
        const questionsMap: Record<number, Question> = {};
        const questionsArray = questions.value || [];
        
        if (Array.isArray(questionsArray)) {
          questionsArray.forEach((question: Question) => {
            // Validar que la pregunta tenga un ID válido
            if (question && question.id && typeof question.id === 'number') {
              questionsMap[question.id] = question;
            }
          });
        }
        
        setQuestionsData(questionsMap);
      } else {
        console.error('Error loading questions:', questions.reason);
        setQuestionsData({});
      }

      // Información general de la encuesta (opcional)
      if (info.status === 'fulfilled') {
        setSurveyInfo(info.value);
      } else {
        console.warn('Could not load survey info:', info.reason);
        setSurveyInfo(null);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos de la encuesta';
      setError(errorMessage);
      console.error('Error loading survey data:', err);
    } finally {
      setLoading(false);
    }
  }, [surveyId, token]);

  // Efecto para cargar datos cuando cambia el surveyId
  useEffect(() => {
    loadSurveyData();
  }, [loadSurveyData]);

  // Función para recargar datos manualmente
  const refetch = useCallback((): void => {
    loadSurveyData();
  }, [loadSurveyData]);

  // Análisis de estadísticas por pregunta (memoizado para optimización)
  const questionAnalytics = useMemo((): Record<number, QuestionAnalytics> => {
    if (!surveyData || !Array.isArray(surveyData) || surveyData.length === 0) {
      return {};
    }
    
    const stats: Record<number, QuestionAnalytics> = {};
    
    surveyData.forEach((response: SurveyResponse) => {
      // Validar que la respuesta tenga answers
      if (response.answers && Array.isArray(response.answers)) {
        response.answers.forEach((answer) => {
          // Validar que la respuesta tenga un questionId válido
          if (!answer.questionId || typeof answer.questionId !== 'number') {
            return;
          }
          
          const qId = answer.questionId;
          
          if (!stats[qId]) {
            stats[qId] = {
              questionId: qId,
              totalResponses: 0,
              textAnswers: [],
              numericAnswers: [],
              dateAnswers: [],
              selectedOptions: [],
              responseRate: 0
            };
          }
          
          stats[qId].totalResponses++;
          
          // Clasificar respuestas por tipo con validaciones estrictas
          if (answer.textAnswer !== null && 
              answer.textAnswer !== undefined && 
              typeof answer.textAnswer === 'string' && 
              answer.textAnswer.trim().length > 0) {
            stats[qId].textAnswers.push(answer.textAnswer.trim());
          }
          
          if (answer.numericAnswer !== null && 
              answer.numericAnswer !== undefined && 
              typeof answer.numericAnswer === 'number' &&
              !isNaN(answer.numericAnswer)) {
            stats[qId].numericAnswers.push(answer.numericAnswer);
          }
          
          if (answer.dateAnswer !== null && 
              answer.dateAnswer !== undefined && 
              typeof answer.dateAnswer === 'string' &&
              answer.dateAnswer.trim().length > 0) {
            stats[qId].dateAnswers.push(answer.dateAnswer.trim());
          }
          
          if (answer.selectedOptionId !== null && 
              answer.selectedOptionId !== undefined && 
              typeof answer.selectedOptionId === 'number') {
            stats[qId].selectedOptions.push(answer.selectedOptionId);
          }
        });
      }
    });

    // Calcular tasa de respuesta para cada pregunta
    const totalSurveys = surveyData.length;
    Object.keys(stats).forEach((qId) => {
      const questionId = Number(qId);
      if (!isNaN(questionId) && stats[questionId]) {
        stats[questionId].responseRate = totalSurveys > 0 ? 
          (stats[questionId].totalResponses / totalSurveys) * 100 : 0;
      }
    });

    return stats;
  }, [surveyData]);

  // Estadísticas generales de la encuesta
  const generalStats = useMemo((): GeneralStats => {
    const questionIds = Object.keys(questionAnalytics)
      .map(Number)
      .filter(id => !isNaN(id));
    
    const totalQuestions = questionIds.length;
    const totalResponses = surveyData.length;
    
    // Calcular tasa de respuesta promedio
    const averageResponseRate = totalQuestions > 0 ? 
      Object.values(questionAnalytics).reduce((sum, q) => sum + (q.responseRate || 0), 0) / totalQuestions : 0;

    // Encontrar la fecha de la última respuesta
    let lastResponseDate: Date | null = null;
    if (surveyData.length > 0) {
      const dates = surveyData
        .map((r: SurveyResponse) => r.submittedAt)
        .filter((date): date is string => Boolean(date) && typeof date === 'string')
        .map((date: string) => {
          try {
            return new Date(date);
          } catch {
            return null;
          }
        })
        .filter((date): date is Date => date !== null && !isNaN(date.getTime()));
      
      if (dates.length > 0) {
        lastResponseDate = new Date(Math.max(...dates.map(d => d.getTime())));
      }
    }

    return {
      totalQuestions,
      totalResponses,
      averageResponseRate,
      lastResponseDate,
      questionIds
    };
  }, [questionAnalytics, surveyData]);

  return {
    // Datos
    surveyData,
    questionsData,
    surveyInfo,
    questionAnalytics,
    generalStats,
    
    // Estados
    loading,
    error,
    
    // Funciones
    refetch,
    
    // Utilidades
    isReady: !loading && !error && Object.keys(questionsData).length > 0
  };
};