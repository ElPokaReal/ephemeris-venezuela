# 🇻🇪 Efemérides Venezolanas

Una aplicación web moderna que genera y muestra diariamente efemérides históricas de Venezuela con una hermosa interfaz de estilo colonial.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ElPokaReal/ephemeris-venezuela)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)

## 🎯 Características

- 🗓️ **Efemérides Diarias**: Cada día una nueva efeméride histórica sobre Venezuela
- 🖥️ **Interfaz Colonial**: Experiencia inmersiva con efectos de terminal clásico y diseño elegante
- 📱 **Responsive**: Adaptado perfectamente para escritorio y dispositivos móviles
- 🤖 **Generación Automática**: Contenido generado diariamente usando Gemini AI
- 📊 **Base de Datos**: Almacenamiento persistente en Supabase
- 🔗 **Compartir en Redes Sociales**: Funcionalidad integrada para compartir en Twitter, Facebook, LinkedIn
- 🌙 **Tema Oscuro**: Diseño elegante con efectos de glow y animaciones
- ⌨️ **Efecto Typewriter**: Animación de escritura para título y descripción

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React para aplicaciones web
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de utilidades CSS
- **Lucide React** - Iconos SVG optimizados
- **Sonner** - Sistema de notificaciones toast
- **shadcn/ui** - Componentes UI reutilizables

### Backend y Base de Datos
- **Supabase** - Base de datos PostgreSQL y autenticación
- **Gemini AI** - Generación automática de contenido histórico
- **Next.js API Routes** - Endpoints del servidor

### Herramientas de Desarrollo
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos
- **ESLint** - Linting de código

## 📋 Requisitos Previos

