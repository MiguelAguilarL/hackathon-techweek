import React, { useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
  Check,
  ListOrdered,
  ToggleLeft,
  PenTool,
  WifiOff
} from 'lucide-react';
import { fetchGuidedExercises } from '../services/guidedExercisesService';

export default function AIGuidedExercisesModal({ isOpen, onClose, onOpenSocraticChat }) {
  if (!isOpen) return null;

  // Estados
  const [selectedType, setSelectedType] = useState('opcion_multiple'); // 'opcion_multiple' | 'verdadero_falso' | 'completar_respuesta'
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null); // { titulo, tema, preguntas: [] }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [index]: selectedOption }
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const typeOptions = [
    {
      id: 'opcion_multiple',
      title: 'Opción Múltiple',
      desc: '5 reactivos con 4 incisos (a, b, c, d) para resolver ecuaciones de primer grado.',
      icon: ListOrdered,
      color: 'bg-emerald-50 text-[#006948] border-emerald-200'
    },
    {
      id: 'verdadero_falso',
      title: 'Verdadero o Falso',
      desc: '5 afirmaciones conceptuales sobre reglas algebraicas y propiedades de la igualdad.',
      icon: ToggleLeft,
      color: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    {
      id: 'completar_respuesta',
      title: 'Completar Respuesta',
      desc: '5 preguntas con espacio en blanco (____) para encontrar el término o paso que falta.',
      icon: PenTool,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  ];

  const handleGenerate = async () => {
    setErrorMessage('');
    setIsGenerating(true);
    setQuizData(null);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);

    try {
      const data = await fetchGuidedExercises(selectedType);
      setQuizData(data);
    } catch (err) {
      setErrorMessage(
        err.message || 'No se pudo conectar con el agente. Asegúrate de tener conexión a Internet y el servidor Python activo.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionText) => {
    // Si ya respondió esta pregunta, no permitir cambiar para evaluar
    if (userAnswers[currentIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText
    }));
  };

  const currentQuestion = quizData?.preguntas?.[currentIndex];
  const totalQuestions = quizData?.preguntas?.length || 0;
  const currentAnswer = userAnswers[currentIndex];
  const hasAnsweredCurrent = currentAnswer !== undefined;
  const isCorrect = hasAnsweredCurrent && currentAnswer === currentQuestion?.respuesta_correcta;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Calcular puntaje final
  const score = quizData?.preguntas?.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.respuesta_correcta ? acc + 1 : acc;
  }, 0) || 0;

  // Solicitar ayuda socrática precargando la duda
  const handleAskHelpForCurrent = () => {
    const questionText = currentQuestion
      ? `Estoy resolviendo este ejercicio de ecuaciones: "${currentQuestion.enunciado}". ¿Me podrías dar una pista orientadora sobre el primer paso sin darme la respuesta?`
      : 'Tengo dudas sobre cómo resolver ecuaciones lineales.';

    if (onOpenSocraticChat) {
      onOpenSocraticChat(questionText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f5fbf5] w-full max-w-3xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header estilo NotebookLM */}
        <div className="bg-white border-b border-[#bccac0]/30 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-[#85f8c4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#171d19]">
                  Ejercicios Guiados por IA
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006948] text-[10px] font-bold uppercase tracking-wide">
                  En Vivo &bull; Groq Qwen
                </span>
              </div>
              <p className="text-xs text-[#3d4a42]">
                Ecuaciones de Primer Grado &bull; Generación activa sin fallbacks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Permanente de Asistencia Socrática */}
            <button
              type="button"
              onClick={handleAskHelpForCurrent}
              className="min-h-[38px] px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006948] border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Pedir pista al Tutor Socrático para este ejercicio"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pedir Pista con IA</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow flex flex-col justify-center">
          
          {/* Mensaje de Error (Sin internet o falla de backend) */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-900 font-bold mb-0.5">Se requiere conexión activa:</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ESTADO 1: Pantalla de Selección de Tipo */}
          {!quizData && !isGenerating && (
            <div className="space-y-6 max-w-xl mx-auto w-full my-auto">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-[#006948] uppercase tracking-wider">
                  Configura tu sesión de práctica
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-[#171d19]">
                  ¿Qué tipo de preguntas deseas generar?
                </h4>
                <p className="text-xs text-slate-500">
                  El agente diseñará 5 preguntas inéditas adaptadas al tipo que elijas.
                </p>
              </div>

              {/* Selector de 3 Tipos */}
              <div className="space-y-3">
                {typeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedType(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                        isSelected
                          ? 'border-[#006948] bg-white shadow-md'
                          : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${opt.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-[#171d19]">{opt.title}</h5>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#006948]" />
                          )}
                        </div>
                        <p className="text-xs text-[#3d4a42] mt-0.5 leading-snug">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="w-full min-h-[48px] py-3 px-6 bg-[#006948] hover:bg-[#00855d] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar 5 Preguntas con IA</span>
              </button>
            </div>
          )}

          {/* ESTADO 2: Cargando preguntas con Groq */}
          {isGenerating && (
            <div className="text-center py-16 space-y-4 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006948] flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-[#171d19]">
                  Generando reactivos con Groq...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  El agente está resolviendo y estructurando 5 ejercicios de ecuaciones de primer grado en formato {selectedType.replace('_', ' ')}.
                </p>
              </div>
            </div>
          )}

          {/* ESTADO 3: Preguntas generadas y en resolución */}
          {quizData && !isCompleted && currentQuestion && (
            <div className="space-y-5 max-w-xl mx-auto w-full my-auto">
              {/* Barra superior de progreso */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#006948] text-xs font-bold">
                    Reactivo {currentIndex + 1} de {totalQuestions}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {quizData.tipo?.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-xs font-semibold text-[#006948]">
                  Progreso: {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>

              <div className="w-full bg-[#eff5ef] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006948] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Tarjeta de la Pregunta */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                <h4 className="text-base sm:text-lg font-bold text-[#171d19] leading-snug">
                  {currentQuestion.enunciado}
                </h4>

                {/* Opciones Interactivas */}
                <div className="space-y-2.5">
                  {currentQuestion.opciones?.map((opt, optIdx) => {
                    const isSelected = currentAnswer === opt;
                    const isCorrectAnswer = opt === currentQuestion.respuesta_correcta;

                    let btnClass = 'border-slate-200 bg-white hover:bg-[#eff5ef] text-slate-800';

                    if (hasAnsweredCurrent) {
                      if (isCorrectAnswer) {
                        btnClass = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        btnClass = 'border-red-400 bg-red-50 text-red-900 font-semibold';
                      } else {
                        btnClass = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={hasAnsweredCurrent}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm min-h-[48px] cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {selectedType === 'verdadero_falso' ? (opt === 'Verdadero' ? 'V' : 'F') : 'ABCD'[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {hasAnsweredCurrent && isCorrectAnswer && (
                          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600" />
                            Correcto
                          </span>
                        )}
                        {hasAnsweredCurrent && isSelected && !isCorrectAnswer && (
                          <span className="text-red-700 text-xs font-bold">Incorrecto</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Retroalimentación inmediata tras responder */}
                {hasAnsweredCurrent && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs animate-in fade-in duration-200 flex items-start gap-2.5 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong>{isCorrect ? '¡Bien hecho!' : 'Respuesta a revisar:'}</strong>{' '}
                      {isCorrect
                        ? 'Identificaste el resultado correcto.'
                        : `La respuesta correcta es "${currentQuestion.respuesta_correcta}".`}
                      {currentQuestion.explicacion && (
                        <p className="mt-1 text-slate-600">{currentQuestion.explicacion}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Navegación del Examen */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="min-h-[44px] px-4 py-2 bg-[#eff5ef] hover:bg-[#dee4de] disabled:opacity-30 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasAnsweredCurrent}
                  className="min-h-[44px] px-6 py-2 bg-[#006948] hover:bg-[#00855d] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIndex < totalQuestions - 1 ? 'Siguiente Reactivo' : 'Finalizar y Ver Aciertos'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ESTADO 4: Resumen de Resultados del Cuestionario */}
          {quizData && isCompleted && (
            <div className="text-center space-y-6 max-w-md mx-auto my-auto animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#006948] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#006948] uppercase tracking-wider">
                  Cuestionario Completado
                </span>
                <h4 className="text-2xl font-extrabold text-[#171d19]">
                  {quizData.titulo || 'Ecuaciones de Primer Grado'}
                </h4>
                <p className="text-xs text-slate-500">
                  Ejercicios guiados generados en vivo por IA
                </p>
              </div>

              {/* Puntuación */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">
                  Tu puntuación
                </span>
                <div className="text-3xl font-extrabold text-[#006948]">
                  {score} / {totalQuestions} aciertos
                </div>
                <p className="text-xs text-[#3d4a42] mt-2">
                  {score >= 4
                    ? '¡Excelente dominio de este formato de ecuaciones!'
                    : 'Buen esfuerzo. Puedes apoyarte del Tutor Socrático para reforzar los pasos que te hicieron dudar.'}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => setQuizData(null)}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Probar otro tipo</span>
                </button>

                <button
                  type="button"
                  onClick={handleAskHelpForCurrent}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Preguntar al Tutor</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
