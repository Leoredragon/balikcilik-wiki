"use client";

import { useState, useEffect } from 'react';

/* ─── SABİTLER ─────────────────────────────────────────────── */
const CITIES = [
  { name: 'Istanbul',  lat: 41.0151, lon: 28.9795 },
  { name: 'Izmir',     lat: 38.4237, lon: 27.1428 },
  { name: 'Ankara',    lat: 39.9208, lon: 32.8541 },
  { name: 'Antalya',   lat: 36.8969, lon: 30.7133 },
  { name: 'Trabzon',   lat: 41.0027, lon: 39.7168 },
  { name: 'Mugla',     lat: 37.2153, lon: 28.3636 },
];

const FISHING: Record<string, { label: string; color: string; tip: string }> = {
  Clear:        { label: 'Acik Hava',   color: 'text-green-700 bg-green-50 border-green-100',   tip: 'Mukemmel av kosullari. Sazan, levrek ve cupra aktif.' },
  Clouds:       { label: 'Bulutlu',     color: 'text-blue-700 bg-blue-50 border-blue-100',      tip: 'Bulutlu hava balik aktivitesi icin idealdir.' },
  Rain:         { label: 'Yagmurlu',    color: 'text-slate-700 bg-slate-50 border-slate-100',   tip: 'Hafif yagmur sazan icin olumlu. Firtinada avlanmayin.' },
  Drizzle:      { label: 'Cisenti',     color: 'text-teal-700 bg-teal-50 border-teal-100',      tip: 'Cisenti gun batiminda levrek icin idealdir.' },
  Thunderstorm: { label: 'Firtina',     color: 'text-red-700 bg-red-50 border-red-100',         tip: 'Tehlikeli — kesinlikle avlanmayin!' },
  Snow:         { label: 'Karli',       color: 'text-indigo-700 bg-indigo-50 border-indigo-100',tip: 'Buzalti balikciligi yapilabilir.' },
  Mist:         { label: 'Sisli',       color: 'text-gray-700 bg-gray-100 border-gray-200',     tip: 'Gorus dusuk, guvenli noktalarda avlanin.' },
  Fog:          { label: 'Yogun Sis',   color: 'text-gray-700 bg-gray-100 border-gray-200',     tip: 'Gorus cok dusuk — tekneyle cikmayin.' },
  Haze:         { label: 'Puslu',       color: 'text-amber-700 bg-amber-50 border-amber-100',   tip: 'Orta kosullar. Sabah erken saatler daha iyi.' },
};

const windDir = (deg: number) => {
  const d = ['K','KKD','KD','DKD','D','DGD','GD','GGD','G','GGB','GB','BGB','B','KBB','KB','KKB'];
  return d[Math.round(deg / 22.5) % 16];
};

const pressureInfo = (p: number) => {
  if (p > 1020) return { text: `${p} hPa — Yüksek Basınç`, tip: 'Dip baliklari aktif. Sazan, levrek, çipura için iyi.', cls: 'text-green-700' };
  if (p < 1010) return { text: `${p} hPa — Düşük Basınç`,  tip: 'Baliklar daha az aktif olabilir, yüzey beslenme artar.', cls: 'text-amber-700' };
  return           { text: `${p} hPa — Normal Basınç`,  tip: 'Dengeli kosullar — cogu tür aktif.', cls: 'text-blue-700' };
};

const uviInfo = (uvi: number) => {
  if (uvi >= 8) return { text: 'Cok Yuksek UV', cls: 'text-red-600' };
  if (uvi >= 6) return { text: 'Yuksek UV', cls: 'text-orange-500' };
  if (uvi >= 3) return { text: 'Orta UV', cls: 'text-amber-500' };
  return           { text: 'Dusuk UV', cls: 'text-green-600' };
};

/* ─── CACHE (30 dakika) ─────────────────────────────────────── */
const CACHE_TTL = 30 * 60 * 1000;
const cacheKey = (lat: number, lon: number) => `wx_${lat.toFixed(2)}_${lon.toFixed(2)}`;

