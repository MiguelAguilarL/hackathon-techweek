const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchGuidedExercises(tipo = 'opcion_multiple') {
  // Verificación estricta de conectividad en el navegador
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error(
      'Esta sección requiere conexión activa a Internet para que la IA genere tus preguntas en tiempo real. Por favor verifica tu red e inténtalo de nuevo.'
    );
  }

  try {
    const res = await fetch(`${API_BASE}/api/guided-exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
          `Error ${res.status}: No se pudo generar el cuestionario con IA. Verifica que el servidor de Python esté activo.`
      );
    }

    const data = await res.json();
    if (!data.preguntas || data.preguntas.length === 0) {
      throw new Error('La IA no devolvió preguntas válidas. Intenta nuevamente.');
    }

    return data;
  } catch (err) {
    console.error('Error generando ejercicios guiados por IA:', err);
    throw err;
  }
}
