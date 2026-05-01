"use client";

import { useState, useEffect } from 'react';

const CITIES = [
  { name: 'İstanbul', lat: 41.015, lon: 28.979, fishingNote: 'Boğaz avlanması için ideal' },
  { name: 'İzmir', lat: 38.423, lon: 27.143, fishingNote: 'Ege kıyı balıkçılığı merkezi' },
  { name: 'Ankara', lat: 39.920, lon: 32.854, fishingNote: 'Kızılırmak barajları yakın' },
  { name: 'Antalya', lat: 36.900, lon: 30.703, fishingNote: 'Akdeniz spin avcılığı' },
  { name: 'Trabzon', lat: 41.002, lon: 39.727, fishingNote: 'Karadeniz hamsi dönemi' },
  { name: 'Muğla (Marmaris)', lat: 36.855, lon: 28.288, fishingNote: 'Ege kayalıkları çipura' },
];

const FISHING_CONDITIONS: Record<string, { label: string; color: string; description: string }> = {
  Clear: { label: 'Açık Hava', color: 'text-green-600 bg-green-50', description: 'Avcılık için mükemmel koşullar.' },
  Clouds: { label: 'Bulutlu', color: 'text-blue-600 bg-blue-50', description: 'Bulutlu hava balık aktivitesi için iyidir.' },
  Rain: { label: 'Yağmurlu', color: 'text-gray-600 bg-gray-100', description: 'Hafif yağmur sazan için iyi olabilir.' },
  Drizzle: { label: 'Çisenti', color: 'text-teal-600 bg-teal-50', description: 'Çisenti gün batımında levrek için idealdir.' },
  Thunderstorm: { label: 'Fırtına', color: 'text-red-600 bg-red-50', description: 'Fırtınalı havada avlanmaktan kaçının!' },
  Snow: { label: 'Karlı', color: 'text-indigo-600 bg-indigo-50', description: 'Kar altında buzaltı balıkçılığı yapılabilir.' },
  Mist: { label: 'Sisli', color: 'text-gray-600 bg-gray-100', description: 'Görüş düşük, güvenli noktalarda avlanın.' },
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

const windDirection = (deg: number) => {
  const dirs = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'KBB', 'KB', 'KKB'];
  return dirs[Math.round(deg / 22.5) % 16];
};

const pressureEffect = (p: number) => {
  if (p > 1020) return { label: 'Yüksek Basınç', tip: 'Dip balıkları daha aktif. Sazan ve levrek iyi.', color: 'text-green-700' };
  if (p < 1010) return { label: 'Düşük Basınç', tip: 'Balıklar daha az aktif olabilir.', color: 'text-amber-700' };
  return { label: 'Normal Basınç', tip: 'Dengeli koşullar, çoğu tür aktif.', color: 'text-blue-700' };
};

