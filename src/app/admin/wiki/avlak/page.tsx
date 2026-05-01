"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminWikiAvlakPage() {
  const supabase = createClient();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', subtitle: '', region: '', coordinates: '', best_months: '', content_main: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('wiki_articles').select('*').eq('section', 'avlak').order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[ğ]/g, 'g').replace(/[ı]/g, 'i').replace(/[ş]/g, 's').replace(/[ç]/g, 'c').replace(/[ö]/g, 'o').replace(/[ü]/g, 'u');
    await supabase.from('wiki_articles').insert({ ...form, slug, section: 'avlak', is_published: true });
    setForm({ title: '', subtitle: '', region: '', coordinates: '', best_months: '', content_main: '', slug: '' });
    setShowForm(false);
    setSaving(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu avlak noktasını silmek istediğinizden emin misiniz?')) return;
    await supabase.from('wiki_articles').delete().eq('id', id);
    await load();
  };

  const inputCls = "w-full p-3 text-base bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500";
  const REGIONS = ['Marmara', 'Ege', 'Akdeniz', 'İç Anadolu', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu Anadolu'];

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <AdminNavbar />
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-5 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/wiki" className="text-sm text-blue-600 hover:underline">← Wiki</Link>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Avlak Noktaları Yönetimi</h2>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow active:scale-95 transition-all">
            {showForm ? '✕ Kapat' : '+ Yeni Nokta Ekle'}
          </button>
        </div>

        {/* EKLEME FORMU */}
        {showForm && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Yeni Avlak Noktası</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Nokta Adı *</label>
                <input required className={inputCls} value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Sapanca Gölü" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Kısa Açıklama</label>
                <input className={inputCls} value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} placeholder="Kuzey Marmara'nın gizli cenneti" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Bölge</label>
                <select className={inputCls} value={form.region} onChange={e => setForm(p => ({...p, region: e.target.value}))}>
                  <option value="">Seçin</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">En İyi Aylar</label>
                <input className={inputCls} value={form.best_months} onChange={e => setForm(p => ({...p, best_months: e.target.value}))} placeholder="Nisan, Mayıs, Eylül" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Koordinat (GPS)</label>
                <input className={inputCls} value={form.coordinates} onChange={e => setForm(p => ({...p, coordinates: e.target.value}))} placeholder="40.7090, 30.2640" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">URL Slug</label>
                <input className={inputCls} value={form.slug} onChange={e => setForm(p => ({...p, slug: e.target.value}))} placeholder="sapanca-golu (boş bırakılırsa otomatik)" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Detaylı Bilgi (Balıklar, İzin, Notlar)</label>
              <textarea rows={4} className={inputCls} value={form.content_main} onChange={e => setForm(p => ({...p, content_main: e.target.value}))} placeholder="Bu noktada hangi balıklar var, av izni durumu, ulaşım, konaklama önerileri..." />
            </div>
            <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-70">
              {saving ? 'Kaydediliyor...' : '✓ Noktayı Kaydet'}
            </button>
          </form>
        )}

        {/* MEVCUT NOKTALAR LİSTESİ */}
        {loading ? (
          <div className="text-center p-8 text-gray-500">Yükleniyor...</div>
        ) : articles.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 text-gray-400">
            Henüz avlak noktası eklenmemiş. İlk noktayı ekleyin!
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {a.region && <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{a.region}</span>}
                  </div>
                  <p className="font-bold text-gray-900">{a.title}</p>
                  {a.subtitle && <p className="text-sm text-gray-500">{a.subtitle}</p>}
                  {a.best_months && <p className="text-xs text-gray-400 mt-0.5">{a.best_months}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                  <Link href={`/admin/wiki/avlak/${a.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-bold">Düzenle</Link>
                  <button onClick={() => handleDelete(a.id)} className="text-xs text-red-400 hover:text-red-600 font-bold">Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
