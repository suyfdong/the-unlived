'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugLetters() {
  const [letters, setLetters] = useState<any[]>([]);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    const { data } = await supabase
      .from('letters_public')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setLetters(data || []);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-8">Debug: Letters in Database</h1>

      {letters.map((letter, idx) => (
        <div key={letter.id} className="mb-8 p-4 bg-gray-900 rounded">
          <div className="text-sm text-gray-400 mb-2">
            #{idx + 1} - Exhibit {letter.exhibit_number} - {letter.recipient_type}
          </div>
          <div className="text-sm text-green-400 mb-2">
            Created: {new Date(letter.created_at).toLocaleString()}
          </div>
          <div className="text-white whitespace-pre-wrap border-t border-gray-700 pt-2">
            {letter.ai_reply}
          </div>
        </div>
      ))}
    </div>
  );
}
