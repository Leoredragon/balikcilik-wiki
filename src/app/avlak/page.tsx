"use client";

import { useEffect, useRef, useState } from 'react';

const FISHING_SPOTS = [
  {
    id: 1, name: 'Sapanca Gölü', region: 'Marmara', lat: 40.709, lng: 30.264,
    fish: 'Kızılgöz, Sazan, Yayın, Sudak',
    bestMonths: 'Nisan, Mayıs, Eylül, Ekim',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Kuzey kıyısı tekne ile avlanmaya uygundur. Güney sahilleri kıyı balıkçılığı için ideal.',
    color: '#3b82f6'
  },
  {
    id: 2, name: 'İznik Gölü', region: 'Marmara', lat: 40.434, lng: 29.528,
    fish: 'Levrek, Sazan, Kızılgöz, Yayın',
    bestMonths: 'Mart–Mayıs, Eylül–Kasım',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Türkiye\'nin 5. büyük gölü. Güney sahilleri daha verimlidir.',
    color: '#3b82f6'
  },
  {
    id: 3, name: 'Manyas Gölü (Kuş Cenneti)', region: 'Marmara', lat: 40.214, lng: 27.985,
    fish: 'Sazan, Çapak, Kızılgöz',
    bestMonths: 'Mart, Nisan, Ekim',
    permit: 'Özel izin gerekli - doğal koruma alanı',
    notes: 'Kuş Cenneti Milli Parkı içindedir. Av noktaları sınırlıdır.',
    color: '#ef4444'
  },
  {
    id: 4, name: 'Ege Kıyıları (Çeşme-Kuşadası)', region: 'Ege', lat: 38.324, lng: 26.298,
    fish: 'Çipura, Levrek, Karagöz, Lagos',
    bestMonths: 'Eylül–Kasım, Mart–Mayıs',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Kayalık bölgeler spin ve jig için mükemmel. Sabah erken saatler en verimli dönem.',
    color: '#10b981'
  },
  {
    id: 5, name: 'Küçük Menderes Nehri', region: 'Ege', lat: 37.856, lng: 27.712,
    fish: 'Yayın, Sazan, Sudak',
    bestMonths: 'Mart, Nisan, Mayıs',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Bahar aylarında su seviyesi yüksekken en verimli dönem.',
    color: '#10b981'
  },
  {
    id: 6, name: 'Seyhan Barajı', region: 'Akdeniz', lat: 37.086, lng: 35.402,
    fish: 'Sazan, Levrek, Sudak, Yayın',
    bestMonths: 'Nisan–Haziran, Eylül–Kasım',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Adana yakınında büyük baraj. Tekne avı için uygun.',
    color: '#f59e0b'
  },
  {
    id: 7, name: 'Beyşehir Gölü', region: 'İç Anadolu', lat: 37.672, lng: 31.723,
    fish: 'Sazan, Levrek, Yayın, Dağ Alabalığı',
    bestMonths: 'Nisan–Haziran, Eylül, Ekim',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Türkiye\'nin en büyük tatlı su gölü. Kuzey kıyılar tekne için uygundur.',
    color: '#8b5cf6'
  },
  {
    id: 8, name: 'Eğirdir Gölü', region: 'İç Anadolu', lat: 37.880, lng: 30.863,
    fish: 'Sudak, Sazan, Levrek',
    bestMonths: 'Mart–Mayıs, Ekim–Kasım',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Göl Alabalığı ve Sudak için ünlüdür.',
    color: '#8b5cf6'
  },
  {
    id: 9, name: 'Uzungöl', region: 'Karadeniz', lat: 40.614, lng: 40.296,
    fish: 'Dağ Alabalığı, Dere Alabalığı',
    bestMonths: 'Nisan–Eylül',
    permit: 'Bölgesel izin gerekli',
    notes: 'Karadeniz\'in efsanevi alabalık vadisi. Fly fishing için mükemmel.',
    color: '#06b6d4'
  },
  {
    id: 10, name: 'Kızılırmak Deltası', region: 'Karadeniz', lat: 41.691, lng: 35.956,
    fish: 'Sazan, Yayın, Yılan Balığı',
    bestMonths: 'Mart–Mayıs, Eylül–Kasım',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Nehir ağzı ve lagünler zengin balık çeşitliliği sunar.',
    color: '#06b6d4'
  },
  {
    id: 11, name: 'Çıldır Gölü', region: 'Doğu Anadolu', lat: 41.075, lng: 43.028,
    fish: 'Sazan, Yayın, Turna',
    bestMonths: 'Ocak–Şubat (Buz altı), Temmuz–Ağustos',
    permit: 'Amatör ruhsat gerekli',
    notes: 'Kışın buz tuttuğunda buzaltı balıkçılığıyla meşhur!',
    color: '#ec4899'
  },
  {
    id: 12, name: 'Van Gölü', region: 'Doğu Anadolu', lat: 38.564, lng: 42.891,
    fish: 'İnci Kefali (Endemik)',
    bestMonths: 'Mayıs–Temmuz (inci kefali göçü)',
    permit: 'Özel izin - kısıtlı avcılık',
    notes: 'Dünyanın en büyük alkali gölü. İnci Kefali nesli tehlike altında. Manzarası muhteşem.',
    color: '#ec4899'
  },
];