- Node.js 18+ o Bun
- Una cuenta en [Supabase](https://supabase.com)
- Una API Key de [Google Gemini](https://makersuite.google.com/app/apikey)

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/ElPokaReal/ephemeris-venezuela.git
cd ephemeris-venezuela
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://app.supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase-schema.sql`
3. Obtén tus credenciales en **Settings** → **API**:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_KEY) ⚠️ Mantén esto en secreto

### 4. Configurar Gemini AI

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una API Key
3. Copia la key generada

### 5. Configurar Variables de Entorno

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita `.env.local`:

\`\`\`env
# Gemini API Key
GEMINI_API_KEY=tu_gemini_api_key_aqui

# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu_supabase_service_role_key_aqui
SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
\`\`\`

### 6. Generar primera efeméride

\`\`\`bash
npm run generate
\`\`\`

### 7. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Uso

### Comandos Disponibles

\`\`\`bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Construye la aplicación
npm start                # Inicia servidor de producción

# Generación de Efemérides
npm run generate         # Genera efeméride para mañana
npm run generate:today   # Genera efeméride para hoy
node scripts/generate-daily-ephemeris.js 2025-01-15  # Fecha específica

# Utilidades
npm run lint             # Ejecuta ESLint
\`\`\`

### Generar Efemérides

El proyecto incluye un script Node.js para generar efemérides:

\`\`\`bash
# Generar para mañana (por defecto)
npm run generate

# Generar para una fecha específica
node scripts/generate-daily-ephemeris.js 2025-12-25

# Ver ayuda
node scripts/generate-daily-ephemeris.js --help
\`\`\`

### Automatizar la Generación Diaria

#### Opción 1: GitHub Actions (Recomendado) ✅

El proyecto incluye un workflow de GitHub Actions que genera automáticamente una efeméride todos los días a las **12:00 AM hora de Venezuela**.

**Configuración:**

1. El workflow ya está incluido en `.github/workflows/ephemeris-venezuela.yml`
2. Configura los siguientes **GitHub Secrets** en tu repositorio:
   - `GEMINI_API_KEY` - Tu API key de Google Gemini
   - `SUPABASE_URL` - URL de tu proyecto Supabase
   - `SUPABASE_SERVICE_KEY` - Service role key de Supabase

3. El workflow se ejecutará automáticamente cada día a medianoche (Venezuela)

**Ejecución Manual:**
- Ve a la pestaña **Actions** en GitHub
- Selecciona "Generar Efeméride Diaria de Venezuela"
- Click en "Run workflow"
- Opcionalmente, especifica una fecha en formato `YYYY-MM-DD`

📖 **Guía completa:** Ver [.github/WORKFLOW_SETUP.md](.github/WORKFLOW_SETUP.md)

#### Opción 2: Cron Job en Servidor

\`\`\`bash
# Agregar al crontab
0 4 * * * cd /ruta/al/proyecto && npm run generate >> /var/log/ephemeris.log 2>&1
\`\`\`

#### Opción 3: Servicio Externo

Usa [cron-job.org](https://cron-job.org) o [EasyCron](https://www.easycron.com/) para ejecutar el script diariamente.

## 🗂️ Estructura del Proyecto

\`\`\`
ephemeris-venezuela/
├── app/
│   ├── api/
│   │   └── today/                # API para obtener efeméride del día
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx                # Layout principal con metadata
│   └── page.tsx                  # Página principal
├── components/
│   ├── colonial-newsboard.tsx    # Componente principal de efemérides
│   ├── theme-provider.tsx        # Proveedor de tema
│   └── ui/                       # Componentes shadcn/ui
├── lib/
│   ├── supabase.ts              # Cliente de Supabase (sin SDK)
│   └── utils.ts                 # Utilidades
├── scripts/
│   └── generate-daily-ephemeris.js  # Script para generar efemérides
├── docs/
│   ├── GEMINI-API.md            # Documentación de Gemini API
│   └── ENVIRONMENT-VARIABLES.md  # Guía de variables de entorno
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── .env.example                 # Template de variables de entorno
├── supabase-schema.sql          # Esquema de la base de datos
├── next.config.mjs              # Configuración de Next.js
├── package.json
└── README.md
\`\`\`

## 🎨 Personalización

### Modificar el Prompt de Gemini

Edita el prompt en `scripts/generate-daily-ephemeris.js`:

\`\`\`javascript
const prompt = \`Genera una efeméride histórica de Venezuela para el \${day} de \${getMonthName(month)}.

Busca un evento histórico REAL y VERIFICABLE relacionado con Venezuela...

Responde SOLO en formato JSON:
{
    "event": "Descripción detallada del evento...",
    "historicalYear": año_del_evento,
    "historicalMonth": mes,
    "historicalDay": día
}
\`
\`\`\`

### Estilos y Temas

Los estilos están en `app/globals.css` usando variables CSS:

\`\`\`css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  --accent: 43 96% 56%;
}
\`\`\`

## 🔒 Seguridad

- ✅ **Row Level Security (RLS)** habilitado en Supabase
- ✅ **Service role key** solo en el servidor (nunca en el cliente)
- ✅ **Variables de entorno** sin prefijo `NEXT_PUBLIC_` para mayor seguridad
- ✅ **Validación de datos** en el backend
- ✅ **API keys** protegidas en `.env.local` (gitignored)
- ✅ **Sanitización** de respuestas de IA

## 🚢 Despliegue

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ElPokaReal/ephemeris-venezuela)

1. Haz push de tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_ANON_KEY`
4. Despliega automáticamente

### Variables de Entorno en Vercel

Ve a **Settings** → **Environment Variables** y agrega:

\`\`\`
GEMINI_API_KEY=tu_key_aqui
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=tu_service_key_aqui
SUPABASE_ANON_KEY=tu_anon_key_aqui
\`\`\`

Selecciona: **Production**, **Preview**, y **Development**

## 📊 Base de Datos

### Esquema de la Tabla \`ephemerides\`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | Identificador único autoincremental |
| day | INTEGER | Día del mes (1-31) |
| month | INTEGER | Mes del año (1-12) |
| year | INTEGER | Año actual para mostrar |
| event | TEXT | Descripción completa del evento histórico |
| display_date | DATE | Fecha de visualización (YYYY-MM-DD) |
| historical_day | INTEGER | Día histórico real del evento |
| historical_month | INTEGER | Mes histórico real del evento |
| historical_year | INTEGER | Año histórico real del evento |
| created_at | TIMESTAMP | Fecha de creación del registro |
| updated_at | TIMESTAMP | Última actualización del registro |

### Políticas RLS

- **SELECT**: Público (cualquiera puede leer)
- **INSERT**: Solo con service role key
- **UPDATE**: Solo con service role key
- **DELETE**: Solo con service role key

## 📚 Documentación Adicional

- **[GEMINI-API.md](docs/GEMINI-API.md)** - Guía completa de la API de Gemini
- **[ENVIRONMENT-VARIABLES.md](docs/ENVIRONMENT-VARIABLES.md)** - Configuración de variables de entorno

## 🔧 Troubleshooting

### Error: "Faltan las variables de entorno"

Verifica que `.env.local` existe y tiene todas las variables requeridas.

### Error: "Invalid API key"

- Verifica que tu API key de Gemini es correcta
- Genera una nueva en [Google AI Studio](https://makersuite.google.com/app/apikey)

### Error: "Cannot connect to Supabase"

- Verifica que la URL de Supabase es correcta
- Verifica que el proyecto está activo
- Verifica las keys en Settings → API

### No se genera contenido

- Verifica que ejecutaste el schema SQL en Supabase
- Ejecuta `npm run generate` manualmente
- Revisa los logs para ver errores específicos

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- **Google Gemini AI** - Generación de contenido histórico
- **Supabase** - Base de datos y backend
- **Vercel** - Hosting y deployment
- **shadcn/ui** - Componentes UI
- Diseño inspirado en la estética colonial venezolana

## 🔗 Enlaces Útiles

- [Demo en Vivo](https://ephemeris-venezuela.vercel.app)
- [Documentación de Gemini](https://ai.google.dev/gemini-api/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)

## 📞 Contacto

Si tienes preguntas o sugerencias:

- 🐛 [Reportar un bug](https://github.com/ElPokaReal/ephemeris-venezuela/issues)
- 💡 [Solicitar una característica](https://github.com/ElPokaReal/ephemeris-venezuela/issues)
- 📧 Contacto: [GitHub](https://github.com/ElPokaReal)

---

**Hecho con ❤️ para Venezuela 🇻🇪**

*Preservando nuestra historia, un día a la vez.*
