"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, MessageSquare, Settings, Star, Calendar, MapPin, Trash2, ArrowRight
} from "lucide-react";

export default function MyReviewsPage() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, profRes] = await Promise.all([
          fetch("/api/user/reviews"),
          fetch("/api/user/profile")
        ]);
        const revData = await revRes.json();
        const profData = await profRes.json();

        if (!revData.error) setReviews(revData);
        if (!profData.error) setProfileData(profData);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchData();
  }, [status]);

  if (status === "unauthenticated") { router.push("/login"); return null; }

  if (status === "loading" || loading) {
    return (
      <div className="loading-screen-elite">
        <div className="loader-pro"></div>
        <span>Katkılarınız Getiriliyor...</span>
      </div>
    );
  }

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
               <div onClick={() => router.push("/my-reviews")} className="d-nav-item active">
                 <MessageSquare size={20} /> 
                 <span>Yorumlarım</span>
                 {reviews.length > 0 && <span className="nav-badge-pill">{reviews.length}</span>}
               </div>
               <div onClick={() => router.push("/profile/settings")} className="d-nav-item">
                 <Settings size={20} /> <span>Hesap Ayarları</span>
               </div>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="dashboard-main">
            <div className="section-block">
              <div className="section-header-reviews">
                <h3>Yorumlarım</h3>
                <p>{reviews.length} adet değerlendirme yaptınız</p>
              </div>

              {reviews.length === 0 ? (
                <div className="empty-reviews-card">
                  <div className="empty-icon-box">
                    <MessageSquare size={48} />
                  </div>
                  <h4>Henüz hiç yorum yapmadınız</h4>
                  <p>Deneyimlerinizi paylaşmak için beğendiğiniz evlere yorum yapmaya başlayın.</p>
                  <button onClick={() => router.push("/")} className="btn-explore-pro">
                    Evleri Keşfet <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="reviews-list-grid">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item-card">
                      <div className="review-card-header">
                        <div className="house-mini-info">
                           <strong>{review.house.title}</strong>
                           <span className="location-tag"><MapPin size={12}/> {review.house.location}</span>
                        </div>
                        <div className="rating-pill-pro">
                           <Star size={14} fill="#f59e0b" color="#f59e0b" />
                           <span>{review.rating}.0</span>
                        </div>
                      </div>
                      
                      <div className="review-card-body">
                        <p>"{review.comment}"</p>
                      </div>

                      <div className="review-card-footer">
                        <span className="review-date">
                          <Calendar size={12}/> {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        <button className="btn-delete-review"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
        .section-header-reviews { margin-bottom: 3rem; }
        .section-header-reviews h3 { font-size: 2rem; font-weight: 950; color: #0f172a; letter-spacing: -1.5px; margin: 0; }
        .section-header-reviews p { color: #94a3b8; font-weight: 600; margin-top: 5px; }

        /* EMPTY STATE */
        .empty-reviews-card { text-align: center; padding: 5rem 2rem; background: #f8fafc; border-radius: 30px; border: 2px dashed #e2e8f0; }
        .empty-icon-box { width: 90px; height: 90px; background: white; border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #cbd5e1; box-shadow: 0 10px 25px rgba(0,0,0,0.03); }
        .empty-reviews-card h4 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
        .empty-reviews-card p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 2rem; }
        .btn-explore-pro { background: #0f172a; color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 800; display: flex; align-items: center; gap: 10px; margin: 0 auto; cursor: pointer; transition: 0.3s; }
        .btn-explore-pro:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(15,23,42,0.2); }

        /* REVIEWS LIST */
        .reviews-list-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .review-item-card { background: #ffffff; padding: 1.75rem; border-radius: 20px; border: 1px solid #f1f5f9; transition: 0.2s; }
        .review-item-card:hover { border-color: #0f172a; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .review-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
        .house-mini-info strong { display: block; font-size: 1.15rem; font-weight: 850; color: #0f172a; margin-bottom: 4px; }
        .location-tag { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #94a3b8; font-weight: 700; }
        .rating-pill-pro { display: flex; align-items: center; gap: 6px; background: #fffbeb; color: #b45309; padding: 6px 12px; border-radius: 12px; font-weight: 900; font-size: 0.95rem; }
        
        .review-card-body p { color: #475569; font-size: 1rem; line-height: 1.6; font-style: italic; }
        
        .review-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #f8fafc; }
        .review-date { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #cbd5e1; font-weight: 700; }
        .btn-delete-review { background: none; border: none; color: #cbd5e1; cursor: pointer; transition: 0.2s; }
        .btn-delete-review:hover { color: #ef4444; }

        .loading-screen-elite { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; gap: 1rem; color: #0f172a; font-weight: 700; }
        .loader-pro { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .unified-dashboard-card { flex-direction: column; }
          .dashboard-sidebar { width: 100%; border-right: none; }
          .dashboard-main { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
