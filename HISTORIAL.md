# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Implementación de Flashcards Interactivas estilo NotebookLM con agente dedicado en Python (`agente_flashcards.py`), adaptadas al nivel del estudiante en ecuaciones lineales.
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
│   │   ├── DiagnosticEditorModal.jsx
│   │   ├── InteractiveFlashcardsModal.jsx
│   │   ├── SocraticChatModal.jsx
│   │   └── StudentModal.jsx
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
│   │   ├── chatService.js
│   │   ├── diagnosticService.js
│   │   ├── flashcardsService.js
│   │   └── studentService.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── agente.py                  # Agente Socrático LangChain + Groq (intacto)
├── agente_flashcards.py       # Agente especializado en Flashcards
├── agente_profesor.py         # Agente de cuestionarios para el estudiante (ecuaciones de primer grado)
├── server.py                  # API FastAPI puente
├── requirements.txt           # Dependencias de Python
├── ecuaciones_lineales.pdf    # Material didáctico de apoyo
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

### [Iteración 10] - 12/11/2026
* **Hecho:**
  * Integración completa de [agente_profesor.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/agente_profesor.py) con el sistema:
    * Endpoint en [server.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/server.py) (`POST /api/guided-exercises`) para invocar `generar_respuesta(tipo)`.
    * Servicio frontend [guidedExercisesService.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/services/guidedExercisesService.js) con validación estricta de conectividad (sin fallbacks offline, 100% generado por IA en vivo).
    * Modal interactivo [AIGuidedExercisesModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/AIGuidedExercisesModal.jsx) con selección de tipo de preguntas (Opción múltiple, V/F, Completar), resolución paso a paso, validación en vivo y botón permanente "Pedir Pista con IA".
    * Integración con [SocraticChatModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/SocraticChatModal.jsx) para guiar al estudiante socráticamente sin darle la respuesta directa.
    * Conexión en [StudentDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/StudentDashboard.jsx) a través del botón "Practicar con IA".
* **Archivos modificados/creados:**
  * `server.py`
  * `src/services/guidedExercisesService.js`
  * `src/components/AIGuidedExercisesModal.jsx`
  * `src/pages/StudentDashboard.jsx`
  * `HISTORIAL.md`
