import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Brain, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';
import { MOCK_USER } from '../data/diagnosticData';

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('lastEvaluationResult');
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch (e) {
        console.error('Error parsing evaluation result', e);
      }
    } else {
      // Valores por defecto basados en referencia
      setResult({
        score: 5,
        total: 6,
        studentName: MOCK_USER.name,
        studentInitials: MOCK_USER.initials,
        grade: MOCK_USER.grade,
        subject: MOCK_USER.subject
      });
    }
  }, []);

  const student = result || {
    score: 5,
    total: 6,
    studentName: MOCK_USER.name,
    studentInitials: MOCK_USER.initials,
    grade: MOCK_USER.grade,
    subject: MOCK_USER.subject
  };

  const scorePercentage = Math.round((student.score / student.total) * 100);

  // Determinar nivel
  let level = 'Intermedio';
  let levelColor = 'text-emerald-700 bg-emerald-50';
  if (scorePercentage < 50) {
    level = 'Básico / En desarrollo';
    levelColor = 'text-amber-800 bg-amber-50';
  } else if (scorePercentage >= 80) {
    level = 'Avanzado';
    levelColor = 'text-teal-800 bg-teal-50';
  }

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
              ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Tarjeta Lateral Izquierda: Perfil del Alumno */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {student.studentInitials || 'MR'}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Nombre estudiante
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">{student.studentName}</h2>
                  <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    Estudiante Activo
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Materia
                  </span>
                  <p className="font-semibold text-slate-700 mt-0.5">{student.subject || 'Matemáticas Aplicadas'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Grado y grupo
                  </span>
                  <p className="font-semibold text-slate-700 mt-0.5">{student.grade || '3° "B" Secundaria'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Tu nivel de aprendizaje
                  </span>
                  <div className="mt-2 flex items-center space-x-3">
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${scorePercentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${levelColor}`}>
                      {level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Evaluación Completada</h4>
                  <p className="text-xs text-slate-600">Revisión diagnóstica finalizada con éxito y guardada localmente.</p>
                </div>
              </div>
            </div>

            {/* Área Principal de Resultados */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              
              {/* Tarjeta de Encabezado y Calificación */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center">
                <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold">
                  Diagnóstico Inicial
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">
                  Resultado de Evaluación Diagnóstica
                </h1>

                {/* Score Box */}
                <div className="mt-6 inline-flex items-center space-x-5 bg-slate-50 px-8 py-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-sm">
                    {student.score}
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">
                      Puntuación obtenida
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      Aciertos: {student.score} / {student.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aspectos a mejorar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Aspectos a mejorar</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tus aspectos a mejorar son el desarrollo de identidades algebraicas y el despeje de incógnitas en ecuaciones lineales que involucran fracciones o signos negativos. Podrás realizar dinámicas con preguntas orientadoras en el tutor socrático para reforzar estos temas paso a paso.
                </p>
              </div>

              {/* Retroalimentación */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Retroalimentación</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Buen desempeño general en álgebra y simplificación de expresiones. Demuestras excelente lógica matemática básica; sin embargo, se recomienda ejercitar la jerarquía de operaciones y la comprobación de soluciones antes de avanzar a los desafíos de sistemas de ecuaciones.
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/evaluacion')}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir evaluación</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('¡Diagnóstico completado! El siguiente paso será interactuar con el Tutor Socrático Jarocho.')}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Continuar al Dashboard / Tutor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Aprender a la jarocha &bull; Educación accesible sin conexión</p>
      </footer>
    </div>
  );
}
