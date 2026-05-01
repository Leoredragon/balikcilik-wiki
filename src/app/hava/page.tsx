"use client";

import { useState, useEffect } from 'react';

const CITIES = [
  { name: 'Istanbul', lat: 41.015, lon: 28.979, fishingNote: 'Bogaz avlanmasi icin ideal' },
  { name: 'Izmir', lat: 38.423, lon: 27.143, fishingNote: 'Ege kiyi balikciligi merkezi' },
  { name: 'Ankara', lat: 39.920, lon: 32.854, fishingNote: 'Kizilirmak barajlari yakin' },
  { name: 'Antalya', lat: 36.900, lon: 30.703, fishingNote: 'Akdeniz spin avcilik' },
  { name: 'Trabzon', lat: 41.002, lon: 39.727, fishingNote: 'Karadeniz hamsi donemi' },
  { name: 'Mugla', lat: 36.855, lon: 28.288, fishingNote: 'Ege kayaliklari cipura' },
];

const FISHING_CONDITIONS: Record<string, { label: string; color: string; description: string }> = {
  Clear:        { label: 'Acik Hava',   color: 'text-green-700 bg-green-50',  description: 'Avcilik icin mukemmel kosullar. Sazan ve levrek aktif.' },
  Clouds:       { label: 'Bulutlu',     color: 'text-blue-700 bg-blue-50',    description: 'Bulutlu hava balik aktivitesi icin idealdir.' },
  Rain:         { label: 'Yagmurlu',    color: 'text-gray-700 bg-gray-100',   description: 'Hafif yagmur sazan icin iyi olabilir.' },
  Drizzle:      { label: 'Cisenti',     color: 'text-teal-700 bg-teal-50',    description: 'Cisenti gun batiminda levrek icin idealdir.' },
  Thunderstorm: { label: 'Firtina',     color: 'text-red-700 bg-red-50',      description: 'Firtinali havada avlanmaktan kazinin!' },
  Snow:         { label: 'Karli',       color: 'text-indigo-700 bg-indigo-50',description: 'Kar altinda buzalti balıkcilik yapilabilir.' },
  Mist:         { label: 'Sisli',       color: 'text-gray-700 bg-gray-100',   description: 'Gorus dusuk, guvenli noktalarda avlanin.' },
};

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather_main: string;
  weather_desc: string;
  pressure: number;
  visibility: number;
  city: string;
  country: string;
}

const windDir = (deg: number) => {
  const dirs = ['K','KKD','KD','DKD','D','DGD','GD','GGD','G','GGB','GB','BGB','B','KBB','KB','KKB'];
  return dirs[Math.round(deg / 22.5) % 16];
};

const pressureInfo = (p: number) => {
  if (p > 1020) return { label: 'Yuksek Basinc', tip: 'Dip baliklari daha aktif. Sazan ve levrek iyi.', color: 'text-green-700' };
  if (p < 1010) return { label: 'Dusuk Basinc',  tip: 'Baliklar daha az aktif olabilir.', color: 'text-amber-700' };
  return { label: 'Normal Basinc', tip: 'Dengeli kosullar, cogu tur aktif.', color: 'text-blue-700' };
};

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

