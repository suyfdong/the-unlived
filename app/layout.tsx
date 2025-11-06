import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'The Unlived Project - AI Emotion Museum',
    template: '%s | The Unlived Project',
  },
  description: 'Write the words you never sent. Let AI reply what you\'ll never hear. An anonymous space for unsent letters and emotional closure.',
  keywords: ['unsent letters', 'AI emotion', 'emotional museum', 'closure', 'anonymous writing', 'AI reply', 'emotional healing'],
  authors: [{ name: 'The Unlived Project' }],
  creator: 'The Unlived Project',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'The Unlived Project - AI Emotion Museum',
    description: 'Write the words you never sent. Let AI reply what you\'ll never hear.',
    siteName: 'The Unlived Project',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Unlived Project - Write unsent letters, receive AI replies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Unlived Project - AI Emotion Museum',
    description: 'Write the words you never sent. Let AI reply what you\'ll never hear.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens when available
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black" suppressHydrationWarning>
        {children}
        <Script id="remove-extension-attributes" strategy="beforeInteractive">
          {`
            // Remove browser extension attributes that cause hydration warnings
            if (typeof window !== 'undefined') {
              const observer = new MutationObserver(() => {
                const html = document.documentElement;
                if (html.hasAttribute('katalonextensionid')) {
                  html.removeAttribute('katalonextensionid');
                }
              });
              observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['katalonextensionid']
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
