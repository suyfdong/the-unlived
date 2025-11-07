import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for The Unlived Project - How we handle your data and protect your privacy.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">Privacy Policy</h1>

          <div className="max-w-none">
            <p className="text-gray-400 mb-8">
              <strong>Effective Date:</strong> November 7, 2024
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              The Unlived Project ("we", "us", "our") respects your privacy and is committed to protecting your personal information.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">What We Collect</h2>
              <ul className="text-gray-300 space-y-3 list-disc pl-6">
                <li>
                  <strong>Unsent letters (original text):</strong> Processed in-memory to generate one AI reply,
                  then <strong>immediately discarded and NOT stored</strong>.
                </li>
                <li>
                  <strong>AI replies submitted to Exhibition (optional):</strong> Stored and displayed publicly
                  in anonymized form only if you choose to submit them.
                </li>
                <li>
                  <strong>Technical data:</strong> Basic logs for security and performance (e.g., IP address (short-lived),
                  timestamps, user agent, browser type).
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">How We Use Data</h2>
              <ul className="text-gray-300 space-y-3 list-disc pl-6">
                <li>Generate a one-time AI reply upon your request.</li>
                <li>Curate and display Exhibition entries (only if you opt in).</li>
                <li>Operate, secure, and improve the site.</li>
                <li>Prevent abuse and enforce rate limiting.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Cookies & Advertising</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use <strong>Google AdSense</strong> to display advertisements on certain pages. Google and its
                partners may use cookies to serve ads based on your prior visits to our website or other websites.
              </p>
              <ul className="text-gray-300 space-y-3 list-disc pl-6">
                <li>
                  You can opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Google Ads Settings
                  </a>.
                </li>
                <li>
                  Learn more about Google's privacy practices at{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Google Privacy Policy
                  </a>.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Data Sharing</h2>
              <ul className="text-gray-300 space-y-3 list-disc pl-6">
                <li>
                  We only share data with service providers necessary to operate the platform
                  (e.g., hosting, CDN, AI processing, analytics, advertising).
                </li>
                <li>We <strong>do NOT sell</strong> your personal data to third parties.</li>
                <li>We may disclose data if required by law or to protect our rights.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Data Retention</h2>
              <ul className="text-gray-300 space-y-3 list-disc pl-6">
                <li>
                  <strong>Original letters:</strong> Not stored; transient in-memory processing only.
                </li>
                <li>
                  <strong>Exhibition entries:</strong> Kept until removed as part of curation or upon your request.
                </li>
                <li>
                  <strong>Logs:</strong> Typically retained for 30-90 days for security purposes, then automatically deleted.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Your Choices & Rights</h2>
              <ul className="text-gray-300 space-y-3 list-disc pl-6">
                <li>
                  <strong>Don't submit personal information</strong> you don't want potentially appearing in AI-generated content.
                </li>
                <li>
                  You may request removal of an Exhibition entry by contacting us at{' '}
                  <a
                    href="mailto:hello@theunlived.art"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    hello@theunlived.art
                  </a>.
                </li>
                <li>
                  EU/EEA residents: You have rights under GDPR including access, correction, deletion, and data portability.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                This service is <strong>not directed to children under 13 years of age</strong> (or under the minimum
                age required in your region). We do not knowingly collect personal information from children.
                If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with
                an updated "Effective Date". Continued use of the service after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about this Privacy Policy or your data, please contact us at:{' '}
                <a
                  href="mailto:hello@theunlived.art"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  hello@theunlived.art
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm text-center">
              Last updated: November 7, 2024
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
