'use client'
import React, { useState, useEffect, useMemo, use } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  Download, 
  Filter 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { FaX } from 'react-icons/fa6';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';

// Tipos de datos
interface Answer {
  id: number;
  questionId: number;
  textAnswer?: string;
  numericAnswer?: number | null;
  dateAnswer?: string;
  selectedOptionId?: number;
}

interface SurveyResponse {
  id: number;
  respondentEmail: string;
  submittedAt?: string;
  answers: Answer[];
}

interface QuestionOption {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  questionType: string;
  options?: QuestionOption[];
}

interface QuestionAnalytics {
  questionId: number;
  totalResponses: number;
  textAnswers: string[];
  numericAnswers: number[];
  dateAnswers: string[];
  selectedOptions: number[];
  responseRate: number;
}

interface GeneralStats {
  totalQuestions: number;
  totalResponses: number;
  averageResponseRate: number;
  lastResponseDate: Date | null;
  questionIds: number[];
}

// Funciones simuladas - reemplaza con tus APIs reales
const getStadistics = async (surveyId: number): Promise<SurveyResponse[]> => {
  // Simula una llamada API
  const session=await getSession()
  const token=session?.user?.token;
    const res=await fetch(`http://localhost:8080/api/responses/survey/${surveyId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json"
      }
    })
    
    const data=await res.json()
    console.log("RESPONSES",data)
    return data

  ;
};

const getQuestions = async (surveyId: number): Promise<Record<number, Question>> => {
  const session=await getSession();
  const token=session?.user?.token  
  const res=await fetch(`http://localhost:8080/api/questions/survey/${surveyId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json"
      }
    }) 
    const data=await res.json()
    const dataById = data.reduce((acc: Record<number, Question>, question: Question) => {
    acc[question.id] = question;
    return acc;
  }, {});
    console.log("QUESTION",data)
    return dataById

};

