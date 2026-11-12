# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Implementación del Dashboard del Docente para el seguimiento del grupo y vista de diagnósticos de alumnos, según `references/dashboard_profesor.html`, con soporte de inicio de sesión docente independiente.
* **Fase:** Prototipado / Desarrollo UI (Mobile-First & PWA).

---

## 🌳 Estructura Actual del Proyecto
```text
hackathon-techweek/
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
│   │   └── ConnectivityBanner.jsx
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
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
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

### [Iteración 4] - 11/11/2026
* **Hecho:** 
  * Se configuraron credenciales y perfil de prueba para docente en [diagnosticData.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/data/diagnosticData.js):
    * **Prof. Javier Hernández** (`profesor.javier@jarocha.edu.mx` / `123`).
  * Se adaptó [LoginPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/LoginPage.jsx) para soportar el cambio reactivo entre el rol **Estudiante** y **Docente**, ajustando el autocompletado y redirigiendo a `/docente` al iniciar sesión como docente.
  * Se implementó [TeacherDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/TeacherDashboard.jsx) reproduciendo fielmente `references/dashboard_profesor.html`:
    * Encabezado con información de ciclo escolar y grupo ("Grupo 4to B • Matemáticas").
    * Cuadrícula de estadísticas grupales: Total de Alumnos (28), Promedio General (8.4), Evaluaciones Completadas (26/28 - 92.8%), Nivel Predominante (Intermedio).
    * Barra de herramientas interactiva con búsqueda en tiempo real por alumno o correo, filtro por nivel (Avanzado, Intermedio, Básico) y ordenamiento por calificación o nombre.
    * Tabla completa de desempeño por materias clave (Álgebra, Geometría, Ecuaciones, Trigonometría) con estados de intento e iconos de visualización individual.
    * Paginación y botones para exportar reporte y agregar alumno.
    * Navegación lateral responsiva con drawer móvil y targets mínimos de 44px.
  * Se registró la ruta `/docente` en [App.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/App.jsx).
  * Se verificó la compilación de producción con `pnpm build` sin errores.
* **Archivos modificados/creados:**
  * `src/data/diagnosticData.js`
  * `src/pages/LoginPage.jsx`
  * `src/pages/TeacherDashboard.jsx`
  * `src/App.jsx`
  * `HISTORIAL.md`
* **Próximos pasos sugeridos:**
  * Conectar el Chat Socrático IA directamente en el flujo de estudio guiado tanto para el alumno como para asistencia analítica docente.
