"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SearchAutocomplete({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ fishes: any[], methods: any[] }>({ fishes: [], methods: [] });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } else {
        setResults({ fishes: [], methods: [] });
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const isDark = variant === 'dark';

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Balik, kategori veya yontem ara..."
          className={`w-full py-3.5 px-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-base
            ${isDark
              ? 'bg-white/10 text-white placeholder:text-white/50 border border-white/20 backdrop-blur-sm'
              : 'bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 shadow-sm'
            }`}
        />
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* SONUC LİSTESİ */}
      {isOpen && (results.fishes.length > 0 || results.methods.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {results.fishes.length > 0 && (
            <div className="p-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-widest">Balik Turleri</div>
              {results.fishes.map(fish => (
                <Link key={fish.id} href={`/balik/${fish.slug}`} onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {fish.cover_image_url && <img src={fish.cover_image_url} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{fish.name_tr}</span>
                </Link>
              ))}
            </div>
          )}
          {results.methods.length > 0 && (
            <div className="p-2 border-t border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-widest">Yontemler</div>
              {results.methods.map(method => (
                <Link key={method.id} href={`/yontem/${method.slug}`} onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700">{method.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
