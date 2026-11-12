# RETO: APRENDER A LA JAROCHA

### EL PROBLEMA

Muchas y muchos estudiantes de secundaria y bachillerato en Veracruz estudian con conexión limitada, desde el celular y sin alguien que les resuelva dudas fuera del aula. La IA puede ser un buen tutor, si se usa bien.

### LO QUE BUSCAMOS

Un tutor o herramienta educativa que ayude a aprender de verdad, no a copiar: que pregunte antes de responder, se adapte al nivel, funcione bien en celular y con poca conexión, y le dé al docente una vista útil del avance del grupo.

### PARA QUIEN

Estudiantes de secundaria y bachillerato, y sus docentes.


---

# BITACORA DE IA:

### [Iteración 0] - Inicio del Proyecto

* **Hecho:** 
  * Definición de reglas operativas en `AGENTS.md`.
  * Creación de la bitácora de contexto `HISTORIAL.md`.
* **Próximos pasos:** 
  * Inicializar el proyecto con Next.js, React y Tailwind CSS (`create-next-app`).
  * Implementar el layout principal y el sistema inicial de páginas/rutas.

### [Iteración 1] - 11/11/2026

* **Hecho:** 

* Se inicializó el proyecto con Vite, React y Tailwind CSS v4, gestionado con **pnpm**.
  * Se integró `vite-plugin-pwa` para el soporte offline y Service Worker.
  * Se añadieron `react-router-dom`, `lucide-react` y `dexie` para persistencia e IndexedDB local.
  * Se implementó el Hook personalizado `useOnlineStatus` y el componente `ConnectivityBanner` con detección de modo en línea / sin conexión.
  * Se implementó la pantalla de Login completa en [LoginPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/LoginPage.jsx), reproduciendo con fidelidad el diseño de [references/login.html](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/references/login.html), aplicando las directrices de `AGENTS.md` (mobile-first, targets mínimos de 44px, alternancia de visibilidad de contraseña, selector de rol Estudiante/Docente).
  * Se verificó la compilación de producción con `pnpm build` de manera exitosa.
* **Archivos modificados/creados:**
  * `vite.config.js`
  * `src/index.css`
  * `src/App.jsx`
  * `src/pages/LoginPage.jsx`
  * `src/components/ConnectivityBanner.jsx`
  * `src/hooks/useOnlineStatus.js`
  * `src/db/index.js`
  * `HISTORIAL.md`
* **Próximos pasos sugeridos:**
  * Implementar el flujo de autenticación/sesión local con Dexie.
  * Diseñar la pantalla principal de selección de temas o chat socrático para el estudiante.

### [Iteración 2] - 11/11/2026

  * Se configuraron credenciales y datos del usuario de prueba (`maria.rodriguez@jarocha.edu.mx` / `123`) con botón de autocompletado en el login.
  * Se diseñó el modal de bienvenida amigable para cuando el estudiante ingresa por primera vez.
  * Se creó [DiagnosticPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/DiagnosticPage.jsx) basándose en `references/evaluacion_diagnostica.html`:
    * 6 preguntas sobre matemáticas básicas (ecuaciones lineales y despejes: 5 de opción múltiple y 1 pregunta explicativa abierta).
    * Barra de progreso interactiva reactiva en tiempo real.
    * Persistencia de los resultados tanto en `localStorage` como en `Dexie.js` (IndexedDB) para funcionamiento offline.
  * Se creó [ResultPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/ResultPage.jsx) basándose en `references/resultado_evaluacion.html`:
    * Cálculo dinámico de aciertos y nivel de partida (Básico, Intermedio, Avanzado).
    * Retroalimentación y aspectos a mejorar estructurados.
    * Opciones para repetir la evaluación o continuar.
  * Se actualizaron las rutas en [App.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/App.jsx) (`/login`, `/evaluacion`, `/resultado`).
  * Se comprobó la compilación exitosa con `pnpm build`.


### [Iteración 3] - 11/11/2026
* **Hecho:** 
  * Se implementó [StudentDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/StudentDashboard.jsx) reproduciendo la estructura visual, jerarquía y componentes de `references/dashboard_estudiante.html`:
    * Encabezado superior con estado online y nombre del estudiante logueado.
    * Menú lateral de navegación responsivo (con drawer para pantallas móviles y targets táctiles de mínimo 44px).
    * Banner de bienvenida personalizado con avatar, grado/grupo, materia actual y nivel de aprendizaje adaptado al resultado del diagnóstico.
    * Medidor de progreso general del curso (68%, Unidad 3 de 4, 12/18 módulos).
    * Módulo activo con botón "Continuar Módulo" y tiempo estimado.
    * Tarjeta de estadísticas de racha (5 días consecutivos, puntos jarocha ganados).
    * Parrilla de actividades disponibles (Test diagnóstico, flashcards interactivas, práctica guiada con IA y reto semanal).
    * Historial reciente de actividades y panel de accesos rápidos (formulario, calculadora, foro, recursos PDF descargables para offline).
    * Botón flotante para asistencia del tutor socrático.
  * Se conectó el botón **"Continuar al Dashboard"** de [ResultPage.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/ResultPage.jsx) para redirigir a `/dashboard`.
  * Se registró la ruta `/dashboard` en [App.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/App.jsx).
  * Se verificó la compilación de producción con `pnpm build` sin ningún error.
* **Archivos modificados/creados:**
  * `src/pages/StudentDashboard.jsx`
  * `src/pages/ResultPage.jsx`
  * `src/App.jsx`
  * `HISTORIAL.md`
* **Próximos pasos sugeridos:**
  * Implementar el chat socrático interactivo que guíe al estudiante paso a paso según el nivel detectado en la evaluación diagnóstica.
  * Implementar la vista del docente para monitorear el progreso del grupo de alumnos.
