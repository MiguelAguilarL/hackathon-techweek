import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  GraduationCap
} from 'lucide-react';
import { fetchFlashcards } from '../services/flashcardsService';

export default function InteractiveFlashcardsModal({ isOpen, onClose, initialLevel = 'intermedio' }) {
  if (!isOpen) return null;

  // Normalizar nivel inicial
  const getInitialKey = (lvl) => {
    const s = String(lvl || '').toLowerCase();
    if (s.includes('bás') || s.includes('bas')) return 'basico';
    if (s.includes('avan')) return 'avanzado';
    return 'intermedio';
  };

  const [selectedLevel, setSelectedLevel] = useState(getInitialKey(initialLevel));
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tarjetas al cambiar de nivel
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(0);

    fetchFlashcards(selectedLevel, 'ecuaciones lineales').then((data) => {
      if (isMounted) {
        setCards(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedLevel]);

  // Manejo de atajos de teclado (flechas y barra espaciadora)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(0);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const toggleMastered = (cardId) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const currentCard = cards[currentIndex] || {
    category: 'Cargando...',
    front: 'Preparando tarjeta didáctica...',
    back: '...',
    hint: ''
  };

  const isCurrentMastered = masteredIds.has(currentCard.id);
  const progressPct = cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f5fbf5] w-full max-w-3xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header estilo NotebookLM */}
        <div className="bg-white border-b border-[#bccac0]/30 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5 text-[#85f8c4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#171d19]">
                  Flashcards: Ecuaciones Lineales
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006948] text-[10px] font-bold uppercase tracking-wide">
                  NotebookLM Style
                </span>
              </div>
              <p className="text-xs text-[#3d4a42]">
                Repaso activo espaciado &bull; Haz clic o pulsa <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono border">Espacio</kbd> para voltear
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Nivel Adaptativo */}
        <div className="bg-white px-5 sm:px-6 py-2.5 border-b border-[#bccac0]/20 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#eff5ef] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedLevel('basico')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedLevel === 'basico'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nivel Básico
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('intermedio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedLevel === 'intermedio'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nivel Intermedio
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('avanzado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                selectedLevel === 'avanzado'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nivel Avanzado
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              title="Barajar tarjetas"
              className="p-2 text-[#006948] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold min-h-[36px]"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Barajar</span>
            </button>
            <span className="text-xs font-bold text-[#006948] bg-emerald-50 px-2.5 py-1 rounded-lg">
              {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0/0'}
            </span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="w-full bg-[#eff5ef] h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#006948] transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Área Central: Tarjeta 3D Flip */}
        <div className="p-4 sm:p-6 flex-grow flex flex-col justify-center items-center overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-3 border-[#006948] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#3d4a42] font-medium">Cargando flashcards adaptadas...</p>
            </div>
          ) : (
            <div className="w-full max-w-xl [perspective:1000px] my-auto">
              {/* Tarjeta con animación flip */}
              <div
                onClick={() => setIsFlipped((prev) => !prev)}
                className={`relative w-full min-h-[290px] sm:min-h-[320px] rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer shadow-md select-none ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* LADO FRENTE (Pregunta / Reto) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#006948] text-xs font-bold uppercase tracking-wider">
                        {currentCard.category || 'Concepto'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" />
                        Toca para voltear
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-[#171d19] leading-snug mt-2">
                      {currentCard.front}
                    </h4>
                  </div>

                  {/* Pista opcional */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Pregunta #{currentIndex + 1}</span>

                    {currentCard.hint && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint((prev) => !prev);
                        }}
                        className="text-xs text-[#006948] hover:text-[#00855d] font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>{showHint ? 'Ocultar pista' : 'Ver pista'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* LADO REVERSO (Respuesta / Explicación Pedagógica) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#006948] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#00855d] text-[#85f8c4] text-xs font-bold uppercase tracking-wider">
                        Respuesta y Explicación
                      </span>
                      <span className="text-[11px] text-emerald-200 font-medium flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" />
                        Toca para ver pregunta
                      </span>
                    </div>

                    <p className="text-base sm:text-lg font-medium text-white leading-relaxed mt-2">
                      {currentCard.back}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-emerald-600/50 flex items-center justify-between">
                    <span className="text-xs text-emerald-200">
                      Nivel: {selectedLevel.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-[#6cf8bb]">
                      ¡Excelente reflexión! 👍
                    </span>
                  </div>
                </div>
              </div>

              {/* Caja de Pista Desplegable */}
              {showHint && currentCard.hint && (
                <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-800">Pista orientadora:</strong>
                    <span>{currentCard.hint}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer y Barra de Navegación estilo NotebookLM */}
        <div className="bg-white border-t border-[#bccac0]/30 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Botón de Autoevaluación de Dominio */}
          <button
            type="button"
            disabled={isLoading || cards.length === 0}
            onClick={() => toggleMastered(currentCard.id)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center ${
              isCurrentMastered
                ? 'bg-emerald-100 text-[#006948] border border-emerald-300'
                : 'bg-[#eff5ef] text-slate-700 hover:bg-[#dee4de]'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isCurrentMastered ? 'text-[#006948]' : 'text-slate-400'}`} />
            <span>{isCurrentMastered ? 'Tarjeta Dominada ✓' : 'Marcar como Dominada'}</span>
          </button>

          {/* Controles de Navegación */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              type="button"
              disabled={isLoading || cards.length <= 1}
              onClick={handlePrev}
              aria-label="Tarjeta anterior"
              className="min-h-[44px] min-w-[44px] px-4 py-2 bg-[#eff5ef] hover:bg-[#dee4de] disabled:opacity-40 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setIsFlipped((prev) => !prev)}
              className="min-h-[44px] px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#006948] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Voltear</span>
            </button>

            <button
              type="button"
              disabled={isLoading || cards.length <= 1}
              onClick={handleNext}
              aria-label="Siguiente tarjeta"
              className="min-h-[44px] min-w-[44px] px-5 py-2 bg-[#006948] hover:bg-[#00855d] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
