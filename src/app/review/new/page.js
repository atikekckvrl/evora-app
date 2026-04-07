"use client";
import { useState } from "react";
import { Star, ShieldCheck, MessageSquare, Camera, CheckCircle2, UserCheck } from "lucide-react";

export default function NewReviewPage() {
  const [rating, setRating] = useState({
    overall: 0,
    noise: 0,
    sunlight: 0,
    humidity: 0,
    landlord: 0
  });

  const [verified, setVerified] = useState(false);

  const setRate = (key, val) => setRating({...rating, [key]: val});

  const renderStars = (key) => {
    return (
      <div className="star-group">
        {[1,2,3,4,5].map(i => (
          <Star 
            key={i} 
            size={24} 
            fill={i <= rating[key] ? "var(--warning)" : "transparent"} 
            stroke={i <= rating[key] ? "var(--warning)" : "var(--text-muted)"}
            onClick={() => setRate(key, i)}
            className="star-icon"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container section">
      <div className="review-layout">
        <div className="review-main">
          <div className="card fade-in">
            <div className="card-header highlight-header">
              <MessageSquare className="text-primary" />
              <h2>Deneyimini Paylaş</h2>
            </div>

            <div className="review-form-content">
              {/* Overall Rating */}
              <div className="rating-section">
                <label className="input-label big-label">Genel Puanın</label>
                {renderStars('overall')}
              </div>

              {/* Detailed Metrics */}
              <div className="metrics-grid">
                <div className="metric-item">
                  <label>Gürültü Seviyesi</label>
                  {renderStars('noise')}
                </div>
                <div className="metric-item">
                  <label>Güneş Işığı</label>
                  {renderStars('sunlight')}
                </div>
                <div className="metric-item">
                  <label>Rutubet/Nem</label>
                  {renderStars('humidity')}
                </div>
                <div className="metric-item">
                  <label>Ev Sahibi İletişimi</label>
                  {renderStars('landlord')}
                </div>
              </div>

              {/* Text Review */}
              <div className="input-group">
                <label className="input-label">Detaylı Görüşün</label>
                <textarea 
                  className="input-field textarea" 
                  placeholder="Ev ve ev sahibi hakkında dürüst görüşlerinizi paylaşın. Küfür ve hakaret içermeyen yorumlar yayınlanacaktır."
                  rows={5}
                ></textarea>
              </div>

              {/* Verification Simulation */}
              <div className={`verification-box ${verified ? 'verified' : ''}`} onClick={() => setVerified(!verified)}>
                <div className="flex-row items-center gap-1">
                  {verified ? <CheckCircle2 className="text-success" /> : <Camera className="text-muted" />}
                  <div>
                    <h4 className="m-0">Doğrulanmış Yorum Yap (Önerilir)</h4>
                    <p className="text-muted text-small m-0">
                      Fatura veya kontrat yükleyerek yorumuna "Doğrulanmış" rozeti alabilirsin.
                    </p>
                  </div>
                </div>
                {!verified && <button className="btn btn-outline btn-small">Dosya Seç</button>}
              </div>

              <div className="anon-disclaimer">
                <UserCheck size={18} className="text-primary" />
                <span>Yorumun <strong>"Kiracı #A12"</strong> gibi anonim bir rumuzla yayınlanacaktır.</span>
              </div>

              <button className="btn btn-primary w-full mt-2">
                Yorumu Gönder
                <ShieldCheck size={20} />
              </button>
            </div>
          </div>
        </div>

        <aside className="review-sidebar desktop-only">
          <div className="card sticky-card">
            <h3>Yorum Kuralları</h3>
            <ul className="rules-list">
              <li>Lütfen dürüst olun, hakaret etmeyin.</li>
              <li>Sadece doğrulanabilir bilgileri paylaşın.</li>
              <li>Reklam veya yönlendirme içermemeli.</li>
              <li>Yorumunuz moderatör onayından sonra yayınlanacaktır.</li>
            </ul>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .review-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .highlight-header {
          border-bottom: 2px solid var(--accent);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
        }

        .big-label {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.75rem;
        }

        .star-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .star-icon {
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .star-icon:hover {
          transform: scale(1.15);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          background: var(--surface);
          padding: 1.5rem;
          border-radius: var(--radius-md);
        }

        .metric-item label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }

        .textarea {
          resize: vertical;
          min-height: 120px;
        }

        .verification-box {
          border: 2px dashed var(--border);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1.5rem;
        }

        .verification-box:hover {
          border-color: var(--primary);
          background: var(--accent);
        }

        .verification-box.verified {
          border-style: solid;
          border-color: var(--success);
          background: #f0fdf4;
        }

        .anon-disclaimer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--accent);
          border-radius: var(--radius-md);
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }

        .rules-list {
          list-style: none;
          padding: 0;
          margin-top: 1rem;
        }

        .rules-list li {
          padding-left: 1.5rem;
          position: relative;
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .rules-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: bold;
        }

        .m-0 { margin: 0; }
        .text-small { font-size: 0.8rem; }
        .items-center { align-items: center; }
        .gap-1 { gap: 1rem; }
        .flex-row { display: flex; }

        @media (max-width: 900px) {
          .review-layout { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}
