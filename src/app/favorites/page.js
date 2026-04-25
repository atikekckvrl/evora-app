"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Home, Star, MapPin, SearchX } from "lucide-react";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch("/api/favorites");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setFavorites(data);
                } else if (res.status === 401) {
                    // Yönlendirme yapılmıyor, Navigation giriş yapın uyarısı verecek
                }
            } catch (err) {
                console.error("Favoriler çekilemedi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const removeFavorite = async (houseId) => {
        // Optimistic UI
        const previousFavorites = [...favorites];
        setFavorites(favorites.filter(f => f.id !== houseId));

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ houseId })
            });
            if (!res.ok) {
                setFavorites(previousFavorites);
                alert("İşlem başarısız oldu, lütfen tekrar deneyin.");
            }
        } catch (err) {
            setFavorites(previousFavorites);
            alert("Hata oluştu.");
        }
    };

    return (
        <main className="favorites-page">
            <div className="container" style={{ minHeight: '80vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className="page-header" style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '16px' }}>
                            <Heart size={32} color="#ef4444" fill="#ef4444" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 5px 0', color: '#0f172a', letterSpacing: '-1px' }}>Favorilerim</h1>
                            <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>Gelecekte incelemek veya kiralamak için kaydettiğiniz evler listesi.</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b', fontWeight: 'bold' }}>Favorileriniz yükleniyor...</div>
                ) : favorites.length === 0 ? (
                    <div className="empty-favorites">
                        <SearchX size={64} color="#cbd5e1" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>Henüz Favori Eviniz Yok</h2>
                        <p style={{ color: '#64748b', maxWidth: '400px', lineHeight: 1.6, marginBottom: '30px' }}>Kaydetmek istediğiniz evleri, ev detay sayfasındaki "Favorilere Ekle" butonuna basarak bu listeye dahil edebilirsiniz.</p>
                        <Link href="/" style={{ background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Home size={18} /> Ev Keşfetmeye Başla
                        </Link>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((fav) => (
                            <div key={fav.id} className="fav-card">
                                <Link href={`/house/${fav.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '20px' }}>
                                    <div className="fav-top">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                                                <Home size={24} color="#b4975a" />
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a' }}>{fav.title}</strong>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                    <MapPin size={14} /> {fav.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fav-body">
                                        <div style={{ margin: '15px 0' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Tam Adres</span>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#334155' }}>{fav.fullAddress}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f8fafc', padding: '10px 15px', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#b4975a', fontWeight: 'bold' }}>
                                                <Star size={16} fill="#b4975a" /> {fav.rating}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                ({fav.reviews} Değerlendirme)
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="fav-actions" style={{ padding: '0 20px 20px 20px' }}>
                                    <button
                                        className="remove-btn"
                                        onClick={(e) => { e.preventDefault(); removeFavorite(fav.id); }}
                                    >
                                        <Heart size={16} fill="#ef4444" color="#ef4444" /> Favorilerden Kaldır
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .favorites-page { min-height: 100vh; display: flex; flex-direction: column; background: #f8fafc; }
                .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; }
                
                .empty-favorites { background: white; border-radius: 24px; padding: 60px 20px; text-align: center; border: 1px solid #e2e8f0; display: flex; flex-direction: column; alignItems: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                
                .favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
                
                .fav-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; transition: 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); display: flex; flex-direction: column; }
                .fav-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }
                
                .remove-btn { width: 100%; display: flex; alignItems: center; justifyContent: center; gap: 8px; background: #fef2f2; color: #ef4444; border: 1px dashed #fca5a5; padding: 10px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
                .remove-btn:hover { background: #fee2e2; border-style: solid; }
                
                @media (max-width: 768px) {
                    .page-header h1 { font-size: 2rem !important; }
                    .favorites-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </main>
    );
}
