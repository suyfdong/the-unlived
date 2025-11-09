import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - The Unlived Project',
  description: 'Privacy Policy for The Unlived Project - How we handle your data, cookies, Google Analytics, and Google AdSense. GDPR and CCPA compliant.',
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
              <strong>Effective Date:</strong> November 9, 2024
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
                <li>
                  <strong>Analytics data (via Google Analytics):</strong> Anonymized usage statistics including page views,
                  session duration, traffic sources, device information, and approximate geographic location.
                </li>
                <li>
                  <strong>Advertising data (via Google AdSense):</strong> Cookie-based data for ad personalization and
                  performance measurement, managed by Google and its advertising partners.
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
              <h2 className="text-2xl font-serif text-white mb-4">Cookies & Tracking Technologies</h2>

              <p className="text-gray-300 leading-relaxed mb-6">
                We use cookies and similar tracking technologies to improve your experience and analyze site usage.
                Below are the types of cookies we use:
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-serif text-white mb-3">Essential Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable basic features
                  like security, rate limiting, and session management.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-serif text-white mb-3">Analytics Cookies</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use <strong>Google Analytics</strong> to understand how visitors interact with our website.
                  Google Analytics collects information such as:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc pl-6 mb-4">
                  <li>Pages you visit and time spent on each page</li>
                  <li>How you arrived at our site (search engine, referral link, direct visit)</li>
                  <li>Device type, browser type, and operating system</li>
                  <li>Approximate geographic location (country/city level, based on anonymized IP address)</li>
                  <li>User interactions (button clicks, form submissions)</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  <strong>Important:</strong> Google Analytics data is anonymized and aggregated. We do not use it
                  to identify individual users. You can opt out of Google Analytics by installing the{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-serif text-white mb-3">Advertising Cookies</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use <strong>Google AdSense</strong> to display advertisements on certain pages
                  (Exhibition Wall and Letter Detail pages). Google and its partners use cookies to:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc pl-6 mb-4">
                  <li>Serve ads based on your prior visits to our website or other websites</li>
                  <li>Personalize ad content based on your interests</li>
                  <li>Measure ad performance and prevent ad fraud</li>
                  <li>Build audience profiles for targeted advertising</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong>Your Advertising Choices:</strong>
                </p>
                <ul className="text-gray-300 space-y-2 list-disc pl-6">
                  <li>
                    Opt out of personalized advertising:{' '}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Google Ads Settings
                    </a>
                  </li>
                  <li>
                    Opt out of third-party cookies:{' '}
                    <a
                      href="https://optout.aboutads.info/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Digital Advertising Alliance Opt-Out
                    </a>
                  </li>
                  <li>
                    EU users can visit:{' '}
                    <a
                      href="https://www.youronlinechoices.eu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Your Online Choices
                    </a>
                  </li>
                  <li>
                    Learn more:{' '}
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      How Google uses advertising cookies
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong>Note:</strong> If you choose to disable cookies, some features of our website may not
                  function properly. You can manage cookies through your browser settings.
                </p>
              </div>
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
              Last updated: November 9, 2024
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
