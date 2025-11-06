'use client';

import { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 沉浸式等待文案
const loadingMessages = [
  "Someone is writing back to you...",
  "The reply is finding its words...",
  "The silence is turning into words...",
  "A response is taking shape...",
  "Words are being chosen carefully...",
];

export default function WritePage() {
  const router = useRouter();
  const [letterText, setLetterText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // 轮换加载文案
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000); // 每3秒切换一次

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!letterText.trim() || !recipient) return;

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userText: letterText,
          recipientType: recipient,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reply');
      }

      // Store the result in sessionStorage to pass to result page
      sessionStorage.setItem('letterResult', JSON.stringify({
        letterId: data.letterId,
        aiReply: data.aiReply,
        recipientType: data.recipientType,
      }));

      router.push('/result');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsGenerating(false);
    }
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

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

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

      {/* 加载动画覆盖层 */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
          >
            <div className="text-center max-w-md px-6">
              {/* 动画光环 */}
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30" />
                <motion.div
                  className="absolute inset-2 rounded-full border-4 border-cyan-400/50"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-4 border-amber-400/50"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-cyan-400" size={32} />
                </div>
              </motion.div>

              {/* 轮换文案 */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl text-white font-light mb-2"
                >
                  {loadingMessages[loadingMessageIndex]}
                </motion.p>
              </AnimatePresence>

              <motion.div
                className="flex justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-cyan-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
