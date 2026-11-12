const API_BASE = 'http://localhost:8000';

export async function sendChatMessage({ messages, materia = 'matematicas', profile = null }) {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        materia,
        profile
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error enviando mensaje al tutor:', err);
    throw err;
  }
}

export async function checkChatHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
