'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Footer() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@theunlived.art');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <p className="text-white text-sm font-light mb-1">The Unlived Project</p>
            <p className="text-gray-500 text-xs">AI Emotional Museum</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link
              href="/about"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Terms
            </Link>
            <button
              onClick={handleCopyEmail}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm cursor-pointer"
              title="Click to copy email address"
            >
              {emailCopied ? 'Email Copied!' : 'Contact'}
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-gray-500 text-xs">
            © 2025 The Unlived Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
