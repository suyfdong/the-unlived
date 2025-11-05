'use client';

import { useState } from 'react';
import { Download, Copy, Upload, Home, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResultPage() {
  const router = useRouter();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const aiReply = `Dear friend,

I understand why you wrote these words, even if you never sent them. Sometimes the most important conversations are the ones we have with ourselves, in the quiet moments when we finally allow ourselves to feel.

You were brave to put these feelings into words. Not everyone can do that.

What you're feeling is real, and it matters. Whether or not these words ever reach their intended destination, they've already served a purpose—they've given shape to something that was weighing on your heart.

The past is a place we visit, but we don't have to live there. You can hold these memories and still move forward. Both are possible.

Whatever you decide to do with these words, know that writing them was an act of courage.

With understanding,
The Echo`;

  const handleCopy = () => {
    navigator.clipboard.writeText(aiReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    setShowSubmitModal(false);
    setTimeout(() => {
      router.push('/exhibition');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-400 text-sm mb-4">
            ✨ Generated Reply
          </div>
          <h1 className="text-3xl text-white font-light">Your Letter Has Been Answered</h1>
        </div>

        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 shadow-2xl border-4 border-amber-100 mb-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] rounded-3xl"></div>

          <div className="relative">
            <div className="text-amber-900 font-serif leading-relaxed whitespace-pre-line text-lg">
              {aiReply}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-amber-200 text-right text-sm text-amber-700">
            Exhibit #{String(Math.floor(Math.random() * 99999)).padStart(5, '0')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700">
            <Download size={20} />
            Save Image
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
          >
            <Upload size={20} />
            Submit to Exhibition
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/write"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Write Another Letter
          </Link>
          <span className="text-gray-600">•</span>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl text-white font-light mb-4">Submit to Exhibition?</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Only the AI's reply will be publicly shown in the exhibition.
              Your original message remains private and will never be displayed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
