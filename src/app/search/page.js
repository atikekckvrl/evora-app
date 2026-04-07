"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Search, Filter, List, Map as MapIcon, Star, ShieldCheck, ArrowRight, X } from "lucide-react";

// Harita bileşenini SSR hatası almamak için dinamik olarak yüklüyoruz
const MapContainer = dynamic(
  () => import("./MapComponent"),
  { 
    ssr: false,
    loading: () => <div className="map-loading">Harita Yükleniyor...</div>
  }
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [viewMode, setViewMode] = useState("split");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [mapCenter, setMapCenter] = useState([39.0, 35.0]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mobileTab, setMobileTab] = useState("list"); // 'list' veya 'map'

  const allHouses = [
    { id: 1, title: "Moda Modern Rezidans", location: "Kadıköy, İstanbul", rating: 4.8, reviews: 24, price: "Verified", lat: 41.0082, lng: 28.9784 },
    { id: 2, title: "Cihangir Boğaz Manzaralı", location: "Beyoğlu, İstanbul", rating: 4.5, reviews: 18, price: "Verified", lat: 41.0120, lng: 28.9850 },
    { id: 3, title: "Beşiktaş Merkez Daire", location: "Beşiktaş, İstanbul", rating: 4.2, reviews: 32, price: "Top Choice", lat: 41.0422, lng: 29.0074 },
    { id: 4, title: "Manisa Merkez Yaşam Konutları", location: "Şehzadeler, Manisa", rating: 4.9, reviews: 12, price: "New Listing", lat: 38.6191, lng: 27.4289 },
    { id: 5, title: "Yunusemre Lüks Site", location: "Yunusemre, Manisa", rating: 4.7, reviews: 5, price: "Verified", lat: 38.6140, lng: 27.3800 },
  ];

  const filteredHouses = allHouses.filter(house => 
    house.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    house.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dinamik Şehir Bulma (Geocoding)
  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          // Daha spesifik bir arama için sorguyu güçlendiriyoruz
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&city=${searchQuery}&country=Turkey&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            const newLat = parseFloat(data[0].lat);
            const newLon = parseFloat(data[0].lon);
            
            if (!isNaN(newLat) && !isNaN(newLon)) {
              setMapCenter([newLat, newLon]);
              setMapZoom(13);
            }
          }
        } catch (err) {
          console.error("Konum bulunamadı:", err);
        }
      }, 400); // Gecikmeyi daha da azalttım

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  return (
    <div className="search-layout">
      {/* ... (Header içeriği aynı) ... */}
      <header className="search-header-pro">
        <div className="container-fluid search-nav">
          <div className="search-input-wrapper">
            <Search size={18} className="text-gold" />
            <input 
              type="text" 
              placeholder="Şehir veya semt ara (Örn: Ankara)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            {filteredHouses.length === 0 && searchQuery && (
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px'}}>
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
                    <button className="btn-small-pro">İncele</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-panel">
          <MapContainer houses={filteredHouses} center={mapCenter} zoom={mapZoom} />
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

      <style dangerouslySetInnerHTML={{ __html: `
        .search-layout { height: calc(100vh - 70px); display: flex; flex-direction: column; background: #fff; }
        
        .search-header-pro { background: white; border-bottom: 1px solid var(--border); padding: 0.75rem 1.5rem; }
        .search-nav { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
        
        .search-input-wrapper { flex: 1; max-width: 600px; display: flex; align-items: center; gap: 10px; background: var(--accent-soft); padding: 0.6rem 1.2rem; border-radius: 100px; border: 1px solid transparent; transition: 0.3s; }
        .search-input-wrapper:focus-within { border-color: var(--accent); background: white; box-shadow: 0 0 0 4px var(--accent-soft); }
        .search-input-wrapper input { border: none; background: transparent; outline: none; width: 100%; font-weight: 600; font-size: 0.95rem; }
        .text-gold { color: var(--accent); }

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
