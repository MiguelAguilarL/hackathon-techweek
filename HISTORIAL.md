# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Creación y modificación de la Evaluación Diagnóstica por el docente desde su Dashboard (preguntas de opción múltiple con 4 incisos) y sincronización con el estudiante.
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
│   │   └── diagnosticService.js
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

### [Iteración 6] - 11/11/2026
* **Hecho:** 
  * Se implementó el servicio [diagnosticService.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/services/diagnosticService.js) y se actualizó el esquema en [db/index.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/db/index.js) (tabla `activeDiagnostics`) con persistencia dual en `Dexie.js` y `localStorage`.
  * Se creó el componente [DiagnosticEditorModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/DiagnosticEditorModal.jsx) para editar o crear exámenes con preguntas de **opción múltiple de 4 incisos** (`a`, `b`, `c`, `d`), asignación de respuesta correcta y validaciones.
  * Se actualizó [TeacherDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/TeacherDashboard.jsx) para que al pulsar **"Evaluación Diagnóstica"** en el sidebar se despliegue la vista de gestión con:
    * Vista previa completa de los reactivos vigentes con incisos y respuesta correcta destacada en verde.
    * Botón **"Modificar Evaluación"** para editar los reactivos existentes.
    * Botón **"Crear Nueva Evaluación"** para redactar un examen nuevo y reemplazar el que está en curso.
  * Se actualizó [DiagnosticPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/DiagnosticPage.jsx) para cargar reactivamente la evaluación activa configurada por el docente, recalculando dinámicamente aciertos y progreso.
  * Se verificó la compilación de producción con `pnpm build` de manera exitosa.
* **Archivos modificados/creados:**
  * `src/db/index.js`
  * `src/services/diagnosticService.js`
  * `src/components/DiagnosticEditorModal.jsx`
  * `src/pages/TeacherDashboard.jsx`
  * `src/pages/DiagnosticPage.jsx`
  * `HISTORIAL.md`
