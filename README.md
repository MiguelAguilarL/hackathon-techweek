# RETO: APRENDER A LA JAROCHA (JAROCHA AI)

### EL PROBLEMA

Muchas y muchos estudiantes de secundaria y bachillerato en Veracruz estudian con conexión limitada, desde el celular y sin alguien que les resuelva dudas fuera del aula. La IA puede ser un buen tutor, si se usa bien.

### LO QUE BUSCAMOS

Un tutor y herramienta educativa que ayude a aprender de verdad, no a copiar: que pregunte antes de responder (método socrático), se adapte al nivel del estudiante, funcione en dispositivos móviles de bajos recursos y sin conexión (PWA + Offline First), detecte intentos de trampa alertando al docente y le brinde al profesor un panel analítico en tiempo real del avance del grupo.

### PARA QUIÉN

Estudiantes de secundaria y bachillerato de Veracruz, y sus docentes titulares.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (PWA & Offline First)
- **Vite:** Empaquetador ultrarrápido y liviano con soporte nativo de ES Modules.
- **React (v19):** Biblioteca declarativa basada en componentes y hooks reutilizables.
- **Tailwind CSS (v4):** Estilos utilitarios para interfaces mobile-first fluidas y de bajo peso.
- **Vite PWA (`vite-plugin-pwa` / Workbox):** Service Workers para caché de la aplicación y funcionamiento 100% desconectado.
- **Dexie.js (IndexedDB):** Base de datos transaccional local reactiva para usuarios, evaluaciones, advertencias y mensajes.
- **React Router (`react-router-dom` v7):** Navegación fluida del lado del cliente sin recargas de página.
- **Lucide React:** Iconografía optimizada con tree-shaking mediante imports nombrados.

### Backend e Inteligencia Artificial
- **Python (v3.11+):** Lenguaje base del servidor y lógica de agentes.
- **FastAPI:** Framework web asíncrono de alto rendimiento para APIs REST.
- **Uvicorn:** Servidor ASGI para ejecución en local y producción.
- **LangChain & LangChain-Groq:** Orquestación de agentes socráticos y cuestionarios adaptativos.
- **Groq Cloud (`qwen/qwen3.8-27b`):** Inferencia de modelos de lenguaje a ultra baja latencia con salida estructurada en JSON.
- **Pydantic (v2):** Validación de datos y esquemas tipados.

---

## ⚙️ Instalación y Configuración Local

