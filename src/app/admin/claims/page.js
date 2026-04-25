"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck, XCircle, CheckCircle2, FileText, ExternalLink, Home, Clock, User, Landmark } from "lucide-react";

export default function ClaimsPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClaims = async () => {
        try {
            const res = await fetch("/api/admin/claims");
            const data = await res.json();
            if (Array.isArray(data)) setClaims(data);
        } catch (err) {
            console.error("Başvurular yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`/api/admin/moderation/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                setClaims(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            alert("İşlem sırasında hata oluştu.");
        }
    };

    if (loading) return <div className="admin-loading">Ev Sahibi Başvuruları Yükleniyor...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-text">
                    <h1>Ev Sahibi Onayları</h1>
                    <p>Platform üzerinden sahiplenme (Tapu incelemesi) yapmak isteyen ev sahiplerinin başvurularını değerlendirin.</p>
                </div>
                <div className="stat-badge">
                    <Clock size={16} /> {claims.length} Bekleyen Başvuru
                </div>
            </header>

            <div className="moderation-grid">
                {claims.length === 0 ? (
                    <div className="empty-state">
                        <CheckCircle2 size={48} color="#10b981" />
                        <h3>Tüm Başvurular İncelendi!</h3>
                        <p>Şu anda bekleyen herhangi bir ev sahipliği başvurusu bulunmuyor.</p>
                    </div>
                ) : (
                    claims.map((claim) => (
                        <div key={claim.id} className="moderation-card">
                            <div className="card-top">
                                <div className="house-info">
                                    <Home size={18} color="var(--primary)" />
                                    <strong>{claim.house.neighborhood}, {claim.house.district}</strong>
                                </div>
                                <div className="status-pill claim-pill">
                                    Tapu Onayı Bekliyor
                                </div>
                            </div>

                            <div className="claim-content">
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Landmark size={18} className="text-primary" /> Ev Sahibi Olmak İstiyor
                                    </h4>
                                    <p style={{ fontStyle: 'normal', color: '#64748b', fontSize: '0.9rem' }}>
                                        Bu kullanıcı evini platform üzerinden sahiplenerek yönetmek istiyor. Lütfen yüklediği tapu belgesi ile idari adresleri eşleştirip doğruluğunu kontrol edin.
                                    </p>
                                </div>
                            </div>

                            <div className="meta-info">
                                <div className="info-item">
                                    <User size={14} /> <span><strong>Kullanıcı:</strong> {claim.author.email}</span>
                                </div>
                                <div className="info-item">
                                    <Clock size={14} /> <span><strong>Tarih:</strong> {new Date(claim.createdAt).toLocaleDateString("tr-TR")}</span>
                                </div>
                            </div>

                            {claim.verificationDoc && (
                                <div className="doc-box">
                                    <div className="doc-header">
                                        <FileText size={18} />
                                        <span>Yüklenen Belge: <strong>{claim.verificationDoc}</strong></span>
                                    </div>
                                    <a href={`/uploads/${claim.verificationDoc}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                        <button className="view-doc-btn">
                                            <ExternalLink size={14} /> Belgeyi Yeni Sekmede İncele
                                        </button>
                                    </a>
                                </div>
                            )}

                            <div className="card-actions">
                                <button className="btn-reject" onClick={() => handleAction(claim.id, 'REJECT')}>
                                    <XCircle size={18} /> Tapuyu Reddet
                                </button>
                                <button className="btn-approve" onClick={() => handleAction(claim.id, 'APPROVE')}>
                                    <CheckCircle2 size={18} /> Sahipliği Onayla
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
        .admin-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .admin-header h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1.5px; margin: 0; color: #0f172a; }
        .admin-header p { color: #64748b; margin-top: 5px; }
        
        .stat-badge { background: #f1f5f9; padding: 8px 16px; border-radius: 100px; display: flex; align-items: center; gap: 8px; font-weight: 700; color: #475569; font-size: 0.9rem; }
        
        .moderation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
        
        .moderation-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; transition: 0.3s; display: flex; flex-direction: column; }
        .moderation-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .house-info { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
        .status-pill { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .status-pill.claim-pill { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        
        .claim-content { background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid var(--primary); }
        
        .meta-info { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .info-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #64748b; }
        
        .doc-box { background: #ebf5ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
        .doc-header { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #1e40af; margin-bottom: 10px; }
        .view-doc-btn { width: 100%; padding: 8px; background: white; border: 1px solid #bfdbfe; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 700; font-size: 0.8rem; color: #2563eb; }
        .view-doc-btn:hover { background: #f8fafc; }
        
        .card-actions { display: flex; gap: 12px; margin-top: auto; }
        .card-actions button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: 0.2s; }
        
        .btn-reject { background: #fef2f2; color: #dc2626; }
        .btn-reject:hover { background: #fee2e2; }
        .btn-approve { background: #334155; color: white; }
        .btn-approve:hover { background: #0f172a; }
        
        .empty-state { grid-column: 1 / -1; text-align: center; padding: 100px; background: #f8fafc; border-radius: 32px; border: 2px dashed #e2e8f0; }
        .empty-state h3 { font-size: 1.5rem; margin: 20px 0 10px; }
        .empty-state p { color: #64748b; }

        .admin-loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #64748b; }
      `}</style>
        </div>
    );
}
