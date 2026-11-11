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

## 2. Stack Tecnológico y Reglas de UI

El proyecto utiliza un stack frontend moderno y estandarizado:

| Área | Tecnología |
| :--- | :--- |
| **Framework base** | Next.js (App Router recomendado) |
| **Librería de UI** | React |
| **Estilos** | Tailwind CSS |
| **Rutas y Paginación** | Next.js Routing (`next/navigation`, `Link`, parámetros de búsqueda `useSearchParams`) |

### Reglas de Desarrollo de UI:
* **Paginación y Enrutamiento:** Toda la navegación entre vistas y paginación de datos debe resolverse usando las utilidades nativas de Next.js (`Link`, rutas dinámicas `[page]` o search params `?page=1`). No usar routers de terceros.
* **Componentes:**
  * Usar componentes funcionales y Hooks modernos.
  * Modularizar la UI en componentes reutilizables (`/components`).
* **Estilos:**
  * Usar exclusivamente clases utilitarias de **Tailwind CSS**.
  * Evitar archivos `.css` adicionales salvo configuraciones globales mínimas (`globals.css`).
  * Diseñar siempre con enfoque *Mobile First* y diseño responsivo.

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

## 🌳 Estructura Actual del Proyecto
\`\`\`text
proyecto/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pagination/
├── components/
├── public/
├── AGENTS.md
└── HISTORIAL.md
\`\`\`

---

## 📝 Registro de Cambios

### [Iteración X] - [Fecha/Hora]
* **Hecho:** 
  * Se creó el componente `X` usando React y Tailwind.
  * Se configuró la paginación con Next.js.
* **Archivos modificados/creados:** `app/page.tsx`, `components/Card.tsx`
* **Próximos pasos sugeridos:** Integrar el consumo de API en la vista de lista.
```