### Requisitos Previos
- **Node.js:** v18 o superior.
- **pnpm:** Gestor de paquetes (`npm install -g pnpm`).
- **Python:** v3.10 o superior.
- **Clave de Groq API:** Puedes obtener una gratuita en [console.groq.com/keys](https://console.groq.com/keys).

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/hackathon-techweek.git
cd hackathon-techweek
```

### 2. Configurar el Backend (Python + FastAPI)
```bash
# Crear y activar entorno virtual
python -m venv .venv

# En Windows:
.\.venv\Scripts\activate
# En Linux/Mac:
# source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crea un archivo .env en la raíz con tu clave de Groq:
echo GROQ_API_KEY=tu_clave_de_groq_aqui > .env
```

### 3. Configurar el Frontend (React + Vite)
```bash
# Instalar dependencias con pnpm
pnpm install
```

### 4. Ejecución en Desarrollo

Abre dos terminales:

**Terminal 1 - Backend FastAPI:**
```bash
# Con el entorno virtual activado (.venv)
uvicorn server:app --port 8000 --reload
```
*API disponible en: `http://localhost:8000` (Swagger UI interactivo en `/docs`)*

**Terminal 2 - Frontend Vite:**
```bash
pnpm dev
```
*Aplicación web disponible en: `http://localhost:5173`*

---

## 📖 Cómo se Utiliza la Aplicación

### 1. Acceso a la Plataforma (Login)
- Ingresa a `http://localhost:5173/login`.
- Puedes alternar entre **Estudiante** y **Docente**.
- **Credenciales por defecto para evaluación:**
  - 🎓 **Estudiante:** `maria.rodriguez@jarocha.edu.mx` / `123`
  - 👨‍🏫 **Docente:** `profesor.javier@jarocha.edu.mx` / `123`

---

### 2. Flujo del Estudiante

1. **Evaluación Diagnóstica Adaptativa (`/evaluacion`):**
   - Si el alumno ingresa por primera vez, realiza una breve prueba de diagnóstico sobre álgebra y ecuaciones lineales.
   - Al finalizar, el sistema determina automáticamente su nivel de partida (**Básico**, **Intermedio** o **Avanzado**) guardando los resultados en `IndexedDB`.
2. **Dashboard del Estudiante (`/dashboard`):**
   - **Tema Actual (Ecuaciones Lineales):** Resumen pedagógico del módulo en curso.
   - **Actividades Disponibles:**
     - 📝 **Test Diagnóstico:** Repaso de 5 minutos sobre ecuaciones lineales.
     - 🗂️ **Flashcards Interactivas (Estilo NotebookLM):** Tarjetas con repaso activo espaciado que se pueden voltear y deslizar con atajos de teclado.
     - 🤖 **Ejercicios Guiados con IA:** Generador en vivo de preguntas (Opción múltiple, Verdadero/Falso, Completar) con validación inmediata y botón permanente de pista.
3. **Chatbot Socrático Jarocha AI:**
   - Botón flotante siempre visible: ayuda al estudiante sin darle la respuesta directa, guiándolo mediante preguntas, analogías y comprobación de pasos.
   - **Integridad Académica:** Si el estudiante intenta copiar o pedir respuestas directas, el tutor le advierte amablemente y registra un aviso de integridad en su expediente escolar.
4. **Modo Sin Conexión (Offline):**
   - Si se desconecta el internet, la aplicación sigue navegando gracias a la PWA y los datos se guardan en el dispositivo hasta que vuelva la conexión.

---

### 3. Flujo del Docente (`/docente`)

1. **Gestión de Grupos y Alumnos:**
   - Visualización exclusiva de los alumnos reales registrados y su progreso analítico (promedio, nivel y evaluaciones completadas).
   - Acciones directas: **Registrar Alumno**, **Editar datos/contraseña** y **Eliminar**.
2. **Supervisión de Integridad y Alertas de IA:**
   - **Banner Global:** Informa cuántos intentos indebidos de copia han ocurrido en el grupo.
   - **Columna Integridad IA:** Identifica rápidamente a los alumnos con alertas (`⚠️ 1 aviso`).
   - **Expediente de Detalle:** El docente puede ver la fecha, la hora y el mensaje exacto que el alumno le envió al chatbot, con un botón para marcar la advertencia como **"Revisada con el Alumno"**.
3. **Gestor de Evaluación Diagnóstica:**
   - Permite al docente personalizar, editar reactivos o crear nuevos exámenes diagnósticos para su clase.

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

* **Hecho:**
  * Se adaptó [agente_profesor.py](agente_profesor.py) para que genere cuestionarios dirigidos al **estudiante**: recibe solo el tipo elegido y produce **exactamente 5 preguntas** sobre **ecuaciones de primer grado** (único tema permitido).
  * Tipos: `opcion_multiple` (4 opciones / 1 correcta), `verdadero_falso` ("Verdadero" / "Falso") y `completar_respuesta` (espacio en blanco + 4 opciones).
  * Se conservó la estructura JSON existente del proyecto y la respuesta regresa como **dict nativo de Python** (`json.loads`).
  * Se eliminó la memoria (checkpointer) y se quitó `response_format`, que fallaba con `tool_use_failed` en `qwen/qwen3.8-27b`.
  * Verificación: 8/8 corridas válidas con 5 preguntas y el tema correcto.
* **Archivos modificados/creados:**
  * `agente_profesor.py`
  * `HISTORIAL.md`
  * `README.md`
* **Próximos pasos sugeridos:**
  * Exponer el agente en `server.py` y consumirlo desde el frontend para abrir el cuestionario desde el dashboard del estudiante.

### [Iteración 9] - 12/11/2026
* **Hecho:** 
  * Se eliminaron las columnas de **Calificación** y **Contraseña** de la tabla de alumnos en [TeacherDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/TeacherDashboard.jsx) atendiendo al principio de privacidad y relevancia de datos.
  * La contraseña permanece segura y sólo es editable/creable dentro de su modal administrativo, nunca expuesta en la tabla.
* **Archivos modificados:**
  * `src/pages/TeacherDashboard.jsx`
  * `HISTORIAL.md`

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


### [Iteración 11] - 12/11/2026
* **Hecho:** 
  * Se corrigió la superposición de capas (stacking context y z-index) del modal del Chatbot Socrático ([SocraticChatModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/SocraticChatModal.jsx)) elevando su capa a `z-[70]`.
  * Se reordenó la jerarquía de renderizado en [StudentDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/StudentDashboard.jsx) para posicionar el modal del tutor posterior a [AIGuidedExercisesModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/AIGuidedExercisesModal.jsx).
  * Ahora, al pulsar **"Pedir Pista con IA"** dentro de los ejercicios guiados, el chatbot se despliega directamente por encima del modal de preguntas, permitiendo al estudiante consultar pistas y orientación pedagógica y al cerrarlo volver directamente al ejercicio activo sin recargas ni pérdida de progreso.
* **Archivos modificados:**
  * `src/components/SocraticChatModal.jsx`
  * `src/pages/StudentDashboard.jsx`
  * `HISTORIAL.md`

### [Iteración 12] - 11/11/2026
* **Hecho:**
  * Se ajustó el system prompt de `agente.py` para que el tutor use el perfil que ya trae el contexto (nombre, grado, materia, ciudad y nivel) y no lo vuelva a preguntar.
  * Las explicaciones de un concepto usan otros números y otra situación, sin reutilizar los ejercicios del material ni los de la evaluación diagnóstica.
  * La metacognición deja de anunciar el veredicto antes de que el alumno compruebe: ante un intento responde en neutro y, si el paso está mal, señala ese paso y pregunta para corregirlo.
  * Cuando el alumno ya comprobó, relaciona una sola vez su seguridad con el acierto (seguro y correcto, seguro e incorrecto, inseguro y correcto, inseguro e incorrecto).
  * El modelo pasó de Gemini a Groq, `qwen/qwen3.8-27b`, con temperatura 0.1.
  * Se restauró `.gitignore` para excluir `node_modules`, `__pycache__` y `.env`.
* **Archivos modificados:**
  * `agente.py`
  * `.gitignore`
* **Próximos pasos sugeridos:**
  * Exigir que el alumno justifique cada paso antes de avanzar.

### [Iteración 13] - 11/11/2026
* **Hecho:**
  * Se reescribió el system prompt de `agente.py` para que el objetivo sea entender el procedimiento y justificar cada paso.
  * Cada indicación incluye qué hacer, cómo hacerlo (con otros números) y por qué funciona.
  * El tutor dice de inmediato si el paso es correcto o incorrecto. Si está mal, nombra el error y la regla, y no da el resultado.
  * Si el error se repite, sube la escalera de ayuda; el ejemplo resuelto sigue siendo de un problema parecido, nunca el del alumno.
  * Después de cada paso pide la justificación y no avanza sin ella. No pregunta "¿qué tan seguro estás?". Si la razón es vaga o repite la pista, pide que la complete con sus palabras.
  * Al cerrar el ejercicio, el alumno comprueba su resultado y explica cómo lo comprobó.
* **Archivos modificados:**
  * `agente.py`
* **Próximos pasos sugeridos:**
  * Registrar pistas, tipo de error y acierto para distinguir práctica con ayuda de un tema dominado.

### [Iteración 14] - 12/11/2026
* **Hecho:**
  * `agente.py` devuelve dos valores: `explicacion` (el mensaje para el alumno) e `intento_copiar` (true solo si pidió el resultado, pidió que se lo resuelvan o pegó el ejercicio para que el tutor lo hiciera).
  * El mensaje final del tutor es un JSON con esos dos campos. `responder` los separa en una cadena y un booleano.
  * Se quitó la herramienta `consultar_material` y el código comentado que leía PDFs subidos a Vercel Blob.
* **Archivos modificados:**
  * `agente.py`
  * `README.md`
  * `HISTORIAL.md`

### [Iteración 15] - 12/11/2026
* **Hecho:**
  * **Sistema de Integridad Académica y Alertas de Copia al Docente:**
    * Integración del valor booleano `intento_copiar` de `agente.py` en [server.py](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/server.py) (`POST /api/chat`), con emisión del objeto estructurado `warning`.
    * Creación de la tabla `academicWarnings` en el esquema `db.version(4)` de `Dexie.js` ([src/db/index.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/db/index.js)) y funciones de gestión en [src/services/studentService.js](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/services/studentService.js).
    * Notificación en tiempo real y aviso de integridad en el chat del estudiante ([src/components/SocraticChatModal.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/components/SocraticChatModal.jsx)).
    * Supervisión en el panel docente ([src/pages/TeacherDashboard.jsx](file:///C:/Users/Dell%20Latitude%207420/Desktop/hackathon-techweek/src/pages/TeacherDashboard.jsx)): banner global de avisos, columna *"Integridad IA"* en la tabla de alumnos (`⚠️ 1 aviso`), expediente de detalle con el mensaje exacto enviado por el alumno y botón *"Marcar como Revisada"*.
  * **Actualización de Identidad Visual a Jarocha AI:**
    * Renombrado transversal del proyecto a **Jarocha AI** en Login, Dashboard del Estudiante, Panel Docente, Evaluación Diagnóstica, Resultado, `index.html` y manifiesto PWA en `vite.config.js`.
  * **Preparación para Producción en la Nube:**
    * Creación de `vercel.json` con reescritura de rutas SPA para despliegue sin errores 404.
    * Creación de `render.yaml` y parametrización de `VITE_API_URL` en servicios frontend.
* **Archivos modificados/creados:**
  * `server.py`
  * `src/db/index.js`
  * `src/services/studentService.js`
  * `src/components/SocraticChatModal.jsx`
  * `src/pages/TeacherDashboard.jsx`
  * `src/pages/StudentDashboard.jsx`
  * `src/pages/LoginPage.jsx`
  * `src/pages/DiagnosticPage.jsx`
  * `src/pages/ResultPage.jsx`
  * `index.html`
  * `vite.config.js`
  * `vercel.json`
  * `render.yaml`
  * `README.md`
