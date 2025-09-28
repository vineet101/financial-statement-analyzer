import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Financial Statement Analyzer',
  description: 'AI-powered financial statement analysis for credit underwriting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
