'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CleanupPage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    if (!confirm('This will delete duplicate letters. Continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cleanup-duplicates', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Cleanup error:', error);
      setResult({ error: 'Failed to cleanup' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-light mb-8">Clean Up Duplicate Letters</h1>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <p className="text-gray-300 mb-4">
            This will remove duplicate letters from the exhibition. It will keep the newest copy and delete older duplicates.
          </p>
          <button
            onClick={handleCleanup}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Cleaning...' : 'Clean Up Duplicates'}
          </button>
        </div>

        {result && (
          <div className={`rounded-xl p-6 ${result.error ? 'bg-red-900/20 border border-red-500' : 'bg-green-900/20 border border-green-500'}`}>
            <h2 className="text-xl mb-4">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/exhibition" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Exhibition
          </Link>
        </div>
      </div>
    </div>
  );
}
