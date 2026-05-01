"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

const inputCls = "w-full p-3 text-base bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500";
const REGIONS = ['Marmara', 'Ege', 'Akdeniz', 'İç Anadolu', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu Anadolu'];

export default function AvlakEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('wiki_articles').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setForm(data); setLoading(false); });
  }, [id]);

  const f = (k: string) => form[k] || '';
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('wiki_articles').update({
      title: form.title,
      subtitle: form.subtitle,
      region: form.region,
      coordinates: form.coordinates,
      best_months: form.best_months,
      content_main: form.content_main,
      content_2: form.content_2,
      is_published: form.is_published,
    }).eq('id', id);
    setSaving(false);
    router.push('/admin/wiki/avlak');
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <AdminNavbar />
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-5 mt-4">
        <div>
          <Link href="/admin/wiki/avlak" className="text-sm text-blue-600 hover:underline">Avlak Noktaları</Link>
          <h2 className="text-xl font-bold text-gray-900 mt-1">{f('title') || 'Avlak Düzenle'}</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Temel Bilgiler</h3>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Nokta Adı *</label>
              <input required className={inputCls} value={f('title')} onChange={e => set('title', e.target.value)} placeholder="Sapanca Gölü" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Alt Başlık</label>
              <input className={inputCls} value={f('subtitle')} onChange={e => set('subtitle', e.target.value)} placeholder="Kuzey Marmara'nın gizli cenneti" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Bölge</label>
                <select className={inputCls} value={f('region')} onChange={e => set('region', e.target.value)}>
                  <option value="">Seçin</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">En İyi Aylar</label>
                <input className={inputCls} value={f('best_months')} onChange={e => set('best_months', e.target.value)} placeholder="Nisan, Mayıs" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Koordinat</label>
              <input className={inputCls} value={f('coordinates')} onChange={e => set('coordinates', e.target.value)} placeholder="40.7090, 30.2640" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">İçerik</h3>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Genel Bilgi (Balıklar, İzin, Notlar)</label>
              <textarea rows={5} className={inputCls} value={f('content_main')} onChange={e => set('content_main', e.target.value)} placeholder="Bu noktada hangi balıklar var, av izni durumu..." />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Ulaşım ve Konaklama</label>
              <textarea rows={3} className={inputCls} value={f('content_2')} onChange={e => set('content_2', e.target.value)} placeholder="En yakın şehir, ulaşım, konaklama önerileri..." />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_published || false} onChange={e => set('is_published', e.target.checked)} className="w-5 h-5 accent-blue-600" />
              <span className="text-sm font-medium text-gray-900">Siteye Yayınla</span>
            </label>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 md:static md:bg-transparent md:border-0 md:p-0 z-20">
            <Link href="/admin/wiki/avlak" className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all">
              Vazgec
            </Link>
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-70">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
