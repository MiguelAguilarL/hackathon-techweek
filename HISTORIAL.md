# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Agente docente único (consola) que genera evaluaciones diagnósticas y actividades con Groq.
* **Fase:** MVP funcional en consola — 5 commits realizados; pendiente decidir siguiente funcionalidad.

---

## 🌳 Estructura Actual del Proyecto
```text
./
├── AGENTS.md
├── README.md
├── HISTORIAL.md
├── .env.example          ← plantilla de credenciales
├── .env                  ← clave real de Groq (NO se commitea)
├── .gitignore            ← ignora .env, .venv/, output/, __pycache__/
├── requirements.txt
├── agente_profesor.py    ← AGENTE ÚNICO (LangChain + Groq)
├── output/               ← JSON generados con uso de tokens (NO se commitea)
└── .venv/                ← entorno virtual (NO se commitea)
```

---

## 🛠 Stack definido (módulo docente)
* Python 3.13 + `langchain` 1.5 + `langchain-groq` + `pydantic` + `python-dotenv` + `pytest`
* Modelo: **`qwen/qwen3.8-27b`** en Groq (temperatura 0.4)
* Sin base de datos, sin lectura de archivos, sin RAG (decisión explícita del usuario)

---

## 📝 Registro de Cambios

### [Iteración 1] - 11/11/2026 — ETAPA 1: Planificación
* **Hecho:**
  * Análisis de requerimientos y plan técnico (agente único vs múltiples; workflow vs agente ReAct).
  * Decisiones: un solo agente con un system prompt, salida estructurada Pydantic, validación en Python, 1 ronda de reparación, ahorro de tokens.
* **Próximos pasos:** entorno y conexión con Groq.

### [Iteración 2] - 11/11/2026 — ETAPA 2: Entorno
* **Hecho:**
  * Entorno virtual `.venv` con Python 3.13 e instalación de `requirements.txt`.
  * Archivos `.env.example`, `.env` (clave pegada por el usuario), `.gitignore`.
  * Conexión verificada a Groq; modelo confirmado: `qwen/qwen3.8-27b`.
* **Archivos creados:** `.env.example`, `.env`, `requirements.txt`, `.gitignore`
* **Próximos pasos:** escribir el agente.

### [Iteración 3] - 11/11/2026 — ETAPA 3: Agente funcional
* **Hecho:**
  * Agente único en `agente_profesor.py`: CLI (`python agente_profesor.py`), system prompt único con reglas para evaluación diagnóstica / actividad / aclaración, salida JSON validada con Pydantic, 1 reparación ante errores, guardado en `output/` con conteo de tokens.
  * Pruebas reales (3 llamadas a Groq):
    * Evaluación diagnóstica (ecuaciones lineales, divisiones): OK — 1557 tokens.
    * Actividad opción múltiple (5 preguntas): OK — 1251 tokens.
    * Petición sin temas → pide aclaración: OK — 595 tokens.
* **Archivos modificados/creados:** `agente_profesor.py`
* **Limitaciones conocidas:**
  * Cada petición es independiente (sin historial) → "genera además..." no recuerda lo anterior; el tema debe ir en la frase.
  * El modelo a veces se equivoca en cálculos → el profesor debe revisar antes de usar.
* **Próximos pasos:** pruebas automatizadas (`pytest` sobre esquemas/validación), proponer commit, y decidir siguiente funcionalidad.

### [Iteración 4] - 11/11/2026 — REESCRITURA SIMPLE: agente de consola en un solo archivo
* **Hecho:**
  * `agente_profesor.py` reescrito desde cero (versión mínima solicitada por el usuario, sin Pydantic ni guardado JSON con tokens):
    * Paso 1: conexión con Groq (`qwen/qwen3.8-27b`, temperatura 0.4).
    * Paso 2: `INSTRUCCIONES` (system prompt con reglas actividad/evaluación/aclaración) + función `generar_respuesta()`.
    * Paso 3: bucle de consola (`Profesor >` / `salir`).
    * Fix `max_tokens=1000` (error 429 OTPM del plan on_demand) + sección de ejecución en `README.md`.
  * Guardado en `output/` implementado y luego eliminado a petición del usuario (por ahora solo imprime en pantalla).
  * Pruebas reales OK: actividad de opción múltiple (3 preguntas) y evaluación diagnóstica de 3 niveles.
* **Commits:** `feat: configurar modelo de Groq`, `feat: crear agente educativo`, `test: probar generación de actividades`, `feat: guardar respuestas en output/`, `docs: agregar instrucciones de ejecución`, `refactor: quitar guardado de respuestas`
* **Limitaciones conocidas:**
  * Límite Groq on_demand: 1000 tokens de salida por minuto → evaluaciones muy largas (15 preguntas) pueden quedar truncadas.
  * Sin historial de conversación (cada petición es independiente).
* **Próximos pasos:** commitear este HISTORIAL + `.env.example`, `.gitignore`, `requirements.txt`; decidir siguiente funcionalidad con el usuario.
