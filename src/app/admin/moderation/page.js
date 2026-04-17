"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck, XCircle, CheckCircle2, FileText, ExternalLink, Home, Clock, User } from "lucide-react";

export default function ModerationPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const res = await fetch("/api/admin/moderation");
            const data = await res.json();
            if (Array.isArray(data)) setReviews(data);
        } catch (err) {
            console.error("Yorumlar yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`/api/admin/moderation/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                setReviews(prev => prev.filter(r => r.id !== id));
            }
        } catch (err) {
            alert("İşlem sırasında hata oluştu.");
        }
    };

    if (loading) return <div className="admin-loading">Moderasyon Kuyruğu Yükleniyor...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-text">
                    <h1>Moderasyon Paneli</h1>
                    <p>Bekleyen belgeleri ve yorumları incele, onayla veya reddet.</p>
                </div>
                <div className="stat-badge">
                    <Clock size={16} /> {reviews.length} Bekleyen İşlem
                </div>
            </header>

            <div className="moderation-grid">
                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <CheckCircle2 size={48} color="#10b981" />
                        <h3>Harika!</h3>
                        <p>Bekleyen herhangi bir moderasyon işlemi bulunmuyor.</p>
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="moderation-card">
                            <div className="card-top">
                                <div className="house-info">
                                    <Home size={18} color="var(--a)" />
                                    <strong>{rev.house.neighborhood}, {rev.house.district}</strong>
                                </div>
                                <div className={`status-pill ${rev.status.toLowerCase()}`}>
                                    {rev.status === 'PENDING' ? 'Onay Bekliyor' : 'Belge Onayı'}
                                </div>
                            </div>

                            <div className="review-content">
                                <p>"{rev.content}"</p>
                                <div className="ratings-summary">
                                    <span className="rating-pill">⭐ {rev.overallRating}/5</span>
                                </div>
                            </div>

                            <div className="meta-info">
                                <div className="info-item">
                                    <User size={14} /> <span>{rev.author.email} ({rev.anonId})</span>
                                </div>
                                <div className="info-item">
                                    <Clock size={14} /> <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {rev.verificationDoc && (
                                <div className="doc-box">
                                    <div className="doc-header">
                                        <FileText size={18} />
                                        <span>Yüklenen Belge: <strong>{rev.verificationDoc}</strong></span>
                                    </div>
                                    <button className="view-doc-btn">
                                        <ExternalLink size={14} /> Belgeyi Görüntüle
                                    </button>
                                </div>
                            )}

                            <div className="card-actions">
                                <button className="btn-reject" onClick={() => handleAction(rev.id, 'REJECT')}>
                                    <XCircle size={18} /> Reddet
                                </button>
                                <button className="btn-approve" onClick={() => handleAction(rev.id, 'APPROVE')}>
                                    <CheckCircle2 size={18} /> Onayla
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
        .status-pill.pending { background: #fff7ed; color: #c2410c; }
        
        .review-content { background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 15px; }
        .review-content p { margin: 0; font-size: 0.95rem; line-height: 1.5; color: #334155; font-style: italic; }
        .rating-pill { display: inline-block; margin-top: 10px; background: #fffbeb; color: #b45309; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
        
        .meta-info { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .info-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #64748b; }
        
        .doc-box { background: #ebf5ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
        .doc-header { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #1e40af; margin-bottom: 10px; }
        .view-doc-btn { width: 100%; padding: 8px; background: white; border: 1px solid #bfdbfe; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 700; font-size: 0.8rem; color: #2563eb; }
        
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
