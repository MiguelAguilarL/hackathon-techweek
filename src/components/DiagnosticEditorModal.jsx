import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function DiagnosticEditorModal({ isOpen, onClose, initialExam, onSave, isNewMode = false }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState(
    isNewMode
      ? 'Nueva Evaluación Diagnóstica de Matemáticas'
      : initialExam?.title || 'Evaluación Diagnóstica: Matemáticas'
  );
  const [subject, setSubject] = useState(initialExam?.subject || 'Matemáticas Aplicadas');
  const [grade, setGrade] = useState(initialExam?.grade || '3° "B" Secundaria');

  // Inicializar preguntas: cada una con 4 incisos fijos (a, b, c, d)
  const [questions, setQuestions] = useState(
    isNewMode
      ? [
          {
            id: 1,
            prompt: '',
            options: [
              { key: 'a', text: '' },
              { key: 'b', text: '' },
              { key: 'c', text: '' },
              { key: 'd', text: '' }
            ],
            correctAnswer: 'a'
          }
        ]
      : initialExam?.questions?.map((q, idx) => ({
          id: idx + 1,
          prompt: q.prompt,
          options: q.options || [
            { key: 'a', text: '' },
            { key: 'b', text: '' },
            { key: 'c', text: '' },
            { key: 'd', text: '' }
          ],
          correctAnswer: q.correctAnswer || 'a'
        })) || []
  );

  const [errorMessage, setErrorMessage] = useState('');

  const handlePromptChange = (qIndex, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].prompt = text;
      return copy;
    });
  };

  const handleOptionChange = (qIndex, optKey, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options = copy[qIndex].options.map((opt) =>
        opt.key === optKey ? { ...opt, text } : opt
      );
      return copy;
    });
  };

  const handleCorrectAnswerChange = (qIndex, optKey) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].correctAnswer = optKey;
      return copy;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        prompt: '',
        options: [
          { key: 'a', text: '' },
          { key: 'b', text: '' },
          { key: 'c', text: '' },
          { key: 'd', text: '' }
        ],
        correctAnswer: 'a'
      }
    ]);
  };

  const handleRemoveQuestion = (qIndex) => {
    if (questions.length <= 1) {
      setErrorMessage('La evaluación debe tener al menos una pregunta.');
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
    setErrorMessage('');
  };

  const handleSave = () => {
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('El título de la evaluación no puede estar vacío.');
      return;
    }

    // Validar que todas las preguntas tengan enunciado y los 4 incisos completos
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt.trim()) {
        setErrorMessage(`La pregunta #${i + 1} no tiene enunciado.`);
        return;
      }
      for (const opt of q.options) {
        if (!opt.text.trim()) {
          setErrorMessage(`En la pregunta #${i + 1}, el inciso (${opt.key}) está vacío.`);
          return;
        }
      }
      if (!q.correctAnswer) {
        setErrorMessage(`En la pregunta #${i + 1}, debes seleccionar cuál es la respuesta correcta.`);
        return;
      }
    }

    const payload = {
      id: isNewMode ? `diagnostic-${Date.now()}` : initialExam?.id || 'diagnostic-default',
      title: title.trim(),
      subject: subject.trim(),
      grade: grade.trim(),
      questions: questions.map((q, idx) => ({
        id: idx + 1,
        prompt: q.prompt.trim(),
        options: q.options.map((o) => ({ key: o.key, text: o.text.trim() })),
        correctAnswer: q.correctAnswer
      }))
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header Modal */}
        <div className="bg-[#006948] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold">
              {isNewMode ? 'Crear Nueva Evaluación Diagnóstica' : 'Modificar Evaluación Actual'}
            </h3>
            <p className="text-xs text-emerald-100">
              Configura preguntas de opción múltiple con 4 incisos (a, b, c, d)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body con Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow bg-[#f5fbf5]">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Datos Generales */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#171d19] border-b border-slate-100 pb-2">
              1. Información General del Examen
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Título de la Evaluación</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Evaluación Diagnóstica de Álgebra"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm border-transparent focus:bg-white focus:ring-2 focus:ring-[#006948]/20 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Materia</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Matemáticas"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm border-transparent focus:bg-white focus:ring-2 focus:ring-[#006948]/20 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Preguntas de Opción Múltiple (4 incisos fijos) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#171d19]">
                  2. Preguntas de Opción Múltiple ({questions.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Cada reactivo cuenta con 4 opciones. Marca el círculo verde para definir la respuesta correcta.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="min-h-[40px] px-3.5 py-1.5 bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Pregunta</span>
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id || qIndex}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#006948] bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Pregunta #{qIndex + 1}
                  </span>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Enunciado */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Enunciado del reactivo / Problema:
                  </label>
                  <textarea
                    rows={2}
                    value={q.prompt}
                    onChange={(e) => handlePromptChange(qIndex, e.target.value)}
                    placeholder="Ej: Si 2x + 6 = 14, ¿cuál es el valor de x?"
                    className="w-full px-3.5 py-2.5 bg-[#eff5ef] rounded-xl text-xs sm:text-sm border-transparent focus:bg-white focus:ring-2 focus:ring-[#006948]/20 focus:outline-hidden"
                  />
                </div>

                {/* 4 Incisos */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Opciones de respuesta (marca el radio verde en la correcta):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctAnswer === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                            isCorrect
                              ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={isCorrect}
                              onChange={() => handleCorrectAnswerChange(qIndex, opt.key)}
                              className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="font-bold text-xs text-slate-600 uppercase">
                              {opt.key})
                            </span>
                          </label>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionChange(qIndex, opt.key, e.target.value)}
                            placeholder={`Opción ${opt.key.toUpperCase()}`}
                            className="flex-grow min-h-[38px] px-2.5 py-1 bg-white rounded-lg text-xs text-slate-900 border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Acciones */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {isNewMode
              ? 'Se reemplazará la evaluación activa en curso.'
              : 'Se actualizarán los reactivos de la evaluación actual.'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="min-h-[44px] px-6 py-2 bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isNewMode ? 'Publicar y Reemplazar' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
