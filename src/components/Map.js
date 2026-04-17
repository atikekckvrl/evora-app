"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
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
function RecenterMap({ houses, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    const size = map.getSize();
    if (!size || size.x === 0 || size.y === 0) return;

    if (houses && houses.length > 0) {
      const valid = houses.filter(h => isValidCoord(h.lat, h.lng));
      if (valid.length > 0) {
        const bounds = L.latLngBounds(valid.map(h => [h.lat, h.lng]));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: zoom || 18, animate: true });
        }
      }
    } else if (center && isValidCoord(center[0], center[1])) {
      map.setView(center, zoom || 18, { animate: true });
    }
  }, [houses, center, map, zoom]);

  return null;
}

// Haritaya tıklayınca konum seç
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function MapComponent({ houses = [], center, zoom, onMapClick }) {
  const containerRef = useRef(null);

  const markerIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  const validHouses = houses.filter(h => isValidCoord(h.lat, h.lng));

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%", minHeight: "350px", position: "relative" }}>
      <MapContainer
        key={`${center?.[0]}-${center?.[1]}-${houses?.length}`}
        center={[39.6484, 27.8826]}
        zoom={zoom || 13}
        maxZoom={21}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <RecenterMap houses={validHouses} center={center} zoom={zoom} />
        <InvalidateSizeOnVisible />
        <MapClickHandler onMapClick={onMapClick} />

        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxNativeZoom={18}
          maxZoom={21}
        />

        {markerIcon && validHouses.map(house => (
          <Marker
            key={house.id}
            position={[house.lat, house.lng]}
            icon={markerIcon}
            draggable={house.isTemp}
            eventHandlers={{
              dragend: (e) => {
                if (house.isTemp && house.onDrag) {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  house.onDrag(position.lat, position.lng);
                }
              },
            }}
          >
            <Popup>
              <strong>{house.title}</strong><br />
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{house.location}</span><br />

              {!house.isTemp ? (
                <>
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
                </>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>Bu konumda henüz bir ev kaydı yok.</p>
                  <p style={{ fontSize: '0.65rem', color: '#b4975a', marginBottom: '8px', fontWeight: 'bold' }}>
                    💡 Tam yerini bulmak için işareti sürükleyebilirsiniz.
                  </p>
                  <a href={`/house/new?lat=${house.lat}&lng=${house.lng}`} style={{
                    display: 'block',
                    background: '#b4975a',
                    color: 'white',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>Bu Evi Kaydet</a>
                </div>
              )}
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
