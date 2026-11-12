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
│   │   ├── chatService.js
│   │   ├── diagnosticService.js
│   │   └── flashcardsService.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── agente.py                  # Agente Socrático LangChain + Groq (intacto)
├── agente_flashcards.py       # Agente especializado en Flashcards
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

### [Iteración 7] - 11/11/2026
* **Hecho:** 
  * Se creó [agente_flashcards.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/agente_flashcards.py) como agente autónomo en Python que genera flashcards adaptadas pedagógicamente por nivel (**básico**, **intermedio**, **avanzado**) sobre ecuaciones lineales a partir del PDF de la materia.
  * Se actualizó [server.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/server.py) exponiendo el endpoint `POST /api/flashcards`.
  * Se implementó el servicio [flashcardsService.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/services/flashcardsService.js) con caché local para disponibilidad offline.
  * Se diseñó el componente [InteractiveFlashcardsModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/InteractiveFlashcardsModal.jsx) con estética NotebookLM: efecto 3D flip al tocar o presionar espacio, selector de nivel, pistas desplegables, contador de progreso, marcado de dominio y atajos de teclado.
  * Se conectó la tarjeta **"Flashcards Interactivas"** de [StudentDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/StudentDashboard.jsx) para abrir el modal precargando el nivel del diagnóstico del alumno.
  * Se verificó la compilación de producción con `pnpm build` sin errores.
* **Archivos modificados/creados:**
  * `agente_flashcards.py`
  * `server.py`
  * `src/services/flashcardsService.js`
  * `src/components/InteractiveFlashcardsModal.jsx`
  * `src/pages/StudentDashboard.jsx`
  * `HISTORIAL.md`
