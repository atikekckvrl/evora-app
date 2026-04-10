"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, ChevronLeft, CheckCircle2, Star, Users, Smartphone, UploadCloud } from "lucide-react";
import Link from "next/link";

const USER_TYPES = [
  { id: "STUDENT", label: "Öğrenci" },
  { id: "EMPLOYEE", label: "Beyaz Yakalı" },
  { id: "FAMILY", label: "Aile" },
  { id: "LANDLORD", label: "Ev Sahibi" }
];

const INTEREST_OPTIONS = [
  "Sessizlik Arıyorum", "Ulaşıma Yakın Olsun", "Evcil Hayvan Dostu",
  "Sosyal Çevre", "Spor & Doğa", "Uygun Fiyatlı", "Güvenlik"
];

const AVATAR_OPTIONS = [
  { id: "house", icon: "🏠", label: "Ev" },
  { id: "key", icon: "🔑", label: "Anahtar" },
  { id: "tree", icon: "🌳", label: "Ağaç" },
  { id: "star", icon: "⭐", label: "Yıldız" },
  { id: "coffee", icon: "☕", label: "Kahve" }
];

export default function LoginPage() {
  const [authMode, setAuthMode] = useState("login");
  const [loginMethod, setLoginMethod] = useState("email"); // email | phone
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    userType: "", interests: [], avatarSelection: "house", linkedInUrl: "", verificationDoc: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const handleInterestToggle = (int) => {
    if (form.interests.includes(int)) {
      setForm({ ...form, interests: form.interests.filter(i => i !== int) });
    } else {
      if (form.interests.length < 3) {
        setForm({ ...form, interests: [...form.interests, int] });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, verificationDoc: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (authMode === "register" && !form.userType) {
      setError("Lütfen Kullanıcı Tipinizi seçin.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (authMode === "register" && !acceptedTerms) {
      setError("Kayıt olabilmek için KVKK ve Kullanım Koşulları'nı kabul etmelisiniz.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      if (authMode === "register") {
        const payload = {
          ...form,
          email: loginMethod === 'email' ? form.email : undefined,
          phone: loginMethod === 'phone' ? form.phone : undefined
        };
        const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success) {
          const loginCreds = loginMethod === 'email' ? { email: form.email, password: form.password } : { phone: form.phone, password: form.password };
          await signIn("credentials", { ...loginCreds, callbackUrl: "/" });
        } else { setError(data.error || "Bir hata oluştu."); }
      } else {
        const credentials = loginMethod === 'email' ? { email: form.email, password: form.password } : { phone: form.phone, password: form.password };
        const result = await signIn("credentials", { ...credentials, redirect: false });
        if (result.error) { setError(loginMethod === 'email' ? "E-posta veya şifre hatalı." : "Telefon veya şifre hatalı."); }
        else { router.push("/"); router.refresh(); }
      }
    } catch (err) { setError("Bağlantı hatası."); } finally { setLoading(false); }
  };

  return (
    <div className="login-v2-container">
      <div className="v2-bg-decor">
        <div className="v2-circle v2-c1"></div>
        <div className="v2-circle v2-c2"></div>
        <div className="v2-grid-pattern"></div>
      </div>

      <div className="login-v2-content">
        <div className="v2-nav-top">
          <Link href="/" className="v2-back-link">
            <ChevronLeft size={20} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        <div className="v2-auth-card">
          <div className="v2-card-left desktop-only">
            <div className="v2-brand-area">
              <ShieldCheck size={40} className="v2-logo-icon" />
              <h2>EVORA</h2>
            </div>
            <div className="v2-feature-list">
              <div className="v2-feature-item">
                <div className="v2-f-icon"><CheckCircle2 size={18} /></div>
                <div>
                  <strong>%100 Anonimlik</strong>
                  <p>Kimliğiniz her zaman bizde saklı kalır.</p>
                </div>
              </div>
              <div className="v2-feature-item">
                <div className="v2-f-icon"><Star size={18} /></div>
                <div>
                  <strong>Doğrulanmış Bilgi</strong>
                  <p>Sadece gerçek kiracı deneyimleri.</p>
                </div>
              </div>
              <div className="v2-feature-item">
                <div className="v2-f-icon"><Users size={18} /></div>
                <div>
                  <strong>Geniş Topluluk</strong>
                  <p>Binlerce adreste gerçek kullanıcı yorumu.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="v2-card-right">
            <div className="v2-form-header">
              <h3>{authMode === 'login' ? 'Tekrar Hoş Geldin!' : 'Yeni Hesap Aç'}</h3>
              <p>{authMode === 'login' ? 'Oturum açarak devam et.' : 'Dürüst emlak ağına hemen katıl.'}</p>
            </div>

            {error && <div className="v2-error-box">{error}</div>}

            <div className="v2-tabs-wrap">
              <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setError(""); }}>Giriş Yap</button>
              <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => { setAuthMode('register'); setError(""); }}>Kayıt Ol</button>
            </div>

            <div className="v2-method-selector">
              <button
                type="button"
                className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
                onClick={() => setLoginMethod('email')}
              >
                <Mail size={14} /> E-posta ile {authMode === 'login' ? 'Giriş' : 'Kayıt'}
              </button>
              <button
                type="button"
                className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                onClick={() => setLoginMethod('phone')}
              >
                <Smartphone size={14} /> Telefon ile {authMode === 'login' ? 'Giriş' : 'Kayıt'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="v2-real-form">
              {authMode === "register" && (
                <>
                  <div className="v2-input-group">
                    <label>AD SOYAD</label>
                    <input
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="v2-input-group">
                    <label>KULLANICI TİPİ <span className="req-star">*</span></label>
                    <p className="v2-input-hint">Profilinizin anonim olarak kimin gözünden yorum yaptığını gösterir.</p>
                    <div className="v2-pill-group">
                      {USER_TYPES.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          className={`v2-pill ${form.userType === type.id ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, userType: type.id })}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {loginMethod === 'phone' ? (
                <div className="v2-input-group">
                  <label>TELEFON NUMARASI <span className="req-star">*</span></label>
                  <div className="v2-field-iconic phone-field-v2">
                    <span className="country-code">🇹🇷 +90</span>
                    <input
                      type="tel"
                      placeholder="5xx xxx xxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              ) : (
                <div className="v2-input-group">
                  <label>E-POSTA ADRESİ <span className="req-star">*</span></label>
                  <div className="v2-field-iconic">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="isim@mail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="v2-input-group">
                <label>ŞİFRE <span className="req-star">*</span></label>
                <div className="v2-field-iconic">
                  <Lock size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {authMode === "register" && (
                <div className="elite-register-fields">
                  <div className="v2-divider"><span>Premium Profil Detayları</span></div>

                  <div className="v2-input-group">
                    <label>İLGİ ALANLARI / YAŞAM TARZI (EN FAZLA 3)</label>
                    <p className="v2-input-hint">İlanları ve yorumları size göre kişiselleştirmemize yardımcı olur.</p>
                    <div className="v2-tag-group">
                      {INTEREST_OPTIONS.map(int => (
                        <button
                          key={int}
                          type="button"
                          className={`v2-tag ${form.interests.includes(int) ? 'active' : ''}`}
                          onClick={() => handleInterestToggle(int)}
                        >
                          {int}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="v2-input-group">
                    <label>PREMIUM EVORA AVATARI</label>
                    <p className="v2-input-hint">Toplulukta görünecek anonim simgeniz.</p>
                    <div className="v2-avatar-selector">
                      {AVATAR_OPTIONS.map(av => (
                        <button
                          key={av.id}
                          type="button"
                          className={`v2-avatar-btn ${form.avatarSelection === av.id ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, avatarSelection: av.id })}
                          title={av.label}
                        >
                          {av.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="v2-input-group">
                    <label>"ELITE / VERIFIED" ROZETİ İÇİN KANIT (OPSİYONEL)</label>
                    <p className="v2-input-hint">Faturalarınızı (hassas bilgileri gizleyerek) yükleyip onaylı kiracı olabilirsiniz.</p>
                    <label className="v2-file-upload">
                      <UploadCloud size={20} />
                      <span>{form.verificationDoc ? form.verificationDoc : "Dosya veya Görsel Yükle"}</span>
                      <input type="file" accept="image/*,.pdf" onChange={handleFileChange} />
                    </label>
                  </div>

                  <div className="v2-input-group">
                    <label>LINKEDIN ILE DOĞRULAN (OPSİYONEL)</label>
                    <p className="v2-input-hint">Profilinize sadece "LinkedIn Onaylı" rozeti eklenir, link görünmez.</p>
                    <div className="v2-field-iconic linkedin-field">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/profil"
                        value={form.linkedInUrl}
                        onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {authMode === "register" && (
                <div className="v2-terms-checkbox" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{ marginTop: '4px', width: 'auto', outline: 'none', boxShadow: 'none' }}
                  />
                  <label htmlFor="acceptTerms" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', lineHeight: '1.5', margin: 0, textTransform: 'none' }}>
                    <Link href="/legal/kvkk" target="_blank" style={{ color: '#0f172a', fontWeight: 'bold' }}>KVKK Aydınlatma Metni</Link>'ni ve{' '}
                    <Link href="/legal/terms" target="_blank" style={{ color: '#0f172a', fontWeight: 'bold' }}>Kullanım Koşulları</Link>'nı okudum ve kabul ediyorum.
                  </label>
                </div>
              )}

              <button type="submit" className="v2-submit-btn" disabled={loading}>
                {loading ? "İşleniyor..." : (authMode === "login" ? "Oturumu Başlat" : "Hesabımı Oluştur")}
              </button>
            </form>

            <div className="v2-divider"><span>veya</span></div>

            <button type="button" className="v2-google-btn" onClick={() => signIn("google", { callbackUrl: "/" })}>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '12px' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google ile Devam Et
            </button>
          </div>
        </div>
      </div >

      <style jsx>{`
        .login-v2-container { 
          min-height: 100vh; 
          background: #ffffff; 
          position: relative; 
          display: flex; 
          align-items: flex-start;
          justify-content: center; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          padding: 3rem 1rem;
          box-sizing: border-box;
        }
        .v2-bg-decor { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
        .v2-circle { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; }
        .v2-c1 { width: 600px; height: 600px; background: #0f172a; top: -150px; left: -100px; }
        .v2-c2 { width: 500px; height: 500px; background: #f59e0b; bottom: -100px; right: -50px; }
        .v2-grid-pattern { position: absolute; inset: 0; background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 30px 30px; opacity: 0.3; }
        
        .login-v2-content { position: relative; z-index: 10; width: 100%; max-width: 1000px; margin-top: 2rem; }
        .v2-nav-top { margin-bottom: 2rem; }
        .v2-back-link { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: #94a3b8; font-weight: 700; font-size: 0.9rem; transition: 0.3s; }
        .v2-back-link:hover { color: #0f172a; transform: translateX(-4px); }
        
        .v2-auth-card { background: #ffffff; border-radius: 40px; display: flex; box-shadow: 0 50px 100px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; min-height: 650px; }
        .v2-card-left { flex: 1; background: #0f172a; padding: 4rem; color: white; display: flex; flex-direction: column; }
        .v2-brand-area { display: flex; align-items: center; gap: 12px; margin-bottom: 5rem; }
        .v2-brand-area h2 { font-weight: 950; font-size: 1.8rem; letter-spacing: -1px; }
        .v2-logo-icon { color: #f59e0b; }
        .v2-feature-list { display: flex; flex-direction: column; gap: 2.5rem; }
        .v2-feature-item { display: flex; gap: 20px; }
        .v2-f-icon { width: 44px; height: 44px; background: rgba(255,255,255,0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #f59e0b; }
        .v2-feature-item strong { display: block; font-size: 1.1rem; margin-bottom: 4px; }
        .v2-feature-item p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; }
        
        .v2-card-right { flex: 1.2; padding: 4rem; background: white; }
        .v2-form-header h3 { font-size: 2rem; font-weight: 900; color: #0f172a; letter-spacing: -1px; margin-bottom: 8px; }
        .v2-form-header p { color: #64748b; margin-bottom: 2rem; }
        .v2-error-box { background: #fee2e2; color: #ef4444; padding: 1rem; border-radius: 12px; font-weight: 700; font-size: 0.85rem; margin-bottom: 2rem; text-align: center; }
        
        .v2-tabs-wrap { display: flex; gap: 8px; background: #f8fafc; padding: 6px; border-radius: 16px; margin-bottom: 1.5rem; }
        .v2-tabs-wrap button { flex: 1; border: none; background: transparent; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; color: #94a3b8; cursor: pointer; transition: 0.2s; }
        .v2-tabs-wrap button.active { background: white; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .v2-method-selector { display: flex; gap: 10px; margin-bottom: 2rem; justify-content: center; }
        .method-btn { background: #f1f5f9; border: none; padding: 8px 16px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; color: #64748b; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
        .method-btn.active { background: #0f172a; color: white; }

        .v2-real-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .v2-input-group { margin-bottom: 0.5rem; }
        .v2-input-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; letter-spacing: 0.5px; text-transform: uppercase; }
        .req-star { color: #ef4444; }
        .v2-input-hint { font-size: 0.75rem; color: #cbd5e1; margin-bottom: 8px; font-weight: 500; }
        
        .v2-input-group input[type="text"], 
        .v2-input-group input[type="email"], 
        .v2-input-group input[type="password"], 
        .v2-input-group input[type="tel"],
        .v2-input-group input[type="url"] { width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; background: #fdfdfd; font-size: 1rem; font-weight: 600; outline: none; transition: 0.3s; box-sizing: border-box; }
        .v2-input-group input:focus { border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15,23,42,0.06); }
        
        .v2-field-iconic { position: relative; }
        .v2-field-iconic svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e1; }
        .v2-field-iconic input { padding-left: 48px !important; }
        
        .phone-field-v2 { display: flex; align-items: center; background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; padding-left: 0; }
        .country-code { padding: 0 14px; background: #f8fafc; border-right: 1px solid #e2e8f0; font-size: 0.85rem; font-weight: 800; color: #0f172a; height: 50px; display: flex; align-items: center; }
        .phone-field-v2 input { border: none !important; box-shadow: none !important; padding-left: 14px !important; flex: 1; }

        .linkedin-field svg { color: #0077b5; }
        
        /* New Custom Fields CSS */
        .elite-register-fields { padding-top: 1rem; animation: fadeIn 0.4s ease; }
        
        .v2-pill-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .v2-pill { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer; color: #64748b; transition: 0.2s; white-space: nowrap; }
        .v2-pill:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .v2-pill.active { background: #0f172a; color: white; border-color: #0f172a; box-shadow: 0 4px 12px rgba(15,23,42,0.1); transform: translateY(-2px); }

        .v2-tag-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .v2-tag { background: white; border: 2px dashed #e2e8f0; padding: 8px 14px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; cursor: pointer; color: #94a3b8; transition: 0.3s; }
        .v2-tag.active { border-style: solid; border-color: #f59e0b; color: #f59e0b; background: rgba(245, 158, 11, 0.05); }

        .v2-avatar-selector { display: flex; gap: 12px; flex-wrap: wrap; }
        .v2-avatar-btn { width: 50px; height: 50px; border-radius: 16px; border: 2px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; transition: 0.3s; }
        .v2-avatar-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
        .v2-avatar-btn.active { border-color: #0f172a; background: #f8fafc; transform: scale(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

        .v2-file-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 1.5rem; background: #f8fafc; cursor: pointer; transition: 0.3s; color: #64748b; font-weight: 700; font-size: 0.85rem; gap: 8px; text-align: center; }
        .v2-file-upload:hover { border-color: #94a3b8; background: #f1f5f9; color: #0f172a; }
        .v2-file-upload input { display: none; }

        .v2-submit-btn { background: #0f172a; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; margin-top: 10px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15); width: 100%; }
        .v2-submit-btn:hover { background: #000; transform: translateY(-3px); box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
        .v2-submit-btn:disabled { opacity: 0.6; }
        
        .v2-divider { display: flex; align-items: center; gap: 15px; margin: 2.5rem 0; color: #cbd5e1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .v2-divider::before, .v2-divider::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
        
        .v2-google-btn { width: 100%; background: white; border: 1px solid #e2e8f0; padding: 16px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #475569; cursor: pointer; transition: 0.2s; }
        .v2-google-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .login-v2-container { padding: 1rem; display: block; overflow-y: auto; }
          .v2-card-left { display: none; }
          .v2-card-right { padding: 2.5rem 1.5rem; }
          .v2-auth-card { border-radius: 30px; }
        }
      `}</style>
    </div >
  );
}
