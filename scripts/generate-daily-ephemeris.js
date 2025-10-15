#!/usr/bin/env node

/**
 * Script para generar efemérides diarias de Venezuela usando Gemini AI
 * 
 * Uso:
 * node scripts/generate-daily-ephemeris.js [fecha_opcional]
 * 
 * Ejemplos:
 * node scripts/generate-daily-ephemeris.js              // Genera para mañana
 * node scripts/generate-daily-ephemeris.js 2025-01-15   // Genera para fecha específica
 */

const https = require('https')
const http = require('http')

// Configuración desde variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada')
    console.error('Configura tu API key de Gemini:')
    console.error('export GEMINI_API_KEY="tu-api-key-aqui"')
    process.exit(1)
}

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_KEY no está configurada')
    console.error('Configura tu service key de Supabase:')
    console.error('export SUPABASE_SERVICE_KEY="tu-service-key-aqui"')
    process.exit(1)
}

// Función auxiliar para hacer peticiones HTTP
function makeRequest(url, options = {}, data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url)
        const isHttps = urlObj.protocol === 'https:'
        const lib = isHttps ? https : http

        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        }

        const req = lib.request(reqOptions, (res) => {
            let body = ''
            res.on('data', chunk => body += chunk)
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body)
                    resolve({ status: res.statusCode, data: jsonData })
                } catch (e) {
                    resolve({ status: res.statusCode, data: body })
                }
            })
        })

        req.on('error', reject)

        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data))
        }

        req.end()
    })
}

// Función para obtener el nombre del mes
function getMonthName(month) {
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    return months[month - 1]
}

// Función para generar efeméride usando Gemini
async function generateEphemeris(targetDate) {
    const day = targetDate.getDate()
    const month = targetDate.getMonth() + 1

    console.log(`🤖 Generando efeméride para ${day} de ${getMonthName(month)}...`)

    const prompt = `Genera una efeméride histórica de Venezuela para el ${day} de ${getMonthName(month)}.

Busca un evento histórico REAL y VERIFICABLE relacionado con Venezuela que haya ocurrido un ${day} de ${getMonthName(month)} de cualquier año.

El evento puede ser sobre:
- Historia Patria (independencia, batallas, próceres)
- Cultura (arte, literatura, música)
- Ciencia y tecnología
- Deportes
- Política y sociedad
- Economía

Responde SOLO en formato JSON:
{
    "event": "Descripción detallada del evento en español (200-300 palabras), con tono formal y patriótico",
    "historicalYear": año_del_evento,
    "historicalMonth": ${month},
    "historicalDay": ${day}
}

IMPORTANTE:
- El evento DEBE ser real y verificable
- Incluye detalles históricos relevantes
- Usa un tono formal y respetuoso
- Enfatiza la importancia para Venezuela
- NO inventes eventos ficticios`

    try {
        const response = await makeRequest(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                topK: 40,
                topP: 0.95,
            }
        })

        if (response.status !== 200) {
            throw new Error(`Error de Gemini: ${response.status} ${JSON.stringify(response.data)}`)
        }

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!content) {
            throw new Error('No se recibió contenido de Gemini')
        }

        // Limpiar la respuesta y extraer JSON si está en un bloque de código
        let cleanContent = content.trim()

        // Si la respuesta está en un bloque de código markdown, extraer el contenido
        if (cleanContent.startsWith('```json') || cleanContent.startsWith('```')) {
            const lines = cleanContent.split('\n')
            const startIndex = lines.findIndex(line => line.startsWith('```'))
            const endIndex = lines.findIndex((line, index) => index > startIndex && line.trim() === '```')

            if (startIndex !== -1 && endIndex !== -1) {
                cleanContent = lines.slice(startIndex + 1, endIndex).join('\n').trim()
            }
        }

        // Parsear la respuesta JSON
        const ephemeris = JSON.parse(cleanContent)

        // Verificar si la IA reportó que no encontró evento verificable
        if (ephemeris.error) {
            console.log(`⚠️ IA reportó: ${ephemeris.error}`)
            return null
        }

        // Validar que la respuesta tenga la estructura correcta
        if (!ephemeris.event || !ephemeris.historicalYear || !ephemeris.historicalMonth || !ephemeris.historicalDay) {
            throw new Error('Respuesta de IA incompleta')
        }

        console.log(`✅ Efeméride generada: ${ephemeris.event.substring(0, 100)}...`)
        return ephemeris
    } catch (error) {
        console.error('❌ Error generando efeméride:', error.message)
        return null
    }
}

