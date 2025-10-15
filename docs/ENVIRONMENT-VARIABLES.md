# 🔐 Variables de Entorno

## Variables Requeridas

Este proyecto utiliza **solo variables de entorno del servidor**, sin el prefijo `NEXT_PUBLIC_`.

### Configuración Completa

```env
# Gemini API Key
GEMINI_API_KEY=tu_gemini_api_key_aqui

# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu_supabase_service_role_key_aqui
SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

## ¿Por qué no usamos NEXT_PUBLIC_?

Las variables con prefijo `NEXT_PUBLIC_` se exponen en el cliente (navegador), lo cual es un **riesgo de seguridad** para:

- ❌ `GEMINI_API_KEY` - Nunca debe estar en el cliente
- ❌ `SUPABASE_SERVICE_KEY` - Tiene permisos completos de administrador
- ⚠️ `SUPABASE_ANON_KEY` - Aunque es "anónima", preferimos mantenerla en el servidor

## Cómo Funcionan las Variables

### En Next.js

Next.js expone las variables de entorno al servidor automáticamente a través de `process.env`.

Para que funcionen en las API routes y en el servidor, las configuramos en `next.config.mjs`:

```javascript
env: {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}
```

### En Scripts de Node.js

Los scripts (como `generate-daily-ephemeris.js`) acceden directamente a `process.env`:

```javascript
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
```

## Obtener las Credenciales

### 1. Gemini API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la key generada

### 2. Supabase URL

1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. Ve a **Settings** → **API**
3. Copia la **Project URL**
   - Formato: `https://xxxxx.supabase.co`

### 3. Supabase Service Key

1. En **Settings** → **API**
2. Busca **service_role key**
3. Haz clic en "Reveal" y cópiala
4. ⚠️ **IMPORTANTE**: Esta key tiene permisos completos, mantenla segura

### 4. Supabase Anon Key

1. En **Settings** → **API**
2. Busca **anon/public key**
3. Cópiala

## Configuración por Entorno

### Desarrollo Local

Crea `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales reales.

### Producción (Vercel)

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_ANON_KEY`
4. Selecciona los entornos: Production, Preview, Development

### GitHub Actions

Configura los secrets en tu repositorio:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Haz clic en "New repository secret"
3. Agrega cada variable

Úsalas en tu workflow:

```yaml
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

## Seguridad

### ✅ Buenas Prácticas

- ✅ Usa `.env.local` para desarrollo (nunca hacer commit)
- ✅ Usa servicios de secrets para producción
- ✅ Rota las keys periódicamente
- ✅ Limita los permisos de las keys cuando sea posible
- ✅ Monitorea el uso de las APIs

### ❌ Nunca Hagas

- ❌ Hacer commit de archivos `.env.local`
- ❌ Compartir tus API keys en público
- ❌ Usar `NEXT_PUBLIC_` para keys sensibles
- ❌ Hardcodear las keys en el código
- ❌ Subir las keys a GitHub

## Verificación

### Verificar en Desarrollo

```bash
# Ejecutar el script de generación
npm run generate

# Si funciona, las variables están correctas
```

### Verificar en Producción

```bash
# Verificar que las variables estén configuradas
vercel env ls

# Probar el deployment
vercel deploy
```

## Troubleshooting

### Error: "Faltan las variables de entorno"

**Causa**: Las variables no están configuradas o tienen nombres incorrectos.

**Solución**:
1. Verifica que `.env.local` existe
2. Verifica los nombres exactos de las variables
3. Reinicia el servidor de desarrollo

### Error: "Invalid API key"

**Causa**: La API key es incorrecta o ha expirado.

**Solución**:
1. Verifica que copiaste la key completa
2. Genera una nueva key si es necesario
3. Verifica que no haya espacios extra

### Error: "Cannot connect to Supabase"

**Causa**: URL o keys de Supabase incorrectas.

**Solución**:
1. Verifica la URL (debe incluir `https://`)
2. Verifica que el proyecto de Supabase esté activo
3. Verifica que las keys sean del proyecto correcto

## Archivos Relevantes

- `.env.example` - Template de variables
- `.env.local` - Variables locales (no hacer commit)
- `.gitignore` - Ignora archivos `.env*`
- `next.config.mjs` - Configuración de Next.js
- `lib/supabase.ts` - Cliente de Supabase
- `scripts/generate-daily-ephemeris.js` - Script de generación

## Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Gemini API Authentication](https://ai.google.dev/gemini-api/docs/api-key)
