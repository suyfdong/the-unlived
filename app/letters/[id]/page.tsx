import DetailPage from '@/components/DetailPage'
import Navigation from '@/components/Navigation'
import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: letter, error } = await supabase
      .from('letters_public')
      .select('ai_reply, recipient_type, exhibit_number')
      .eq('id', id)
      .single()

    if (error || !letter) {
      return {
        title: 'Letter Not Found',
        description: 'This letter does not exist or has been removed.',
      }
    }

    // Generate excerpt (first 150 characters)
    const excerpt = letter.ai_reply.substring(0, 150).trim() + '...'

    // Format recipient type for display
    const recipientDisplay = letter.recipient_type === 'past-self'
      ? 'Past Self'
      : letter.recipient_type === 'no-one'
      ? 'No One'
      : letter.recipient_type.charAt(0).toUpperCase() + letter.recipient_type.slice(1)

    const title = `Exhibit ${letter.exhibit_number} - Letter to ${recipientDisplay}`
    const description = `An unsent letter to ${recipientDisplay.toLowerCase()}: ${excerpt}`

    return {
      title,
      description,
      keywords: ['unsent letter', letter.recipient_type, 'emotional closure', 'AI reply', 'anonymous confession', 'emotional healing'],
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/letters/${id}`,
        images: ['/og-image.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png'],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'The Unlived Project',
      description: 'Read unsent letters and AI replies from the emotion museum.',
    }
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch letter data for structured data
  let structuredData = null;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: letter } = await supabase
      .from('letters_public')
      .select('ai_reply, recipient_type, exhibit_number, created_at')
      .eq('id', id)
      .single()

    if (letter) {
      const recipientDisplay = letter.recipient_type === 'past-self'
        ? 'Past Self'
        : letter.recipient_type === 'no-one'
        ? 'No One'
        : letter.recipient_type.charAt(0).toUpperCase() + letter.recipient_type.slice(1)

      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: `Exhibit ${letter.exhibit_number} - Letter to ${recipientDisplay}`,
        description: letter.ai_reply.substring(0, 200).trim() + '...',
        author: {
          '@type': 'Organization',
          name: 'The Unlived Project AI'
        },
        datePublished: letter.created_at,
        inLanguage: 'en',
        isPartOf: {
          '@type': 'WebSite',
          name: 'The Unlived Project',
          url: 'https://www.theunlived.art'
        },
        genre: 'Emotional Expression',
        keywords: `unsent letter, ${letter.recipient_type}, emotional closure, AI reply, anonymous confession`,
        url: `https://www.theunlived.art/letters/${id}`
      }
    }
  } catch (error) {
    console.error('Error generating structured data:', error)
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <Navigation />
      <DetailPage id={id} />
    </>
  )
}