function readCache(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function writeCache(key: string, data: any) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

/* ─── INTERFACES ────────────────────────────────────────────── */
interface DailyItem {
  dt: number;
  temp: { min: number; max: number; day: number };
  weather: { main: string; description: string; icon: string }[];
  pop: number;
  humidity: number;
}

interface WeatherState {
  city: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pressure: number;
  visibility: number;
  uvi: number;
  weather_main: string;
  weather_desc: string;
  daily: DailyItem[];
  sunrise: number;
  sunset: number;
}

const API = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

/* ─── ONE CALL 3.0 FETCH ────────────────────────────────────── */
async function fetchOneCall(lat: number, lon: number, cityLabel: string): Promise<WeatherState> {
  const key = cacheKey(lat, lon);
  const cached = readCache(key);
  if (cached) return { ...cached, city: cityLabel || cached.city };

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API}&units=metric&lang=tr`;
  const res = await fetch(url);
  if (!res.ok) {
    // One Call 3.0 abonelik gerektirebilir — 2.5 fallback
    const url25 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric&lang=tr`;
    const res25 = await fetch(url25);
    if (!res25.ok) throw new Error(`API hatası: ${res25.status} — API anahtarını ve aboneliği kontrol edin.`);
    const d = await res25.json();
    const state: WeatherState = {
      city: cityLabel || d.name,
      temp: Math.round(d.main.temp),
      feels_like: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      wind_speed: Math.round(d.wind.speed * 3.6),
      wind_deg: d.wind.deg || 0,
      pressure: d.main.pressure,
      visibility: Math.round((d.visibility || 10000) / 1000),
      uvi: 0,
      weather_main: d.weather[0].main,
      weather_desc: d.weather[0].description,
      daily: [],
      sunrise: d.sys.sunrise,
      sunset: d.sys.sunset,
    };
    writeCache(key, state);
    return state;
  }

  const d = await res.json();
  const cur = d.current;
  const state: WeatherState = {
    city: cityLabel,
    temp: Math.round(cur.temp),
    feels_like: Math.round(cur.feels_like),
    humidity: cur.humidity,
    wind_speed: Math.round(cur.wind_speed * 3.6),
    wind_deg: cur.wind_deg || 0,
    pressure: cur.pressure,
    visibility: Math.round((cur.visibility || 10000) / 1000),
    uvi: Math.round(cur.uvi || 0),
    weather_main: cur.weather[0].main,
    weather_desc: cur.weather[0].description,
    daily: d.daily?.slice(0, 5) || [],
    sunrise: cur.sunrise,
    sunset: cur.sunset,
  };
  writeCache(key, state);
  return state;
}

/* ─── GEOCODİNG API (ücretsiz, limit yok) ───────────────────── */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.length) return null;
    return { lat: data[0].lat, lon: data[0].lon, name: data[0].local_names?.tr || data[0].name };
  } catch { return null; }
}

