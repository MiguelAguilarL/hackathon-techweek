# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Flujo completo de Autenticación, Bienvenida, Evaluación Diagnóstica (6 preguntas de matemáticas) y Resultados.
* **Fase:** Prototipado / Desarrollo UI (Mobile-First & PWA).

---

## 🌳 Estructura Actual del Proyecto
```text
hackathon-techweek/
├── public/
├── references/
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
│   │   └── ResultPage.jsx
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                     ← NUEVO (no se sube al repo)
├── agente.js                ← NUEVO (traducción a JavaScript de agente.py)
├── agente.py
├── ecuaciones_lineales.pdf
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

### [Iteración 2] - 11/11/2026
* **Hecho:** 
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
* **Archivos modificados/creados:**
  * `src/data/diagnosticData.js`
  * `src/db/index.js`
  * `src/pages/LoginPage.jsx`
  * `src/pages/DiagnosticPage.jsx`
  * `src/pages/ResultPage.jsx`
  * `src/App.jsx`
  * `HISTORIAL.md`
* **Próximos pasos sugeridos:**
  * Desarrollar el tutor socrático (chat guiado) que tome como base el diagnóstico obtenido.
  * Implementar el panel o vista docente para consultar el avance del grupo.

### [Iteración 3] - 11/11/2026
* **Hecho:**
  * Se completó el agente tutor en Python (`agente.py`) con LangChain y Gemini 3.8 Flash.
  * El agente incluye el system prompt socrático (pistas graduales, metacognición con "¿qué tan seguro estás?", contexto de Veracruz y detección de dudas) y la tool `consultar_material`, que lee el texto de `ecuaciones_lineales.pdf` desde el repo con `pypdf`; la carga de PDFs desde Vercel quedó comentada.
  * Se creó `.env` para la API key de Gemini (`GOOGLE_API_KEY`), que el agente carga con `python-dotenv`, y se agregó `.env` a `.gitignore` para no subirla al repo.
* **Archivos modificados/creados:**
  * `agente.py`
  * `.env` (no versionado)
  * `.gitignore`
  * `HISTORIAL.md`