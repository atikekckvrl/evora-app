"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Check, X, Trash2, User, MessageSquare, Home } from "lucide-react";

export default function AdminPage() {
  const [houses, setHouses] = useState([]);
  const [selectedHouseId, setSelectedHouseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetch('/api/houses').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setHouses(data);
    });
  }, []);

  const handleDeleteHouse = async (id) => {
    if (!confirm("Bu evi platformdan silmek istediğinize emin misiniz? İçindeki tüm yorumlar da silinecektir!")) return;

    try {
      const res = await fetch(`/api/houses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHouses(houses.filter(h => h.id !== id));
        setSelectedHouseId("");
        alert("Ev başarıyla silindi ve haritadan kaldırıldı.");
      } else {
        alert("Ev silinirken hata oluştu.");
      }
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="container section">
      <div className="admin-header">
        <div className="flex-row items-center gap-1">
          <ShieldCheck size={32} className="text-primary" />
          <h1>Admin Moderasyon Paneli</h1>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-val">{houses.length}</span>
            <span className="stat-label">Kayıtlı Ev</span>
          </div>
        </div>
      </div>

      <div className="moderation-queue" style={{ marginTop: '1rem' }}>
        <h2>Sistemdeki Kayıtlı Evleri Yönet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Evin tüm özelliklerini görüntüleyip inceleyebilir, haritadan kaldırmak istediğiniz evi kalıcı olarak silebilirsiniz.</p>

        <div style={{ marginBottom: '25px' }}>
          <input
            type="text"
            placeholder="Arama yap: İlçe, Mahalle, Sokak Adı veya Puan girin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
          />
        </div>

        {houses.filter(h => h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
          <div className="empty-state card">
            <Home size={48} className="text-muted mb-1" />
            <p>{searchTerm ? "Bu aramaya uygun bir ev bulunamadı." : "Sistemde henüz kayıtlı bir mülk bulunmuyor."}</p>
          </div>
        ) : (
          <div className="queue-list grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {houses.filter(h => h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())).map(house => (
              <div key={house.id} className="queue-item card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px', position: 'relative' }}>
                <div className="item-main" style={{ width: '100%', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                      <Home size={24} className="text-primary" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', display: 'block', color: 'var(--text-main)' }}>{house.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(house.createdAt).toLocaleDateString("tr-TR")} tarihinde eklendi
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Tam Adres</strong>
                      <span>{house.fullAddress}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                      <span style={{ color: '#64748b' }}>Değerlendirme Puanı:</span>
                      <strong style={{ color: '#b4975a' }}>⭐ {house.rating} ({house.reviews} Doğrulanmış Yorum)</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                      <span style={{ color: '#64748b' }}>Ev Sahibi Durumu:</span>
                      {house.ownerId ? <strong style={{ color: '#10b981' }}>Sahiplenildi</strong> : <strong style={{ color: '#f59e0b' }}>Sahipsiz (Anonim)</strong>}
                    </div>
                  </div>
                </div>

                <div className="item-actions" style={{ marginLeft: 0, width: '100%', display: 'flex', gap: '10px' }}>
                  <a
                    href={`/house/${house.id}`}
                    target="_blank"
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#334155', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', transition: '0.2s', fontSize: '0.9rem' }}
                  >
                    Detaylı İncele
                  </a>
                  <button
                    className="admin-btn btn-danger"
                    onClick={() => handleDeleteHouse(house.id)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Trash2 size={16} /> Haritadan Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border);
        }

        .stats-grid {
          display: flex;
          gap: 2rem;
        }

        .stat-card {
          text-align: right;
        }

        .stat-val {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }

        .moderation-queue h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .queue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
        }

        .item-main { flex: 1; }

        .item-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .item-user { color: var(--text-main); display: flex; align-items: center; gap: 4px; }
        .item-house { color: var(--text-muted); display: flex; align-items: center; gap: 4px; }

        .badge-verified-tiny {
          background: #f0fdf4;
          color: var(--success);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .item-content {
          font-size: 0.9375rem;
          color: var(--text-main);
          font-style: italic;
        }

        .item-actions {
          display: flex;
          gap: 0.75rem;
          margin-left: 2rem;
        }

        .admin-btn {
          border: none;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .btn-success { background: var(--success); color: white; }
        .btn-success:hover { background: #15803d; }

        .btn-danger { background: var(--error); color: white; }
        .btn-danger:hover { background: #b91c1c; }

        .btn-outline-danger { background: transparent; border: 1px solid var(--error); color: var(--error); }
        .btn-outline-danger:hover { background: #fef2f2; }

        .empty-state {
          text-align: center;
          padding: 4rem;
        }

        @media (max-width: 768px) {
          .admin-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .queue-item { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .item-actions { margin-left: 0; width: 100%; }
          .admin-btn { flex: 1; justify-content: center; }
        }
      `}} />
    </div>
  );
}
