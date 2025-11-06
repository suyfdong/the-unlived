import Navigation from '@/components/Navigation'

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-amber-100 mb-4">
              Privacy & How It Works
            </h1>
            <p className="text-slate-400 text-lg">
              Your privacy is at the core of The Unlived Project
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                Your Input Stays Private
              </h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  <strong className="text-amber-200">Your original message is never displayed or stored in any public area.</strong>
                </p>
                <p>
                  When you write an unsent letter, your words remain completely private.
                  We store them securely in a private database that only you (and our AI) can access during generation.
                </p>
                <p>
                  We never train models on your input. We never analyze your content.
                  Your message exists only to generate a one-time AI reply.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                Only AI Replies Can Be Shared
              </h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  If you choose to submit your letter to the exhibition, <strong className="text-amber-200">only the AI-generated reply is made public</strong>.
                </p>
                <p>
                  Your original words remain hidden. The exhibition wall shows anonymous AI responses only—
                  like reading letters from strangers in a museum, without knowing who wrote to them.
                </p>
                <p>
                  Each exhibited letter gets a random exhibit number (like #01234) with no connection to your identity.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-3">
                <span className="text-3xl">🎭</span>
                Complete Anonymity
              </h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  We don't require accounts, emails, or any personal information to use The Unlived Project.
                </p>
                <p>
                  Exhibition submissions are completely anonymous. There's no way to trace a public AI reply back to who wrote the original message.
                </p>
                <p>
                  We don't track user behavior, link IP addresses to submissions, or create user profiles.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-3">
                <span className="text-3xl">🗑️</span>
                Data Handling
              </h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  <strong className="text-amber-200">Private storage:</strong> Your original messages are stored in a separate,
                  private database table with strict access controls.
                </p>
                <p>
                  <strong className="text-amber-200">Public exhibition:</strong> Only AI replies you choose to submit
                  are copied to the public exhibition database—without any identifying information.
                </p>
                <p>
                  <strong className="text-amber-200">No resale:</strong> We never sell, trade, or share your data with third parties.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                What We Do Collect
              </h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  To improve the experience, we collect minimal, anonymous analytics:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Which recipient types are most popular (e.g., "To a Lover" vs "To Past Self")</li>
                  <li>How many letters are generated vs. submitted to exhibition</li>
                  <li>Page views and basic site performance metrics</li>
                </ul>
                <p className="text-sm text-slate-400 mt-4">
                  None of this data is linked to individual users or their letter content.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-serif text-amber-100 mb-4 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Questions?
              </h2>
              <div className="text-slate-300 leading-relaxed">
                <p>
                  If you have any questions about privacy or how your data is handled,
                  feel free to reach out. This project was built with emotional safety and privacy as the foundation.
                </p>
                <p className="mt-4 text-sm text-slate-400">
                  Last updated: November 2024
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500/50 text-amber-100 rounded-full font-medium transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
