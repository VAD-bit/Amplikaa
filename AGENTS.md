# AGENTS.md — Equipo de Agentes IA (Solo Gratis)

Reglas de operación del proyecto **Amplikaa**. Solo se usan agentes y modelos con tier gratuito.

## Mapa de Agentes

| Agente / Herramienta | Tarea Asignada | Modelo / Conexión Recomendada |
|---|---|---|
| **OpenCode** | Lógica de Landing, integración de Skills, CRO y Reglas `.md` | Gemini API / OpenRouter Free |
| **Aider** | Refactorización de múltiples archivos y esquema SQL en Supabase | Gemini Flash (Free Tier API) |
| **Cline** | Ajustes visuales precisos en el editor y componentes UI | OpenRouter Free Models |
| **v0 / Antigravity** | Generación inicial de bloques UI inspirados en la skill de diseño | Plan Web Gratuito |

## Reglas por Agente

### 1. OpenCode (orquestador principal)
- **Enfoque:** arquitectura de la landing, copy/CRO, integración de la skill `ui-ux-pro-max` y mantenimiento de reglas en `.md`.
- **Modelos gratuitos:**
  - Gemini API: `gemini-2.5-flash` vía [Google AI Studio](https://aistudio.google.com) (API key gratis).
  - OpenRouter Free: modelos con sufijo `:free` (ej. `google/gemini-2.5-flash-exp:free`, `deepseek/deepseek-chat-v3-0324:free`).
- **Config:** `opencode.json` del proyecto → providers `google` (baseURL `https://generativelanguage.googleapis.com/v1beta/openai/`) u `openrouter` (baseURL `https://openrouter.ai/api/v1`), ambos en modo OpenAI-compatible.

### 2. Aider (refactor + base de datos)
- **Enfoque:** refactors que tocan varios archivos y definición del esquema SQL de Supabase (tablas, RLS, políticas, índices).
- **Modelo gratuito:** Gemini Flash con API key de Google AI Studio.
- **Comando típico:**
  ```bash
  aider --model gemini/gemini-2.5-flash
  ```
- **Regla:** el esquema SQL vive en `supabase/migrations/`. Aider solo genera/edita SQL; la ejecución en el remoto la aprueba el humano.

### 3. Cline (UI pixel-perfect)
- **Enfoque:** ajustes visuales finos dentro del editor (VS Code / compatible): espaciados, tipografía, responsive, estados hover/focus.
- **Modelo gratuito:** OpenRouter Free Models (mismas claves `:free` que OpenCode).
- **Regla:** antes de pedir cambios de UI a Cline, usar la skill de diseño en OpenCode para obtener el sistema de diseño (colores, fuentes, spacing) y pasarle ese contexto a Cline.

### 4. v0 / Antigravity (prototipado inicial)
- **Enfoque:** generar el primer bloque o sección UI (hero, pricing, features, testimonios) en el plan web gratuito.
- **Regla:** el output de v0/Antigravity es un **borrador**. Siempre se adapta después en el proyecto con la skill de diseño, nunca se copia tal cual.

## Flujo de Trabajo Recomendado

1. **v0 / Antigravity** → genera el bloque visual base.
2. **OpenCode** → estructura la landing, aplica CRO, integra la skill `ui-ux-pro-max` y define reglas `.md`.
3. **Cline** → refino visual preciso en el editor.
4. **Aider** → refactor multi-archivo y esquema SQL de Supabase cuando la landing necesita backend/datos.

## Reglas Globales del Proyecto

- prohibido usar modelos de pago o planes de suscripción; solo free tier / `:free` / API keys gratuitas.
- Cualquier cambio que toque base de datos pasa por revisión humana antes de aplicarse en Supabase remoto.
- La skill `ui-ux-pro-max` es la fuente de verdad de estilos, paletas y tipografías; los agentes no inventan design tokens fuera de ella.
- Los prompts hacia v0/Antigravity deben incluir el design system generado por OpenCode para mantener consistencia.
