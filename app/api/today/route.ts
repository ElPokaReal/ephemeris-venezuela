import { NextRequest, NextResponse } from 'next/server'
import { makeSupabaseRequest, Ephemeris } from '@/lib/supabase'

// Función para obtener la efeméride para una fecha específica
async function getEphemerisForDate(date: string): Promise<Ephemeris | null> {
  try {
    const data = await makeSupabaseRequest(`/ephemerides?display_date=eq.${date}`)

    if (!data || data.length === 0) {
      return null
    }

    return data[0]
  } catch (error) {
    console.error('💥 Error en getEphemerisForDate:', error)
    return null
  }
}

// Función para obtener la efeméride más reciente
async function getLatestEphemeris(): Promise<Ephemeris | null> {
  try {
    const data = await makeSupabaseRequest(`/ephemerides?order=display_date.desc&limit=1`)

    if (!data || data.length === 0) {
      return null
    }

    return data[0]
  } catch (error) {
    console.error('💥 Error en getLatestEphemeris:', error)
    return null
  }
}

// Handler para GET requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    // Si se especifica una fecha, obtener esa efeméride específica
    if (date) {
      const ephemeris = await getEphemerisForDate(date)
      
      if (!ephemeris) {
        return NextResponse.json(
          { error: 'No se encontró efeméride para la fecha especificada' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ data: ephemeris })
    }

    // Por defecto, obtener la efeméride de hoy
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    const todayEphemeris = await getEphemerisForDate(todayString)
    
    if (todayEphemeris) {
      return NextResponse.json({ data: todayEphemeris, isToday: true })
    }

    // Si no hay para hoy, obtener la más reciente
    const latestEphemeris = await getLatestEphemeris()
    
    if (!latestEphemeris) {
      return NextResponse.json(
        { 
          error: 'No hay efemérides disponibles',
          message: 'Aún no se ha generado ninguna efeméride. Ejecuta el script de generación para crear una.'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      data: latestEphemeris, 
      isToday: false,
      message: 'Mostrando la efeméride más reciente'
    })

  } catch (error) {
    console.error('Error en API de efemérides:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Revalidar cada hora
export const revalidate = 3600
