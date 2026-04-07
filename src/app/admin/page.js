"use client";
import { useState } from "react";
import { ShieldCheck, AlertTriangle, Check, X, Trash2, User, MessageSquare } from "lucide-react";

export default function AdminPage() {
  const [pendingReviews, setPendingReviews] = useState([
    { 
      id: 1, 
      user: "Kiracı #A01", 
      house: "Kadıköy, Moda Sk. No:12", 
      content: "Harika bir ev, sadece banyo biraz eski.", 
      verified: true 
    },
    { 
      id: 2, 
      user: "Ev Sahibi #B45", 
      house: "Beşiktaş, Ihlamurdere No:4", 
      content: "Kiracı son derece dürüst bir insandı, evi tertemiz bıraktı.", 
      verified: false 
    },
  ]);

  const handleAction = (id, action) => {
    setPendingReviews(pendingReviews.filter(r => r.id !== id));
    alert(`Yorum ${action === 'approve' ? 'onaylandı' : 'reddedildi'}!`);
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
            <span className="stat-val">{pendingReviews.length}</span>
            <span className="stat-label">Bekleyen Yorum</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">1.2K</span>
            <span className="stat-label">Toplam Yorum</span>
          </div>
        </div>
      </div>

      <div className="moderation-queue">
        <h2>Onay Bekleyenler</h2>
        {pendingReviews.length === 0 ? (
          <div className="empty-state card">
            <Check size={48} className="text-success mb-1" />
            <p>Tüm yorumlar incelendi. Harika iş!</p>
          </div>
        ) : (
          <div className="queue-list">
            {pendingReviews.map(review => (
              <div key={review.id} className="queue-item card fade-in">
                <div className="item-main">
                  <div className="item-meta">
                    <span className="item-user"><User size={14}/> {review.user}</span>
                    <span className="item-house"><AlertTriangle size={14} className="text-warning" /> {review.house}</span>
                    {review.verified && <span className="badge-verified-tiny">Belge Sunuldu</span>}
                  </div>
                  <p className="item-content">"{review.content}"</p>
                </div>
                
                <div className="item-actions">
                  <button className="admin-btn btn-success" onClick={() => handleAction(review.id, 'approve')}>
                    <Check size={18} /> Onayla
                  </button>
                  <button className="admin-btn btn-danger" onClick={() => handleAction(review.id, 'reject')}>
                    <X size={18} /> Reddet
                  </button>
                  <button className="admin-btn btn-outline-danger" onClick={() => handleAction(review.id, 'delete')}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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
