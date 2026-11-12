import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Sparkles, X, CheckCircle2 } from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';
import SocraticChatModal from '../components/SocraticChatModal';
import { DIAGNOSTIC_QUESTIONS, MOCK_USER } from '../data/diagnosticData';
import { db } from '../db';

export default function DiagnosticPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(MOCK_USER);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCurrentUser(parsed);
        if (parsed.firstTime) {
          setShowWelcomeModal(true);
        }
      } catch (e) {
        console.error('Error parsing current user', e);
      }
    } else {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcomeModal(false);
    // Marcamos que ya vio la bienvenida
    const updated = { ...currentUser, firstTime: false };
    setCurrentUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  const handleChoiceChange = (qId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleTextChange = (qId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: text
    }));
  };

  // Cálculo de progreso
  const answeredCount = DIAGNOSTIC_QUESTIONS.reduce((count, q) => {
    const ans = answers[q.id];
    if (ans && typeof ans === 'string' && ans.trim().length > 0) {
      return count + 1;
    }
    return count;
  }, 0);

  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calcular aciertos en preguntas de opción múltiple
    let score = 0;
    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (q.type === 'choice' && answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    // Para la pregunta abierta, si respondió algo sustancial, otorgamos el punto del diagnóstico
    if (answers[6] && answers[6].trim().length >= 5) {
      score += 1;
    }

    const evaluationResult = {
      score,
      total: totalQuestions,
      answers,
      completedAt: new Date().toISOString(),
      studentName: currentUser.name,
      studentInitials: currentUser.initials,
      grade: currentUser.grade,
      subject: currentUser.subject
    };

    try {
      // Guardar en IndexedDB localmente para modo offline
      await db.evaluationResults.add({
        userId: currentUser.email,
        email: currentUser.email,
        score,
        total: totalQuestions,
        answers,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error saving to Dexie:', err);
    }

    // Persistir en localStorage para navegación inmediata
    localStorage.setItem('lastEvaluationResult', JSON.stringify(evaluationResult));

    // Redirigir a resultado
    navigate('/resultado');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Banner de Conectividad */}
      <ConnectivityBanner />

      {/* Header Principal */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              AJ
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Aprender a la jarocha
            </h1>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
              ACTIVO
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {/* Barra lateral del Estudiante */}
          <aside className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl sm:text-2xl font-bold mb-3 shadow-inner">
                {currentUser.initials || 'MR'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1">
                Estudiante Activo
              </span>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Materia
                </span>
                <p className="font-semibold text-slate-700 mt-0.5">{currentUser.subject || 'Matemáticas Aplicadas'}</p>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Grado y grupo
                </span>
                <p className="font-semibold text-slate-700 mt-0.5">{currentUser.grade || '3° "B" Secundaria'}</p>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Nivel de partida
                </span>
                <div className="mt-1 flex items-center space-x-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <p className="font-semibold text-slate-700">Por definir (Diagnóstico)</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Panel Principal de Evaluación */}
          <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
            {/* Header del Panel y Barra de Progreso */}
            <div className="mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 uppercase">
                  Evaluación Diagnóstica
                </h2>
                <span className="text-sm font-bold text-emerald-600">
                  {progressPercentage}% ({answeredCount}/{totalQuestions})
                </span>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Formulario con Preguntas */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              {DIAGNOSTIC_QUESTIONS.map((q, index) => (
                <div
                  key={q.id}
                  className={`space-y-4 ${index > 0 ? 'pt-6 border-t border-slate-100' : ''}`}
                >
                  <h3 className="text-base font-semibold text-slate-800 leading-snug">
                    <span className="text-emerald-600 font-bold mr-2">{q.id}.</span>
                    {q.prompt}
                  </h3>

                  {q.type === 'choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1 sm:pl-6">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt.key;
                        return (
                          <label
                            key={opt.key}
                            className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition-all min-h-[44px] ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                                : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={opt.key}
                              checked={isSelected}
                              onChange={() => handleChoiceChange(q.id, opt.key)}
                              className="text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                            />
                            <span className="ml-3 text-sm font-medium text-slate-700">
                              <span className="font-bold text-slate-400 mr-1.5">{opt.key})</span>
                              {opt.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'open' && (
                    <div className="pl-1 sm:pl-6">
                      <textarea
                        rows={3}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className="w-full sm:max-w-xl px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400 outline-hidden transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Botón de Enviar */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[44px] px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Guardando...' : 'Finalizar y ver resultado'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* Modal de Bienvenida para el Primer Ingreso */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleDismissWelcome}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full inline-block">
                ¡Bienvenido a la comunidad jarocha!
              </span>

              <h2 className="text-2xl font-bold text-slate-900">
                ¡Hola, {currentUser.name}! 👋
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                Esta es tu primera vez en <strong>Aprender a la jarocha</strong>. Para que tu tutor personalizado se adapte a tu ritmo y estilo de aprendizaje, realizaremos una breve <strong>evaluación diagnóstica</strong> de matemáticas básicas (6 preguntas).
              </p>

              <div className="space-y-2 text-xs text-slate-500 text-left pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sin límite de tiempo ni presión.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Funciona incluso con conexión lenta o intermitente.</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleDismissWelcome}
                  className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Comenzar evaluación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget flotante de Soporte Socrático */}
      <aside className="fixed bottom-6 right-6 z-40">
        <div
          onClick={() => setChatOpen(true)}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-3.5 sm:p-4 flex items-center space-x-3 hover:shadow-2xl transition-all cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-medium">¿Tienes dudas?</span>
            <span className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
              Chat IA apoyo
            </span>
          </div>
        </div>
      </aside>

      {/* Modal del Tutor Socrático */}
      <SocraticChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialTopic="Preguntas de Diagnóstico de Matemáticas"
        studentProfile={{
          name: currentUser.name,
          grade: currentUser.grade,
          subject: currentUser.subject,
          level: 'Evaluación Inicial',
          city: 'Veracruz'
        }}
      />
    </div>
  );
}