// Función para verificar si ya existe una efeméride
async function checkExistingEphemeris(displayDate) {
    try {
        const response = await makeRequest(
            `${SUPABASE_URL}/rest/v1/ephemerides?display_date=eq.${displayDate}`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                }
            }
        )

        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0]
        }

        return null
    } catch (error) {
        console.error('❌ Error verificando efeméride existente:', error.message)
        return null
    }
}

// Función para insertar efeméride en Supabase
async function insertEphemeris(targetDate, ephemerisData) {
    const displayDate = targetDate.toISOString().split('T')[0] // YYYY-MM-DD

    const ephemerisRecord = {
        day: targetDate.getDate(),
        month: targetDate.getMonth() + 1,
        year: targetDate.getFullYear(),
        event: ephemerisData.event,
        display_date: displayDate,
        historical_day: ephemerisData.historicalDay,
        historical_month: ephemerisData.historicalMonth,
        historical_year: ephemerisData.historicalYear,
    }

    console.log(`💾 Insertando efeméride en la base de datos...`)

    try {
        const response = await makeRequest(`${SUPABASE_URL}/rest/v1/ephemerides`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            }
        }, ephemerisRecord)

        if (response.status !== 201) {
            throw new Error(`Error insertando en Supabase: ${response.status} ${JSON.stringify(response.data)}`)
        }

        console.log(`✅ Efeméride insertada exitosamente para ${displayDate}`)
        return response.data[0]
    } catch (error) {
        console.error('❌ Error insertando efeméride:', error.message)
        throw error
    }
}

// Función principal
async function main() {
    console.log('🚀 Iniciando generación de efeméride diaria de Venezuela...')

    // Determinar la fecha objetivo
    const targetDateArg = process.argv[2]
    let targetDate

    if (targetDateArg) {
        targetDate = new Date(targetDateArg + 'T00:00:00.000Z')
        if (isNaN(targetDate.getTime())) {
            console.error('❌ Error: Fecha inválida. Usa formato YYYY-MM-DD')
            process.exit(1)
        }
    } else {
        // Por defecto: mañana
        targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

    const displayDate = targetDate.toISOString().split('T')[0]
    console.log(`📅 Fecha objetivo: ${displayDate}`)

    try {
        // Verificar si ya existe una efeméride para esta fecha
        console.log('🔍 Verificando si ya existe una efeméride...')
        const existing = await checkExistingEphemeris(displayDate)

        if (existing) {
            console.log(`⚠️  Ya existe una efeméride para ${displayDate}:`)
            console.log(`   ${existing.event.substring(0, 150)}...`)
            console.log('✨ No se necesita generar una nueva.')
            return
        }

        // Generar nueva efeméride
        const ephemerisData = await generateEphemeris(targetDate)

        if (!ephemerisData) {
            console.error('❌ No se pudo generar la efeméride')
            process.exit(1)
        }

        // Insertar en la base de datos
        const insertedEphemeris = await insertEphemeris(targetDate, ephemerisData)

        console.log('🎉 ¡Efeméride generada e insertada exitosamente!')
        console.log(`📖 Evento: ${insertedEphemeris.event.substring(0, 150)}...`)
        console.log(`📅 Fecha histórica: ${insertedEphemeris.historical_day}/${insertedEphemeris.historical_month}/${insertedEphemeris.historical_year}`)

    } catch (error) {
        console.error('❌ Error en el proceso:', error.message)
        process.exit(1)
    }
}

// Ejecutar el script
if (require.main === module) {
    main()
}
