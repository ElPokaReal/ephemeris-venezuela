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
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno desde .env.local
function loadEnvFile() {
    const envPath = path.join(__dirname, '..', '.env.local')
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8')
        envContent.split('\n').forEach(line => {
            line = line.trim()
            // Ignorar comentarios y líneas vacías
            if (!line || line.startsWith('#')) return
            
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim()
                // Solo establecer si no existe ya en process.env
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = value
                }
            }
        })
        console.log('✅ Variables de entorno cargadas desde .env.local')
    } else {
        console.log('⚠️  Archivo .env.local no encontrado')
    }
}

// Cargar variables de entorno
loadEnvFile()

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
    const day = targetDate.getUTCDate()
    const month = targetDate.getUTCMonth() + 1

    console.log(`🤖 Generando efeméride para ${day} de ${getMonthName(month)}...`)

    const prompt = `Genera una efeméride histórica de Venezuela para el ${day} de ${getMonthName(month)}.

INSTRUCCIONES DE BÚSQUEDA:
1. Busca en fuentes históricas confiables (Wikipedia, archivos nacionales, bibliotecas digitales)
2. VERIFICA que el evento ocurrió EXACTAMENTE el ${day} de ${getMonthName(month)}
3. Confirma el año exacto del evento
4. NO uses eventos de fechas cercanas (si fue el 14, NO lo pongas para el 15)

El evento DEBE ser REAL y VERIFICABLE relacionado con Venezuela sobre:
- Historia Patria (independencia, batallas, próceres)
- Cultura (arte, literatura, música)
- Ciencia y tecnología
- Deportes
- Política y sociedad
- Economía

FORMATO DEL EVENTO:
- Primera oración: TÍTULO conciso (máximo 150 caracteres)
- Siguientes 2-3 oraciones: DESCRIPCIÓN con contexto e importancia (máximo 200 palabras)
- Tono formal pero accesible
- Enfatiza la relevancia para Venezuela

Responde SOLO en formato JSON:
{
    "event": "Título conciso del evento. Descripción breve con contexto histórico e importancia para Venezuela.",
    "historicalYear": año_del_evento,
    "historicalMonth": ${month},
    "historicalDay": ${day},
    "source": "Fuente de verificación (ej: Wikipedia, Biblioteca Nacional, etc.)",
    "url": "https://... (URL completa con más información)",
    "confidence": "high/medium/low"
}

VALIDACIÓN OBLIGATORIA:
✓ Fecha exacta verificada: ${day}/${month}/[año]
✓ Evento documentado en fuentes históricas
✓ URL válida y accesible
✓ Relevancia para Venezuela confirmada
✗ NO inventes eventos
✗ NO uses fechas aproximadas
✗ NO confundas días cercanos

EJEMPLO CORRECTO:
{
    "event": "Nace Juan Vicente Bolívar y Ponte, padre del Libertador. El 15 de octubre de 1726 nació en La Victoria, Estado Aragua, Juan Vicente Bolívar y Ponte, padre de Simón Bolívar. Fue activo propulsor de la independencia venezolana y su influencia fue fundamental en la formación de los valores de su ilustre hijo.",
    "historicalYear": 1726,
    "historicalMonth": 10,
    "historicalDay": 15,
    "source": "Wikipedia",
    "url": "https://es.wikipedia.org/wiki/Juan_Vicente_Bol%C3%ADvar_y_Ponte",
    "confidence": "high"
}`

    try {
        const response = await makeRequest(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
                maxOutputTokens: 8192,
                topK: 40,
                topP: 0.95,
            }
        })

        if (response.status !== 200) {
            console.error('📋 Respuesta completa:', JSON.stringify(response.data, null, 2))
            throw new Error(`Error de Gemini: ${response.status} ${JSON.stringify(response.data)}`)
        }

        // Debug: mostrar estructura de la respuesta
        console.log('📋 Respuesta de Gemini recibida')
        
        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!content) {
            console.error('❌ Estructura de respuesta:', JSON.stringify(response.data, null, 2))
            console.error('❌ Candidates:', response.data.candidates)
            if (response.data.candidates?.[0]) {
                console.error('❌ Primer candidate:', JSON.stringify(response.data.candidates[0], null, 2))
            }
            throw new Error('No se recibió contenido de Gemini')
        }

        // Limpiar la respuesta y extraer JSON si está en un bloque de código
        let cleanContent = content.trim()

        console.log('📝 Contenido original (primeros 200 chars):', cleanContent.substring(0, 200))

        // Remover bloques de código markdown
        if (cleanContent.includes('```')) {
            // Buscar el patrón ```json o ``` seguido de JSON
            const jsonMatch = cleanContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
            if (jsonMatch && jsonMatch[1]) {
                cleanContent = jsonMatch[1].trim()
            } else {
                // Si no encuentra el patrón, intentar remover todas las líneas con ```
                cleanContent = cleanContent
                    .split('\n')
                    .filter(line => !line.trim().startsWith('```'))
                    .join('\n')
                    .trim()
            }
        }

        console.log('✨ Contenido limpio (primeros 200 chars):', cleanContent.substring(0, 200))

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

        // Validar nivel de confianza
        if (ephemeris.confidence && ephemeris.confidence === 'low') {
            console.log('⚠️  Advertencia: La IA reportó baja confianza en este evento')
        }

        console.log(`✅ Efeméride generada: ${ephemeris.event.substring(0, 100)}...`)
        if (ephemeris.source) {
            console.log(`📚 Fuente: ${ephemeris.source}`)
        }
        if (ephemeris.url) {
            console.log(`🔗 URL: ${ephemeris.url}`)
        }
        if (ephemeris.confidence) {
            console.log(`🎯 Nivel de confianza: ${ephemeris.confidence}`)
        }
        
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
        day: targetDate.getUTCDate(),
        month: targetDate.getUTCMonth() + 1,
        year: targetDate.getUTCFullYear(),
        event: ephemerisData.event,
        display_date: displayDate,
        historical_day: ephemerisData.historicalDay,
        historical_month: ephemerisData.historicalMonth,
        historical_year: ephemerisData.historicalYear,
        priority: 1, // Prioridad por defecto
        source: ephemerisData.source || null,
        url: ephemerisData.url || null,
        confidence: ephemerisData.confidence || null,
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