const REGIONS = ['Tümü', 'Marmara', 'Ege', 'Akdeniz', 'İç Anadolu', 'Karadeniz', 'Doğu Anadolu'];
const REGION_COLORS: Record<string, string> = {
  'Marmara': '#3b82f6', 'Ege': '#10b981', 'Akdeniz': '#f59e0b',
  'İç Anadolu': '#8b5cf6', 'Karadeniz': '#06b6d4', 'Doğu Anadolu': '#ec4899'
};

export default function AvlakHaritasiPage() {
  const mapRef = useRef<any>(null);
  const mapInstance = useRef<any>(null);
  const [selectedSpot, setSelectedSpot] = useState<typeof FISHING_SPOTS[0] | null>(null);
  const [activeRegion, setActiveRegion] = useState('Tümü');

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstance.current) return;

    import('leaflet').then(L => {
      // Fix Leaflet default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!).setView([39.0, 35.0], 6);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
      }).addTo(map);

      FISHING_SPOTS.forEach(spot => {
        const color = REGION_COLORS[spot.region] || '#3b82f6';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);cursor:pointer"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedSpot(spot);
          map.setView([spot.lat, spot.lng], 9, { animate: true });
        });
        marker.bindTooltip(spot.name, { permanent: false, direction: 'top', offset: [0, -8] });
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const filtered = activeRegion === 'Tümü' ? FISHING_SPOTS : FISHING_SPOTS.filter(s => s.region === activeRegion);

  const handleSpotClick = (spot: typeof FISHING_SPOTS[0]) => {
    setSelectedSpot(spot);
    if (mapInstance.current) {
      mapInstance.current.setView([spot.lat, spot.lng], 9, { animate: true });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-md mx-auto md:max-w-6xl p-4 md:p-8 mt-4 space-y-5">

        {/* BAŞLIK */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">🗺️ Avlak Noktaları</h1>
          <p className="text-gray-500 text-sm mt-1">Türkiye genelinde en iyi balıkçılık noktaları</p>
        </div>

        {/* BÖLGE FİLTRE */}
        <div className="flex gap-2 flex-wrap">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setActiveRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeRegion === r ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* HARİTA */}
          <div className="md:col-span-2">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
            <div ref={mapRef} className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md" style={{ height: '450px' }} />
            <p className="text-xs text-gray-400 text-center mt-2">Haritada noktaya tıklayarak detayları görün</p>
          </div>

          {/* LİSTE + DETAY */}
          <div className="space-y-3">
            {/* SEÇİLİ NOKTA DETAYI */}
            {selectedSpot && (
              <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white mb-1 inline-block" style={{ background: REGION_COLORS[selectedSpot.region] || '#3b82f6' }}>{selectedSpot.region}</span>
                    <h3 className="font-bold text-gray-900 text-base">{selectedSpot.name}</h3>
                  </div>
                  <button onClick={() => setSelectedSpot(null)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p><span className="font-semibold text-gray-700">🐟 Balıklar:</span> <span className="text-gray-600">{selectedSpot.fish}</span></p>
                  <p><span className="font-semibold text-gray-700">📅 En İyi:</span> <span className="text-gray-600">{selectedSpot.bestMonths}</span></p>
                  <p><span className="font-semibold text-gray-700">📋 İzin:</span> <span className="text-gray-600">{selectedSpot.permit}</span></p>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded-lg text-xs leading-relaxed">{selectedSpot.notes}</p>
                </div>
              </div>
            )}

            {/* NOKTA LİSTESİ */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filtered.map(spot => (
                <button key={spot.id} onClick={() => handleSpotClick(spot)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedSpot?.id === spot.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: REGION_COLORS[spot.region] || '#3b82f6' }} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{spot.name}</p>
                      <p className="text-xs text-gray-500">{spot.fish.split(',')[0]}...</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RENK AÇIKLAMASI */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Bölge Renkleri</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(REGION_COLORS).map(([region, color]) => (
              <span key={region} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
                {region}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
