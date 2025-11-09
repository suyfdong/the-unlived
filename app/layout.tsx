import type { Metadata } from 'next'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'The Unlived Project - AI Emotion Museum',
    template: '%s | The Unlived Project',
  },
  description: 'To the one who\'s gone. To the version of you that died somewhere along the way. Write what you never said. Hear what you\'ll never hear. This is where unfinished stories find an ending.',
  keywords: ['unsent letters', 'emotional closure', 'grief support', 'AI therapy', 'write to deceased', 'letter to ex', 'anonymous confession', 'emotional healing', 'closure letter', 'forgiveness letter', 'goodbye letter', 'regret', 'past self', 'emotional museum', 'AI reply', 'therapeutic writing'],
  authors: [{ name: 'The Unlived Project' }],
  creator: 'The Unlived Project',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'The Unlived Project - AI Emotion Museum',
    description: 'To the one who\'s gone. To the version of you that died somewhere along the way. Write what you never said. Hear what you\'ll never hear.',
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
    description: 'To the one who\'s gone. To the version of you that died somewhere along the way. Write what you never said. Hear what you\'ll never hear.',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Replace with your actual AdSense client ID
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-9041836440635279';
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script - Only loads in production */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {/* Google Analytics - Only loads in production when GA ID is set */}
        {process.env.NODE_ENV === 'production' && gaId && (
          <GoogleAnalytics measurementId={gaId} />
        )}
      </head>
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
