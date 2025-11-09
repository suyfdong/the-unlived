import HomePage from '@/components/HomePage'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.theunlived.art',
    siteName: 'The Unlived Project',
  }
}

export default function Page() {
  // Structured Data (Schema.org) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Unlived Project',
    alternateName: 'AI Emotion Museum',
    url: 'https://www.theunlived.art',
    description: 'To the one who\'s gone. To the version of you that died somewhere along the way. Write what you never said. Hear what you\'ll never hear. This is where unfinished stories find an ending.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.theunlived.art/exhibition?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    creator: {
      '@type': 'Organization',
      name: 'The Unlived Project',
      url: 'https://www.theunlived.art',
      logo: 'https://www.theunlived.art/og-image.png'
    },
    about: {
      '@type': 'Thing',
      name: 'Emotional Healing and Closure',
      description: 'A space for writing unsent letters and receiving AI-generated empathetic replies'
    },
    keywords: 'unsent letters, emotional closure, AI therapy, grief support, anonymous letters, emotional healing, closure letter, writing therapy'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />
      <HomePage />
    </>
  )
}
