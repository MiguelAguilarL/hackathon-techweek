# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** Configuración inicial del entorno y desarrollo de la pantalla de Login basada en la referencia.
* **Fase:** Prototipado / Desarrollo UI (Mobile-First & PWA).

---

## 🌳 Estructura Actual del Proyecto
```text
hackathon-techweek/
├── public/
├── references/
│   └── login.html
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ConnectivityBanner.jsx
│   ├── db/
│   │   └── index.js
│   ├── hooks/
│   │   └── useOnlineStatus.js
│   ├── pages/
│   │   └── LoginPage.jsx
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
