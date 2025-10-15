import { NextRequest, NextResponse } from 'next/server'
import { makeSupabaseRequest, Ephemeris } from '@/lib/supabase'

// Función para obtener las efemérides para una fecha específica
async function getEphemeridesForDate(date: string): Promise<Ephemeris[]> {
  try {
    const data = await makeSupabaseRequest(
      `/ephemerides?display_date=eq.${date}&order=priority.desc,created_at.asc`
    )

    if (!data || data.length === 0) {
      return []
    }

    return data
  } catch (error) {
    console.error('💥 Error en getEphemeridesForDate:', error)
    return []
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

    // Si se especifica una fecha, obtener esas efemérides específicas
    if (date) {
      const ephemerides = await getEphemeridesForDate(date)
      
      if (ephemerides.length === 0) {
        return NextResponse.json(
          { error: 'No se encontraron efemérides para la fecha especificada' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        data: ephemerides,
        count: ephemerides.length 
      })
    }

    // Por defecto, obtener las efemérides de hoy
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    const todayEphemerides = await getEphemeridesForDate(todayString)
    
    if (todayEphemerides.length > 0) {
      return NextResponse.json({ 
        data: todayEphemerides,
        count: todayEphemerides.length,
        isToday: true 
      })
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
      data: [latestEphemeris],
      count: 1,
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
