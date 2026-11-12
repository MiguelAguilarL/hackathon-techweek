# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Integración completa del chatbot pedagógico (`agente.py`) con la UI de React mediante un servidor FastAPI en entorno virtual Python 3.14.
* **Fase:** Prototipado / Desarrollo UI e Integración con IA (Mobile-First & PWA).

---

## 🌳 Estructura Actual del Proyecto
```text
hackathon-techweek/
├── .venv/                      # Entorno virtual con Python 3.14
├── public/
├── references/
│   ├── dashboard_estudiante.html
│   ├── dashboard_profesor.html
│   ├── evaluacion_diagnostica.html
│   ├── login.html
│   └── resultado_evaluacion.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ConnectivityBanner.jsx
│   │   └── SocraticChatModal.jsx
│   ├── data/
│   │   └── diagnosticData.js
│   ├── db/
│   │   └── index.js
│   ├── hooks/
│   │   └── useOnlineStatus.js
│   ├── pages/
│   │   ├── DiagnosticPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── TeacherDashboard.jsx
│   ├── services/
│   │   └── chatService.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── agente.py                  # Agente Socrático LangChain + Groq (intacto)
├── server.py                  # API FastAPI puente
├── requirements.txt           # Dependencias de Python
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
├── AGENTS.md
├── HISTORIAL.md
└── README.md
```

---

## 📝 Registro de Cambios

### [Iteración 5] - 11/11/2026
* **Hecho:** 
  * Se creó [requirements.txt](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/requirements.txt) con las dependencias necesarias del backend (`fastapi`, `uvicorn`, `langchain`, `langchain-groq`, `pypdf`, `python-dotenv`, etc.).
  * Se inicializó el entorno virtual `.venv` con **Python 3.14** y se instalaron todas las dependencias.
  * Se creó el servidor [server.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/server.py) con FastAPI que expone `/api/chat` e importa `agente` y `Contexto` de [agente.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/agente.py) sin modificar este último.
  * Se creó el servicio [chatService.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/services/chatService.js) para gestionar la comunicación cliente-servidor.
  * Se implementó el componente [SocraticChatModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/SocraticChatModal.jsx) con estilo mobile-first, burbujas accesibles, quick replies, loader animado y persistencia en Dexie.js con soporte offline.
  * Se integró el modal en [StudentDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/StudentDashboard.jsx) y en [DiagnosticPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/DiagnosticPage.jsx).
  * Se compiló el frontend con `pnpm build` de manera satisfactoria.
* **Archivos modificados/creados:**
  * `requirements.txt`
  * `server.py`
  * `src/services/chatService.js`
  * `src/components/SocraticChatModal.jsx`
  * `src/pages/StudentDashboard.jsx`
  * `src/pages/DiagnosticPage.jsx`
  * `HISTORIAL.md`
* **Próximos pasos sugeridos:**
  * Probar conversaciones guiadas de ejercicios matemáticos con el modelo Groq activo.
