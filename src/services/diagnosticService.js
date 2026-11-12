import { db } from '../db';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticData';

const LOCAL_STORAGE_KEY = 'activeDiagnosticExam';

// Aseguramos que solo usamos preguntas de opción múltiple con 4 incisos
const DEFAULT_INITIAL_EXAM = {
  id: 'diagnostic-default',
  title: 'Evaluación Diagnóstica: Matemáticas y Álgebra Básica',
  subject: 'Matemáticas Aplicadas',
  grade: '3° "B" Secundaria',
  updatedAt: new Date().toISOString(),
  questions: DIAGNOSTIC_QUESTIONS.filter((q) => q.type === 'choice').map((q, idx) => ({
    id: idx + 1,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer
  }))
};

export async function getActiveDiagnostic() {
  try {
    // 1. Intentar leer desde Dexie IndexedDB
    const fromDb = await db.activeDiagnostics?.where({ isActive: 1 }).first();
    if (fromDb && fromDb.questions && fromDb.questions.length > 0) {
      return fromDb;
    }
  } catch (err) {
    console.warn('Error leyendo de Dexie:', err);
  }

  // 2. Intentar leer de localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.questions && parsed.questions.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error leyendo localStorage:', err);
  }

  // 3. Fallback inicial por defecto
  return DEFAULT_INITIAL_EXAM;
}

export async function saveDiagnosticExam(examData) {
  const updatedExam = {
    ...examData,
    updatedAt: new Date().toISOString(),
    isActive: 1
  };

  // Guardar en localStorage para disponibilidad síncrona inmediata
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedExam));
  } catch (err) {
    console.warn('Error guardando en localStorage:', err);
  }

  // Guardar en Dexie IndexedDB
  try {
    if (db.activeDiagnostics) {
      await db.transaction('rw', db.activeDiagnostics, async () => {
        // Desactivamos cualquier otro examen anterior
        await db.activeDiagnostics.where({ isActive: 1 }).modify({ isActive: 0 });
        // Guardamos el nuevo o actualizado
        await db.activeDiagnostics.put(updatedExam);
      });
    }
  } catch (err) {
    console.warn('Error guardando en Dexie:', err);
  }

  return updatedExam;
}
