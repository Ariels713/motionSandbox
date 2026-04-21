import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Code Sandbox',
  description: 'Quick React & Motion snippet tester',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
