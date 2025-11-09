import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for The Unlived Project - Guidelines for using our service.',
}

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">Terms of Use</h1>

          <div className="max-w-none">
            <p className="text-gray-400 mb-8">
              <strong>Effective Date:</strong> November 7, 2025
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              By using The Unlived Project, you agree to these Terms of Use. Please read them carefully.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">1. The Service</h2>
              <p className="text-gray-300 leading-relaxed">
                We provide a creative experience where you write an unsent letter and receive an AI-generated reply.
                You may optionally submit the AI reply to a public Exhibition for others to view.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">2. Your Submissions & License</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <strong>Do NOT submit:</strong>
                </p>
                <ul className="text-gray-300 space-y-3 list-disc pl-6">
                  <li>Illegal, harmful, or threatening content</li>
                  <li>Personal data of others (names, addresses, phone numbers, email addresses, IDs)</li>
                  <li>Content that violates intellectual property rights</li>
                  <li>Hate speech, harassment, or discriminatory content</li>
                  <li>Spam or misleading information</li>
                </ul>

                <p className="text-gray-300 leading-relaxed mt-4">
                  <strong>Exhibition License:</strong> If you choose to submit an AI reply to the Exhibition, you grant
                  The Unlived Project a <strong>non-exclusive, worldwide, royalty-free, transferable, and sublicensable license</strong> to:
                </p>
                <ul className="text-gray-300 space-y-3 list-disc pl-6">
                  <li>Host, display, and publicly perform the AI reply</li>
                  <li>Adapt, translate, or create derivative works for promotional purposes</li>
                  <li>Use the content in connection with the Project (e.g., social media, press, publications)</li>
                </ul>

                <p className="text-gray-300 leading-relaxed mt-4">
                  You represent that you have the right to grant this license and that the submission does not violate
                  any third-party rights.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">3. Privacy & Data</h2>
              <p className="text-gray-300 leading-relaxed">
                Original letters are processed in-memory to generate one AI reply and are <strong>not stored</strong>.
                Only AI replies you choose to submit to the Exhibition are saved. See our{' '}
                <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                  Privacy Policy
                </a>{' '}
                for details.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">4. Content Moderation</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to refuse, remove, or moderate any submission at our sole discretion, including but
                not limited to content that:
              </p>
              <ul className="text-gray-300 space-y-3 list-disc pl-6 mt-3">
                <li>Violates these Terms or applicable laws</li>
                <li>Contains personal information (doxxing)</li>
                <li>Is inappropriate, offensive, or harmful</li>
                <li>Infringes on third-party rights</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">5. No Professional Advice</h2>
              <p className="text-gray-300 leading-relaxed">
                AI-generated replies are <strong>creative and reflective content only</strong>. They are <strong>NOT</strong>:
              </p>
              <ul className="text-gray-300 space-y-3 list-disc pl-6 mt-3">
                <li>Medical, mental health, or therapeutic advice</li>
                <li>Legal counsel or professional guidance</li>
                <li>A substitute for professional consultation</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                If you are experiencing a crisis or need professional help, please contact qualified professionals
                or crisis hotlines in your area.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">6. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed">
                We use third-party services for hosting, AI processing, analytics, and advertising (e.g., Google AdSense).
                Their respective terms and privacy policies may apply to your use of this service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">7. Age Requirement</h2>
              <p className="text-gray-300 leading-relaxed">
                You must be at least <strong>13 years old</strong> (or the minimum age required in your region) to use this service.
                By using the service, you represent that you meet this age requirement.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">8. Disclaimers & Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-gray-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY,
                OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">9. Changes to These Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update these Terms from time to time. Changes will be posted on this page with an updated
                "Effective Date". Your continued use of the service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">10. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to suspend or terminate your access to the service at any time, for any reason,
                including violation of these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-serif text-white mb-4">11. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about these Terms, please contact us at:{' '}
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
              Last updated: November 7, 2025
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
