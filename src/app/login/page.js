"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, ChevronLeft, CheckCircle2, Star, Users, Smartphone } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState("login");
  const [loginMethod, setLoginMethod] = useState("email"); // email | phone
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "register") {
        const payload = loginMethod === 'email' ? { name: form.name, email: form.email, password: form.password } : { name: form.name, phone: form.phone, password: form.password };
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
                   <div className="v2-f-icon"><CheckCircle2 size={18}/></div>
                   <div>
                      <strong>%100 Anonimlik</strong>
                      <p>Kimliğiniz her zaman bizde saklı kalır.</p>
                   </div>
                </div>
                <div className="v2-feature-item">
                   <div className="v2-f-icon"><Star size={18}/></div>
                   <div>
                      <strong>Doğrulanmış Bilgi</strong>
                      <p>Sadece gerçek kiracı deneyimleri.</p>
                   </div>
                </div>
                <div className="v2-feature-item">
                   <div className="v2-f-icon"><Users size={18}/></div>
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
                <button className={authMode === 'login' ? 'active' : ''} onClick={() => {setAuthMode('login'); setError("");}}>Giriş Yap</button>
                <button className={authMode === 'register' ? 'active' : ''} onClick={() => {setAuthMode('register'); setError("");}}>Kayıt Ol</button>
             </div>

             <div className="v2-method-selector">
                <button 
                  className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
                  onClick={() => setLoginMethod('email')}
                >
                  <Mail size={14} /> E-posta ile {authMode === 'login' ? 'Giriş' : 'Kayıt'}
                </button>
                <button 
                  className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                  onClick={() => setLoginMethod('phone')}
                >
                  <Smartphone size={14} /> Telefon ile {authMode === 'login' ? 'Giriş' : 'Kayıt'}
                </button>
             </div>

             <form onSubmit={handleSubmit} className="v2-real-form">
                {authMode === "register" && (
                  <div className="v2-input-group">
                    <label>AD SOYAD</label>
                    <input 
                      type="text" 
                      placeholder="Adınız Soyadınız" 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                )}
                
                {loginMethod === 'phone' ? (
                  <div className="v2-input-group">
                    <label>TELEFON NUMARASI</label>
                    <div className="v2-field-iconic phone-field-v2">
                       <span className="country-code">🇹🇷 +90</span>
                       <input 
                         type="tel" 
                         placeholder="5xx xxx xxxx" 
                         value={form.phone}
                         onChange={(e) => setForm({...form, phone: e.target.value})}
                         required
                         pattern="[0-9]{10}"
                       />
                    </div>
                  </div>
                ) : (
                  <div className="v2-input-group">
                    <label>E-POSTA ADRESİ</label>
                    <div className="v2-field-iconic">
                       <Mail size={16} />
                       <input 
                         type="email" 
                         placeholder="isim@mail.com" 
                         value={form.email}
                         onChange={(e) => setForm({...form, email: e.target.value})}
                         required
                       />
                    </div>
                  </div>
                )}

                <div className="v2-input-group">
                   <label>ŞİFRE</label>
                   <div className="v2-field-iconic">
                      <Lock size={16} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        required
                      />
                   </div>
                </div>

                <button type="submit" className="v2-submit-btn" disabled={loading}>
                  {loading ? "İşleniyor..." : (authMode === "login" ? "Oturumu Başlat" : "Hesabımı Oluştur")}
                </button>
             </form>

             <div className="v2-divider"><span>veya</span></div>

             <button className="v2-google-btn" onClick={() => signIn("google", { callbackUrl: "/" })}>
                <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight: '12px'}}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile Devam Et
             </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-v2-container { min-height: 100vh; background: #ffffff; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; font-family: 'Plus Jakarta Sans', sans-serif; }
        .v2-bg-decor { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .v2-circle { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; }
        .v2-c1 { width: 600px; height: 600px; background: #0f172a; top: -150px; left: -100px; }
        .v2-c2 { width: 500px; height: 500px; background: #f59e0b; bottom: -100px; right: -50px; }
        .v2-grid-pattern { position: absolute; inset: 0; background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 30px 30px; opacity: 0.3; }
        .login-v2-content { position: relative; z-index: 10; width: 100%; max-width: 1000px; padding: 2rem; }
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
        .v2-input-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom: 8px; letter-spacing: 0.5px; }
        .v2-input-group input { width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; background: #fdfdfd; font-size: 1rem; font-weight: 600; outline: none; transition: 0.3s; box-sizing: border-box; }
        .v2-input-group input:focus { border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15,23,42,0.06); }
        .v2-field-iconic { position: relative; }
        .v2-field-iconic svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e1; }
        .v2-field-iconic input { padding-left: 48px; }
        
        .phone-field-v2 { display: flex; align-items: center; background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; padding-left: 0; }
        .country-code { padding: 0 14px; background: #f8fafc; border-right: 1px solid #e2e8f0; font-size: 0.85rem; font-weight: 800; color: #0f172a; height: 50px; display: flex; align-items: center; }
        .phone-field-v2 input { border: none !important; box-shadow: none !important; padding-left: 14px; flex: 1; }

        .v2-submit-btn { background: #0f172a; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; margin-top: 10px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15); }
        .v2-submit-btn:hover { background: #000; transform: translateY(-3px); box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
        .v2-submit-btn:disabled { opacity: 0.6; }
        .v2-divider { display: flex; align-items: center; gap: 15px; margin: 2.5rem 0; color: #cbd5e1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .v2-divider::before, .v2-divider::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
        .v2-google-btn { width: 100%; background: white; border: 1px solid #e2e8f0; padding: 16px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #475569; cursor: pointer; transition: 0.2s; }
        .v2-google-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

        @media (max-width: 900px) {
          .v2-card-left { display: none; }
          .v2-card-right { padding: 2.5rem 1.5rem; }
          .v2-auth-card { border-radius: 30px; }
        }
      `}</style>
    </div>
  );
}
