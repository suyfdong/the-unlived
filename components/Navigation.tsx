'use client';

import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-black/95 backdrop-blur-md border-b border-cyan-400/20 shadow-lg shadow-cyan-500/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-black font-bold text-xl">U</span>
            </div>
            <span className="text-white text-xl font-light tracking-wider">The Unlived</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                pathname === '/' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/exhibition"
              className={`text-sm transition-colors ${
                pathname === '/exhibition' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              Exhibition
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                pathname === '/about' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              About
            </Link>
          </div>

          <Link
            href="/write"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
          >
            Write a Letter
          </Link>

          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
