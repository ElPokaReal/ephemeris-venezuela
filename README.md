# 🇻🇪 Efemérides Venezolanas

Una aplicación web moderna que genera y muestra diariamente efemérides históricas de Venezuela con una hermosa interfaz de estilo colonial.

![Efemérides Venezolanas](https://img.shields.io/badge/Venezuela-Historia-FFD700?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)

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

## 🚀 Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone <tu-repositorio>
cd daily-ephemeris-venezuela
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
# o
bun install
# o
pnpm install
\`\`\`

### 3. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://app.supabase.com)
2. Ve a SQL Editor y ejecuta el script `supabase-schema.sql`:

\`\`\`bash
# Copia el contenido de supabase-schema.sql y ejecútalo en el SQL Editor de Supabase
\`\`\`

3. Obtén tus credenciales:
   - Ve a **Settings** → **API**
   - Copia la **URL** del proyecto
   - Copia la **anon/public key**
   - Copia la **service_role key** (¡mantén esto en secreto!)

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita `.env.local` con tus credenciales:

\`\`\`env
# Gemini API Key
GEMINI_API_KEY=tu_gemini_api_key_aqui

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aqui

# Token secreto para el cron job (opcional, genera uno aleatorio)
CRON_SECRET=tu_token_secreto_aqui
\`\`\`

### 5. Ejecutar en desarrollo

\`\`\`bash
npm run dev
# o
bun dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Uso

### Generar una Efeméride Manualmente

Durante el desarrollo, puedes generar una efeméride para el día actual visitando:

\`\`\`
http://localhost:3000/api/generate-ephemeris
\`\`\`

O usando curl:

\`\`\`bash
curl -X POST http://localhost:3000/api/generate-ephemeris \
  -H "Authorization: Bearer dev-secret-token"
\`\`\`

### Automatizar la Generación Diaria

Para producción, configura un cron job que llame al endpoint de generación diariamente:

#### Opción 1: Vercel Cron Jobs

Crea un archivo `vercel.json`:

\`\`\`json
{
  "crons": [{
    "path": "/api/generate-ephemeris",
    "schedule": "0 0 * * *"
  }]
}
\`\`\`

#### Opción 2: GitHub Actions

Crea `.github/workflows/daily-ephemeris.yml`:

\`\`\`yaml
name: Generate Daily Ephemeris

on:
  schedule:
    - cron: '0 4 * * *'  # 4 AM UTC (12 AM Venezuela)
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/generate-ephemeris \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
\`\`\`

#### Opción 3: Servicio Externo

Usa servicios como [cron-job.org](https://cron-job.org) o [EasyCron](https://www.easycron.com/) para hacer una petición POST diaria a tu endpoint.

## 🗂️ Estructura del Proyecto

\`\`\`
daily-ephemeris-venezuela/
├── app/
│   ├── api/
│   │   ├── generate-ephemeris/   # Genera efemérides con Gemini
│   │   │   └── route.ts
│   │   └── today/                # Obtiene la efeméride del día
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── colonial-newsboard.tsx    # Componente principal
│   └── ui/                       # Componentes shadcn/ui
├── lib/
│   └── supabase.ts              # Cliente de Supabase
├── hooks/
│   └── use-mobile.ts
├── .env.example                 # Plantilla de variables de entorno
├── supabase-schema.sql          # Esquema de la base de datos
├── package.json
└── README.md
\`\`\`

## 🎨 Personalización

### Modificar el Prompt de Gemini

Edita el prompt en `app/api/generate-ephemeris/route.ts` para ajustar el estilo o contenido de las efemérides:

\`\`\`typescript
const prompt = \`Genera una efeméride histórica de Venezuela para el día \${dayMonth}.

Requisitos:
1. Debe ser un evento REAL y VERIFICABLE de la historia de Venezuela
2. Incluye el año exacto del evento
// ... personaliza aquí
\`
\`\`\`

### Cambiar Categorías

Las categorías disponibles son:
- Historia Patria
- Cultura
- Ciencia
- Deportes
- Arte
- Sociedad

Puedes modificarlas en el prompt o agregar nuevas según tus necesidades.

### Estilos y Temas

Los estilos están en `app/globals.css` y usan variables CSS para fácil personalización:

\`\`\`css
:root {
  --background: ...
  --foreground: ...
  --primary: ...
  --secondary: ...
  --accent: ...
}
\`\`\`

## 🔒 Seguridad

- ✅ Row Level Security (RLS) habilitado en Supabase
- ✅ Service role key solo en el servidor
- ✅ Token de autorización para el endpoint de generación
- ✅ Variables de entorno para credenciales sensibles
- ✅ Validación de datos en el backend

## 🚢 Despliegue

### Vercel (Recomendado)

1. Haz push de tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega

### Netlify

\`\`\`bash
npm run build
netlify deploy --prod
\`\`\`

### Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
\`\`\`

## 📊 Base de Datos

### Esquema de la Tabla \`ephemerides\`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| date | DATE | Fecha completa (YYYY-MM-DD) |
| day_month | TEXT | Día y mes legible ("15 de Octubre") |
| year | TEXT | Año del evento histórico |
| category | TEXT | Categoría de la efeméride |
| title | TEXT | Título del evento |
| description | TEXT | Descripción detallada |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Datos históricos generados por Google Gemini AI
- Diseño inspirado en la estética colonial venezolana
- Componentes UI de [shadcn/ui](https://ui.shadcn.com)

## 📞 Soporte

Si tienes alguna pregunta o problema:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles

---

Hecho con ❤️ para Venezuela 🇻🇪
