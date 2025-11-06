import ExhibitionPage from '@/components/ExhibitionPage'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exhibition Wall',
  description: 'Browse AI replies to unsent letters. A growing collection of words people needed to hear, written by AI in response to what they never sent.',
  openGraph: {
    title: 'Exhibition Wall | The Unlived Project',
    description: 'A collection of AI replies to unsent letters from people around the world.',
    url: '/exhibition',
  },
}

export default function Page() {
  return (
    <>
      <Navigation />
      <ExhibitionPage />
    </>
  )
}
