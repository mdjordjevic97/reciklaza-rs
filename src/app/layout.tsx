import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Reciklaža.rs — Kupovina i prodaja otpada",
  description: "Marketplace za kupovinu i prodaju otpada. Povežite se sa generatorima i sakupljačima otpada u Srbiji.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
