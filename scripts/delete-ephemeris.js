#!/usr/bin/env node

/**
 * Script para eliminar una efeméride específica
 * Uso: node scripts/delete-ephemeris.js 2025-10-15
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
            if (!line || line.startsWith('#')) return
            
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim()
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = value
                }
            }
        })
    }
}

loadEnvFile()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: Variables de entorno no configuradas')
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

async function deleteEphemeris(displayDate) {
    try {
        const response = await makeRequest(
            `${SUPABASE_URL}/rest/v1/ephemerides?display_date=eq.${displayDate}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                }
            }
        )

        if (response.status === 204 || response.status === 200) {
            console.log(`✅ Efeméride eliminada para ${displayDate}`)
        } else {
            console.log(`⚠️  No se encontró efeméride para ${displayDate}`)
        }
    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

// Main
const date = process.argv[2]
if (!date) {
    console.error('❌ Error: Debes especificar una fecha (YYYY-MM-DD)')
    console.error('Uso: node scripts/delete-ephemeris.js 2025-10-15')
    process.exit(1)
}

deleteEphemeris(date)
