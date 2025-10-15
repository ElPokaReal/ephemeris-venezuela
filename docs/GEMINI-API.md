# 🤖 Integración con Gemini API

## Endpoint Utilizado

Según la [documentación oficial de Gemini](https://ai.google.dev/api/generate-content?hl=es-419), usamos:

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
```

### Modelo

Utilizamos `gemini-2.5-flash` por su excelente balance entre velocidad, calidad y precio:

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}
```

## Estructura de la Petición

### Headers

```javascript
{
  'Content-Type': 'application/json'
}
```

### Body

```javascript
{
  contents: [{
    parts: [{
      text: "Tu prompt aquí"
    }]
  }],
  generationConfig: {
    temperature: 0.7,        // Creatividad (0.0 - 1.0)
    maxOutputTokens: 1024,   // Máximo de tokens en la respuesta
    topK: 40,                // Top-K sampling
    topP: 0.95,              // Nucleus sampling
  }
}
```

## Estructura de la Respuesta

### Respuesta Exitosa (200)

```javascript
{
  candidates: [{
    content: {
      parts: [{
        text: "Contenido generado por Gemini"
      }],
      role: "model"
    },
    finishReason: "STOP",
    index: 0,
    safetyRatings: [...]
  }],
  usageMetadata: {
    promptTokenCount: 123,
    candidatesTokenCount: 456,
    totalTokenCount: 579
  }
}
```

### Acceso al Contenido

```javascript
const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text
```

## Parámetros de GenerationConfig

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `temperature` | number | 0.0 - 2.0 | Controla la aleatoriedad. Valores más altos = más creativo |
| `maxOutputTokens` | integer | 1 - 8192 | Número máximo de tokens a generar |
| `topK` | integer | 1 - 40 | Limita a los K tokens más probables |
| `topP` | number | 0.0 - 1.0 | Nucleus sampling: suma acumulativa de probabilidades |
| `candidateCount` | integer | 1 - 8 | Número de respuestas a generar |
| `stopSequences` | string[] | - | Secuencias que detienen la generación |

## Modelos Disponibles

### Gemini 2.5 Flash (Recomendado) ⭐
- **Nombre**: `gemini-2.5-flash`
- **Uso**: Mejor modelo en relación precio-rendimiento
- **Ventajas**: Rápido, eficiente, económico, excelente calidad
- **Límite de tokens**: 1M de entrada, 65K de salida
- **Características**: Thinking, Function calling, Code execution

### Gemini 2.5 Pro
- **Nombre**: `gemini-2.5-pro`
- **Uso**: Tareas complejas que requieren razonamiento avanzado
- **Ventajas**: Máxima capacidad de razonamiento
- **Límite de tokens**: 2M de entrada, 65K de salida

### Gemini 2.5 Flash-Lite
- **Nombre**: `gemini-2.5-flash-lite`
- **Uso**: Tareas ultra rápidas y de bajo costo
- **Ventajas**: Velocidad extrema, muy económico
- **Límite de tokens**: Menor que Flash estándar

## Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| 400 | Bad Request | Verifica la estructura del JSON |
| 401 | Unauthorized | Verifica tu API key |
| 403 | Forbidden | API key inválida o sin permisos |
| 429 | Too Many Requests | Límite de rate alcanzado, espera |
| 500 | Internal Server Error | Error del servidor, reintenta |

### Ejemplo de Manejo

```javascript
try {
  const response = await makeRequest(url, options, data)
  
  if (response.status !== 200) {
    throw new Error(`Error ${response.status}: ${JSON.stringify(response.data)}`)
  }
  
  const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!content) {
    throw new Error('No se recibió contenido de Gemini')
  }
  
  return content
} catch (error) {
  console.error('Error con Gemini API:', error.message)
  throw error
}
```

## Límites y Cuotas

### Free Tier
- **Requests por minuto**: 15
- **Requests por día**: 1,500
- **Tokens por minuto**: 1M

### Paid Tier
- **Requests por minuto**: 1,000+
- **Requests por día**: Ilimitado
- **Tokens por minuto**: 4M+

## Mejores Prácticas

### 1. Prompts Efectivos

```javascript
const prompt = `Genera una efeméride histórica de Venezuela para el ${day} de ${month}.

Requisitos:
1. Evento REAL y VERIFICABLE
2. Incluye el año exacto
3. Descripción detallada (200-300 palabras)
4. Tono formal y patriótico

Responde SOLO en formato JSON:
{
  "event": "descripción",
  "historicalYear": año,
  "historicalMonth": mes,
  "historicalDay": día
}

NO incluyas texto adicional, solo el JSON.`
```

### 2. Limpieza de Respuestas

```javascript
let cleanContent = content.trim()

// Remover bloques de código markdown
if (cleanContent.startsWith('```json')) {
  cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
} else if (cleanContent.startsWith('```')) {
  cleanContent = cleanContent.replace(/```\n?/g, '')
}

const data = JSON.parse(cleanContent)
```

### 3. Validación de Respuestas

```javascript
// Validar estructura
if (!data.event || !data.historicalYear || !data.historicalMonth || !data.historicalDay) {
  throw new Error('Respuesta incompleta de Gemini')
}

// Validar tipos
if (typeof data.event !== 'string' || typeof data.historicalYear !== 'number') {
  throw new Error('Tipos de datos incorrectos')
}

// Validar rangos
if (data.historicalYear < 1500 || data.historicalYear > new Date().getFullYear()) {
  throw new Error('Año histórico fuera de rango')
}
```

### 4. Reintentos con Backoff

```javascript
async function generateWithRetry(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateEphemeris(prompt)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = Math.pow(2, i) * 1000 // Exponential backoff
      console.log(`Reintentando en ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

## Seguridad

### Safety Settings

```javascript
{
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
}
```

### Protección de API Key

```bash
# Nunca hagas commit de tu API key
echo "GEMINI_API_KEY=*" >> .gitignore

# Usa variables de entorno
export GEMINI_API_KEY="tu-api-key-aqui"

# En producción, usa servicios de secrets
# - GitHub Secrets
# - Vercel Environment Variables
# - AWS Secrets Manager
```

## Recursos

- [Documentación Oficial](https://ai.google.dev/api/generate-content?hl=es-419)
- [Todos los Métodos](https://ai.google.dev/api/all-methods?hl=es-419)
- [Guía de Prompts](https://ai.google.dev/gemini-api/docs/prompting-intro?hl=es-419)
- [Límites y Cuotas](https://ai.google.dev/gemini-api/docs/quota?hl=es-419)
- [Obtener API Key](https://makersuite.google.com/app/apikey)

## Ejemplo Completo

Ver el archivo `scripts/generate-daily-ephemeris.js` para una implementación completa y funcional.
