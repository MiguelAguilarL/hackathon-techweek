import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  WifiOff,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { sendChatMessage, checkChatHealth } from '../services/chatService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { db } from '../db';

const QUICK_REPLIES = [
  '¿Me das una pista sobre el primer paso?',
  'Creo que ya sé cómo despejar x, ¿cómo lo compruebo?',
  'Tengo dudas con los signos negativos al pasar al otro lado',
  '¿Cuál es la diferencia entre ecuación e identidad?'
];

export default function SocraticChatModal({ isOpen, onClose, initialTopic, studentProfile }) {
  const isOnline = useOnlineStatus();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerActive, setIsServerActive] = useState(true);
  const messagesEndRef = useRef(null);

  // Inicialización de la conversación
  useEffect(() => {
    if (!isOpen) return;

    // Verificar si el servidor local de python está activo
    checkChatHealth().then((active) => setIsServerActive(active));

    // Cargar historial si está vacío
    if (messages.length === 0) {
      const studentName = studentProfile?.name?.split(' ')[0] || 'estudiante';
      const greeting = initialTopic
        ? `¡Qué tal, ${studentName}! 👋 Soy tu Tutor Socrático Jarocho. Veo que quieres practicar sobre "${initialTopic}". ¿Qué es lo primero que has intentado o qué recuerdas de este tema?`
        : `¡Qué tal, ${studentName}! 👋 Soy tu Tutor Socrático Jarocho. Aquí no te daré las respuestas directas, sino que te ayudaré a razonarlas paso a paso. ¿En qué ejercicio o duda matemática te gustaría que trabajemos hoy?`;

      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, initialTopic, studentProfile]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Guardar mensaje en Dexie DB
      try {
        await db.messages.add({
          sessionId: 'socratic-default',
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Error guardando en Dexie:', e);
      }

      // Si no hay red o el servidor está inactivo
      if (!isOnline) {
        throw new Error('Estás sin conexión a internet. Tu mensaje se guardó localmente.');
      }

      // Preparamos historial simplificado para el backend
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendChatMessage({
        messages: payloadMessages,
        materia: 'matematicas',
        profile: studentProfile
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Guardar respuesta del asistente en Dexie
      try {
        await db.messages.add({
          sessionId: 'socratic-default',
          role: 'assistant',
          text: res.reply,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Error guardando asistente en Dexie:', e);
      }
    } catch (err) {
      console.error(err);
      let errorResponse =
        'No pude conectar con el tutor en este momento. Verifica que el servidor local de Python esté ejecutándose con: `uvicorn server:app --port 8000`.';
      if (!isOnline) {
        errorResponse =
          'Modo sin conexión: guardamos tu duda en este dispositivo. Cuando vuelvas a tener red o inicies el servidor, continuaremos con tu tutor.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: errorResponse,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-2xl h-[92vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header del Chat */}
        <div className="bg-[#006948] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-emerald-200 flex items-center justify-center shadow-inner font-bold">
              <Bot className="w-6 h-6 text-[#85f8c4]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base leading-tight">Tutor Socrático Jarocho</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00855d] text-[10px] font-semibold text-emerald-100 uppercase tracking-wide">
                  IA Pedagógica
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-tight flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#6cf8bb] inline-block animate-pulse"></span>
                <span>Guía reflexiva paso a paso &bull; No da respuestas directas</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar chat"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerta de conexión si está offline */}
        {!isOnline && (
          <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            <span>Modo sin conexión. Puedes redactar tus dudas y se sincronizarán al reconectar.</span>
          </div>
        )}

        {/* Área de Mensajes */}
        <div className="flex-grow p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#f5fbf5]">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#006948] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4 text-[#85f8c4]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#006948] text-white rounded-tr-xs'
                      : m.isError
                      ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-xs'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isUser ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loader mientras el tutor responde */}
          {isLoading && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-[#006948] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                <Bot className="w-4 h-4 text-[#85f8c4]" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 border border-slate-100 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#006948]" />
                <span>El Tutor Jarocho está pensando tu pista...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias Rápidas (Quick Replies) */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Pistas:
          </span>
          {QUICK_REPLIES.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(reply)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-[#eff5ef] hover:bg-[#dee4de] text-[#171d19] font-medium transition-colors cursor-pointer border border-[#bccac0]/30 min-h-[36px]"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input y Botón de Enviar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu duda o lo que has intentado..."
              disabled={isLoading}
              className="flex-grow min-h-[48px] px-4 py-2.5 bg-[#eff5ef] rounded-xl text-sm text-[#171d19] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#006948]/20 border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              aria-label="Enviar mensaje"
              className="min-h-[48px] min-w-[48px] px-4 py-2.5 bg-[#006948] hover:bg-[#00855d] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            El tutor socrático no te dará la respuesta directa; te guiará para que aprendas el método.
          </p>
        </div>

      </div>
    </div>
  );
}
