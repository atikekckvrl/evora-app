"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Shield, MessageSquare, Calendar, Settings, ChevronRight, Edit3, Camera, Star, Lock
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (!data.error) setProfileData(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (status === "authenticated") fetchProfile();
  }, [status]);

  if (status === "unauthenticated") { router.push("/login"); return null; }

  if (status === "loading" || loading) {
    return (
      <div className="loading-screen-elite">
        <div className="loader-pro"></div>
        <span>Verileriniz Hazırlanıyor...</span>
      </div>
    );
  }

  const user = profileData || session?.user;
  const joinDate = profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : "";

  // Blue link sorununu kökten çözen yönlendirme fonksiyonu
  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="profile-container-ultra">
      <div className="profile-header-gradient"></div>
      
      <div className="container profile-page-wrapper">
        <div className="unified-dashboard-card">
          {/* LEFT SIDEBAR */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-top">
              <div className="avatar-wrapper-pro">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="main-avatar" />
                ) : (
                  <div className="avatar-placeholder-large">
                    {user?.name?.[0].toUpperCase()}
                  </div>
                )}
                <button className="edit-avatar-btn"><Camera size={14}/></button>
              </div>
              <div className="sidebar-user-header">
                <h2>{user?.name}</h2>
                <span className="join-label">{joinDate} katıldı</span>
              </div>
            </div>

            <div className="dashboard-nav">
               <div onClick={() => navigateTo("/profile")} className="d-nav-item active">
                 <User size={20} /> <span>Profilim</span>
               </div>
               <div onClick={() => navigateTo("/my-reviews")} className="d-nav-item">
                 <MessageSquare size={20} /> 
                 <span>Yorumlarım</span>
                 {profileData?.reviewCount > 0 && <span className="nav-badge-pill">{profileData.reviewCount}</span>}
               </div>
               <div onClick={() => navigateTo("/profile/settings")} className="d-nav-item">
                 <Settings size={20} /> <span>Hesap Ayarları</span>
               </div>
            </div>

            <div className="sidebar-bottom-stats">
               <div className="mini-stat">
                  <strong>{profileData?.favoriteCount || 0}</strong>
                  <span>Favori</span>
               </div>
               <div className="mini-stat">
                  <strong>{profileData?.reviewCount || 0}</strong>
                  <span>Katkı</span>
               </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="dashboard-main">
            <div className="section-block">
              <div className="section-header">
                <h3>Kişisel Bilgiler</h3>
                <button className="btn-edit-pro"><Edit3 size={14}/> Bilgileri Güncelle</button>
              </div>

              <div className="info-grid-pro">
                <div className="info-item">
                  <label>AD SOYAD</label>
                  <div className="info-val-box">
                    <User size={18} className="v-icon" />
                    <span>{user?.name}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>E-POSTA ADRESİ</label>
                  <div className="info-val-box">
                    <Mail size={18} className="v-icon" />
                    <span>{user?.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>HESAP DURUMU</label>
                  <div className={`info-val-box ${profileData?.emailVerified ? 'status-active' : 'status-pending'}`}>
                    <Shield size={18} className="v-icon" />
                    <span>{profileData?.emailVerified ? 'Onaylı Hesap' : 'Onay Bekliyor'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>ÜYELİK TİPİ</label>
                  <div className="info-val-box">
                    <Star size={18} className="v-icon" style={{color: '#f59e0b'}} />
                    <span>Standart Üye</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <div className="section-header">
                <h3>Güvenlik & Gizlilik</h3>
              </div>
              <div className="security-actions-pro">
                 <div onClick={() => navigateTo("/profile/settings")} className="security-tile">
                    <div className="s-icon-box"><Lock size={20}/></div>
                    <div className="s-text">
                       <strong>Şifre Değiştir</strong>
                       <p>Düzenli şifre değişimi güvenliği artırır.</p>
                    </div>
                    <ChevronRight size={18} className="s-arrow" />
                 </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .loading-screen-elite { 
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; gap: 1rem; color: #0f172a; font-weight: 700; 
        }
        .loader-pro { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .profile-container-ultra {
          min-height: 100vh; background: #f8fafc; padding-bottom: 5rem; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .profile-header-gradient {
          height: 150px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); width: 100%;
        }
        .profile-page-wrapper { margin-top: -60px; position: relative; z-index: 10; max-width: 1200px; padding: 0 20px; }

        .unified-dashboard-card {
          background: white; border-radius: 40px; display: flex;
          box-shadow: 0 40px 100px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
          min-height: 700px; overflow: hidden;
        }

        /* SIDEBAR */
        .dashboard-sidebar {
          width: 300px; background: #fbfcfd; border-right: 1px solid #f1f5f9;
          padding: 3rem 1.5rem; display: flex; flex-direction: column; flex-shrink: 0;
        }
        .sidebar-top { text-align: center; margin-bottom: 3rem; }
        .avatar-placeholder-large { 
          width: 100px; height: 100px; background: #0f172a; color: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 2.2rem;
          font-weight: 800; border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); margin: 0 auto;
        }
        .avatar-wrapper-pro { position: relative; display: inline-block; }
        .main-avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .edit-avatar-btn { position: absolute; bottom: 0; right: 0; width: 30px; height: 30px; background: white; border-radius: 50%; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; }

        .sidebar-user-header h2 { font-size: 1.25rem; font-weight: 950; color: #0f172a; margin-top: 1rem; margin-bottom: 4px; letter-spacing: -1px; }
        .join-label { font-size: 0.7rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

        .dashboard-nav { display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .d-nav-item {
          display: flex; align-items: center; gap: 14px; padding: 14px 20px;
          cursor: pointer; color: #64748b; font-weight: 800; font-size: 0.95rem;
          border-radius: 20px; transition: 0.3s;
        }
        .d-nav-item:hover { background: #f1f5f9; color: #0f172a; transform: translateX(5px); }
        .d-nav-item.active { background: #0f172a; color: white; box-shadow: 0 10px 25px rgba(15,23,42,0.15); }
        .nav-badge-pill { background: #ef4444; color: white; font-size: 0.65rem; padding: 2px 10px; border-radius: 12px; margin-left: auto; font-weight: 900; }

        .sidebar-bottom-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding-top: 2rem; border-top: 1px solid #f1f5f9; }
        .mini-stat { background: white; padding: 15px 10px; border-radius: 18px; text-align: center; border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 2px; }
        .mini-stat strong { font-size: 1.1rem; color: #0f172a; font-weight: 950; }
        .mini-stat span { font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; }

        /* MAIN CONTENT */
        .dashboard-main { flex: 1; padding: 4rem; background: white; display: flex; flex-direction: column; gap: 4rem; }
        .section-block { width: 100%; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .section-header h3 { font-size: 1.75rem; font-weight: 950; color: #0f172a; letter-spacing: -1.5px; margin: 0; }
        .btn-edit-pro { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; color: #475569; cursor: pointer; transition: 0.2s; }
        .btn-edit-pro:hover { background: #0f172a; color: white; border-color: #0f172a; }

        .info-grid-pro { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 3rem; }
        .info-item label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; display: block; }
        .info-val-box { display: flex; align-items: center; gap: 15px; padding: 1.25rem 1.5rem; background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; font-weight: 700; color: #1e293b; font-size: 1.05rem; }
        .v-icon { color: #cbd5e1; }
        .status-active { color: #059669; background: #ecfdf5; border-color: #d1fae5; }
        .status-active .v-icon { color: #059669; }
        .status-pending { color: #d97706; background: #fffbeb; border-color: #fef3c7; }
        .status-pending .v-icon { color: #d97706; }

        .security-actions-pro { display: flex; flex-direction: column; gap: 1.5rem; }
        .security-tile { display: flex; align-items: center; gap: 20px; padding: 2rem; background: #ffffff; border-radius: 24px; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .security-tile:hover { border-color: #0f172a; transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .s-icon-box { width: 50px; height: 50px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .s-text { flex: 1; }
        .s-text strong { display: block; font-size: 1.1rem; color: #0f172a; margin-bottom: 4px; font-weight: 800; }
        .s-text p { font-size: 0.9rem; color: #94a3b8; line-height: 1.4; }
        .s-arrow { color: #cbd5e1; }

        @media (max-width: 1024px) {
          .unified-dashboard-card { flex-direction: column; border-radius: 0; min-height: auto; }
          .dashboard-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #f1f5f9; padding: 2rem; }
          .dashboard-main { padding: 2rem; gap: 3rem; }
          .info-grid-pro { grid-template-columns: 1fr; gap: 1.5rem; }
          .profile-page-wrapper { margin-top: 0; padding: 0; }
          .profile-header-gradient { height: 100px; }
        }
      `}</style>
    </div>
  );
}
