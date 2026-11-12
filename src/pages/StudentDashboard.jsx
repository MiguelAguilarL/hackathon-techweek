import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Bot,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';
import SocraticChatModal from '../components/SocraticChatModal';
import InteractiveFlashcardsModal from '../components/InteractiveFlashcardsModal';
import AIGuidedExercisesModal from '../components/AIGuidedExercisesModal';
import { MOCK_USER } from '../data/diagnosticData';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTopic, setChatTopic] = useState('');
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [guidedExercisesOpen, setGuidedExercisesOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(MOCK_USER);
  const [evaluationResult, setEvaluationResult] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('currentUser');
    if (rawUser) {
      try {
        setCurrentUser(JSON.parse(rawUser));
      } catch (e) {
        console.error(e);
      }
    }

    const rawEval = localStorage.getItem('lastEvaluationResult');
    if (rawEval) {
      try {
        setEvaluationResult(JSON.parse(rawEval));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Determinar nivel detectado en la evaluación
  const score = evaluationResult ? evaluationResult.score : 5;
  const total = evaluationResult ? evaluationResult.total : 6;
  const scorePercentage = Math.round((score / total) * 100);

  let levelText = 'Nivel Intermedio';
  if (scorePercentage < 50) {
    levelText = 'Nivel Básico';
  } else if (scorePercentage >= 80) {
    levelText = 'Nivel Avanzado';
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5fbf5] text-[#171d19] antialiased selection:bg-emerald-500 selection:text-white">
      {/* Banner de Conectividad */}
      <ConnectivityBanner />

      {/* Header Superior */}
      <header className="bg-white border-b border-[#bccac0]/30 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Botón hamburguesa móvil */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#006948] flex items-center justify-center text-white font-bold text-xl shadow-md">
              AJ
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#006948] to-[#00855d] bg-clip-text text-transparent">
              Aprender a la jarocha
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-sm font-medium text-[#3d4a42]">
              <span>Estudiante:</span>
              <span className="font-bold text-[#171d19]">{currentUser.name}</span>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Menú lateral izquierdo (Desktop & Mobile Drawer) */}
      <div className="flex-grow flex relative">
        <aside
          className={`fixed lg:sticky top-16 bottom-0 left-0 w-64 bg-[#eff5ef] border-r border-[#bccac0]/30 z-20 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl transition-colors bg-[#006948] text-white font-semibold text-sm shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/resultado"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-[#171d19] hover:bg-[#dee4de] transition-colors text-sm font-medium min-h-[44px]"
            >
              <TrendingUp className="w-4 h-4 mr-3 text-slate-500" />
              <span>Progreso Diagnóstico</span>
            </Link>
          </nav>

          <div className="space-y-3">
            

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-red-700 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer min-h-[44px]"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-600" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Backdrop móvil */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-10 lg:hidden"
          />
        )}

        {/* Contenido Principal */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
          <div className="flex flex-col w-full space-y-6 pb-12">
            
            {/* Banner de Bienvenida y Resumen de Perfil */}
            <section className="relative overflow-hidden rounded-3xl bg-[#eff5ef] p-6 sm:p-8 shadow-xs border border-slate-100">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#006948]/10 blur-3xl pointer-events-none" />
              <div className="absolute right-1/3 -bottom-20 w-48 h-48 rounded-full bg-[#6cf8bb]/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="relative shrink-0">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl">
                      {currentUser.initials || 'MR'}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#006948] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-[#006948] text-xs font-bold uppercase tracking-wider">
                        {levelText}
                      </span>
                      <span className="text-[#3d4a42] text-xs font-medium">
                        {currentUser.grade || '3° "B" Secundaria'}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171d19] mb-1">
                      ¡Qué tal, {currentUser.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-sm text-[#3d4a42]">
                      Materia actual: <span className="font-bold text-[#171d19]">{currentUser.subject || 'Matemáticas Aplicadas'}</span> 
                    </p>
                  </div>
                </div>

                {/* Gauge de Progreso General */}
                
              </div>
            </section>

            {/* Tema Actual */}
            <section className="rounded-3xl bg-[#006948] text-white p-6 sm:p-8 relative overflow-hidden shadow-md">
              <div className="relative z-10">
                <div className="inline-flex items-center mb-3">
                  <span className="px-3 py-1 rounded-lg bg-[#00855d] text-emerald-50 text-xs font-bold uppercase tracking-wide">
                    Tema Actual
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                  Ecuaciones Lineales
                </h3>
                <p className="text-sm text-emerald-50/90 max-w-2xl leading-relaxed">
                  Estudio y resolución de ecuaciones de primer grado con una incógnita, aplicando las propiedades de la igualdad y el despeje algebraico para modelar y resolver problemas matemáticos y cotidianos.
                </p>
              </div>
            </section>

            {/* Sección de Actividades Disponibles */}
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[#006948] text-xs font-bold uppercase tracking-wider block mb-1">
                    Práctica recomendada
                  </span>
                  <h3 className="text-xl font-bold text-[#171d19]">Actividades Disponibles para este Tema</h3>
                </div>
                <span className="text-xs text-[#3d4a42] font-medium hidden sm:block">
                  3 actividades disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Actividad 1: Test */}
                <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006948] flex items-center justify-center font-bold mb-3 group-hover:bg-[#006948] group-hover:text-white transition-colors">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#e9efe9] text-[#3d4a42] text-[10px] font-semibold mb-1.5">
                      5 Minutos
                    </span>
                    <h4 className="font-bold text-[#171d19] text-base mb-1">Test Diagnóstico</h4>
                    <p className="text-xs text-[#3d4a42] mb-4 line-clamp-2">
                      Evaluación rápida de 5 preguntas sobre ecuaciones lineales de primer grado.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/evaluacion')}
                    className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-[#e9efe9] hover:bg-[#006948] hover:text-white transition-colors text-xs font-bold text-[#171d19] flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Iniciar Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Actividad 2: Flashcards */}
                <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#006c49] flex items-center justify-center font-bold mb-3 group-hover:bg-[#006c49] group-hover:text-white transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#e9efe9] text-[#3d4a42] text-[10px] font-semibold mb-1.5">
                      Repaso Activo
                    </span>
                    <h4 className="font-bold text-[#171d19] text-base mb-1">Flashcards Interactivas</h4>
                    <p className="text-xs text-[#3d4a42] mb-4 line-clamp-2">
                      Memoriza y repasa fórmulas y conceptos clave con tarjetas estilo NotebookLM.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlashcardsOpen(true)}
                    className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-[#e9efe9] hover:bg-[#006c49] hover:text-white transition-colors text-xs font-bold text-[#171d19] flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Abrir Tarjetas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Actividad 3: IA Asistida */}
                <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-[#9b3e3b] flex items-center justify-center font-bold mb-3 group-hover:bg-[#9b3e3b] group-hover:text-white transition-colors">
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#e9efe9] text-[#3d4a42] text-[10px] font-semibold mb-1.5">
                      IA Asistida
                    </span>
                    <h4 className="font-bold text-[#171d19] text-base mb-1">Ejercicios Guiados con IA</h4>
                    <p className="text-xs text-[#3d4a42] mb-4 line-clamp-2">
                      Cuestionarios generados en vivo con retroalimentación y tutor socrático.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuidedExercisesOpen(true)}
                    className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-[#e9efe9] hover:bg-[#9b3e3b] hover:text-white transition-colors text-xs font-bold text-[#171d19] flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Practicar con IA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Widget flotante de Soporte IA Socrático */}
      <aside className="fixed bottom-6 right-6 z-40">
        <div
          onClick={() => {
            setChatTopic('');
            setChatOpen(true);
          }}
          className="bg-white rounded-2xl border border-[#bccac0]/30 shadow-xl p-3.5 sm:p-4 flex items-center space-x-3 hover:shadow-2xl transition-all cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006948] flex items-center justify-center font-bold group-hover:bg-[#006948] group-hover:text-white transition-colors">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] text-[#3d4a42] font-medium">¿Tienes dudas?</span>
            <span className="text-sm font-bold text-[#171d19] group-hover:text-[#006948] transition-colors">
              Chat IA apoyo
            </span>
          </div>
        </div>
      </aside>

      {/* Modal de Flashcards Interactivas (NotebookLM Style) */}
      <InteractiveFlashcardsModal
        isOpen={flashcardsOpen}
        onClose={() => setFlashcardsOpen(false)}
        initialLevel={levelText}
      />

      {/* Modal de Ejercicios Guiados por IA (Groq Qwen en vivo) */}
      <AIGuidedExercisesModal
        isOpen={guidedExercisesOpen}
        onClose={() => setGuidedExercisesOpen(false)}
        onOpenSocraticChat={(promptText) => {
          setChatTopic(promptText);
          setChatOpen(true);
        }}
      />

      {/* Modal del Tutor Socrático (con z-[70] para superponerse limpiamente sobre cualquier otro modal) */}
      <SocraticChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialTopic={chatTopic}
        studentProfile={{
          name: currentUser.name,
          grade: currentUser.grade,
          subject: currentUser.subject,
          level: levelText,
          city: 'Veracruz'
        }}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 bg-white border-t border-slate-100">
        <p>&copy; {new Date().getFullYear()} Aprender a la jarocha &bull; Educación accesible sin conexión</p>
      </footer>
    </div>
  );
}
