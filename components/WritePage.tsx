'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const router = useRouter();
  const [letterText, setLetterText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!letterText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      router.push('/result');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-cyan-400 mb-4">
            <Sparkles size={20} />
            <span className="text-sm uppercase tracking-wider">Unsent Letters</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Write Your Unsent Letter
          </h1>
          <p className="text-gray-400 text-lg">
            Your words remain private forever. Only the AI's reply can be shared.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-3 font-light">To whom?</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="">Select a recipient</option>
                <option value="lover">To a Lover</option>
                <option value="friend">To a Friend</option>
                <option value="parent">To a Parent</option>
                <option value="past-self">To Past Self</option>
                <option value="no-one">To No One</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm mb-3 font-light">Your Unsent Words</label>
              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Write the words you never sent..."
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700 focus:border-cyan-400 focus:outline-none transition-colors min-h-[300px] resize-none font-light leading-relaxed"
              />
              <div className="mt-2 text-xs text-gray-500 text-right">
                {letterText.length} characters
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400 leading-relaxed">
                🔒 <span className="text-cyan-400">Privacy guarantee:</span> Your original message will remain private forever.
                It will not be stored, displayed, or used for any purpose other than generating a single AI response.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!letterText.trim() || !recipient || isGenerating}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-4 rounded-xl font-medium text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="animate-spin" size={20} />
                  Generating Reply...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Generate Reply
                </>
              )}
            </button>

            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            The AI will write a reply in the voice of closure, understanding, or perspective.
            It's not about accuracy—it's about what you need to hear.
          </p>
        </div>
      </div>
    </div>
  );
}
