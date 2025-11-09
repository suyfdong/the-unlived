import AboutPage from '@/components/AboutPage'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Some words live too long inside us. The Unlived Project is a space for letters you never sent—to the one who left, the one you lost, the you you used to be. Write what you never said. Hear what you\'ll never hear.',
  keywords: ['unsent letters', 'emotional closure', 'grief', 'AI therapy', 'anonymous letters', 'emotional healing', 'closure letter', 'writing therapy'],
  openGraph: {
    title: 'About | The Unlived Project',
    description: 'A space for words you never sent. Write to the one who\'s gone, your past self, or the void. AI answers what silence never could.',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | The Unlived Project',
    description: 'A space for words you never sent. Write to the one who\'s gone, your past self, or the void.',
  },
}

export default function Page() {
  return (
    <>
      <Navigation />
      <AboutPage />
    </>
  )
}
