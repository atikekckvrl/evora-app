"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, List, Map as MapIcon, Star, ShieldCheck, ArrowRight, X, MapPin } from "lucide-react";

// Harita bileşenini SSR hatası almamak için dinamik olarak yüklüyoruz
const MapContainer = dynamic(
  () => import("../../components/Map"),
  {
    ssr: false,
    loading: () => <div className="map-loading">Harita Yükleniyor...</div>
  }
);

const ALTIEYLUL_MAHALLELER = [
  "Tüm Mahalleler",
  ...[
    "Bahçelievler", "Plevne", "Hasan Basri Çantay", "Gümüşçeşme",
    "Gündoğan", "Dinkçiler", "Kasaplar", "Yıldız", "Sütlüce",
    "Altıeylül", "Gaziosmanpaşa", "Çınarlıdere", "Aslıhantepe"
  ].sort()
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [viewMode, setViewMode] = useState("split");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Tüm Mahalleler");
  const [mapCenter, setMapCenter] = useState([39.6410, 27.8820]); // Altıeylül Merkez
  const [mapZoom, setMapZoom] = useState(13);
  const [mobileTab, setMobileTab] = useState("list"); // 'list' veya 'map'
  const [allHouses, setAllHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch("/api/houses");
        const data = await res.json();
        if (Array.isArray(data)) setAllHouses(data);
      } catch (err) {
        console.error("Evler yüklenirken hata:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const filteredHouses = allHouses.filter(house => {
    const matchDistrict = (house.location === "Altıeylül" || house.district === "Altıeylül");
    const matchNh = selectedNeighborhood === "Tüm Mahalleler" || house.neighborhood === selectedNeighborhood;
    const matchText = (house.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (house.neighborhood || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (house.street || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (house.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchDistrict && matchNh && matchText;
  });

  const [tempMarker, setTempMarker] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const skipNextSearch = React.useRef(false); // seçim yapıldığında tekrar aramayı engelle

  // Arama mantığı — hem debounce hem Enter'dan çağrılabilir
  const performSearch = React.useCallback(async (query, isManual = false) => {
    if (!query || query.length < 3) return;
    try {
      const district = "Altıeylül";
      const city = "Balıkesir";
      const nhQuery = selectedNeighborhood !== "Tüm Mahalleler" ? `, ${selectedNeighborhood}` : '';

      // Balıkesir il sınırları (viewbox: minLon,minLat,maxLon,maxLat)
      const BALIKESIR_VIEWBOX = '26.5,38.8,28.5,40.5';
      // Sıkı merkez Balıkesir sınırları (koordinat doğrulaması için)
      const BAL_LAT_MIN = 38.8, BAL_LAT_MAX = 40.5;
      const BAL_LON_MIN = 26.5, BAL_LON_MAX = 28.5;
      const isInsideBalikesir = (lat, lon) =>
        lat >= BAL_LAT_MIN && lat <= BAL_LAT_MAX && lon >= BAL_LON_MIN && lon <= BAL_LON_MAX;

      let cleanQ = query
        .replace(/bal[ıi]kesir/gi, '')
        .replace(/alt[ıi]eyl[uü]l/gi, '')
        .replace(/karesi/gi, '')
        .replace(/edremit/gi, '')
        .replace(/bandırma/gi, '')
        .replace(/no\s*:\s*\d+/gi, '')
        .replace(/no\s+\d+/gi, '')
        .trim();
      if (!cleanQ) return;

      const streetNumberMatch = cleanQ.match(/(\d+)\s*(sokak|cadde|sk\.?|cd\.?|bulvar|blv\.?)/i);
      const houseNumberMatch = query.match(/(?:no|numara|num|kap[ıi])\s*[:\-]?\s*(\d+)/i);
      const hasHouseNumber = !!houseNumberMatch;

      let searchUrl;
      if (streetNumberMatch) {
        const streetNo = streetNumberMatch[1];
        const streetTypeRaw = streetNumberMatch[2].toLowerCase();
        const streetType = streetTypeRaw.startsWith('sokak') || streetTypeRaw === 'sk' || streetTypeRaw === 'sk.' ? 'Sokak'
          : streetTypeRaw.startsWith('cad') || streetTypeRaw === 'cd' || streetTypeRaw === 'cd.' ? 'Caddesi' : 'Bulvarı';
        const formattedStreet = `${streetNo}. ${streetType}`;
        const houseParam = hasHouseNumber ? `&housenumber=${encodeURIComponent(houseNumberMatch[1])}` : '';
        // limit=10 ile daha fazla mahalle seçeneği çekiyoruz
        searchUrl = `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(formattedStreet)}&city=${encodeURIComponent(city)}${district ? `&county=${encodeURIComponent(district)}` : ''}${houseParam}&viewbox=${BALIKESIR_VIEWBOX}&bounded=1&limit=10&addressdetails=1`;

        const res = await fetch(searchUrl, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
        const data = await res.json();

        if (data && data.length > 0) {
          // Sadece aranan sokak numarasını içeren sonuçları kabul et ("135" içerenleri bul)
          const exact = data.filter(r => {
            const road = (r.address?.road || r.display_name || '').toLowerCase();
            const lat = parseFloat(r.lat); const lon = parseFloat(r.lon);
            return road.includes(streetNo.toLowerCase()) && isInsideBalikesir(lat, lon);
          });

          if (exact.length > 0) {
            const formatted = exact.map(r => {
              const road = r.address?.road || r.display_name.split(',')[0];
              const suburb = r.address?.suburb || r.address?.neighbourhood || r.address?.quarter || '';
              return {
                display_name: r.display_name,
                main_text: suburb ? `${road} — ${suburb}` : road,
                lat: parseFloat(r.lat), lon: parseFloat(r.lon)
              };
            });

            setSuggestions(formatted);
            setShowSuggestions(true);
            // Her zaman liste aç, kullanıcı seçsin — otomatik uçma yok
          } else {
            // Tam eşleşme yok — yanlış sokağa gitme, listeyi temizle
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setSuggestions([]); setShowSuggestions(false);
        }
        return;
      } else {
        searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + nhQuery + ', ' + district + ', ' + city)}&viewbox=${BALIKESIR_VIEWBOX}&bounded=1&limit=5&addressdetails=1`;
      }

      const res = await fetch(searchUrl, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
      const data = await res.json();

      if (data && data.length > 0) {
        // 1. Amenity filtresi
        // 2. Koordinat doğrulaması — Balıkesir dışındaki sonuçları at
        const inBounds = data.filter(r => {
          const lat = parseFloat(r.lat); const lon = parseFloat(r.lon);
          return isInsideBalikesir(lat, lon) && r.class !== 'amenity';
        });
        const results = (inBounds.length > 0 ? inBounds : data).slice(0, 5);
        const formatted = results.map(r => ({
          display_name: r.display_name,
          main_text: r.address?.road || r.address?.suburb || r.display_name.split(',')[0],
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon)
        }));

        setSuggestions(formatted);
        if (isManual) {
          setShowSuggestions(false);
          setSuggestions([]);
        } else {
          setShowSuggestions(true);
        }

        if (streetNumberMatch && formatted.length > 0) {
          const top = formatted[0];
          setMapCenter([top.lat, top.lon]);
          // Güvenli maksimum zoom: sokak 19, bina 20
          setMapZoom(hasHouseNumber ? 20 : 19);

          setTempMarker({
            id: 'temp',
            title: hasHouseNumber ? `No: ${houseNumberMatch[1]} — ${top.main_text}` : top.main_text,
            location: top.display_name,
            lat: top.lat, lng: top.lon, isTemp: true,
            onDrag: (newLat, newLng) => setTempMarker(prev => prev ? { ...prev, lat: newLat, lng: newLng } : null)
          });
        }
      } else if (hasHouseNumber && streetNumberMatch) {
        const streetNo = streetNumberMatch[1];
        const streetTypeRaw = streetNumberMatch[2].toLowerCase();
        const streetType = streetTypeRaw.startsWith('sokak') || streetTypeRaw === 'sk' ? 'Sokak'
          : streetTypeRaw.startsWith('cad') || streetTypeRaw === 'cd' ? 'Caddesi' : 'Bulvarı';
        const formattedStreet = `${streetNo}. ${streetType}`;
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(formattedStreet)}&city=${encodeURIComponent(city)}${district ? `&county=${encodeURIComponent(district)}` : ''}&limit=1&addressdetails=1`;
        const fallbackRes = await fetch(fallbackUrl, { headers: { 'User-Agent': 'EvoraApp/1.0' } });
        const fallbackData = await fallbackRes.json();
        if (fallbackData && fallbackData.length > 0) {
          const r = fallbackData[0];
          const lat = parseFloat(r.lat); const lon = parseFloat(r.lon);
          setMapCenter([lat, lon]);
          setMapZoom(20); // Güvenli derinlik
          setTempMarker({
            id: 'temp',
            title: `No: ${houseNumberMatch[1]} — ${r.address?.road || formattedStreet}`,
            location: `${r.display_name} (Sürükleyebilirsiniz)`,
            lat, lng: lon, isTemp: true,
            onDrag: (newLat, newLng) => setTempMarker(prev => prev ? { ...prev, lat: newLat, lng: newLng } : null)
          });
          if (isManual) {
            setSuggestions([]); setShowSuggestions(false);
          }
        }
      }
    } catch (err) {
      console.error("Geocoding hatası:", err);
    }
  }, [selectedNeighborhood]);

  // Otomatik Tamamlama - Sokak seviyesinde doğruluk
  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedNeighborhood, performSearch]);

  const handleSelectSuggestion = (s) => {
    skipNextSearch.current = true; // Seçim sonrası aramayı engelle
    const lat = s.lat;
    const lon = s.lon;
    setMapCenter([lat, lon]);
    setMapZoom(20); // Maksimum zoom
    setShowSuggestions(false);
    setSuggestions([]);
    setSearchQuery(s.main_text + ' no:'); // Kullanıcı no: yazabilsin

    setTempMarker({
      id: 'temp',
      title: s.main_text,
      location: s.display_name,
      lat,
      lng: lon,
      isTemp: true,
      onDrag: (newLat, newLng) => {
        setTempMarker(prev => prev ? { ...prev, lat: newLat, lng: newLng } : null);
      }
    });
  };

  // Haritaya tıklayınca iğne bırak
  const handleMapClick = (lat, lng) => {
    setTempMarker({
      id: 'temp',
      title: '📍 Seçilen Konum',
      location: `${lat.toFixed(5)}, ${lng.toFixed(5)} — İşareti sürükleyerek ayarlayabilirsiniz`,
      lat, lng,
      isTemp: true,
      onDrag: (newLat, newLng) => {
        setTempMarker(prev => prev ? { ...prev, lat: newLat, lng: newLng } : null);
      }
    });
  };

  // Haritaya gönderilecek evlere geçici marker'ı ekle
  const mapDisplayHouses = tempMarker ? [...filteredHouses, tempMarker] : filteredHouses;

  // Harita odağı arama yoksa varsayılan Altıeylül merkeze sabit kalır
  useEffect(() => {
    const hasSearch = searchQuery && searchQuery.length > 2;
    if (!hasSearch) {
      setMapCenter([39.6410, 27.8820]);
      setMapZoom(13);
    }
  }, [searchQuery]);

  return (
    <div className="search-layout">
      {/* ... (Header içeriği aynı) ... */}
      <header className="search-header-pro">
        <div className="container-fluid search-nav">
          <div className="search-input-container">
            <div className="search-input-wrapper">
              <MapPin size={18} className="text-gold" />
              <div style={{ fontWeight: 800, color: '#0f172a', marginRight: '5px', fontSize: '0.95rem' }}>Altıeylül</div>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 5px' }}></div>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#0f172a', marginRight: '5px', maxWidth: '150px', cursor: 'pointer' }}
              >
                {ALTIEYLUL_MAHALLELER.map(nh => <option key={nh} value={nh}>{nh}</option>)}
              </select>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1', marginRight: '10px' }}></div>
              <Search size={18} className="text-gold" />
              <input
                type="text"
                placeholder="Bina, sokak veya özellik ara..."
                value={searchQuery}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setShowSuggestions(false);
                    performSearch(searchQuery, true);
                  }
                }}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => { setSearchQuery(""); setTempMarker(null); setShowSuggestions(false); }}>
                  &times;
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown-search">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="suggestion-item-search" onClick={() => handleSelectSuggestion(s)}>
                    <MapPin size={16} className="text-gold" />
                    <div className="suggestion-text">
                      <span className="suggestion-main">{s.main_text}</span>
                      <span className="suggestion-sub">{s.display_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ... (Görünüm butonları aynı) ... */}
          <div className="filter-actions desktop-only">
            <div className="view-selector">
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={18} /></button>
              <button className={`view-btn ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')}><MapIcon size={18} /></button>
            </div>
          </div>
        </div>
      </header>

      <main className={`search-main ${viewMode} tab-${mobileTab}`}>
        <div className="results-panel">
          <div className="results-panel-header">
            <h4>{filteredHouses.length > 0 ? `${filteredHouses.length} İnceleme Bulundu` : `${searchQuery} için henüz inceleme yok`}</h4>
            {filteredHouses.length > 0 && (
              <p className="trust-info-tag">
                <ShieldCheck size={14} color="#10b981" /> <strong>Doğrulanmış</strong> rozetleri, kira belgesi sunan gerçek kiracıları temsil eder.
              </p>
            )}
            {filteredHouses.length === 0 && searchQuery && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                Bu bölgede ilk incelemeyi sen bırakmak ister misin?
              </p>
            )}
          </div>

          <div className="results-scroll">
            {filteredHouses.map((house) => (
              <div key={house.id} className="house-card-pro-search card-lux">
                {/* ... (Kart içeriği aynı) ... */}
                <div className="card-pro-img"></div>
                <div className="card-pro-details">
                  <span className="loc-text">{house.location}</span>
                  <h3>{house.title}</h3>
                  <div className="card-pro-footer">
                    <Link href={`/house/${house.id}`} className="btn-small-pro" style={{ textDecoration: 'none', textAlign: 'center' }}>İncele</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-panel">
          <div style={{
            position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(15,23,42,0.82)', color: 'white', fontSize: '0.72rem',
            fontWeight: 700, padding: '5px 14px', borderRadius: '100px',
            zIndex: 999, pointerEvents: 'none', whiteSpace: 'nowrap', letterSpacing: '0.3px'
          }}>📍 Sokak bulunamıyorsa haritaya tıklayarak konum seçin</div>
          <MapContainer houses={mapDisplayHouses} center={mapCenter} zoom={mapZoom} onMapClick={handleMapClick} />
        </div>
      </main>

      {/* MOBİL TAB SWITCHER */}
      <div className="mobile-tab-bar">
        <button
          className={`mobile-tab ${mobileTab === 'list' ? 'active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          <List size={20} />
          <span>Liste</span>
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'map' ? 'active' : ''}`}
          onClick={() => setMobileTab('map')}
        >
          <MapIcon size={20} />
          <span>Harita</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .search-layout { height: calc(100vh - 70px); display: flex; flex-direction: column; background: #fff; }
        
        .search-header-pro { background: white; border-bottom: 1px solid var(--border); padding: 0.75rem 1.5rem; }
        .search-nav { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
        
        .search-input-container { flex: 1; max-width: 600px; position: relative; }
        .search-input-wrapper { display: flex; align-items: center; gap: 10px; background: var(--accent-soft); padding: 0.6rem 1.2rem; border-radius: 100px; border: 1px solid transparent; transition: 0.3s; }
        .search-input-wrapper:focus-within { border-color: var(--accent); background: white; box-shadow: 0 0 0 4px var(--accent-soft); }
        .search-input-wrapper input { border: none; background: transparent; outline: none; width: 100%; font-weight: 600; font-size: 0.95rem; }
        .text-gold { color: var(--accent); }
        .clear-search-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; padding: 0 0.5rem; line-height: 1; }

        .suggestions-dropdown-search { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: white; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; overflow: hidden; }
        .suggestion-item-search { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; transition: 0.2s; border-bottom: 1px solid #f1f5f9; }
        .suggestion-item-search:last-child { border-bottom: none; }
        .suggestion-item-search:hover { background: #f8fafc; }
        .suggestion-text { display: flex; flex-direction: column; overflow: hidden; }
        .suggestion-main { font-weight: 700; font-size: 0.9rem; color: var(--primary); }
        .suggestion-sub { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .filter-actions { display: flex; align-items: center; gap: 1rem; }
        .btn-filter-pro { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid var(--border); padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-filter-pro:hover { border-color: var(--accent); color: var(--accent); }
        
        .view-selector { display: flex; background: var(--accent-soft); padding: 4px; border-radius: 8px; gap: 4px; }
        .view-btn { padding: 6px 12px; border: none; background: transparent; cursor: pointer; border-radius: 6px; color: var(--text-muted); transition: 0.2s; }
        .view-btn.active { background: white; color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .search-main { flex: 1; display: grid; overflow: hidden; }
        .search-main.split { grid-template-columns: 480px 1fr; }
        .search-main.list { grid-template-columns: 1fr; }
        .search-main.map { grid-template-columns: 0 1fr; }

        .results-panel { overflow-y: auto; border-right: 1px solid var(--border); background: #fdfdfd; }
        .results-panel-header { padding: 1.5rem; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: #fdfdfd; z-index: 5; }
        .trust-info-tag { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #64748b; margin-top: 10px; background: #f0fdf4; padding: 8px 12px; border-radius: 10px; border: 1px solid #dcfce7; }
        .active-filters { display: flex; gap: 8px; margin-top: 1rem; }
        .filter-tag { background: var(--primary); color: white; padding: 4px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }

        .results-scroll { padding: 1.5rem; }
        .house-card-pro-search { display: flex; gap: 1.5rem; background: white; padding: 1rem; margin-bottom: 1.5rem; border: 1px solid var(--border); border-radius: 1.25rem; transition: 0.3s; cursor: pointer; }
        .house-card-pro-search:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: var(--shadow-sm); }
        
        .card-pro-img { width: 140px; height: 140px; background: #f1f5f9; border-radius: 1rem; position: relative; flex-shrink: 0; }
        .badge-verified-sm { position: absolute; top: 6px; left: 6px; background: var(--primary); color: white; font-size: 0.6rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }
        
        .card-pro-details { flex: 1; display: flex; flex-direction: column; }
        .loc-text { font-size: 0.75rem; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
        .card-pro-details h3 { font-size: 1.1rem; margin-bottom: 8px; letter-spacing: -0.4px; }
        
        .rating-row-pro { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .stars-gold { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; }
        .rev-count { font-size: 0.8rem; color: var(--text-muted); }
        
        .card-pro-snippet { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .card-pro-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .price-tag { font-size: 0.75rem; font-weight: 800; color: var(--primary); background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }
        .btn-small-pro { background: var(--primary); color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer; }

        .map-panel { background: #f1f5f9; position: relative; width: 100%; height: 100%; }
        .map-loading { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f8fafc; font-weight: 700; color: var(--text-muted); }

        /* MOBİL TAB BAR */
        .mobile-tab-bar { display: none; }

        @media (max-width: 900px) {
          .search-layout { height: 100dvh; padding-bottom: 64px; }
          .search-main.split { grid-template-columns: 1fr; grid-template-rows: 1fr; position: relative; }
          
          /* Liste ve Harita — display:none KULLANMIYORUZ çünkü Leaflet çöker */
          .search-main .results-panel { flex-direction: column; }
          .search-main .map-panel { position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; }

          /* Liste aktifken: haritayı arka plana at ama boyutunu koru */
          .search-main.tab-list .results-panel { display: flex; position: relative; z-index: 2; }
          .search-main.tab-list .map-panel { visibility: hidden; z-index: 1; }

          /* Harita aktifken: listeyi gizle */
          .search-main.tab-map .results-panel { display: none; }
          .search-main.tab-map .map-panel { visibility: visible; z-index: 2; position: relative; }

          /* Alt Tab Çubuğu */
          .mobile-tab-bar {
            display: flex;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: white;
            border-top: 1px solid var(--border);
            z-index: 100;
            height: 64px;
          }
          .mobile-tab {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            border: none;
            background: transparent;
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--text-muted);
            cursor: pointer;
            transition: 0.2s;
          }
          .mobile-tab.active { color: var(--primary); }
          .mobile-tab.active svg { stroke: var(--primary); }
          .results-header h3 { font-size: 1.2rem; }
        }
      `}} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="map-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>Evora Yükleniyor...</div>}>
      <SearchContent />
    </React.Suspense>
  );
}
