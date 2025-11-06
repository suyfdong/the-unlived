'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { supabase, LetterPublic } from '@/lib/supabase';

interface DetailPageProps {
  id: string;
}

// Helper function to format recipient type for display
const formatRecipientType = (type: string) => {
  const formats: { [key: string]: string } = {
    'lover': 'To a Lover',
    'friend': 'To a Friend',
    'parent': 'To a Parent',
    'past-self': 'To Past Self',
    'no-one': 'To No One',
  };
  return formats[type] || type;
};

// Helper function to get border color
const getBorderColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'lover': 'border-pink-500 text-pink-400',
    'friend': 'border-purple-500 text-purple-400',
    'parent': 'border-green-500 text-green-400',
    'past-self': 'border-cyan-500 text-cyan-400',
    'no-one': 'border-amber-500 text-amber-400',
  };
  return colors[type] || 'border-gray-500 text-gray-400';
};

export default function DetailPage({ id }: DetailPageProps) {
  const [letter, setLetter] = useState<LetterPublic | null>(null);
  const [relatedLetters, setRelatedLetters] = useState<LetterPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadLetter();
  }, [id]);

  const loadLetter = async () => {
    try {
      // Load the specific letter
      const { data: letterData, error: letterError } = await supabase
        .from('letters_public')
        .select('*')
        .eq('id', id)
        .single();

      if (letterError || !letterData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setLetter(letterData);
      setIsLoading(false); // 立即显示主要内容

      // 异步增加浏览次数（不阻塞渲染）
      Promise.resolve(
        supabase
          .from('letters_public')
          .update({ views: (letterData.views || 0) + 1 })
          .eq('id', id)
      ).catch(console.error);

      // 异步加载相关信件（不阻塞渲染）
      Promise.resolve(
        supabase
          .from('letters_public')
          .select('*')
          .eq('recipient_type', letterData.recipient_type)
          .neq('id', id)
          .order('created_at', { ascending: false })
          .limit(3)
      ).then(({ data }) => {
        if (data) setRelatedLetters(data);
      }).catch(console.error);
    } catch (error) {
      console.error('Error loading letter:', error);
      setNotFound(true);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (notFound || !letter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-white mb-4">Letter Not Found</h1>
          <Link href="/exhibition" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Exhibition
          </Link>
        </div>
      </div>
    );
  }

  const displayType = formatRecipientType(letter.recipient_type);
  const borderColor = getBorderColor(letter.recipient_type);
  const formattedDate = new Date(letter.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/exhibition"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Exhibition
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">Exhibit #{letter.exhibit_number}</span>
              <span className={`px-3 py-1 rounded-full text-xs border ${borderColor}`}>
                {displayType}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
          <p className="text-gray-500 text-sm">{formattedDate} · {letter.views} views</p>
        </div>

        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 md:p-16 shadow-2xl border-4 border-amber-100 mb-12">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] rounded-3xl"></div>

          <div className="relative">
            <div className="text-amber-900 font-serif leading-relaxed whitespace-pre-line text-lg">
              {letter.ai_reply}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 mb-12">
          <h3 className="text-white text-lg font-light mb-4">About This Letter</h3>
          <p className="text-gray-400 leading-relaxed">
            This reply was generated by AI in response to an unsent letter. The original message
            remains private and was never stored or displayed. Each letter in this exhibition
            represents a moment of emotional honesty, transformed into art through artificial intelligence.
          </p>
        </div>

        {relatedLetters.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white text-xl font-light mb-6">More Letters Like This</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedLetters.map((relatedLetter) => {
                const preview = relatedLetter.ai_reply.length > 100
                  ? relatedLetter.ai_reply.substring(0, 100) + '...'
                  : relatedLetter.ai_reply;
                const category = formatRecipientType(relatedLetter.recipient_type);

                return (
                  <Link
                    key={relatedLetter.id}
                    href={`/letters/${relatedLetter.id}`}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all text-left group block"
                  >
                    <div className="text-xs text-gray-500 mb-2">Exhibit #{relatedLetter.exhibit_number}</div>
                    <div className="text-xs border border-gray-600 text-gray-400 px-2 py-1 rounded-full inline-block mb-3">
                      {category}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3 group-hover:text-white transition-colors">
                      {preview}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/write"
            className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Write Your Own Letter
          </Link>
        </div>
      </div>
    </div>
  );
}
