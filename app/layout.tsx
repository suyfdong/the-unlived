import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Unlived Project - AI Emotion Museum',
  description: 'Write the words you never sent. Let AI reply what you\'ll never hear.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        {children}
      </body>
    </html>
  )
}