export default function HavaDurumuPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [customCity, setCustomCity] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  const fetchWeather = async (lat: number, lon: number, label: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`
      );
      if (!res.ok) throw new Error('Hava durumu alınamadı');
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6),
        wind_deg: data.wind.deg || 0,
        weather_main: data.weather[0].main,
        weather_desc: data.weather[0].description,
        pressure: data.main.pressure,
        visibility: Math.round((data.visibility || 10000) / 1000),
        city: label,
        country: data.sys.country,
      });
    } catch (e: any) {
      setError(e.message || 'Hata oluştu');
    }
    setLoading(false);
  };

  const fetchByCity = async () => {
    if (!customCity.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(customCity)}&appid=${API_KEY}&units=metric&lang=tr`
      );
      if (!res.ok) throw new Error('Şehir bulunamadı');
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6),
        wind_deg: data.wind.deg || 0,
        weather_main: data.weather[0].main,
        weather_desc: data.weather[0].description,
        pressure: data.main.pressure,
        visibility: Math.round((data.visibility || 10000) / 1000),
        city: data.name,
        country: data.sys.country,
      });
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon, selectedCity.name);
  }, [selectedCity]);

  const condition = weather ? (FISHING_CONDITIONS[weather.weather_main] || FISHING_CONDITIONS['Clouds']) : null;
  const pressure = weather ? pressureEffect(weather.pressure) : null;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-8 mt-4 space-y-5">

        {/* BAŞLIK */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">🌤️ Hava & Su Durumu</h1>
          <p className="text-gray-500 text-sm mt-1">Hangi hava koşullarında hangi balık avlanır?</p>
        </div>

        {/* ŞEHİR SEÇİMİ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {CITIES.map(city => (
              <button key={city.name} onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCity.name === city.name ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                {city.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 p-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Başka bir şehir ara..."
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchByCity()}
            />
            <button onClick={fetchByCity} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 active:scale-95 transition-all">Ara</button>
          </div>
        </div>

        {/* HAVA DURUMU KARTI */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Hava durumu yükleniyor...</p>
          </div>
        )}
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm">{error}</div>}

        {weather && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ANA KART */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-blue-200 text-sm font-medium">{weather.city}, {weather.country}</p>
                  <p className="text-7xl font-black mt-1 leading-none">{weather.temp}°</p>
                  <p className="text-blue-100 capitalize mt-1">{weather.weather_desc}</p>
                  <p className="text-blue-200 text-xs mt-0.5">Hissedilen: {weather.feels_like}°C</p>
                </div>
                <div className="text-6xl">
                  {weather.weather_main === 'Clear' ? '☀️' :
                    weather.weather_main === 'Clouds' ? '☁️' :
                    weather.weather_main === 'Rain' ? '🌧️' :
                    weather.weather_main === 'Thunderstorm' ? '⛈️' :
                    weather.weather_main === 'Snow' ? '❄️' : '🌫️'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-400/40">
                <div className="text-center">
                  <p className="text-2xl font-bold">{weather.humidity}%</p>
                  <p className="text-blue-200 text-xs">Nem</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{weather.wind_speed}</p>
                  <p className="text-blue-200 text-xs">km/s Rüzgar</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{weather.visibility} km</p>
                  <p className="text-blue-200 text-xs">Görüş</p>
                </div>
              </div>
            </div>

            {/* BALIKÇILIK ANALİZİ */}
            <div className="space-y-4">
              {/* Hava Analizi */}
              <div className={`p-4 rounded-2xl border ${condition?.color} border-current border-opacity-20`}>
                <h3 className="font-bold text-sm mb-1">{condition?.label}</h3>
                <p className="text-xs leading-relaxed">{condition?.description}</p>
              </div>

              {/* Balık Tavsiyesi */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-2">🎣 Av Tavsiyesi</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{selectedCity.fishingNote}</p>
              </div>

              {/* Basınç */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-2">🌡️ Hava Basıncı</h3>
                <p className={`font-bold text-sm ${pressure?.color}`}>{weather.pressure} hPa — {pressure?.label}</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{pressure?.tip}</p>
              </div>

              {/* Rüzgar */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-2">💨 Rüzgar Analizi</h3>
                <p className="font-bold text-gray-700 text-sm">{weather.wind_speed} km/s — {windDirection(weather.wind_deg)} yönü</p>
                <p className="text-gray-500 text-xs mt-1">
                  {weather.wind_speed > 40 ? '⛔ Çok güçlü rüzgar — avlanmayın' :
                    weather.wind_speed > 25 ? '⚠️ Güçlü rüzgar — dikkatli olun' :
                    weather.wind_speed > 10 ? '✅ Orta rüzgar — genellikle iyi' :
                    '✅ Sakin hava — mükemmel av koşulları'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GENEL İPUÇLARI */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 text-base mb-4">📋 Hava Koşullarına Göre Av Rehberi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(FISHING_CONDITIONS).map(([key, val]) => (
              <div key={key} className={`p-3 rounded-xl text-sm ${val.color}`}>
                <span className="font-bold">{val.label}:</span> {val.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
