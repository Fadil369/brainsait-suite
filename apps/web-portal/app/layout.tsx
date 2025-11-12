import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrainSAIT Suite - Healthcare AI Platform',
  description: 'AI-powered healthcare platform for NPHIES compliance in Saudi Arabia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
