"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminNavbar from '@/components/AdminNavbar';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const MONTH_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const scoreColor = (s: number) => {
  if (s >= 80) return 'bg-green-500';
  if (s >= 50) return 'bg-blue-400';
  if (s >= 20) return 'bg-amber-400';
  return 'bg-gray-200';
};

export default function AdminYieldPage() {
  const supabase = createClient();
  const [fishes, setFishes] = useState<any[]>([]);
  const [yields, setYields] = useState<Record<string, Record<number, number>>>({});
  const [selectedFish, setSelectedFish] = useState<any>(null);
  const [scores, setScores] = useState<number[]>(Array(12).fill(0));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('fish').select('id, slug, name_tr, water_type').eq('is_published', true).order('name_tr')
      .then(({ data }) => setFishes(data || []));
  }, []);

  const loadYield = async (fish: any) => {
    setSelectedFish(fish);
    const { data } = await supabase.from('monthly_yield')
      .select('month, yield_score').eq('fish_id', fish.id);
    const arr = Array(12).fill(0);
    (data || []).forEach(r => { arr[r.month - 1] = r.yield_score; });
    setScores(arr);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedFish) return;
    setSaving(true);
    for (let i = 0; i < 12; i++) {
      await supabase.from('monthly_yield').upsert(
        { fish_id: selectedFish.id, month: i + 1, yield_score: scores[i] },
        { onConflict: 'fish_id,month' }
      );
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const filtered = fishes.filter(f =>
    f.name_tr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />
      <div className="p-4 md:p-8 max-w-5xl mx-auto mt-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mevsimsel Verim Yonetimi</h2>
          <p className="text-gray-500 text-sm mt-1">Her balik icin 12 aylik av verimi puanlari (0-100)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SOL — BALIK LİSTESİ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <input
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Balik ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {filtered.map(fish => (
                <button key={fish.id} onClick={() => loadYield(fish)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 text-sm transition-colors
                    ${selectedFish?.id === fish.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <p className="font-medium">{fish.name_tr}</p>
                  <p className="text-xs text-gray-400">{fish.water_type === 'fresh' ? 'Tatlı Su' : fish.water_type === 'salt' ? 'Tuzlu Su' : 'Her İkisi'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* SAG — PUAN EDİTORU */}
          <div className="md:col-span-2">
            {!selectedFish ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex items-center justify-center p-10">
                <p className="text-gray-400 text-sm">Soldan bir balik secin</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">{selectedFish.name_tr}</h3>
                  <button onClick={handleSave} disabled={saving}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'} disabled:opacity-60`}>
                    {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}
                  </button>
                </div>

                {/* GÖRSEL BAR GRAFİĞİ */}
                <div className="grid grid-cols-12 gap-1 h-24 items-end">
                  {scores.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-full rounded-t-sm transition-all ${scoreColor(s)}`}
                        style={{ height: `${Math.max(s, 4)}%`, minHeight: '4px' }} />
                    </div>
                  ))}
                </div>

                {/* AY SLIDERS */}
                <div className="space-y-3">
                  {MONTH_NUMS.map((m, i) => (
                    <div key={m} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500 w-8 text-right">{MONTHS[i]}</span>
                      <div className="flex-1 relative">
                        <input
                          type="range" min="0" max="100" step="5"
                          value={scores[i]}
                          onChange={e => {
                            const arr = [...scores];
                            arr[i] = Number(e.target.value);
                            setScores(arr);
                          }}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                      <span className={`text-xs font-bold w-9 text-center px-1.5 py-0.5 rounded ${scoreColor(scores[i])} text-white`}>
                        {scores[i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ETIKETLER */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> 80-100: Yüksek</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> 50-79: Orta</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> 20-49: Düşük</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" /> 0-19: Pasif</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
