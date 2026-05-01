"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchAutocomplete() {
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

  return (
    <div className="relative max-w-xl mx-auto md:mx-0" ref={containerRef}>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Balık, kategori veya yöntem ara..." 
        className="w-full py-3.5 px-4 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg border border-gray-100"
      />
      <div className="absolute right-4 top-3.5 text-gray-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* SONUÇ LİSTESİ */}
      {isOpen && (results.fishes.length > 0 || results.methods.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {results.fishes.length > 0 && (
            <div className="p-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-widest">Balık Türleri</div>
              {results.fishes.map(fish => (
                <Link key={fish.id} href={`/balik/${fish.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                    <img src={fish.cover_image_url || '/no-image.png'} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{fish.name_tr}</span>
                </Link>
              ))}
            </div>
          )}

          {results.methods.length > 0 && (
            <div className="p-2 border-t border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-widest">Balıkçılık Çeşitleri</div>
              {results.methods.map(method => (
                <Link key={method.id} href={`/yontem/${method.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700">🎣 {method.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