const fmt = (unix: number) => new Date(unix * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const fmtDay = (unix: number) => new Date(unix * 1000).toLocaleDateString('tr-TR', { weekday: 'short' });

/* ─── SAYFA ─────────────────────────────────────────────────── */
export default function HavaDurumuPage() {
  const [wx, setWx] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [customCity, setCustomCity] = useState('');

  const load = async (lat: number, lon: number, label: string) => {
    setLoading(true); setError('');
    try {
      const data = await fetchOneCall(lat, lon, label);
      setWx(data);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) { load(41.015, 28.979, 'Istanbul'); return; }
    setLocating(true); setError('');
    navigator.geolocation.getCurrentPosition(
      pos => { setLocating(false); load(pos.coords.latitude, pos.coords.longitude, 'Konumunuz'); },
      ()  => { setLocating(false); load(41.015, 28.979, 'Istanbul'); },
      { timeout: 8000 }
    );
  };

  const searchCity = async () => {
    if (!customCity.trim()) return;
    setLoading(true); setError('');
    const geo = await geocodeCity(customCity);
    if (!geo) { setError('Sehir bulunamadi. Farkli bir yazimla deneyin.'); setLoading(false); return; }
    setActiveCity(geo.name);
    load(geo.lat, geo.lon, geo.name);
  };

  useEffect(() => { getLocation(); }, []);

  const fc = wx ? (FISHING[wx.weather_main] || FISHING['Clouds']) : null;
  const pr = wx ? pressureInfo(wx.pressure) : null;
  const uv = wx ? uviInfo(wx.uvi) : null;
  const busy = loading || locating;

  return (
    <main className="min-h-screen bg-[#f8f9fb] pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-5">

        <div>
          <h1 className="font-dm text-2xl md:text-3xl font-bold text-gray-900">Hava ve Su Durumu</h1>
          <p className="text-gray-500 text-sm mt-1">Anlık koşullara göre balıkçılık analizi</p>
        </div>

        {/* KONTROLLER */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <button onClick={getLocation} disabled={busy}
            className="flex items-center gap-2 bg-[#0d1b2a] hover:bg-[#1a2f45] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {locating ? 'Konum aliniyor...' : 'Konumumu Kullan'}
          </button>

          <div className="flex flex-wrap gap-1.5">
            {CITIES.map(c => (
              <button key={c.name} disabled={busy}
                onClick={() => { setActiveCity(c.name); load(c.lat, c.lon, c.name); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-60 ${
                  activeCity === c.name ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}>
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Baska bir sehir yazin..."
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchCity()}
            />
            <button onClick={searchCity} disabled={busy}
              className="px-4 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60">
              Ara
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        {busy && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{locating ? 'Konumunuz aliniyor...' : 'Hava durumu yukleniyor...'}</p>
            <p className="text-gray-300 text-xs mt-1">Veriler 30 dakika onbelleğe alinir</p>
          </div>
        )}

        {wx && !busy && (
          <>
            {/* ANA HAVA KARTI */}
            <div className="bg-gradient-to-br from-[#0d1b2a] to-[#163350] rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-blue-300 text-sm font-medium">{wx.city}</p>
                  <p className="text-6xl md:text-7xl font-black leading-none mt-1">{wx.temp}°C</p>
                  <p className="text-blue-200 capitalize mt-1.5">{wx.weather_desc}</p>
                  <p className="text-blue-300 text-xs mt-0.5">Hissedilen {wx.feels_like}°C</p>
                </div>
                <div className="text-right text-xs text-blue-300/70 space-y-1 mt-1">
                  <p>Gün dogumu {fmt(wx.sunrise)}</p>
                  <p>Gün batimi {fmt(wx.sunset)}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
                {[
                  { val: `${wx.humidity}%`,           lbl: 'Nem' },
                  { val: `${wx.wind_speed} km/s`,      lbl: `Rüzgar ${windDir(wx.wind_deg)}` },
                  { val: `${wx.visibility} km`,         lbl: 'Görüş' },
                  { val: `UV ${wx.uvi}`,               lbl: uv!.text, cls: uv!.cls },
                ].map(i => (
                  <div key={i.lbl} className="text-center">
                    <p className={`text-base font-bold ${i.cls || ''}`}>{i.val}</p>
                    <p className="text-blue-300 text-[10px] mt-0.5 leading-tight">{i.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ANALİZ + TAHMİN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Balıkçılık Analizi */}
              <div className="space-y-3">
                {fc && (
                  <div className={`p-4 rounded-2xl border ${fc.color}`}>
                    <p className="font-bold text-sm">{fc.label}</p>
                    <p className="text-xs leading-relaxed mt-1 opacity-90">{fc.tip}</p>
                  </div>
                )}
                {pr && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className={`font-semibold text-sm ${pr.cls}`}>{pr.text}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{pr.tip}</p>
                  </div>
                )}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="font-semibold text-gray-800 text-sm">
                    {wx.wind_speed} km/s — {windDir(wx.wind_deg)} yönü
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {wx.wind_speed > 40 ? 'Cok guclu — avlanmayin' :
                     wx.wind_speed > 25 ? 'Guclu ruzgar — dikkatli olun' :
                     wx.wind_speed > 10 ? 'Orta ruzgar — genellikle uygun' :
                                          'Sakin hava — mukemmel av kosullari'}
                  </p>
                </div>
              </div>

              {/* 5 Günlük Tahmin */}
              {wx.daily.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">5 Gunluk Tahmin</h3>
                  <div className="space-y-2">
                    {wx.daily.map((day, i) => (
                      <div key={day.dt} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 w-10">{i === 0 ? 'Bug.' : fmtDay(day.dt)}</span>
                        <span className="text-gray-400 text-xs flex-1 mx-2 capitalize line-clamp-1">
                          {day.weather[0].description}
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          {day.pop > 0 && (
                            <span className="text-blue-500">{Math.round(day.pop * 100)}%</span>
                          )}
                          <span className="text-gray-400">{Math.round(day.temp.min)}°</span>
                          <span className="text-gray-900 font-bold">{Math.round(day.temp.max)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Av Rehberi</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>Yuksek basinc (1020+ hPa): Dip baliklari aktif</p>
                    <p>Bulutlu sabah: Levrek ve lufer en iyi</p>
                    <p>Ruzgarsiz akşam: Cupra ve karagoz</p>
                    <p>Yağmur sonrası: Nehirlerde sazan aktif</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hava Tiplerine Gore Rehber */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-dm font-bold text-gray-900 mb-3">Hava Kosullarina Gore Av Rehberi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.values(FISHING).map(v => (
                  <div key={v.label} className={`p-3 rounded-xl text-xs border ${v.color}`}>
                    <span className="font-bold">{v.label}:</span> {v.tip}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
