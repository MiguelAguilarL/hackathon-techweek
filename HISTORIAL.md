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
├── agente.py                  # Tutor: explicación + booleano intento_copiar
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

### [Iteración 11] - 12/11/2026
* **Hecho:** 
  * Se corrigió la superposición de capas (stacking context y z-index) del modal del Chatbot Socrático ([SocraticChatModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/SocraticChatModal.jsx)) elevando su capa a `z-[70]`.
  * Se reordenó la jerarquía de renderizado en [StudentDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/StudentDashboard.jsx) para posicionar el modal del tutor posterior a [AIGuidedExercisesModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/AIGuidedExercisesModal.jsx).
  * Ahora, al pulsar **"Pedir Pista con IA"** dentro de los ejercicios guiados, el chatbot se despliega directamente por encima del modal de preguntas, permitiendo al estudiante consultar pistas y orientación pedagógica y al cerrarlo volver directamente al ejercicio activo sin recargas ni pérdida de progreso.
* **Archivos modificados:**
  * `src/components/SocraticChatModal.jsx`
  * `src/pages/StudentDashboard.jsx`
  * `HISTORIAL.md`

### [Iteración 12] - 12/11/2026
* **Hecho:**
  * Se anotaron en la bitácora de IA del `README.md` los ajustes del tutor que no estaban registrados: el cambio de modelo a Groq, la restauración de `.gitignore` y el system prompt de `agente.py` que exige justificación de cada paso.
* **Archivos modificados:**
  * `README.md`
  * `HISTORIAL.md`

### [Iteración 14] - 12/11/2026
* **Hecho:**
  * `responder` en `agente.py` regresa la explicación y el booleano `intento_copiar`.
  * Se eliminó `consultar_material` y el código comentado de PDFs en Vercel Blob.
* **Archivos modificados:**
  * `agente.py`
  * `README.md`
  * `HISTORIAL.md`
