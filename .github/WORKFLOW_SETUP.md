# 🔧 Configuración del Workflow de GitHub Actions

Este documento explica cómo configurar el workflow automático para generar efemérides diarias.

## 📋 Requisitos Previos

Antes de activar el workflow, necesitas configurar los siguientes **GitHub Secrets** en tu repositorio.

## 🔐 Configurar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### Secrets Requeridos:

#### 1. `GEMINI_API_KEY`
- **Descripción:** API Key de Google Gemini para generar contenido
- **Cómo obtenerla:** 
  - Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Inicia sesión con tu cuenta de Google
  - Click en "Create API Key"
  - Copia la key generada
- **Valor:** `AIza...` (tu API key de Gemini)

#### 2. `SUPABASE_URL`
- **Descripción:** URL de tu proyecto de Supabase
- **Cómo obtenerla:**
  - Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
  - Settings → API
  - Copia la "Project URL"
- **Valor:** `https://gsyxclnhkhlancyuhbtk.supabase.co`

#### 3. `SUPABASE_SERVICE_KEY`
- **Descripción:** Service Role Key de Supabase (tiene permisos completos)
- **Cómo obtenerla:**
  - Ve a tu proyecto en Supabase Dashboard
  - Settings → API
  - En "Project API keys", copia el **service_role** key (no el anon key)
  - ⚠️ **IMPORTANTE:** Esta key tiene acceso completo, nunca la expongas en el código
- **Valor:** `eyJhbG...` (tu service role key)

## ⏰ Horario de Ejecución

El workflow está configurado para ejecutarse:
- **Automáticamente:** Todos los días a las **12:00 AM hora de Venezuela** (04:00 UTC)
- **Manualmente:** Puedes ejecutarlo cuando quieras desde la pestaña "Actions"

### Zona Horaria de Venezuela
- Venezuela está en UTC-4 (sin cambio de horario)
- El cron `0 4 * * *` ejecuta a las 04:00 UTC = 12:00 AM Venezuela

## 🚀 Ejecución Manual

Para ejecutar el workflow manualmente:

1. Ve a la pestaña **Actions** en tu repositorio
2. Selecciona el workflow **"Generar Efeméride Diaria de Venezuela"**
3. Click en **"Run workflow"**
4. (Opcional) Ingresa una fecha específica en formato `YYYY-MM-DD`
5. Click en **"Run workflow"** para confirmar

### Ejemplos de Ejecución Manual:

**Generar para mañana (por defecto):**
- Deja el campo de fecha vacío

**Generar para una fecha específica:**
- Ingresa: `2025-12-25` (para generar la efeméride del 25 de diciembre)

## 📊 Monitoreo

Después de cada ejecución:

1. Ve a la pestaña **Actions**
2. Click en la ejecución más reciente
3. Revisa los logs para ver:
   - ✅ Si la efeméride se generó correctamente
   - 📅 La fecha para la que se generó
   - ⏰ La hora de ejecución
   - ❌ Cualquier error que haya ocurrido

## 🔍 Verificar en Supabase

Para confirmar que la efeméride se guardó:

1. Ve a tu proyecto en Supabase Dashboard
2. Click en **Table Editor**
3. Selecciona la tabla `ephemerides`
4. Verifica que hay un nuevo registro con el `display_date` correcto

## ⚠️ Solución de Problemas

### Error: "GEMINI_API_KEY not found"
- Verifica que agregaste el secret `GEMINI_API_KEY` correctamente
- Asegúrate de que el nombre del secret esté exactamente como se muestra (mayúsculas)

### Error: "Supabase connection failed"
- Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` estén configurados
- Confirma que la URL no tenga espacios ni caracteres extra
- Verifica que estés usando el **service_role** key, no el anon key

### El workflow no se ejecuta automáticamente
- Asegúrate de que el archivo `.github/workflows/ephemeris-venezuela.yml` esté en la rama `main`
- Los workflows solo se ejecutan en la rama por defecto del repositorio
- Puede tomar hasta 1 hora después del push para que GitHub active el cron

## 📝 Notas Adicionales

- El workflow usa **Bun** como runtime (más rápido que npm)
- Si prefieres npm, cambia `bun install` por `npm install` en el workflow
- Las efemérides se generan para el día siguiente (mañana)
- Cada efeméride tiene un `display_date` único para evitar duplicados

## 🎯 Próximos Pasos

1. ✅ Configurar los 3 secrets requeridos
2. ✅ Hacer push del workflow a GitHub
3. ✅ Probar con ejecución manual
4. ✅ Esperar a la medianoche para ver la ejecución automática
5. ✅ Verificar en Supabase que se guardó correctamente

---

**¿Necesitas ayuda?** Revisa los logs en la pestaña Actions o consulta la documentación en el README.md principal.