// Función para formatear fechas
const formatDate = (date: Date, format?: string): string => {
  if (!date || !(date instanceof Date)) return 'N/A';
  
  if (format === 'yyyy-MM-dd HH:mm:ss') {
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  return date.toLocaleDateString('es-ES');
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const SurveyAnalyticsDashboard: React.FC<PageProps>= ({params}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'questions' | 'responses'>('overview');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const resolvedParams = use(params); // <--- Esta es la parte clave
  const surveyId = Number(resolvedParams.id);
  console.log("sera este el id?",surveyId)
  // Estados para datos asíncronos
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [questionsData, setQuestionsData] = useState<Record<number, Question>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setMounted(true);
        setCurrentTime(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        console.log('Cargando datos para survey:', surveyId);
        const [statisticsData, questionsResponse] = await Promise.all([
          getStadistics(surveyId),
          getQuestions(surveyId)
        ]);

        // Asegurar que los datos sean arrays/objetos válidos
        setSurveyData(Array.isArray(statisticsData) ? statisticsData : []);
        setQuestionsData(questionsResponse || {});
        
        console.log('Statistics:', statisticsData);
        console.log('Questions:', questionsResponse);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calcular estadísticas analíticas
  const questionAnalytics = useMemo((): Record<number, QuestionAnalytics> => {
    if (!surveyData.length) return {};
    
    const stats: Record<number, QuestionAnalytics> = {};
    
    surveyData.forEach((response) => {
      if (response.answers && Array.isArray(response.answers)) {
        response.answers.forEach((answer) => {
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
          
          if (answer.textAnswer) stats[qId].textAnswers.push(answer.textAnswer);
          if (answer.numericAnswer !== null && answer.numericAnswer !== undefined) {
            stats[qId].numericAnswers.push(answer.numericAnswer);
          }
          if (answer.dateAnswer) stats[qId].dateAnswers.push(answer.dateAnswer);
          if (answer.selectedOptionId) stats[qId].selectedOptions.push(answer.selectedOptionId);
        });
      }
    });

    const totalSurveys = surveyData.length;
    Object.keys(stats).forEach((qId) => {
      const questionId = Number(qId);
      stats[questionId].responseRate = totalSurveys > 0 ? (stats[questionId].totalResponses / totalSurveys) * 100 : 0;
    });

    return stats;
  }, [surveyData]);

  const generalStats: GeneralStats = useMemo(() => {
    const questionIds = Object.keys(questionAnalytics).map(Number);
    const responseRates = Object.values(questionAnalytics);
    
    return {
      totalQuestions: questionIds.length,
      totalResponses: surveyData.length,
      averageResponseRate: responseRates.length > 0 
        ? responseRates.reduce((sum, q) => sum + q.responseRate, 0) / responseRates.length 
        : 0,
      lastResponseDate: surveyData.length > 0 
        ? new Date(Math.max(...surveyData.map(r => r.submittedAt ? new Date(r.submittedAt).getTime() : 0)))
        : null,
      questionIds
    };
  }, [questionAnalytics, surveyData]);

  // Colores para los gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Preparar datos para gráficos de barras (respuestas numéricas)
  const numericChartData = useMemo(() => {
    const data: { [key: string]: any }[] = [];
    Object.entries(questionAnalytics).forEach(([qId, analytics]) => {
      if (analytics.numericAnswers.length > 0) {
        const avg = analytics.numericAnswers.reduce((sum, val) => sum + val, 0) / analytics.numericAnswers.length;
        const questionText = questionsData[Number(qId)]?.text || `Pregunta ${qId}`;
        data.push({
          question: questionText.length > 30 ? questionText.substring(0, 30) + '...' : questionText,
          promedio: Math.round(avg * 100) / 100,
          respuestas: analytics.numericAnswers.length
        });
      }
    });
    return data;
  }, [questionAnalytics, questionsData]);

  // Preparar datos para gráfico de pie (opciones múltiples)
  const multipleChoiceData = useMemo(() => {
    const selectedQ = selectedQuestionId || Number(Object.keys(questionAnalytics)[0]);
    if (!selectedQ || !questionAnalytics[selectedQ]) return [];

    const analytics = questionAnalytics[selectedQ];
    const question = questionsData[selectedQ];
    
    if (!question?.options) return [];

    const optionCounts: { [key: number]: number } = {};
    analytics.selectedOptions.forEach(optionId => {
      optionCounts[optionId] = (optionCounts[optionId] || 0) + 1;
    });

    return question.options.map((option, index) => ({
      name: option.text,
      value: optionCounts[option.id] || 0,
      color: COLORS[index % COLORS.length]
    }));
  }, [questionAnalytics, questionsData, selectedQuestionId]);

  // Datos para gráfico de línea temporal
  const timelineData = useMemo(() => {
    if (!surveyData.length) return [];
    
    const dailyResponses: { [key: string]: number } = {};
    
    surveyData.forEach(response => {
      if (response.submittedAt) {
        const date = new Date(response.submittedAt).toISOString().split('T')[0];
        dailyResponses[date] = (dailyResponses[date] || 0) + 1;
      }
    });

    return Object.entries(dailyResponses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: formatDate(new Date(date)), 
        respuestas: count
      }));
  }, [surveyData]);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = 
    ({ title, value, icon, color }) => (
      <div className="bg-slate-300 rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="text-2xl" style={{ color }}>
            {icon}
          </div>
        </div>
      </div>
    );

  // Estados de carga y error
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  console.log("Primer",selectedQuestionId,
    questionAnalytics[Number(selectedQuestionId)],questionsData)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate via-slate-500 to-black p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className='flex w-full justify-between'>
             <h1 className="text-3xl font-bold text-gray-500 mb-2">Analisis de la Encuesta</h1>
            <button className='border border-gray-400 p-2 rounded-lg hover:cursor-pointer'>
              <Link href={"/dashboard"}>
              <FaX></FaX>
              </Link>
              </button></div>
         
          <p className="text-gray-500">Visualización completa de respuestas y estadísticas</p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 justify-center
          bg-gradient-to-tr from-gray via-slate-600 to-slate-800 p-1 rounded-lg shadow-sm border">
            {[
              { key: 'overview', label: 'Resumen General', icon: <BarChart3 className="w-4 h-4" /> },
              { key: 'questions', label: 'Análisis por Pregunta', icon: <MessageSquare className="w-4 h-4" /> },
              { key: 'responses', label: 'Respuestas Detalladas', icon: <Users className="w-4 h-4" /> }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSelectedView(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  selectedView === key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-100 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vista de Resumen General */}
        {selectedView === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total de Respuestas"
                value={generalStats.totalResponses}
                icon={<Users />}
                color="#3B82F6"
              />
              <StatCard
                title="Preguntas Totales"
                value={generalStats.totalQuestions}
                icon={<MessageSquare />}
                color="#10B981"
              />
              <StatCard
                title="Tasa de Respuesta Promedio"
                value={`${Math.round(generalStats.averageResponseRate)}%`}
                icon={<TrendingUp />}
                color="#F59E0B"
              />
              <StatCard
                title="Última Respuesta"
                value={
                  generalStats.lastResponseDate
                    ? formatDate(generalStats.lastResponseDate)
                    : 'N/A'
                }
                icon={<Clock />}
                color="#8B5CF6"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Respuestas Numéricas */}
              <div className="bg-gradient-to-br from-gray to-black rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Promedios de Respuestas Numéricas</h3>
                {numericChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={numericChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="question" tick={{ fontSize: 12 ,fill:"#ffff"}} />
                      <YAxis tick={{ fontSize: 12 ,fill:"#ffff"}}/>
                      <Tooltip labelStyle={{ color: '#93C5FD' }} />
                      <Bar dataKey="promedio" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No hay datos numéricos disponibles
                  </div>
                )}
              </div>

              {/* Gráfico Temporal */}
              <div className="bg-gradient-to-br from-blue to-black  rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Respuestas por Día</h3>
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 ,fill:"#ffff"}}/>
                      <YAxis tick={{ fontSize: 12 ,fill:"#ffff"}}/>
                      <Tooltip labelStyle={{ color: '#93C5FD' }}/>
                      <Area type="monotone" dataKey="respuestas" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No hay datos temporales disponibles
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vista de Análisis por Pregunta */}
        {selectedView === 'questions' && (
          <div className="space-y-6">
            {/* Selector de Pregunta */}
            <div className="bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-400 mb-4">Seleccionar Pregunta para Análisis</h3>
             <select
  value={selectedQuestionId ?? ''}
  onChange={(e) => setSelectedQuestionId(Number(e.target.value))}
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option className="bg-slate-600" value="">Seleccione una pregunta</option>
  {Object.values(questionsData).map((question,index) => (
    
    <option className="bg-slate-600" key={question.id} value={question.id}>
      {question.text}
    </option>
  ))}
</select>

            </div>
            {selectedQuestionId && questionAnalytics[Number(selectedQuestionId)] && (
              console.log("estos es mas abajo",selectedQuestionId,questionAnalytics[Number(selectedQuestionId)]),
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estadísticas de la Pregunta */}
                <div className="bg-slate-400 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de la Pregunta</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Respuestas:</span>
                      <span className="font-semibold">{questionAnalytics[Number(selectedQuestionId)].totalResponses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Respuesta:</span>
                      <span className="font-semibold">{Math.round(questionAnalytics[Number(selectedQuestionId)].responseRate)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo de Pregunta:</span>
                      <span className="font-semibold capitalize">{questionsData[Number(selectedQuestionId)]?.questionType?.replace('_', ' ') || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico según tipo de pregunta */}
                <div className="bg-slate-400 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Respuestas</h3>
                  {questionsData[selectedQuestionId]?.questionType === 'SELECCION_UNICA' && (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={multipleChoiceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {multipleChoiceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  
                  {questionsData[selectedQuestionId]?.questionType === 'CAMPO_NUMERICO' && questionAnalytics[selectedQuestionId].numericAnswers.length > 0 && (
                    <div className="space-y-2">
                      <p><strong>Promedio:</strong> {(questionAnalytics[selectedQuestionId].numericAnswers.reduce((a, b) => a + b, 0) / questionAnalytics[selectedQuestionId].numericAnswers.length).toFixed(2)}</p>
                      <p><strong>Mínimo:</strong> {Math.min(...questionAnalytics[selectedQuestionId].numericAnswers)}</p>
                      <p><strong>Máximo:</strong> {Math.max(...questionAnalytics[selectedQuestionId].numericAnswers)}</p>
                    </div>
                  )}

                  {questionsData[selectedQuestionId]?.questionType === 'text' && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <p><strong>Respuestas de texto ({questionAnalytics[selectedQuestionId].textAnswers.length}):</strong></p>
                      {questionAnalytics[selectedQuestionId].textAnswers.map((answer, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                          {answer}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vista de Respuestas Detalladas */}
        {selectedView === 'responses' && (
          <div className="bg-slate-500 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Respuestas Detalladas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Respuestas</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-500 divide-y divide-gray-200">
                  {surveyData.map((response) => (
                    <tr key={response.id} className="hover:bg-slate-300">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{response.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{response.respondentEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.submittedAt ? formatDate(new Date(response.submittedAt)) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-2">
                          {response.answers?.map((answer) => (
                            <div key={answer.id} className="text-xs bg-slate-600 p-2 rounded">
                              <strong>Q {answer.questionId}:</strong>{' '}
                              {answer.textAnswer || 
                               answer.numericAnswer || 
                               (answer.selectedOptionId && questionsData[answer.questionId]?.options?.find(o => o.id === answer.selectedOptionId)?.text) || 
                               answer.dateAnswer || 'Sin respuesta'}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer con acciones */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-100">
            Última actualización: {currentTime}
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar Datos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalyticsDashboard;