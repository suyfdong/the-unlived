import { Heart, Lock, Sparkles, BookOpen } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">The Unlived Project</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A digital museum for emotions that were never expressed,
            conversations that never happened, and moments that slipped away.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                <Heart className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="text-white text-xl font-light mb-3">The Concept</h3>
                <p className="text-gray-400 leading-relaxed">
                  We all carry words we never sent—letters to lost loves, apologies to old friends,
                  conversations with our past selves. The Unlived Project gives these emotions a voice
                  through AI-generated replies, transforming private pain into shared art.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                <Lock className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="text-white text-xl font-light mb-3">Your Privacy</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Your original words remain completely private. They are never stored, displayed,
                  or used for any purpose beyond generating a single AI response.
                </p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    Only AI-generated replies can be shared publicly
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    No tracking, no profiling, no data mining
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    Exhibition submissions are completely anonymous
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                <Sparkles className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="text-white text-xl font-light mb-3">How It Works</h3>
                <div className="space-y-4 text-gray-400">
                  <div>
                    <div className="text-white font-medium mb-1">1. Write</div>
                    <p className="text-sm">Express the words you never sent to someone special, a friend, or your past self.</p>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">2. Receive</div>
                    <p className="text-sm">AI generates a thoughtful reply—closure, perspective, or understanding you might need.</p>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">3. Share (Optional)</div>
                    <p className="text-sm">Submit the AI's response to the public exhibition, where it becomes art.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                <BookOpen className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="text-white text-xl font-light mb-3">Future Exhibitions</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The Unlived Project will expand into new emotional territories:
                </p>
                <div className="space-y-3 text-sm text-gray-400">
                  <div>
                    <span className="text-cyan-400 font-medium">Museum of Lost Days:</span> Upload old photos
                    and receive AI-generated stories about forgotten moments.
                  </div>
                  <div>
                    <span className="text-cyan-400 font-medium">What If You Stayed:</span> Describe a life
                    choice and explore parallel universes of what could have been.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="inline-block px-6 py-3 bg-gray-800 rounded-full border border-gray-700">
            <p className="text-gray-400 text-sm">
              <span className="text-cyan-400 font-medium">847</span> letters answered • <span className="text-cyan-400 font-medium">612</span> exhibited
            </p>
          </div>

          <div>
            <button
              onClick={() => onNavigate('write')}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 rounded-full font-medium text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
            >
              Start Your Letter
            </button>
          </div>

          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Every unsent word deserves to be heard, even if only by yourself.
          </p>
        </div>
      </div>
    </div>
  );
}
