# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Agente de cuestionarios para el ESTUDIANTE (`agente_profesor.py`) que genera 5 preguntas sobre **ecuaciones de primer grado** según el tipo elegido (opción múltiple, verdadero/falso o completar respuesta).
* **Fase:** Prototipado / Desarrollo UI e Integración con IA (Mobile-First & PWA) — Demo.

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
  * Se adaptó [agente_profesor.py](agente_profesor.py) para que ahora esté dirigido al **ESTUDIANTE**: recibe únicamente el tipo de cuestionario y genera **exactamente 5 preguntas**.
  * Tema exclusivo fijado en el prompt: **ECUACIONES DE PRIMER GRADO** (se ignora cualquier otro tema solicitado).
  * Tipos soportados: `opcion_multiple` (4 opciones, 1 correcta), `verdadero_falso` (opciones "Verdadero"/"Falso") y `completar_respuesta` (espacio en blanco `____` + 4 opciones).
  * Se conservó la estructura JSON existente (`estado`, `tipo`, `titulo`, `tema`, `nivel_educativo`, `mensaje`, `preguntas[]` con `enunciado`, `opciones`, `respuesta_correcta`, `explicacion`, `dificultad`).
  * `generar_respuesta(tipo)` ahora devuelve un **dict nativo de Python** mediante `json.loads()` + validación con `ContenidoEducativo`.
  * Se quitó el `checkpointer` (memoria) y las herramientas: cada cuestionario se genera de forma independiente; no se agregaron dependencias.
  * Se eliminó `response_format` (tool-calling), que con `qwen/qwen3.8-27b` fallaba ~50% de las veces con error `tool_use_failed`; el modelo ahora responde JSON directo.
  * Se verificó la generación: **8/8 corridas válidas** (5 preguntas, número correcto de opciones, respuesta correcta dentro de opciones, tema correcto).
* **Archivos modificados/creados:**
  * `agente_profesor.py`
  * `HISTORIAL.md`
  * `README.md`
* **Próximos pasos sugeridos:**
  * Conectar un endpoint en `server.py` (p. ej. `POST /api/cuestionario`) que reciba `{"tipo": ...}` y devuelva el dict, y consumirlo desde el frontend.
  * Mostrar el cuestionario en un modal del dashboard del estudiante.
