import WritePage from '@/components/WritePage'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write Your Unsent Letter',
  description: 'Write the words you never sent to a lover, friend, parent, or past self. Your message stays private forever. Only the AI reply can be shared.',
  openGraph: {
    title: 'Write Your Unsent Letter | The Unlived Project',
    description: 'Write the words you never sent. Your message stays private forever.',
    url: '/write',
  },
}

export default function Page() {
  return (
    <>
      <Navigation />
      <WritePage />
    </>
  )
}
