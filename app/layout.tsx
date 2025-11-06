import type { Metadata } from 'next'
import Script from 'next/script'
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
