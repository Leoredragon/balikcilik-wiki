"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchAutocomplete from './SearchAutocomplete';

export default function Sidebar({ fishes, methods, equipments }: { fishes: any[], methods: any[], equipments: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Akıllı Akordiyon State'leri (Sadece biri açık kalır)
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  const toggleMain = (section: string) => {
    setOpenMain(prev => prev === section ? null : section);
    setOpenSub(null); // Ana menü değişince alt menüleri de kapat
  };

  const toggleSub = (section: string) => {
    setOpenSub(prev => prev === section ? null : section);
  };

  if (pathname && pathname.startsWith('/admin')) return null;

  // Verileri Türkçe (A-Z) harf sırasına göre dizme fonksiyonu
  const sortTR = (a: any, b: any, key: string) => a[key].localeCompare(b[key], 'tr');

  const freshwater = fishes?.filter(f => f.water_type === 'fresh' || f.water_type === 'both').sort((a,b) => sortTR(a,b,'name_tr')) || [];
  const saltwater = fishes?.filter(f => f.water_type === 'salt' || f.water_type === 'both').sort((a,b) => sortTR(a,b,'name_tr')) || [];
  const sortedMethods = [...(methods || [])].sort((a,b) => sortTR(a,b,'title'));

  // Ekipmanları kategorilerine göre gruplayıp A-Z sırala
  const equipmentCategories: Record<string, any[]> = {};
  const categoryOrder = ['Olta Kamışları', 'Olta Makineleri', 'Suni Yemler', 'İp ve Misinalar', 'Olta İğneleri', 'Olta Aparatları'];
  
  (equipments || []).forEach((e: any) => {
    const cat = e.category_name || 'Diğer';
    if (!equipmentCategories[cat]) equipmentCategories[cat] = [];
    equipmentCategories[cat].push(e);
  });

  Object.keys(equipmentCategories).forEach(cat => {
    equipmentCategories[cat].sort((a, b) => sortTR(a, b, 'title'));
  });

  const sortedEquipCats = categoryOrder.filter(c => equipmentCategories[c]);

  const MenuContent = () => (
    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 scrollbar-hide">

      {/* Masaüstü için Arama Kutusu */}
      <div className="hidden md:block mb-4 px-1">
        <SearchAutocomplete />
      </div>

      <Link href="/" onClick={() => setIsOpen(false)} className={`block px-3 py-2.5 text-sm font-bold transition-colors rounded-lg ${pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
        Ana Sayfa
      </Link>

      {/* --- 1. BALIK TÜRLERİ --- */}
      <div className="border-b border-gray-100 pb-1">
        <button onClick={() => toggleMain('baliklar')} className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-lg transition-colors ${openMain === 'baliklar' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50'}`}>
          <span>Balık Türleri</span>
          <svg className={`w-4 h-4 transition-transform duration-200 ${openMain === 'baliklar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {openMain === 'baliklar' && (
          <div className="ml-4 space-y-1 mt-1">
            {/* Tatlı Su */}
            <button onClick={() => toggleSub('tatliSu')} className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider hover:bg-blue-50/60 rounded-md transition-colors">
              <span>Tatlı Su Balıkları</span>
              <span className="text-base font-light">{openSub === 'tatliSu' ? '−' : '+'}</span>
            </button>
            {openSub === 'tatliSu' && (
              <ul className="ml-3 border-l-2 border-blue-100 pl-3 space-y-0.5">
                {freshwater.map(f => (
                  <li key={f.id}>
                    <Link href={`/balik/${f.slug}`} onClick={() => setIsOpen(false)} className={`block py-1.5 text-sm transition-colors ${pathname === `/balik/${f.slug}` ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}>
                      {f.name_tr}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Tuzlu Su */}
            <button onClick={() => toggleSub('tuzluSu')} className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider hover:bg-blue-50/60 rounded-md transition-colors">
              <span>Tuzlu Su Balıkları</span>
              <span className="text-base font-light">{openSub === 'tuzluSu' ? '−' : '+'}</span>
            </button>
            {openSub === 'tuzluSu' && (
              <ul className="ml-3 border-l-2 border-blue-100 pl-3 space-y-0.5">
                {saltwater.map(f => (
                  <li key={f.id}>
                    <Link href={`/balik/${f.slug}`} onClick={() => setIsOpen(false)} className={`block py-1.5 text-sm transition-colors ${pathname === `/balik/${f.slug}` ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}>
                      {f.name_tr}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* --- 2. BALIKÇILIK ÇEŞİTLERİ --- */}
      <div className="border-b border-gray-100 pb-1">
        <button onClick={() => toggleMain('yontemler')} className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-lg transition-colors ${openMain === 'yontemler' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50'}`}>
          <span>Balıkçılık Çeşitleri</span>
          <svg className={`w-4 h-4 transition-transform duration-200 ${openMain === 'yontemler' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {openMain === 'yontemler' && (
          <ul className="ml-7 border-l-2 border-gray-100 pl-3 mt-1 space-y-0.5">
            {sortedMethods.map(m => (
              <li key={m.id}>
                <Link href={`/yontem/${m.slug}`} onClick={() => setIsOpen(false)} className={`block py-1.5 text-sm transition-colors ${pathname === `/yontem/${m.slug}` ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}>
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- 3. EKİPMAN REHBERİ --- */}
      <div>
        <button onClick={() => toggleMain('ekipmanlar')} className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-lg transition-colors ${openMain === 'ekipmanlar' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50'}`}>
          <span>Ekipman Rehberi</span>
          <svg className={`w-4 h-4 transition-transform duration-200 ${openMain === 'ekipmanlar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {openMain === 'ekipmanlar' && (
          <div className="ml-4 mt-1 space-y-1">
            {sortedEquipCats.map(catName => (
              <div key={catName}>
                <button onClick={() => toggleSub(catName)} className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider hover:bg-blue-50/60 rounded-md transition-colors">
                  <span>{catName}</span>
                  <span className="text-base font-light">{openSub === catName ? '−' : '+'}</span>
                </button>
                {openSub === catName && (
                  <ul className="ml-3 border-l-2 border-blue-100 pl-3 space-y-0.5">
                    {equipmentCategories[catName].map(r => (
                      <li key={r.id}>
                        <Link href={`/ekipman/${r.slug}`} onClick={() => setIsOpen(false)} className={`block py-1.5 text-sm transition-colors ${pathname === `/ekipman/${r.slug}` ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}>
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* MOBİL ÜST BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 mr-2 text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <Link href="/" className="font-bold text-lg text-gray-900 tracking-tight">Balıkçılık Wiki</Link>
        </div>
        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 -mr-2 text-blue-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>

      {/* MOBİL ARAMA (Üstten kayar) */}
      {isSearchOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full bg-white border-b border-gray-200 z-30 p-3 shadow-lg">
          <SearchAutocomplete />
        </div>
      )}

      {/* ARKA PLAN KARARTMASI */}
      {isOpen && <div className="fixed inset-0 bg-gray-900/60 z-50 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
      
      {/* MOBİL SOL ÇEKMECE */}
      <aside className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
          <span className="font-bold text-lg text-blue-600">Menü</span>
          <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <MenuContent />
      </aside>

      {/* MASAÜSTÜ SABİT SOL MENÜ */}
      <aside className="hidden md:flex fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="font-extrabold text-xl text-blue-600 tracking-tight">Balıkçılık Wiki</Link>
        </div>
        <MenuContent />
      </aside>
    </>
  );
}
