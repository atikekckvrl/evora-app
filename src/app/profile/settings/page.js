"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, MessageSquare, Settings, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Shield
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();

  // Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  // Status State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (!data.error) setProfileData(data);
      } catch (err) { console.error(err); }
    };
    if (status === "authenticated") fetchProfile();
  }, [status]);

  if (status === "unauthenticated") { router.push("/login"); return null; }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Yeni şifreler eşleşmiyor!" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Yeni şifre en az 6 karakter olmalıdır." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      
      if (data.error) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "success", text: "Şifreniz başarıyla değişti." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  const user = profileData || session?.user;
  const joinDate = profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : "";

  return (
    <div className="profile-container-ultra">
      <div className="profile-header-gradient"></div>
      
      <div className="container profile-page-wrapper">
        <div className="unified-dashboard-card">
          {/* SIDEBAR */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-top">
              <div className="avatar-placeholder-large">
                {user?.name?.[0].toUpperCase()}
              </div>
              <div className="sidebar-user-header">
                <h2>{user?.name}</h2>
                <span className="join-label">{joinDate} katıldı</span>
              </div>
            </div>

            <nav className="dashboard-nav">
               <div onClick={() => router.push("/profile")} className="d-nav-item">
                 <User size={20} /> <span>Profilim</span>
               </div>
               <div onClick={() => router.push("/my-reviews")} className="d-nav-item">
                 <MessageSquare size={20} /> 
                 <span>Yorumlarım</span>
                 {profileData?.reviewCount > 0 && <span className="nav-badge-pill">{profileData.reviewCount}</span>}
               </div>
               <div onClick={() => router.push("/profile/settings")} className="d-nav-item active">
                 <Settings size={20} /> <span>Hesap Ayarları</span>
               </div>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="dashboard-main">
            <div className="section-block">
              <div className="section-header-settings">
                <div onClick={() => router.back()} className="back-link">
                  <ArrowLeft size={18} /> Geri Dön
                </div>
                <h3>Güvenlik Ayarları</h3>
              </div>

              <div className="settings-form-wrapper">
                <div className="settings-info-box">
                  <Shield size={22} className="shield-icon" />
                  <div>
                    <strong>Şifre Güncelleme</strong>
                    <p>Hesabınızın güvenliği için güçlü ve benzersiz bir şifre seçtiğinizden emin olun.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="password-form-elite">
                   <div className="form-group">
                      <label>MEVCUT ŞİFRE</label>
                      <div className="input-icon-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input 
                          type={showPass ? "text" : "password"} 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          required 
                        />
                        <div onClick={() => setShowPass(!showPass)} className="eye-toggle">
                           {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                      </div>
                   </div>

                   <div className="form-grid-pass">
                      <div className="form-group">
                        <label>YENİ ŞİFRE</label>
                        <div className="input-icon-wrapper">
                          <Lock size={18} className="input-icon" />
                          <input 
                            type={showPass ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Yeni şifreniz"
                            required 
                          />
                          <div onClick={() => setShowPass(!showPass)} className="eye-toggle">
                             {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>YENİ ŞİFRE (TEKRAR)</label>
                        <div className="input-icon-wrapper">
                          <Lock size={18} className="input-icon" />
                          <input 
                            type={showPass ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Tekrar yazın"
                            required 
                          />
                          <div onClick={() => setShowPass(!showPass)} className="eye-toggle">
                             {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                          </div>
                        </div>
                      </div>
                   </div>

                   {message.text && (
                     <div className={`status-message-elite ${message.type}`}>
                        {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                     </div>
                   )}

                   <button type="submit" disabled={loading} className="btn-save-settings">
                      {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                   </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .profile-container-ultra { min-height: 100vh; background: #f8fafc; padding-bottom: 5rem; }
        .profile-header-gradient { height: 150px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); width: 100%; }
        .profile-page-wrapper { margin-top: -60px; position: relative; z-index: 10; max-width: 1200px; padding: 0 20px; margin-left: auto; margin-right: auto; }

        .unified-dashboard-card { background: white; border-radius: 40px; display: flex; box-shadow: 0 40px 100px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; min-height: 700px; overflow: hidden; }

        /* SIDEBAR */
        .dashboard-sidebar { width: 300px; background: #fbfcfd; border-right: 1px solid #f1f5f9; padding: 3rem 1.5rem; display: flex; flex-direction: column; }
        .avatar-placeholder-large { width: 100px; height: 100px; background: #0f172a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 800; border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); margin: 0 auto; }
        .sidebar-user-header { text-align: center; margin-top: 1rem; margin-bottom: 2.5rem; }
        .sidebar-user-header h2 { font-size: 1.25rem; font-weight: 950; color: #0f172a; letter-spacing: -1px; margin-bottom: 4px; }
        .join-label { font-size: 0.7rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

        .dashboard-nav { display: flex; flex-direction: column; gap: 10px; }
        .d-nav-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; cursor: pointer; color: #64748b; font-weight: 800; font-size: 0.95rem; border-radius: 18px; transition: 0.3s; }
        .d-nav-item:hover { background: #f1f5f9; color: #0f172a; transform: translateX(5px); }
        .d-nav-item.active { background: #0f172a; color: white; box-shadow: 0 10px 25px rgba(15,23,42,0.15); }
        .nav-badge-pill { background: #ef4444; color: white; font-size: 0.65rem; padding: 2px 10px; border-radius: 12px; margin-left: auto; font-weight: 900; }

        /* MAIN */
        .dashboard-main { flex: 1; padding: 4rem; background: white; }
        .section-header-settings { margin-bottom: 3rem; }
        .back-link { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 0.85rem; font-weight: 800; margin-bottom: 1rem; cursor: pointer; transition: 0.2s; }
        .back-link:hover { color: #0f172a; transform: translateX(-5px); }
        .section-header-settings h3 { font-size: 2rem; font-weight: 950; color: #0f172a; letter-spacing: -1.5px; margin: 0; }

        .settings-form-wrapper { max-width: 600px; }
        .settings-info-box { display: flex; gap: 1.5rem; background: #f8fafc; padding: 1.5rem; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 3rem; align-items: center; }
        .shield-icon { color: #0f172a; flex-shrink: 0; }
        .settings-info-box strong { display: block; font-size: 1rem; color: #0f172a; margin-bottom: 4px; }
        .settings-info-box p { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0; }

        .password-form-elite { display: flex; flex-direction: column; gap: 2rem; }
        .form-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 12px; }
        .input-icon-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 18px; color: #cbd5e1; }
        .input-icon-wrapper input { width: 100%; padding: 1.1rem 1.4rem 1.1rem 3.5rem; background: #fbfcfd; border: 1px solid #f1f5f9; border-radius: 18px; font-weight: 700; color: #0f172a; font-size: 1rem; transition: 0.3s; }
        .input-icon-wrapper input:focus { border-color: #0f172a; background: white; outline: none; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        .eye-toggle { position: absolute; right: 18px; color: #cbd5e1; cursor: pointer; display: flex; align-items: center; transition: 0.2s; }
        .eye-toggle:hover { color: #0f172a; transform: scale(1.1); }

        .form-grid-pass { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .btn-save-settings { background: #0f172a; color: white; border: none; padding: 1.25rem; border-radius: 18px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; margin-top: 1rem; box-shadow: 0 15px 35px rgba(15,23,42,0.15); }
        .btn-save-settings:hover { transform: translateY(-3px); box-shadow: 0 20px 45px rgba(15,23,42,0.2); }
        .btn-save-settings:disabled { opacity: 0.6; cursor: not-allowed; }

        .status-message-elite { display: flex; align-items: center; gap: 10px; padding: 1.25rem; border-radius: 18px; font-size: 0.9rem; font-weight: 800; }
        .status-message-elite.success { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
        .status-message-elite.error { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }

        @media (max-width: 768px) {
          .unified-dashboard-card { flex-direction: column; border-radius: 0; }
          .dashboard-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #f1f5f9; }
          .form-grid-pass { grid-template-columns: 1fr; }
          .dashboard-main { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
