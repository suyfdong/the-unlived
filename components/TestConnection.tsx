'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestConnection() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  const testSupabase = async () => {
    setStatus('testing');
    setMessage('Testing Supabase connection...');

    try {
      // Test 1: Check if we can query the public letters table
      const { data, error } = await supabase
        .from('letters_public')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      setStatus('success');
      setMessage('✅ Supabase connected successfully!');
      setDetails({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        tablesAccessible: ['letters_private', 'letters_public'],
        currentRows: data?.length || 0
      });
    } catch (error: any) {
      setStatus('error');
      setMessage('❌ Supabase connection failed');
      setDetails({ error: error.message });
    }
  };

  const testOpenRouter = async () => {
    setStatus('testing');
    setMessage('Testing OpenRouter API...');

    try {
      const response = await fetch('/api/test-openrouter');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'API test failed');
      }

      setStatus('success');
      setMessage('✅ OpenRouter API connected successfully!');
      setDetails(result);
    } catch (error: any) {
      setStatus('error');
      setMessage('❌ OpenRouter API connection failed');
      setDetails({ error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl text-white font-light mb-8 text-center">
          🔧 Connection Test
        </h1>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl text-white mb-4">Supabase Database</h2>
            <button
              onClick={testSupabase}
              disabled={status === 'testing'}
              className="bg-cyan-500 text-black px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {status === 'testing' ? 'Testing...' : 'Test Supabase Connection'}
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl text-white mb-4">OpenRouter API</h2>
            <button
              onClick={testOpenRouter}
              disabled={status === 'testing'}
              className="bg-cyan-500 text-black px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {status === 'testing' ? 'Testing...' : 'Test OpenRouter API'}
            </button>
          </div>

          {message && (
            <div className={`rounded-xl p-6 border ${
              status === 'success' ? 'bg-green-900/20 border-green-500' :
              status === 'error' ? 'bg-red-900/20 border-red-500' :
              'bg-gray-800 border-gray-700'
            }`}>
              <p className="text-white text-lg mb-2">{message}</p>
              {details && (
                <pre className="text-gray-300 text-sm overflow-auto mt-4 bg-black/30 p-4 rounded">
                  {JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
