"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function isValidCoord(lat, lng) {
  return (
    typeof lat === "number" && typeof lng === "number" &&
    isFinite(lat) && isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  );
}

// setView kullanarak NaN hatasını tamamen ortadan kaldırıyoruz
// flyTo animasyon sırasında pixel→latlng dönüşümü yapar, 
// gizli container'da bu NaN üretir. setView bunu yapmaz.
function RecenterMap({ houses, center }) {
  const map = useMap();
  const prevKey = useRef("");

  useEffect(() => {
    // Harita container'ının boyutu 0 ise (gizliyse) hiçbir şey yapma
    const size = map.getSize();
    if (!size || size.x === 0 || size.y === 0) return;

    try {
      if (houses && houses.length > 0) {
        const valid = houses.filter(h => isValidCoord(h.lat, h.lng));
        if (valid.length > 0) {
          const bounds = L.latLngBounds(valid.map(h => [h.lat, h.lng]));
          if (bounds.isValid()) {
            const key = bounds.toBBoxString();
            if (key !== prevKey.current) {
              prevKey.current = key;
              map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: false });
            }
          }
        }
      } else if (center && Array.isArray(center) && isValidCoord(center[0], center[1])) {
        const key = `${center[0].toFixed(4)},${center[1].toFixed(4)}`;
        if (key !== prevKey.current) {
          prevKey.current = key;
          map.setView([center[0], center[1]], 13, { animate: false });
        }
      }
    } catch (err) {
      // Hata olursa sessizce geç
    }
  }, [houses, center, map]);

  return null;
}

export default function MapComponent({ houses = [], center }) {
  const containerRef = useRef(null);

  const markerIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  const validHouses = houses.filter(h => isValidCoord(h.lat, h.lng));

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%", minHeight: "300px" }}>
      <MapContainer
        center={[39.0, 35.0]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <RecenterMap houses={validHouses} center={center} />
        <InvalidateSizeOnVisible />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markerIcon && validHouses.map(house => (
          <Marker key={house.id} position={[house.lat, house.lng]} icon={markerIcon}>
            <Popup>
              <strong>{house.title}</strong><br />
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{house.location}</span><br />
              <span style={{ color: "#b4975a", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                ⭐ {house.rating} ({house.reviews} Yorum)
              </span>
              <a href={`/house/${house.id}`} style={{ 
                display: 'block', 
                background: '#0f172a', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                textAlign: 'center', 
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>İncele</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// Harita görünür olduğunda boyutunu yeniden hesapla
function InvalidateSizeOnVisible() {
  const map = useMap();
  useEffect(() => {
    const interval = setInterval(() => {
      const size = map.getSize();
      if (size && size.x > 0 && size.y > 0) {
        map.invalidateSize();
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [map]);
  return null;
}
