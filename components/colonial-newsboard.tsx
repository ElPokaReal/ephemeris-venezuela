"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Share2, X, Facebook, Linkedin, Link2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface EphemerisItem {
  id: number
  day: number
  month: number
  year: number
  event: string
  display_date: string
  historical_day: number | null
  historical_month: number | null
  historical_year: number | null
  source?: string | null
  confidence?: 'high' | 'medium' | 'low' | null
}

export function ColonialNewsboard() {
  const [ephemerides, setEphemerides] = useState<EphemerisItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [displayedDescription, setDisplayedDescription] = useState("")
  const [isTitleComplete, setIsTitleComplete] = useState(false)
  const [isDescriptionComplete, setIsDescriptionComplete] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const ephemeris = ephemerides[currentIndex] || null

  // Obtener efemérides del día
  useEffect(() => {
    async function fetchEphemerides() {
      try {
        const response = await fetch('/api/today')
        if (!response.ok) {
          throw new Error('Error al obtener las efemérides')
        }
        const result = await response.json()
        setEphemerides(result.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEphemerides()
  }, [])

  // Resetear typewriter al cambiar de efeméride
  useEffect(() => {
    setDisplayedTitle("")
    setDisplayedDescription("")
    setIsTitleComplete(false)
    setIsDescriptionComplete(false)
  }, [currentIndex])

  // Efecto de escritura para el evento
  useEffect(() => {
    if (!ephemeris) return

    // Extraer título (primera oración del evento)
    const sentences = ephemeris.event.split('. ')
    const firstSentence = sentences[0] + '.'
    
    let titleIndex = 0
    const titleInterval = setInterval(() => {
      if (titleIndex < firstSentence.length) {
        setDisplayedTitle(firstSentence.substring(0, titleIndex + 1))
        titleIndex++
      } else {
        clearInterval(titleInterval)
        setIsTitleComplete(true)
      }
    }, 30)

    return () => clearInterval(titleInterval)
  }, [ephemeris])

  // Efecto de escritura para la descripción
  useEffect(() => {
    if (!isTitleComplete || !ephemeris) return

    setIsDescriptionComplete(false)

    // Descripción es el resto del evento (después de la primera oración)
    const sentences = ephemeris.event.split('. ')
    const restOfEvent = sentences.length > 1 
      ? sentences.slice(1).join('. ')
      : ''

    if (!restOfEvent) {
      setIsDescriptionComplete(true)
      return
    }

    let descriptionIndex = 0
    const descriptionInterval = setInterval(() => {
      if (descriptionIndex < restOfEvent.length) {
        setDisplayedDescription(restOfEvent.substring(0, descriptionIndex + 1))
        descriptionIndex++
      } else {
        clearInterval(descriptionInterval)
        setIsDescriptionComplete(true)
      }
    }, 20)

    return () => clearInterval(descriptionInterval)
  }, [isTitleComplete, ephemeris])

  // Funciones para compartir
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const getMonthName = (month: number) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return months[month - 1]
  }
  const shareText = ephemeris 
    ? `Efeméride de Venezuela - ${ephemeris.day} de ${getMonthName(ephemeris.month)} de ${ephemeris.year}` 
    : ''

  const handleShareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Compartiendo en X')
  }

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Compartiendo en Facebook')
  }

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Compartiendo en LinkedIn')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Enlace copiado al portapapeles')
    } catch (err) {
      toast.error('Error al copiar el enlace')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="text-secondary mx-auto mb-4 animate-pulse" size={48} />
          <p className="text-lg text-secondary">Cargando efeméride del día...</p>
        </div>
      </div>
    )
  }

  if (error || !ephemeris) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="text-secondary mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-serif text-primary mb-4 font-bold">
            Aún no hay efemérides generadas
          </h2>
          <p className="text-muted-foreground mb-6">
            Para generar la primera efeméride, ejecuta:
          </p>
          <code className="block bg-secondary/10 text-secondary px-4 py-3 rounded-md font-mono text-sm mb-4">
            bun run generate
          </code>
          <p className="text-xs text-muted-foreground">
            Consulta el README.md para más información
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8 relative">
          {/* Decorative top border with Venezuelan motif */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-0.5 bg-secondary flex-1 max-w-xs"></div>
            <div className="mx-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rotate-45"></div>
              <BookOpen className="text-secondary" size={36} strokeWidth={1.5} />
              <div className="w-2 h-2 bg-accent rotate-45"></div>
            </div>
            <div className="h-0.5 bg-secondary flex-1 max-w-xs"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-primary mb-4 tracking-tight font-bold">
            Efemérides Venezolanas
          </h1>

          <p className="text-lg md:text-xl text-secondary italic mb-3 font-semibold">
            Crónicas de Nuestra Historia Patria
          </p>

          <p className="text-sm text-muted-foreground uppercase tracking-[0.3em] font-semibold">
            República Bolivariana de Venezuela
          </p>

          {/* Decorative bottom border */}
          <div className="flex items-center justify-center mt-6">
            <div className="h-0.5 bg-secondary flex-1 max-w-xs"></div>
            <div className="mx-6 flex gap-2">
              <div className="w-2 h-2 bg-accent rotate-45"></div>
              <div className="w-2 h-2 bg-secondary rotate-45"></div>
              <div className="w-2 h-2 bg-accent rotate-45"></div>
            </div>
            <div className="h-0.5 bg-secondary flex-1 max-w-xs"></div>
          </div>
        </div>

        <Card className="relative overflow-hidden border-4 border-secondary bg-card shadow-2xl">
          {/* Decorative corner ornaments - Venezuelan baroque style */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-accent"></div>
            <div className="absolute top-2 left-2 w-3 h-3 bg-secondary rotate-45"></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="absolute top-0 right-0 w-full h-full border-t-4 border-r-4 border-accent"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-secondary rotate-45"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16">
            <div className="absolute bottom-0 left-0 w-full h-full border-b-4 border-l-4 border-accent"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-secondary rotate-45"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-accent"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-secondary rotate-45"></div>
          </div>

          {/* Inner decorative frame */}
          <div className="absolute top-8 left-8 right-8 bottom-8 border border-secondary/30 pointer-events-none"></div>

          <div className="p-8 md:p-14 lg:p-20">
            {/* Date and Historical Info */}
            <div className="flex items-center justify-between mb-8 text-sm flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <time className="text-secondary uppercase tracking-[0.2em] font-bold text-base">
                  {ephemeris.day} de {getMonthName(ephemeris.month)}
                </time>
                <span className="text-accent font-semibold text-lg">{ephemeris.year}</span>
              </div>
              {ephemeris.historical_year && (
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground border-2 border-accent px-4 py-2 text-sm font-bold"
                >
                  Año Histórico: {ephemeris.historical_year}
                </Badge>
              )}
            </div>

            {/* Title with typewriter effect */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-8 leading-tight text-balance font-bold">
              {displayedTitle}
              {!isTitleComplete && <span className="animate-pulse">|</span>}
            </h2>

            {/* Decorative divider - Venezuelan style */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-accent rotate-45"></div>
              <div className="h-0.5 bg-secondary flex-1"></div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-secondary rotate-45"></div>
                <div className="w-1.5 h-1.5 bg-accent rotate-45"></div>
                <div className="w-1.5 h-1.5 bg-secondary rotate-45"></div>
              </div>
              <div className="h-0.5 bg-secondary flex-1"></div>
              <div className="w-2 h-2 bg-accent rotate-45"></div>
            </div>

            {/* Description with typewriter effect */}
            {displayedDescription && (
              <p className="text-foreground/90 leading-relaxed text-lg md:text-xl lg:text-2xl text-pretty mb-6">
                {displayedDescription}
                {!isDescriptionComplete && <span className="animate-pulse">|</span>}
              </p>
            )}

            {/* Source information */}
            {ephemeris?.source && isDescriptionComplete && (
              <div className="mb-6 text-center">
                <p className="text-sm text-muted-foreground italic">
                  📚 Fuente: {ephemeris.source}
                </p>
              </div>
            )}

            {/* Share buttons */}
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-secondary/30">
              <p className="text-sm text-secondary font-semibold mr-2">Compartir:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareX}
                className="border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                X
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareFacebook}
                className="border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLinkedIn}
                className="border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
          </div>
        </Card>

        {/* Controles de Carrusel */}
        {ephemerides.length > 1 && (
          <div className="mt-8 space-y-4">
            {/* Indicador de posición */}
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                Efeméride {currentIndex + 1} de {ephemerides.length}
              </Badge>
            </div>

            {/* Navegación */}
            <div className="flex justify-center items-center gap-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                ← Anterior
              </Button>

              {/* Dots indicator */}
              <div className="flex gap-2 items-center">
                {ephemerides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex 
                        ? "bg-secondary w-8" 
                        : "bg-secondary/30 w-2"
                    }`}
                    aria-label={`Ir a efeméride ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(prev => Math.min(ephemerides.length - 1, prev + 1))}
                disabled={currentIndex === ephemerides.length - 1}
                className="border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mt-10 pt-8 border-t-2 border-secondary">

          <p className="text-secondary text-base italic mb-3 font-semibold">
            Preservando la Memoria Histórica de Nuestra Nación
          </p>
        </div>
      </div>
    </div>
  )
}
