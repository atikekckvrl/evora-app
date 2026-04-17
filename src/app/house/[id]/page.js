"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Star, ShieldCheck, MapPin, UserCheck, MessageSquareQuote, ArrowLeft, CheckCircle2, AlertTriangle, X, Camera
} from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const MapContainer = dynamic(
  () => import("@/components/Map"),
  {
    ssr: false,
    loading: () => <div className="loading-map">Harita yükleniyor...</div>
  }
);

export default function HouseDetailsPage() {
  const params = useParams();
  const houseId = params.id;
  const { data: session, status } = useSession();
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [reviewRole, setReviewRole] = useState("tenant"); // 'tenant' | 'landlord'
  const [reviews, setReviews] = useState([]); // Gerçek yorumlar
  const [comment, setComment] = useState("");
  const [verificationFile, setVerificationFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");

  const handleAuthSubmit = async (e) => {
    if (e) e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      if (authMode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authForm),
        });
        const data = await res.json();
        if (data.success) {
          await signIn("credentials", {
            email: authForm.email,
            password: authForm.password,
            redirect: false,
          });
          setAuthModalOpen(false);
          setReviewModalOpen(true);
        } else {
          setAuthError(data.error || "Kayıt sırasında bir hata oluştu.");
        }
      } else {
        const result = await signIn("credentials", {
          email: authForm.email,
          password: authForm.password,
          redirect: false,
        });

        if (result.error) {
          setAuthError("E-posta veya şifre hatalı.");
        } else {
          setAuthModalOpen(false);
          setReviewModalOpen(true);
        }
      }
    } catch (err) {
      setAuthError("Bir bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Etkileşimli Yıldız Puanlama Stateleri
  const [tRatings, setTRatings] = useState({ q1: 0, q2: 0, q3: 0, q4: 0 });
  const [lRatings, setLRatings] = useState({ q1: 0, q2: 0, q3: 0 });
  const [hoverRating, setHoverRating] = useState({ id: null, val: 0 });

  const touchStartX = useRef(null);

  // Etkileşimli Yıldız Bileşeni (Local Component)
  const InteractiveStars = ({ name, value, onChange }) => {
    return (
      <div className="interactive-stars" style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            size={24}
            fill={num <= (hoverRating.id === name ? hoverRating.val : value) ? "#b4975a" : "transparent"}
            stroke={num <= (hoverRating.id === name ? hoverRating.val : value) ? "#b4975a" : "#cbd5e1"}
            style={{ cursor: 'pointer', transition: '0.2s', transform: num <= (hoverRating.id === name ? hoverRating.val : value) ? 'scale(1.1)' : 'scale(1)' }}
            onMouseEnter={() => setHoverRating({ id: name, val: num })}
            onMouseLeave={() => setHoverRating({ id: null, val: 0 })}
            onClick={() => onChange(name, num)}
          />
        ))}
      </div>
    );
  };

  const [house, setHouse] = useState({
    id: houseId,
    title: "Yükleniyor...",
    location: "Yükleniyor...",
    fullAddress: "Yükleniyor...",
    rating: 0,
    reviews: 0,
    desc: "Lütfen bekleyiniz..."
  });

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await fetch(`/api/houses/${houseId}`);
        if (res.ok) {
          const data = await res.json();
          setHouse(data);
        }
      } catch (err) {
        console.error("Ev verisi çekilemedi:", err);
      }
    };
    fetchHouse();
  }, [houseId]);

  // Yorumları Çekme
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?houseId=${houseId}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [houseId]);

  // Yorum Gönderme
  const submitReview = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseId,
          role: reviewRole,
          ratings: reviewRole === 'tenant' ? tRatings : lRatings,
          comment,
          verificationDoc: verificationFile ? verificationFile.name : null // Simülasyon: Sadece dosya adını gönderiyoruz
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(verificationFile ? "Yorumunuz ve belgeniz alındı. Moderatör onayından sonra 'Doğrulanmış' rozetiyle yayınlanacaktır!" : "Yorumunuz başarıyla paylaşıldı!");
        setReviewModalOpen(false);
        setComment("");
        setVerificationFile(null);
        fetchReviews(); // Listeyi yenile
      }
    } catch (err) {
      alert("Hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="house-pro-app">
      {/* HEADER SECTION - NO OVERLAP */}
      <div className="house-local-nav">
        <div className="container nav-wrap">
          <button onClick={() => window.history.back()} className="back-circle" style={{ paddingLeft: '8px' }}><ArrowLeft size={20} /> Geri</button>
          <div className="nav-group">
          </div>
        </div>
      </div>

      <div className="container">
        <div className="house-layout-grid pt-3">
          <main className="content-side">
            <div className="elite-header-box">
              <span className="gold-label">ADRES İNCELEMESİ</span>
              <h1 className="pro-house-title">{house.title}</h1>
              <div className="pro-location-text"><MapPin size={16} /> {house.fullAddress}</div>
            </div>

            <div className="pro-card-white mt-4">
              <h3 className="card-title">Konum</h3>
              <div style={{ height: "400px", borderRadius: "16px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
                <MapContainer
                  houses={[{
                    id: house.id,
                    title: house.title,
                    location: house.location,
                    lat: house.latitude,
                    lng: house.longitude,
                    rating: house.rating,
                    reviews: house.reviews
                  }]}
                  center={house.latitude && house.longitude ? [house.latitude, house.longitude] : null}
                />
              </div>
            </div>

            <div className="pro-card-white mt-4" style={{ marginBottom: "2rem" }}>
              <div className="reviews-header">
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>Bina Hakkında Yorumlar</h3>
                  <p style={{ fontSize: '0.81rem', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>
                    <ShieldCheck size={14} style={{ display: 'inline', color: '#10b981', marginBottom: '-2px' }} /> <strong>Doğrulanmış</strong> rozetli yorumlar, resmi belgelerle o evde yaşadığı teyit edilmiş gerçek kiracılara aittir.
                  </p>
                </div>
                <span className="badge-count-pro">{reviews.length} Yorum</span>
              </div>
              <div className="reviews-list mt-3">

                {reviews.length === 0 && (
                  <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    Henüz yorum yapılmamış. İlk yorumu sen yap!
                  </p>
                )}

                {reviews.map((rev, idx) => (
                  <div key={idx} className="tenant-review-box" style={rev.targetType === 'TENANT' ? { borderLeft: "4px solid var(--a)", background: "#fef8ea" } : {}}>
                    <div className="reviewer-top">
                      <div className="reviewer-avatar" style={rev.targetType === 'TENANT' ? { background: "var(--a)", color: "white" } : {}}>
                        {rev.targetType === 'TENANT' ? <ShieldCheck size={20} /> : <UserCheck size={20} />}
                      </div>
                      <div className="reviewer-info">
                        <strong>{rev.anonId}</strong>
                        <span>{new Date(rev.createdAt).toLocaleDateString('tr-TR')} tarihinde paylaşıldı</span>
                      </div>
                      <div className="reviewer-score"><Star size={14} fill="#b4975a" stroke="none" /> {rev.overallRating ? rev.overallRating.toFixed(1) : "0.0"}</div>
                    </div>
                    <p className="review-text-pro">"{rev.content}"</p>

                    {rev.targetType === 'HOUSE' && (
                      <div className="review-pros-cons">
                        {rev.isVerified && <div className="pros"><CheckCircle2 size={14} color="#10b981" /> Doğrulanmış Kiracı</div>}
                        {rev.noiseRating && rev.noiseRating <= 2 && <div className="cons"><AlertTriangle size={14} color="#ef4444" /> Gürültü Sorunu</div>}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            </div>
          </main>

          <aside className="sidebar-side">
            <div className="sticky-box">
              <div className="pro-trust-card">
                <div className="icon-wrap-top"><MessageSquareQuote size={40} color="var(--a)" strokeWidth={1.5} /></div>
                <h3 style={{ margin: "15px 0 5px 0", fontSize: "1.2rem" }}>Bu evde yaşadın mı?</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.5 }}>
                  Eski veya mevcut kiracıysan deneyimlerini paylaş, diğer kiracılara yol göster.
                </p>

                <div className="score-wrap" style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px", marginBottom: "20px" }}>
                  <span className="big-val">{house.rating}</span>
                  <div className="stars-wrap">
                    <div className="stars-row" style={{ justifyContent: "center" }}>
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= Math.round(house.rating) ? "#b4975a" : "none"} stroke="#b4975a" />)}
                    </div>
                    <small>{house.reviews} Doğrulanmış Puan</small>
                  </div>
                </div>

                <button
                  className="btn-primary-elite"
                  onClick={() => {
                    if (status === 'authenticated') setReviewModalOpen(true);
                    else {
                      setAuthMode("login");
                      setAuthModalOpen(true);
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                  Deneyimini Puanla
                </button>
                <p className="anon-note"><ShieldCheck size={12} style={{ display: 'inline', marginBottom: '-2px' }} /> Kimliğin tamamen anonim tutulur.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* AUTH (GİRİŞ / KAYIT) MODALI */}
      {isAuthModalOpen && (
        <div className="review-modal-overlay" onClick={() => setAuthModalOpen(false)}>
          <div className="review-modal-content" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{authMode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</h2>
              <button className="close-btn" onClick={() => setAuthModalOpen(false)}><X size={24} /></button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', textAlign: 'center' }}>
              {authMode === 'login'
                ? 'Yorum yapmak ve topluluğa katılmak için giriş yapmalısın.'
                : 'Gerçek kimliğini doğrulamak için kayıt olmalısın (Daima anonim kalırsın).'}
            </p>

            <div className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                className="google-btn-pro"
                type="button"
                onClick={() => signIn('google')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                  <path fill="#EA4335" d="M24 12.25c0-.82-.07-1.61-.21-2.38H12v4.5h6.75c-.32 1.58-1.24 2.91-2.61 3.82v3.17h4.22c2.47-2.27 3.89-5.61 3.89-9.11z" />
                  <path fill="#4285F4" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.22-3.17c-1.14.77-2.59 1.23-3.71 1.23-3.08 0-5.69-2.08-6.62-4.88H1.1v3.28C3.11 20.89 7.23 24 12 24z" />
                  <path fill="#FBBC05" d="M5.38 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.45H1.1C.4 7.84 0 9.38 0 11s.4 3.16 1.1 4.55l4.28-3.28z" />
                  <path fill="#34A853" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.08 15.24 0 12 0 7.23 0 3.11 3.11 1.1 7.27l4.28 3.28c.93-2.81 3.54-4.88 6.62-4.88z" />
                </svg>
                Google ile {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>

              <div className="auth-divider">
                <span>veya</span>
              </div>

              {authError && (
                <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
                  {authError}
                </div>
              )}
              {authMode === 'register' && (
                <div className="input-group-pro">
                  <label>Ad Soyad</label>
                  <input
                    type="text"
                    placeholder="Adınız ve Soyadınız"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}
              <div className="input-group-pro">
                <label>E-posta Adresi</label>
                <input
                  type="email"
                  placeholder="ornek@mail.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
              <div className="input-group-pro">
                <label>Şifre</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <button
                className="submit-review-btn"
                style={{ marginTop: '10px' }}
                onClick={handleAuthSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'İşleniyor...' : (authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
              </button>
            </div>

            <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
              {authMode === 'login' ? (
                <p>Hesabın yok mu? <span onClick={() => setAuthMode('register')} style={{ color: 'var(--a)', fontWeight: 'bold', cursor: 'pointer' }}>Kayıt Ol</span></p>
              ) : (
                <p>Zaten üye misin? <span onClick={() => setAuthMode('login')} style={{ color: 'var(--a)', fontWeight: 'bold', cursor: 'pointer' }}>Giriş Yap</span></p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* YORUM YAPMA (REVIEW) MODALI */}
      {isReviewModalOpen && (
        <div className="review-modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deneyimini Paylaş</h2>
              <button className="close-btn" onClick={() => setReviewModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="anon-warning">
              <ShieldCheck size={20} color="#10b981" />
              <div>
                <strong>Kimliğin Gizli Kalacak</strong>
                <p>Yorumun sistemde "Kiracı #A12" gibi anonim bir rumuzla görünecek. Amacımız adil ve güvenli bir bilgi ağı kurmak.</p>
              </div>
            </div>

            <div className="rating-questions">
              <div className="q-row">
                <span>Rutubet ve İzolasyon Sorunu Yaşadın mı?</span>
                <InteractiveStars name="q1" value={tRatings.q1} onChange={(k, v) => setTRatings(p => ({ ...p, [k]: v }))} />
              </div>
              <div className="q-row">
                <span>Evin Güneş Alma Durumu Nasıldı?</span>
                <InteractiveStars name="q2" value={tRatings.q2} onChange={(k, v) => setTRatings(p => ({ ...p, [k]: v }))} />
              </div>
              <div className="q-row">
                <span>Gürültü Seviyesi (Yan ve Alt Komşular)</span>
                <InteractiveStars name="q3" value={tRatings.q3} onChange={(k, v) => setTRatings(p => ({ ...p, [k]: v }))} />
              </div>
              <div className="q-row">
                <span>Ev Sahibi İletişimi Nasıldı?</span>
                <InteractiveStars name="q4" value={tRatings.q4} onChange={(k, v) => setTRatings(p => ({ ...p, [k]: v }))} />
              </div>
            </div>

            <div className="review-text-area">
              <label>Eklemek İstediklerin (Zorunlu Değil)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Örn: Ev sahibi Mert Bey çok ilgiliydi ama kombi sürekli arıza yapıyordu..."
              ></textarea>
            </div>

            {true && (
              <div className="verification-upload-box">
                <Camera size={24} color="var(--a)" />
                <div className="v-text-content">
                  <strong>Doğrulanmış Kiracı Ol (Önerilir)</strong>
                  <p>Kira kontratı veya fatura yükle. <span style={{ color: '#b45309', fontWeight: '800' }}>TC No gibi özel bilgileri karalayarak yükleyebilirsin.</span> Sadece adresin ve adınızın görünmesi yeterlidir.</p>
                </div>
                <input
                  type="file"
                  id="v-upload-input"
                  style={{ display: 'none' }}
                  onChange={(e) => setVerificationFile(e.target.files[0])}
                  accept="image/*,application/pdf"
                />
                <label htmlFor="v-upload-input" className="v-btn-alt">
                  {verificationFile ? "✓ Seçildi" : "Dosya Seç"}
                </label>
              </div>
            )}

            <div className="modal-footer">
              <p className="terms-text">Gönder'e basarak Topluluk Kurallarını ve iftira/yanıltıcı beyan paylaşmadığını kabul etmiş olursun.</p>
              <button
                className="submit-review-btn"
                disabled={isSubmitting}
                onClick={submitReview}
              >
                {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        :root { --p: #0f172a; --a: #b4975a; --bg: #ffffff; --s: #f8fafc; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Outfit', 'Inter', sans-serif; background: white; color: var(--p); -webkit-font-smoothing: antialiased; }
        
        .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
        
        .house-layout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2.5rem; }
        .content-side { min-width: 0; }
        .elite-header-box { margin-bottom: 2.5rem; }
        .gold-label { display: block; color: var(--a); font-weight: 800; font-size: 0.85rem; letter-spacing: 1.5px; margin-bottom: 0.5rem; }
        .pro-house-title { font-size: 3.5rem; font-weight: 950; line-height: 1; letter-spacing: -3px; margin: 0.5rem 0; color: var(--p); }
        .pro-location-text { display: flex; align-items: center; gap: 8px; color: #64748b; font-weight: 600; font-size: 1.1rem; }
        
        .pro-card-white { background: white; border-radius: 32px; padding: 2.5rem; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        
        .house-local-nav { padding: 1.5rem 0; background: #fff; border-bottom: 1px solid #f1f5f9; }
        .nav-wrap { display: flex; justify-content: space-between; align-items: center; }
        .back-circle { width: auto; height: 44px; padding: 0 20px; background: white; border-radius: 22px; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer; text-decoration: none; color: var(--p); transition: 0.3s; font-weight: 700; }
        .back-circle:hover { border-color: var(--a); color: var(--a); transform: translateY(-2px); }
        .nav-group { display: flex; gap: 12px; }

        .card-title { font-size: 1.75rem; font-weight: 900; margin-bottom: 2rem; letter-spacing: -1px; }

        .sticky-box { position: sticky; top: 100px; }
        .pro-trust-card { background: white; padding: 2.5rem; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 15px 35px rgba(0,0,0,0.02); text-align: center; }
        .score-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; margin-bottom: 2rem; }
        .big-val { font-size: 5rem; font-weight: 950; letter-spacing: -4px; }
        .stars-row { display: flex; gap: 4px; margin-bottom: 5px; }
        .btn-primary-elite { width: 100%; background: var(--p); color: white; border: none; padding: 1.25rem; border-radius: 18px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
        .anon-note { font-size: 0.75rem; color: #94a3b8; margin-top: 15px; font-weight: 600; }

        .score-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; margin-bottom: 2rem; }

        /* REVIEW SECTION STYLES */
        .reviews-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
        .badge-count-pro { background: var(--s); color: var(--p); padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; }
        
        .tenant-review-box { padding: 1.5rem; border: 1px solid #f1f5f9; border-radius: 16px; margin-bottom: 1rem; background: #fff; transition: 0.2s; }
        .tenant-review-box:hover { border-color: #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        
        .reviewer-top { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
        .reviewer-avatar { width: 40px; height: 40px; background: var(--s); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--p); }
        .reviewer-info { flex: 1; display: flex; flex-direction: column; }
        .reviewer-info strong { font-size: 0.95rem; color: var(--p); }
        .reviewer-info span { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
        .reviewer-score { background: #fffbeb; padding: 4px 8px; border-radius: 8px; font-weight: 800; font-size: 0.85rem; color: #b45309; display: flex; align-items: center; gap: 4px; border: 1px solid #fef3c7; }
        
        .review-text-pro { font-size: 1rem; line-height: 1.6; color: #334155; font-style: italic; }
        
        .review-pros-cons { display: flex; gap: 15px; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #e2e8f0; }
        .pros, .cons { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; }
        .pros { color: #10b981; } .cons { color: #ef4444; }

        .icon-wrap-top { display: flex; justify-content: center; margin-bottom: 5px; }

        /* REVIEW MODAL STYLES */
        .review-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .review-modal-content { background: white; width: 100%; max-width: 600px; border-radius: 24px; padding: 2rem; box-shadow: 0 25px 50px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 1.5rem; }
        .modal-header h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #64748b; transition: 0.2s; }
        .close-btn:hover { color: #0f172a; }

        .role-selector { display: flex; gap: 10px; background: #f1f5f9; padding: 6px; border-radius: 12px; margin-bottom: 1.5rem; }
        .role-btn { flex: 1; padding: 0.75rem; border: none; background: transparent; font-weight: 700; font-size: 0.9rem; color: #64748b; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .role-btn.active { background: white; color: var(--p); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

        .anon-warning { display: flex; gap: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
        .anon-warning strong { display: block; color: #166534; font-size: 0.9rem; margin-bottom: 4px; }
        .anon-warning p { margin: 0; font-size: 0.8rem; color: #15803d; line-height: 1.5; }

        .rating-questions { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
        .q-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8fafc; padding-bottom: 10px; }
        .q-row span { font-weight: 600; font-size: 0.95rem; color: #334155; }
        
        .interactive-stars { display: flex; align-items: center; }

        .review-text-area { display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; }
        .review-text-area label { font-size: 0.85rem; font-weight: 700; color: #64748b; }
        .review-text-area textarea { width: 100%; height: 120px; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; font-family: inherit; font-size: 0.95rem; resize: vertical; background: #f8fafc; outline: none; transition: 0.3s; }
        .review-text-area textarea:focus { border-color: var(--a); background: white; box-shadow: 0 0 0 3px rgba(180, 151, 90, 0.1); }

        .input-group-pro { display: flex; flex-direction: column; gap: 6px; }
        .input-group-pro label { font-size: 0.8rem; font-weight: 700; color: #64748b; }
        .input-group-pro input { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; outline: none; transition: 0.3s; }
        .input-group-pro input:focus { border-color: var(--a); box-shadow: 0 0 0 3px rgba(180, 151, 90, 0.1); }

        .modal-footer { text-align: center; }
        .terms-text { font-size: 0.75rem; color: #94a3b8; margin-bottom: 1rem; }
        .submit-review-btn { width: 100%; background: var(--p); color: white; border: none; padding: 1.25rem; border-radius: 14px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
        .submit-review-btn:hover { background: #000; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        .verification-upload-box { 
          display: flex; align-items: center; gap: 15px; background: #fffbeb; border: 1px dashed #f59e0b; padding: 1.25rem; border-radius: 16px; margin-bottom: 2rem;
        }
        .v-text-content { flex: 1; }
        .v-text-content strong { display: block; font-size: 0.9rem; color: #b45309; margin-bottom: 2px; }
        .v-text-content p { margin: 0; font-size: 0.75rem; color: #d97706; line-height: 1.4; }
        .v-btn-alt { background: white; border: 1px solid #f59e0b; color: #b45309; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.2s; white-space: nowrap; }
        .v-btn-alt:hover { background: #fef3c7; }

        .google-btn-pro { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700; font-size: 0.95rem; color: #334155; cursor: pointer; transition: 0.2s; }
        .google-btn-pro:hover { background: #f8fafc; border-color: #cbd5e1; }
        
        .auth-divider { display: flex; align-items: center; gap: 15px; margin: 5px 0; }
        .auth-divider::before, .auth-divider::after { content: ""; flex: 1; height: 1px; background: #f1f5f9; }
        .auth-divider span { font-size: 0.8rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        @media (max-width: 1024px) {
          .house-layout-grid { grid-template-columns: 1fr; }
          .sidebar-side { order: -1; }
          .desktop-gallery { height: 400px; }
          .side-thumb { height: 123px; }
          .pro-house-title { font-size: 2.5rem; }
        }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .desktop-gallery { display: none; }
          .mobile-scroll-gallery { 
            display: flex; height: 40vh; overflow-x: auto; scroll-snap-type: x mandatory; 
            scrollbar-width: none; -ms-overflow-style: none;
          }
          .mobile-scroll-gallery::-webkit-scrollbar { display: none; }
          .mobile-slide { flex: 0 0 100%; height: 100%; scroll-snap-align: start; }
          .mobile-slide img { width: 100%; height: 100%; object-fit: cover; }
          .mobile-gallery-badge { position: absolute; bottom: 20px; right: 25px; background: rgba(0,0,0,0.7); color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
          
          .pro-house-title { font-size: 2.2rem; }
          .amenities-strip { gap: 1.5rem; overflow-x: auto; }
          .grid-2-col { grid-template-columns: 1fr; }
          .big-val { font-size: 4rem; }
        }
      `}} />
    </div>
  );
}
