import type React from "react"
import type { Metadata } from "next"
import { EB_Garamond, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import "./globals.css"

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Efemérides Venezolanas | Historia Diaria de Venezuela",
  description: "Descubre cada día una nueva efeméride histórica de Venezuela. Contenido generado con IA, diseño colonial elegante y funcionalidad para compartir en redes sociales.",
  keywords: ["Venezuela", "historia", "efemérides", "historia venezolana", "cultura", "educación"],
  authors: [{ name: "Efemérides Venezolanas" }],
  creator: "Efemérides Venezolanas",
  publisher: "Efemérides Venezolanas",
  openGraph: {
    title: "Efemérides Venezolanas | Historia Diaria de Venezuela",
    description: "Descubre cada día una nueva efeméride histórica de Venezuela",
    type: "website",
    locale: "es_VE",
    siteName: "Efemérides Venezolanas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Efemérides Venezolanas",
    description: "Historia diaria de Venezuela con diseño colonial",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`font-serif ${ebGaramond.variable} ${geistMono.variable}`}
        style={{ fontFamily: "var(--font-eb-garamond)" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
