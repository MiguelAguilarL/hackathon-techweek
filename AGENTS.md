# Protocolo del Proyecto: AGENTS.md

> **Propósito:** Este archivo define las reglas obligatorias de comportamiento, arquitectura y gestión de contexto para cualquier modelo o agente de IA que colabore en este repositorio durante el hackathon.

---

## Núcleo del Proyecto: El Reto a Resolver (README.md)

Fuente de la Verdad: La descripción completa, requisitos, objetivos y criterios de evaluación del hackathon se encuentran documentados en el archivo README.md.

Enfoque 100% Alineado: Todo el desarrollo, arquitectura, componentes y decisiones de diseño deben responder estrictamente a resolver el problema planteado en dicho archivo.

Prohibición de Features Innecesarias: Queda terminantemente prohibido sugerir o implementar funcionalidades accesorias que desvíen al equipo del objetivo central definido en el README.md. Cada propuesta de código debe justificar cómo aporta a la solución del reto.

## 1. Regla de Oro: Gestión de Contexto y Memoria (`HISTORIAL.md`)

Dado que el desarrollo se realiza a través de múltiples sesiones de chat o con límites de contexto de ventana, **es obligatorio mantener y consultar activamente la bitácora del proyecto**.

### 1.1. Consulta Inicial
* Al iniciar cualquier conversación o tarea, el agente debe **leer `HISTORIAL.md`** para entender el estado actual del proyecto, las últimas decisiones tomadas y las tareas pendientes.

### 1.2. Actualización Obligatoria al Finalizar Cada Tarea
Al completar cualquier cambio relevante (creación de archivos, refactorizaciones, nuevas dependencias o features), el agente debe actualizar `HISTORIAL.md` registrando:
1. **Fecha / Marca temporal:** Momento del cambio o número de iteración.
2. **Acciones realizadas:** Resumen concreto de lo que se implementó o modificó.
3. **Estructura del proyecto:** Árbol de carpetas y archivos actualizado (destacando nuevos archivos).
4. **Estado actual y próximos pasos:** Qué quedó listo y cuál es la siguiente tarea prioritaria para el próximo chat o agente.

---

## 2. Stack Tecnológico, Arquitectura y Reglas de UI

El proyecto utiliza un stack frontend orientado a **PWA (Progressive Web App)**, optimizado para teléfonos de recursos limitados, baja latencia y funcionamiento sin conexión:

| Área | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Tooling & Build** | Vite | Bundle ultra liviano, tiempos de compilación mínimos y soporte nativo para ES Modules. |
| **Librería de UI** | React | Desarrollo declarativo basado en componentes y hooks reutilizables. |
| **Estilos** | Tailwind CSS | Clases utilitarias puras que reducen el tamaño final del CSS al eliminar reglas no usadas. |
| **Capacidades PWA** | `vite-plugin-pwa` (Workbox) | Gestión automatizada de Service Workers, caché de cascarón (app shell) y manifiesto web. |
| **Persistencia Local** | Dexie.js (IndexedDB) | Base de datos local reactiva y transaccional para chats, temas y cola de sincronización. |
| **Enrutamiento** | React Router (`react-router-dom`) | Navegación en el cliente sin recargas de página ni consumo adicional de red. |
| **Iconografía** | Lucide React | Paquete optimizado con tree-shaking mediante imports nombrados. |

---

### Reglas de Desarrollo de UI:

- **Enfoque Mobile-First Obligatorio:**
  - Toda pantalla se diseña partiendo de resoluciones base móviles (360px–420px de ancho).
  - Todo elemento táctil (botones, inputs, chips de respuesta) debe cumplir un área de contacto mínima de **44×44 px**.
  - Interacciones clave concentradas en la zona inferior de la pantalla para permitir uso cómodo con una sola mano.

- **Optimización para Baja Conexión y Rendimiento:**
  - **Zero Heavy Assets:** Queda prohibido el uso de imágenes pesadas, gifs o librerías de animación complejas; priorizar fuentes tipográficas del sistema (`font-sans`).
  - **Indicador de Conectividad:** La interfaz debe integrar un banner o etiqueta sutil que notifique claramente si la app está en modo *Conectado* o *Sin conexión (Guardando localmente)*.
  - **Actualizaciones Optimistas:** El contenido generado por el estudiante (mensajes, intentos, selecciones) debe mostrarse al instante en pantalla antes de sincronizarse con la red.

- **Diseño del Chat y Tutor Socrático:**
  - Flujo visual estilo mensajería rápida con burbujas legibles y contrastes de color accesibles (WCAG AA).
  - Integración de botones de acción rápida (*quick reply chips*) para estructurar el razonamiento del alumno sin exigir tecleo excesivo en pantallas pequeñas.

- **Componentes y Modularidad:**
  - Uso exclusivo de componentes funcionales y Hooks personalizados (`useOnlineStatus`, `useLiveQuery`).
  - Desacoplamiento total entre las interfaces del alumno y el panel de seguimiento docente.

- **Estilos:**
  - Uso estricto de clases de utilidad de **Tailwind CSS**.
  - Evitar archivos de estilos personalizados; centralizar configuraciones mínimas en `index.css`.

---

### Estructura de Directorios del Proyecto

```text
aprender-a-la-jarocha/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── db/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 3. Modo de Trabajo para Hackathon

En un entorno de hackathon, la velocidad y la claridad son críticas:

1. **Código Funcional (MVP Primero):** Priorizar soluciones operativas y entregables que demuestren valor antes que sobreingeniería o configuraciones complejas.
2. **Single-File Logic donde aplique:** Evitar dispersar lógica innecesariamente si un componente puede resolver su estado interno de forma limpia.
3. **Manejo de Errores y Mock Data:** Si una API externa no está lista, proveer *mock data* inmediata en el código para no bloquear el desarrollo visual ni la demo.
4. **Claridad en las Instrucciones:** En cada respuesta, el agente debe especificar si el usuario debe ejecutar algún comando (`npm install`, migraciones, etc.) de manera explícita y concisa.

---

## 4. Plantilla Base para `HISTORIAL.md`

El agente debe inicializar o verificar que `HISTORIAL.md` siga esta estructura:

```markdown
# Bitácora del Proyecto: HISTORIAL.md

## 📌 Estado General
* **Objetivo actual:** [Describir meta del MVP]
* **Fase:** [Planificación / Desarrollo UI / Integración / Demo]

---



---

## 📝 Registro de Cambios

### [Iteración X] - [Fecha/Hora]
* **Hecho:** 
  * Se creó el componente `X` usando React y Tailwind.
  * Se configuró la paginación con Next.js.
* **Archivos modificados/creados:** `app/page.tsx`, `components/Card.tsx`
* **Próximos pasos sugeridos:** Integrar el consumo de API en la vista de lista.
```