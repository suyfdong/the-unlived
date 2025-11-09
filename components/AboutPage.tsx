'use client';

import { Heart, Lock, Circle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AboutPage() {
  // 页面加载时强制滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">The Unlived Project</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed italic">
            Some words live too long inside us.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {/* Opening Statement - Artistic Typography */}
          <div className="text-center max-w-3xl mx-auto mb-16 px-4">
            <div className="relative px-6 md:px-0">
              {/* Decorative quotes - 移动端缩小 */}
              <div className="absolute -left-2 md:-left-4 -top-4 md:-top-6 text-4xl md:text-6xl text-cyan-400/20 font-serif">"</div>
              <div className="absolute -right-2 md:-right-4 -bottom-4 md:-bottom-6 text-4xl md:text-6xl text-cyan-400/20 font-serif">"</div>

              <p className="text-gray-200 text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 font-serif italic relative">
                The letter you've carried for years
              </p>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
                <span className="text-cyan-400/70 text-sm">to</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/50"></div>
              </div>

              <p className="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-2 font-light">
                the one who left,
              </p>
              <p className="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-2 font-light">
                the one you lost,
              </p>
              <p className="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-10 font-light">
                the you you used to be.
              </p>

              <div className="relative inline-block">
                <p className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-serif italic">
                  This is where those words finally get to exist.
                </p>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* What is this */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-white text-2xl font-light mb-6">What is this?</h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Unlived Project is an anonymous space where you can write what you never said—and receive an AI-generated reply.
              </p>
              <p>
                Not therapy. Not advice. Just... someone listening. Someone answering.
              </p>
            </div>
          </div>

          {/* Who to write to */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-white text-2xl font-light mb-6">You write to:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start gap-3">
                <Heart className="text-cyan-400 mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium text-white mb-1">The ex you never got closure with</div>
                  <p className="text-sm text-gray-400">The words you should have said. The apology that came too late.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-cyan-400 mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium text-white mb-1">The parent you couldn't forgive</div>
                  <p className="text-sm text-gray-400">Complex feelings that deserve to be spoken.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-cyan-400 mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium text-white mb-1">The friend who disappeared</div>
                  <p className="text-sm text-gray-400">Connections that ended without goodbye.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-cyan-400 mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium text-white mb-1">The version of yourself you left behind</div>
                  <p className="text-sm text-gray-400">The person you were before everything changed.</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <Circle className="text-cyan-400 mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium text-white mb-1">No one at all—just the void</div>
                  <p className="text-sm text-gray-400 italic">
                    Sometimes you don't need someone specific to listen. You just need the words to exist somewhere outside your head.
                    Scream into the void. The void screams back—gently.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mt-6 leading-relaxed">
              And AI writes back. Tenderly. Honestly. The way you wish they would have.
            </p>
          </div>

          {/* Why does this exist */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-white text-2xl font-light mb-6">Why does this exist?</h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Because some conversations never happen.
              </p>
              <p>
                Because grief doesn't have an inbox.
              </p>
              <p>
                Because sometimes you need to hear "I'm sorry" or "I forgive you" or "I know"—even if it's not real, even if it's just words on a screen.
              </p>
              <p className="text-gray-400 text-sm pt-4 border-t border-gray-700">
                This is for the letters that live in your notes app. For the drafts you'll never send. For the words that deserve to exist somewhere, even if no one else will ever read them.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                <Lock className="text-cyan-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-2xl font-light mb-4">Your privacy</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your original letter is never shown to anyone. Ever.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Only the AI's reply can be shared in our public exhibition—and only if you choose to submit it.
                </p>
                <div className="space-y-2 text-gray-400 text-sm">
                  <p>We don't track you.</p>
                  <p>We don't train on your words.</p>
                  <p>We don't even ask for your name.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who made this */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-white text-2xl font-light mb-6">Who made this?</h3>
            <p className="text-gray-300 leading-relaxed italic">
              Someone who's written too many unsent letters.
            </p>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="inline-block px-6 py-3 bg-gray-800 rounded-full border border-gray-700">
            <p className="text-gray-400 text-sm">
              <span className="text-cyan-400 font-medium">847</span> letters answered • <span className="text-cyan-400 font-medium">612</span> exhibited
            </p>
          </div>

          <div>
            <Link href="/write">
              <button
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 rounded-full font-medium text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
              >
                Start Your Letter
              </button>
            </Link>
          </div>

          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Every unsent word deserves to be heard, even if only by yourself.
          </p>
        </div>
      </div>
    </div>
  );
}
