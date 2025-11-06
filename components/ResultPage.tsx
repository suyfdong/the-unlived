'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Copy, Upload, Home, Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

// 打字机动画组件
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // 每30ms显示一个字符
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, text, onComplete]);

  return (
    <div className="text-amber-900 font-serif leading-relaxed whitespace-pre-line text-lg">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-amber-900 ml-1 animate-pulse" />
      )}
    </div>
  );
}

interface LetterResult {
  letterId: string;
  aiReply: string;
  recipientType: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letterData, setLetterData] = useState<LetterResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exhibitNumber, setExhibitNumber] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const letterCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get the result from sessionStorage
    const storedResult = sessionStorage.getItem('letterResult');
    if (storedResult) {
      const data = JSON.parse(storedResult);
      setLetterData(data);
      // Generate a random exhibit number for display
      setExhibitNumber(String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0'));
    } else {
      // If no data, redirect to write page
      router.push('/write');
    }
  }, [router]);

  const handleCopy = () => {
    if (letterData) {
      navigator.clipboard.writeText(letterData.aiReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveImage = async () => {
    if (!letterCardRef.current || !typingComplete) return;

    try {
      const canvas = await html2canvas(letterCardRef.current, {
        backgroundColor: null,
        scale: 2, // 提高清晰度
        logging: false,
      });

      // 转换为图片并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `letter-${exhibitNumber}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!letterData || hasSubmitted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-to-exhibition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterId: letterData.letterId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if already submitted
        if (data.alreadyPublished) {
          alert('This letter has already been submitted to the exhibition.');
          setHasSubmitted(true);
          setShowSubmitModal(false);
          return;
        }
        throw new Error(data.error || 'Failed to submit to exhibition');
      }

      setHasSubmitted(true);
      setShowSubmitModal(false);

      // Clear the session storage
      sessionStorage.removeItem('letterResult');

      // Redirect to the exhibition
      setTimeout(() => {
        router.push('/exhibition');
      }, 500);
    } catch (error: any) {
      console.error('Submit error:', error);
      alert(error.message || 'Failed to submit to exhibition. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!letterData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-400 text-sm mb-4">
            {typingComplete ? '✨ Reply Complete' : '✍️ Words are taking shape...'}
          </div>
          <h1 className="text-3xl text-white font-light">Your Letter Has Been Answered</h1>
        </div>

        <div
          ref={letterCardRef}
          className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 shadow-2xl border-4 border-amber-100 mb-8"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] rounded-3xl"></div>

          <div className="relative">
            <TypewriterText
              text={letterData.aiReply}
              onComplete={() => setTypingComplete(true)}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-amber-200 text-right text-sm text-amber-700">
            Exhibit #{exhibitNumber}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleCopy}
            disabled={!typingComplete}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button
            onClick={handleSaveImage}
            disabled={!typingComplete}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            Save Image
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={!typingComplete || isSubmitting || hasSubmitted}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            {hasSubmitted ? 'Already Submitted' : isSubmitting ? 'Submitting...' : 'Submit to Exhibition'}
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
                disabled={isSubmitting}
                className="flex-1 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
