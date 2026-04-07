"use client";
import { Star, ShieldCheck, MapPin, Wind, Sun, Volume2, User, ChevronRight, MessageCircle } from "lucide-react";

export default function HouseDetailsPage() {
  const ratings = [
    { label: "Sessizlik", value: 4, icon: <Volume2 size={16}/> },
    { label: "Güneş Işığı", value: 5, icon: <Sun size={16}/> },
    { label: "Isınma / Nem", value: 2, icon: <Wind size={16}/> },
    { label: "Ev Sahibi", value: 4.5, icon: <User size={16}/> },
  ];

  const renderRatingBar = (val) => {
    const percent = (val / 5) * 100;
    return (
      <div className="rating-bar-container">
        <div className="rating-bar-fill" style={{ width: `${percent}%` }}></div>
      </div>
    );
  };

  return (
    <div className="container section">
      <div className="house-header-grid">
        <div className="house-main-info">
          <div className="badge-wrapper mb-1">
            <span className="badge-verified"><ShieldCheck size={14}/> 12 Doğrulanmış Yorum</span>
            <span className="badge-location"><MapPin size={14}/> Kadıköy, İstanbul</span>
          </div>
          <h1>Moda Leylek Sokak 12 No'lu Bina</h1>
          <p className="house-subtitle">Harika konumda, merkezi ısıtmalı ama bina biraz gürültülü.</p>
        </div>

        <div className="house-score-card shadow-lg">
          <div className="score-header">
            <div className="score-circle">4.2</div>
            <div>
              <div className="score-text">Genel Puan</div>
              <div className="score-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= 4 ? "var(--warning)" : "transparent"} stroke="var(--warning)" />)}
              </div>
            </div>
          </div>
          
          <div className="rating-details">
            {ratings.map((r, i) => (
              <div key={i} className="rating-row-item">
                <div className="rating-label">
                  {r.icon}
                  <span>{r.label}</span>
                </div>
                {renderRatingBar(r.value)}
                <span className="rating-val">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="house-content-grid">
        <div className="house-reviews-section">
          <div className="section-title-with-count">
            <h2>Kiracı Yorumları</h2>
            <span className="badge-count">10</span>
          </div>

          <div className="reviews-list">
            {[1, 2].map(i => (
              <div key={i} className="review-item card">
                <div className="review-meta">
                  <div className="author-info">
                    <User size={24} className="author-avatar" />
                    <div>
                      <div className="author-name">Kiracı #A24 {i === 1 && <span className="verified-badge">Doğrulanmış</span>}</div>
                      <div className="review-date">2 Ay önce paylaştı</div>
                    </div>
                  </div>
                  <div className="review-stars-row">
                    <Star fill="var(--warning)" stroke="var(--warning)" size={16} />
                    <strong>4.5</strong>
                  </div>
                </div>
                <p className="review-body">
                  "2 yıl burada yaşadım. Mahalle harika, komşular çok tatlı. 
                  Sadece kış aylarında alt kattan gelen gürültü biraz rahatsız edici olabiliyor. 
                  Ev sahibi kira zammında her zaman kanuni sınırı takip etti, oldukça anlayışlı biri."
                </p>
                <div className="review-actions">
                  <button className="btn-link">Faydalı (12)</button>
                  <button className="btn-link">Şikayet Et</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="section-title-with-count mt-4">
            <h2>Ev Sahibinin Kiracı Profilleri</h2>
            <span className="badge-count">2</span>
          </div>
          <div className="reviews-list">
            <div className="review-item card landlord-review">
              <div className="review-meta">
                <div className="author-info">
                  <ShieldCheck size={24} className="author-avatar text-primary" />
                  <div>
                    <div className="author-name">Ev Sahibi #B12</div>
                    <div className="review-date">1 Yıl önce paylaştı</div>
                  </div>
                </div>
              </div>
              <p className="review-body">
                "Kiracım evi çok temiz kullandı. Ödemeler her zaman gününde yapıldı. Komşulardan herhangi bir şikayet almadım. Kendisine referans olurum."
              </p>
            </div>
          </div>
        </div>

        <aside className="house-sidebar desktop-only">
          <div className="sidebar-promo shadow-md">
            <MessageCircle size={32} className="text-primary mb-1" />
            <h3>Sen de Yorum Yap</h3>
            <p>Bu evde yaşadın mı? Deneyimlerin başkaları için çok değerli.</p>
            <button className="btn btn-primary w-full mt-1">Hemen Yorumla</button>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .house-header-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
          margin-bottom: 4rem;
          align-items: center;
        }

        .house-main-info h1 {
          font-size: 2.75rem;
          margin-top: 1rem;
          letter-spacing: -1px;
        }

        .house-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .house-score-card {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }

        .score-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .score-circle {
          width: 70px;
          height: 70px;
          background: var(--primary);
          color: white;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        }

        .rating-details {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .rating-row-item {
          display: grid;
          grid-template-columns: 120px 1fr 20px;
          align-items: center;
          gap: 1rem;
        }

        .rating-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .rating-bar-container {
          height: 6px;
          background: var(--surface);
          border-radius: 3px;
          overflow: hidden;
        }

        .rating-bar-fill {
          height: 100%;
          background: var(--primary);
          border-radius: 3px;
        }

        .rating-val { font-size: 0.75rem; font-weight: 700; color: var(--text-main); }

        .house-content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 4rem;
        }

        .section-title-with-count {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .badge-count {
          background: var(--accent);
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 12px;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-item {
          padding: 1.5rem;
        }

        .review-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .author-info {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .author-avatar {
          background: var(--surface);
          padding: 8px;
          border-radius: 50%;
          color: var(--text-muted);
        }

        .author-name { font-weight: 700; font-size: 0.9375rem; }
        .review-date { font-size: 0.75rem; color: var(--text-muted); }

        .verified-badge {
          font-size: 0.65rem;
          color: var(--success);
          background: #f0fdf4;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
        }

        .review-body {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-main);
          margin-bottom: 1.5rem;
        }

        .review-actions {
          display: flex;
          gap: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface);
        }

        .landlord-review {
          border-left: 4px solid var(--primary);
          background: #f0fdf455;
        }

        .sidebar-promo {
          background: var(--secondary);
          color: white;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .sidebar-promo h3 { color: white; margin-bottom: 0.5rem; }
        .sidebar-promo p { color: #cbd5e1; font-size: 0.9rem; margin-bottom: 1.5rem; }

        @media (max-width: 900px) {
          .house-header-grid { grid-template-columns: 1fr; gap: 2rem; }
          .house-content-grid { grid-template-columns: 1fr; }
          .house-main-info h1 { font-size: 2rem; }
        }
      `}} />
    </div>
  );
}
