"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, MapPin, Star, ShieldCheck, TrendingUp, ArrowRight, Home as HomeIcon, UserCheck, MessageSquare, Building2, CheckCircle2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchTxt, setSearchTxt] = useState("");
  const [latestHouses, setLatestHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/houses");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLatestHouses(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Son incelemeler yüklenemedi:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleAddHouse = (e) => {
    e.preventDefault();
    if (!session) {
      router.push("/login?callbackUrl=/house/new");
    } else {
      router.push("/house/new");
    }
  };

  return (
    <div className="pro-container">
      {/* PROFESSIONAL SPLIT HERO */}
      <section className="hero-split">
        <div className="hero-split-content">
          <div className="hero-info reveal">
            <div className="pro-badge">
              <CheckCircle2 size={16} />
              <span>Doğrulanmış Kiracı Ağı</span>
            </div>
            <h1 className="display-lg">
              Gerçek Deneyimler, <br />
              <span className="text-gradient-gold">Akıllı Seçimler.</span>
            </h1>
            <p className="hero-desc">
              Ev orası, ama huzur neresi? <br />
              Taşınmadan önce komşuları, ev sahibini ve binanın gerçek durumunu öğrenin.
              <span style={{ display: 'block', marginTop: '15px', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '700' }}>
                🛡️ Doğrulanmış rozetleri, kira belgesi sunan gerçek kiracıları temsil eder.
              </span>
            </p>

            <div className="hero-actions">
              <div className="search-professional">
                <div className="search-field">
                  <MapPin size={22} className="icon-gold" />
                  <input
                    type="text"
                    placeholder="Altıeylül'de mahalle, sokak veya bina..."
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                  />
                </div>
                <Link href={`/search?q=${searchTxt}`} style={{ display: 'contents' }}>
                  <button className="btn btn-navy">
                    <Search size={20} />
                    <span className="desktop-text">Bul</span>
                  </button>
                </Link>
              </div>

              <button className="btn-outline-gold" onClick={handleAddHouse}>
                <HomeIcon size={20} />
                <span className="desktop-text">Yeni Ev Ekle</span>
              </button>
            </div>

            <div className="pro-stats">
              <div className="stat"><strong>5.000+</strong> <span>Aktif Yorum</span></div>
              <div className="stat"><strong>%100</strong> <span>Anonimlik</span></div>
              <div className="stat"><strong>7/24</strong> <span>Moderasyon</span></div>
            </div>
          </div>
        </div>
        <div className="hero-split-image desktop-only">
          <div className="overlay-gradient"></div>
          <img src="/hero.png" alt="Modern House Interior" className="hero-main-img" />
        </div>
      </section>

      {/* HOW IT WORKS - PROFESSIONAL */}
      <section id="nasil-calisir" className="section bg-soft">
        <div className="container">
          <div className="section-title-center reveal">
            <span className="gold-label">PROSES</span>
            <h2>Evora Nasıl Çalışır?</h2>
          </div>
          <div className="pro-steps-grid">
            <div className="pro-step-card card-pro reveal" style={{ animationDelay: '0.1s' }}>
              <div className="pro-step-icon"><Search size={32} /></div>
              <h3>Adresi Belirle</h3>
              <p>Türkiye genelindeki binlerce kayıtlı adres arasından ilgilendiğin evi bul.</p>
            </div>
            <div className="pro-step-card card-pro reveal" style={{ animationDelay: '0.2s' }}>
              <div className="pro-step-icon"><UserCheck size={32} /></div>
              <h3>İncelemeleri Oku</h3>
              <p>Ev sahibi tutumundan tesisat durumuna kadar her detayı dürüstçe incele.</p>
            </div>
            <div className="pro-step-card card-pro reveal" style={{ animationDelay: '0.3s' }}>
              <div className="pro-step-icon"><MessageSquare size={32} /></div>
              <h3>Deneyimini Paylaş</h3>
              <p>Kendi deneyimini anonim olarak yaz, topluluğun rehberi ol.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS - CLEAN & CORPORATE */}
      <section className="section container">
        <div className="section-header-pro reveal">
          <h2>Son İncelemeler</h2>
          <Link href="/search" className="pro-link" style={{ textDecoration: 'none' }}>Tümünü Listeleyin <ArrowRight size={18} /></Link>
        </div>

        <div className="house-list-pro">
          {latestHouses.length === 0 && !isLoading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '20px', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Henüz hiç inceleme yapılmamış. İlk incelemeyi siz yapın!</p>
              <Link href="/house/new" className="btn btn-navy" style={{ textDecoration: 'none', display: 'inline-flex', gap: '8px' }}>
                <HomeIcon size={18} />
                <span>Bir Ev Kaydet</span>
              </Link>
            </div>
          )}

          {latestHouses.map((house, i) => (
            <div key={house.id} className="house-item-pro reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="house-img-pro">
                <div className="badge-verified">
                  <ShieldCheck size={14} />
                  DOĞRULANMIŞ
                </div>
                <img src="/apartman.jpg" alt="House" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="house-body-pro">
                <span className="tag-location">{(house.location || "Balıkesir").toUpperCase()}</span>
                <h3>{house.title}</h3>
                <div className="house-rating-pro">
                  <div className="stars-fill">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= Math.round(house.rating) ? "#b4975a" : "transparent"}
                        stroke="#b4975a"
                      />
                    ))}
                  </div>
                  <span>{house.rating > 0 ? `${house.rating} (${house.reviews} Yorum)` : "Henüz Puanlanmamış"}</span>
                </div>
                <p>Bu konut hakkında yapılan son değerlendirmeleri görmek için detayları inceleyin.</p>
                <div className="house-footer-pro">
                  <span className="user-ref">Evora Üyesi</span>
                  <Link href={`/house/${house.id}`} className="btn-small" style={{ textDecoration: 'none' }}>Detay <ArrowRight size={14} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US - HAKKIMIZDA */}
      <section id="hakkimizda" className="section bg-soft" style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <div className="section-title-center reveal">
            <span className="gold-label">BİZ KİMİZ?</span>
            <h2>Hakkımızda</h2>
          </div>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2rem" }}>
            Evora, Türkiye'nin ilk ve tek şeffaf emlak deneyimi platformudur. Amacımız, kiracıların ve ev sahiplerinin sürprizlerden uzak, %100 doğrulanmış yorumlar ışığında güvenli kararlar almasını sağlamaktır. Dürüstlük en büyük ilkemizdir.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="pro-badge" style={{ margin: 0 }}><ShieldCheck size={16} /> %100 Şeffaflık</div>
            <div className="pro-badge" style={{ margin: 0 }}><UserCheck size={16} /> Doğrulanmış Kullanıcılar</div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 90vh; background: #fff; position: relative; }
        .hero-split-content { display: flex; align-items: center; padding: 4rem 5%; position: relative; z-index: 2; } /* Mobilde dengeleme için azaltıldı */
        .hero-info { max-width: 600px; margin: 0 auto; position: relative; z-index: 3; } /* Mobilde ortalama için */
        
        .pro-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--accent-soft); color: var(--accent); padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
        .hero-desc { font-size: 1.25rem; color: var(--text-muted); line-height: 1.6; margin-top: 1.5rem; }

        .hero-split-image { position: relative; overflow: hidden; background: #000; }
        .hero-main-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
        .overlay-gradient { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, white, transparent 20%); z-index: 1; pointer-events: none; }

        .hero-actions { display: flex; gap: 1rem; margin-top: 3rem; align-items: stretch; }
        .search-professional { display: flex; background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.5rem; box-shadow: var(--shadow-sm); flex: 1; }
        .search-field { flex: 1; display: flex; align-items: center; padding: 0 1rem; gap: 12px; }
        .search-field input { border: none; outline: none; width: 100%; font-size: 0.95rem; font-weight: 600; color: var(--primary); }
        .icon-gold { color: var(--accent); }
        
        .btn-outline-gold { background: transparent; color: var(--accent); border: 2px solid var(--accent); border-radius: var(--radius-md); padding: 0 1.5rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; position: relative; overflow: hidden; z-index: 1; }
        .btn-outline-gold::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: var(--accent); z-index: -1; transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-outline-gold:hover { color: white; box-shadow: 0 10px 20px rgba(180, 151, 90, 0.25); transform: translateY(-2px); }
        .btn-outline-gold:hover::before { transform: scaleX(1); }


        .pro-stats { display: flex; gap: 3rem; margin-top: 4rem; border-top: 1px solid var(--border); padding-top: 2rem; justify-content: center; }
        .stat strong { display: block; font-size: 1.5rem; font-weight: 800; color: var(--primary); }
        .stat span { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }

        .section-title-center { text-align: center; margin-bottom: 5rem; padding: 0 1rem; }
        .section-title-center h2 { font-size: 3rem; color: var(--primary); letter-spacing: -1.5px; }
        .gold-label { color: var(--accent); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }

        .pro-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .pro-step-icon { width: 70px; height: 70px; background: var(--primary); color: white; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .pro-step-card { padding: 2rem; border: 1px solid var(--border); border-radius: 1.5rem; }
        .pro-step-card h3 { margin-bottom: 1rem; font-size: 1.4rem; }
        .pro-step-card p { color: var(--text-muted); line-height: 1.6; }

        .section-header-pro { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
        .section-header-pro h2 { font-size: 2.5rem; letter-spacing: -1px; }
        .pro-link { background: transparent; border: none; font-weight: 800; color: var(--accent); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; transition: 0.3s; }

        .house-list-pro { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
        .house-item-pro { border-bottom: 1px solid var(--border); padding-bottom: 2rem; transform: translateZ(0); }
        .house-img-pro { height: 220px; background: #f1f5f9; position: relative; border-radius: var(--radius-md); overflow: hidden; }
        .badge-verified { position: absolute; top: 1rem; left: 1rem; background: var(--primary); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.65rem; font-weight: 900; letter-spacing: 1px; display: flex; align-items: center; gap: 4px; }
        
        .house-body-pro { padding: 1.5rem 0; }
        .tag-location { font-size: 0.75rem; font-weight: 800; color: var(--accent); letter-spacing: 0.5px; display: block; margin-bottom: 0.5rem; }
        .house-body-pro h3 { font-size: clamp(1.1rem, 4vw, 1.4rem); margin-bottom: 0.75rem; }
        .house-rating-pro { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; font-size: 0.85rem; font-weight: 600; }
        .house-body-pro p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.5; }

        .house-footer-pro { display: flex; justify-content: space-between; align-items: center; }
        .user-ref { font-size: 0.85rem; font-weight: 700; color: var(--primary); opacity: 0.6; }
        .btn-small { background: transparent; border: 1px solid var(--border); padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.3s; }

        .bg-soft { background: #f8fafc; }

        /* PROFESSIONAL FOOTER */
        .footer-pro { background: var(--primary); color: white; padding: 4rem 0 2rem; margin-top: 4rem; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
        .footer-brand h2 { color: var(--accent); font-size: 1.8rem; margin-bottom: 1rem; }
        .footer-brand p { color: #94a3b8; max-width: 300px; }
        .footer-links h4 { margin-bottom: 1.5rem; font-weight: 800; }
        .footer-links ul { list-style: none; padding: 0; }
        .footer-links li { margin-bottom: 0.75rem; color: #94a3b8; font-size: 0.9rem; cursor: pointer; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center; color: #475569; font-size: 0.8rem; }

        @media (max-width: 1024px) {
          .hero-split { grid-template-columns: 1fr; min-height: auto; }
          .hero-split-content { padding: 6rem 1.5rem; text-align: center; width: 100%; box-sizing: border-box; }
          .hero-info { width: 100%; }
          .display-lg { font-size: 2.8rem; letter-spacing: -2px; }
          .hero-actions { flex-direction: column; gap: 1rem; padding: 1rem; }
          .search-professional { flex-direction: column; gap: 10px; width: 100%; box-sizing: border-box; }
          .btn-outline-gold { padding: 1rem; width: 100%; }
          .pro-steps-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .house-list-pro { grid-template-columns: 1fr; padding: 0 1rem; }
          .section-title-center h2 { font-size: 2.2rem; }
          .footer-grid { grid-template-columns: 1fr; text-align: center; gap: 3rem; }
          .footer-brand p { margin: 0 auto; }
          .pro-stats { flex-wrap: wrap; gap: 2rem; }
          .desktop-only { display: none; }
        }

        @media (max-width: 480px) {
          .display-lg { font-size: 2.2rem; }
          .hero-desc { font-size: 1rem; }
          .section { padding: 4rem 0; }
          .desktop-text { display: none; }
        }
      `}} />
    </div>
  );
}