export default function HavaDurumuPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [customCity, setCustomCity] = useState('');
  const [locating, setLocating] = useState(false);

  const fetchWeather = async (lat: number, lon: number, label: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`
      );
      if (!res.ok) throw new Error('Hava durumu alinamadi');
      const d = await res.json();
      setWeather({
        temp: Math.round(d.main.temp),
        feels_like: Math.round(d.main.feels_like),
        humidity: d.main.humidity,
        wind_speed: Math.round(d.wind.speed * 3.6),
        wind_deg: d.wind.deg || 0,
        weather_main: d.weather[0].main,
        weather_desc: d.weather[0].description,
        pressure: d.main.pressure,
        visibility: Math.round((d.visibility || 10000) / 1000),
        city: label || d.name,
        country: d.sys.country,
      });
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const fetchByCity = async () => {
    if (!customCity.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(customCity)}&appid=${API_KEY}&units=metric&lang=tr`
      );
      if (!res.ok) throw new Error('Sehir bulunamadi');
      const d = await res.json();
      setWeather({
        temp: Math.round(d.main.temp),
        feels_like: Math.round(d.main.feels_like),
        humidity: d.main.humidity,
        wind_speed: Math.round(d.wind.speed * 3.6),
        wind_deg: d.wind.deg || 0,
        weather_main: d.weather[0].main,
        weather_desc: d.weather[0].description,
        pressure: d.main.pressure,
        visibility: Math.round((d.visibility || 10000) / 1000),
        city: d.name,
        country: d.sys.country,
      });
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  // Konum al — otomatik olarak sayfa açılınca dene
  const getLocation = () => {
    if (!navigator.geolocation) { setError('Tarayiciniz konum desteklemiyor.'); return; }
    setLocating(true); setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Konumunuz');
      },
      () => {
        setLocating(false);
        // Konum reddedilirse varsayilan Istanbul
        fetchWeather(41.015, 28.979, 'Istanbul');
      },
      { timeout: 8000 }
    );
  };

  // Sayfa yuklenir yuklenmez konum iste
  useEffect(() => { getLocation(); }, []);

  const condition = weather ? (FISHING_CONDITIONS[weather.weather_main] || FISHING_CONDITIONS['Clouds']) : null;
  const pressure = weather ? pressureInfo(weather.pressure) : null;

  const weatherIcon = (main: string) => {
    const icons: Record<string, string> = { Clear: '☀', Clouds: '☁', Rain: '⛆', Drizzle: '⛆', Thunderstorm: '⛈', Snow: '❄', Mist: '≋' };
    return icons[main] || '☁';
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-5">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">Hava ve Su Durumu</h1>
          <p className="text-gray-500 text-sm mt-1">Anlık koşullara göre balıkçılık analizi</p>
        </div>

        {/* KOnum + Sehir Secimi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={getLocation} disabled={locating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locating ? 'Konum Alınıyor...' : 'Konumumu Kullan'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CITIES.map(city => (
              <button key={city.name} onClick={() => { setSelectedCity(city.name); fetchWeather(city.lat, city.lon, city.name); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCity === city.name ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}>
                {city.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input className="flex-1 p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Baska bir sehir..." value={customCity}
              onChange={e => setCustomCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchByCity()} />
            <button onClick={fetchByCity} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-all">Ara</button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm">{error}</div>}

        {(loading || locating) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{locating ? 'Konumunuz alınıyor...' : 'Hava durumu yükleniyor...'}</p>
          </div>
        )}

        {weather && !loading && !locating && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ANA KART */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] rounded-2xl p-6 text-white shadow-xl">
              <p className="text-blue-300 text-sm font-medium mb-1">{weather.city}{weather.country !== 'TR' ? `, ${weather.country}` : ''}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-7xl font-black leading-none">{weather.temp}°</p>
                  <p className="text-blue-200 capitalize mt-1">{weather.weather_desc}</p>
                  <p className="text-blue-300 text-xs mt-0.5">Hissedilen {weather.feels_like}°C</p>
                </div>
                <div className="text-7xl text-blue-300/50 font-light select-none">
                  {weatherIcon(weather.weather_main)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold">{weather.humidity}%</p>
                  <p className="text-blue-300 text-xs mt-0.5">Nem</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{weather.wind_speed}</p>
                  <p className="text-blue-300 text-xs mt-0.5">km/s Rüzgar</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{weather.visibility}</p>
                  <p className="text-blue-300 text-xs mt-0.5">km Görüş</p>
                </div>
              </div>
            </div>

            {/* ANALİZ KARTLARI */}
            <div className="space-y-3">
              {condition && (
                <div className={`p-4 rounded-2xl border ${condition.color}`}>
                  <p className="font-semibold text-sm">{condition.label}</p>
                  <p className="text-xs leading-relaxed mt-1 opacity-80">{condition.description}</p>
                </div>
              )}
              {pressure && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className={`font-semibold text-sm ${pressure.color}`}>{weather.pressure} hPa — {pressure.label}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{pressure.tip}</p>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="font-semibold text-gray-800 text-sm">{weather.wind_speed} km/s — {windDir(weather.wind_deg)} yönü</p>
                <p className="text-gray-500 text-xs mt-1">
                  {weather.wind_speed > 40 ? 'Cok guclu ruzgar — avlanmayin' :
                   weather.wind_speed > 25 ? 'Guclu ruzgar — dikkatli olun' :
                   weather.wind_speed > 10 ? 'Orta ruzgar — genellikle iyi' :
                   'Sakin hava — mukemmel av kosullari'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* REHBER */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-playfair text-lg font-bold text-gray-900 mb-4">Hava Kosullarina Gore Av Rehberi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.values(FISHING_CONDITIONS).map(val => (
              <div key={val.label} className={`p-3 rounded-xl text-xs ${val.color}`}>
                <span className="font-bold">{val.label}:</span> {val.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
