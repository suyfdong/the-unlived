import AboutPage from '@/components/AboutPage'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about The Unlived Project - an AI emotion museum where you can write unsent letters and receive AI-generated replies for emotional closure.',
  openGraph: {
    title: 'About | The Unlived Project',
    description: 'An AI emotion museum for unsent letters and emotional closure.',
    url: '/about',
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
