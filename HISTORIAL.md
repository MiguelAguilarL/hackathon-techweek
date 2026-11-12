# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General

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

---

## 🛠 Stack definido (módulo docente)
* Python 3.13 + `langchain` 1.5 + `langchain-groq` + `pydantic` + `python-dotenv` + `pytest`
* Modelo: **`qwen/qwen3.8-27b`** en Groq (temperatura 0.4)
* Sin base de datos, sin lectura de archivos, sin RAG (decisión explícita del usuario)

---

## 📝 Registro de Cambios

