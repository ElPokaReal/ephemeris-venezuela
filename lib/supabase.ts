// Configuración de Supabase desde variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_SERVICE_KEY')
}

// Tipo para la tabla ephemerides
export interface Ephemeris {
  id: number
  day: number
  month: number
  year: number
  event: string
  display_date: string
  historical_day: number | null
  historical_month: number | null
  historical_year: number | null
  priority: number
  created_at: string | null
  updated_at: string | null
}

// Función para hacer peticiones a Supabase desde el servidor
export async function makeSupabaseRequest(endpoint: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Variables de entorno de Supabase no configuradas')
  }
  
  const url = `${SUPABASE_URL}/rest/v1${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
  }

  return response.json()
}
