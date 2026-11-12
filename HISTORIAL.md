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

### [Iteración 8] - 12/11/2026
* **Hecho:** 
  * Se implementó [studentService.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/services/studentService.js) y se actualizó [db/index.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/db/index.js) (esquema v3) para gestionar alumnos reales con persistencia dual en `Dexie.js` y `localStorage`.
  * Se creó [StudentModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/StudentModal.jsx) para registrar y modificar alumnos con: **Nombre**, **Correo** y **Contraseña** asignada por el docente.
  * Se refactorizó [TeacherDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/TeacherDashboard.jsx) eliminando la lista simulada de 28 alumnos:
    * Ahora muestra únicamente a los alumnos reales registrados (iniciando con **María Rodríguez** y los que cree el profesor).
    * Cálculo en tiempo real de métricas: total de alumnos, promedio general, evaluaciones completadas y nivel predominante.
    * Acciones directas por fila: **Editar** (nombre, correo, contraseña), **Eliminar** (con confirmación) y **Ver detalle** (panel con respuestas, puntaje y fecha del diagnóstico).
  * Se actualizó [LoginPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/LoginPage.jsx) para validar dinámicamente las credenciales creadas por el docente mediante `validateStudentCredentials`.
  * Se verificó la compilación de producción con `pnpm build` sin ningún error.
* **Archivos modificados/creados:**
  * `src/db/index.js`
  * `src/services/studentService.js`
  * `src/components/StudentModal.jsx`
  * `src/pages/TeacherDashboard.jsx`
  * `src/pages/LoginPage.jsx`
  * `HISTORIAL.md`

