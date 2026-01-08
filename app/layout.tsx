import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vertragsverwaltung',
  description: 'Mitarbeiter-Vertragsverwaltung für Dienstverträge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
