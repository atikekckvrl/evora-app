"use client";
import React, { useState } from "react";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Search, PlusCircle, User, Star, ShieldCheck, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

import { Providers } from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className={jakarta.className}>
        <Providers>
          <NavbarContent />
          <main>{children}</main>
          <Footer />
          <GlobalStyles />
        </Providers>
      </body>
    </html>
  );
}

function NavbarContent() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <nav className="container navbar">
        <Link href="/" className="logo-section">
          <ShieldCheck className="logo-icon" size={28} />
          <span className="logo-text">EVORA</span>
        </Link>

        <div className="nav-links desktop-only">
          <Link href="/search" className="nav-link">Keşfet</Link>
          <Link href="/#nasil-calisir" className="nav-link">Nasıl Çalışır?</Link>
          <Link href="/#hakkimizda" className="nav-link">Hakkımızda</Link>
        </div>

        <div className="nav-actions">
          {status === "authenticated" ? (
            <div className="user-nav-container">
              <div className="user-nav-box" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className="user-name-nav desktop-only">{session.user.name?.split(' ')[0]}</span>
                <div className="user-avatar-mini">{session.user.name?.charAt(0).toUpperCase()}</div>
              </div>

              {isMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header mobile-only">
                    <strong>{session.user.name}</strong>
                  </div>
                  <Link href="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Profilim
                  </Link>

                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin/moderation" className="dropdown-item" style={{ color: '#b45309' }} onClick={() => setIsMenuOpen(false)}>
                      <ShieldCheck size={16} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#b45309' }} /> Yönetim Paneli
                    </Link>
                  )}

                  <Link href="/favorites" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <Heart size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Favorilerim
                  </Link>
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="dropdown-item logout-red">Çıkış Yap</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary-nav login-btn-mobile">Giriş Yap</Link>
          )}

          <Link href="/search" className="btn-primary-nav desktop-only">
            <Search size={18} />
            <span>Adres Sorgula</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-section">
          <div className="logo-section mb-1">
            <ShieldCheck className="logo-icon" />
            <span className="logo-text" style={{ color: 'white' }}>EVORA</span>
          </div>
          <p className="text-muted" style={{ color: '#94a3b8', maxWidth: '300px' }}>Türkiye'nin dürüst, şeffaf ve güvenilir kira deneyim platformu.</p>
        </div>
        <div className="footer-section">
          <h4 style={{ color: 'white' }}>Hızlı Linkler</h4>
          <ul>
            <li><Link href="/search">Ev Ara</Link></li>
            <li><Link href="/">İnceleme Yaz</Link></li>
            <li><Link href="/#hakkimizda">Hakkımızda</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 style={{ color: 'white' }}>Yasal</h4>
          <ul>
            <li><Link href="/legal/kvkk">KVKK</Link></li>
            <li><Link href="/legal/terms">Kullanım Koşulları</Link></li>
            <li><Link href="/legal/security">Güvenlik</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Evora Platform – Tüm Hakları Saklıdır.</p>
      </div>
    </footer>
  );
}

function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      .navbar-wrapper {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(15px);
        border-bottom: 1px solid rgba(0,0,0,0.05);
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: 0.85rem 0;
        box-shadow: 0 4px 30px rgba(0,0,0,0.02);
      }

      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 900;
        font-size: 1.6rem;
        color: #0f172a;
        letter-spacing: -1px;
        text-decoration: none;
      }

      .logo-icon {
        stroke-width: 2.5px;
        color: var(--primary);
      }

      .nav-links {
        display: flex;
        gap: 2.5rem;
      }

      .nav-link {
        font-size: 0.9rem;
        font-weight: 600;
        color: #64748b;
        transition: 0.2s;
        text-decoration: none;
      }

      .nav-link:hover {
        color: #0f172a;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      .user-nav-container { position: relative; }
      
      .user-nav-box {
        display: flex;
        align-items: center;
        gap: 10px;
        background: white;
        padding: 4px 4px 4px 12px;
        border-radius: 40px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        cursor: pointer;
        transition: 0.2s;
      }
      .user-nav-box:hover { border-color: #cbd5e1; background: #f8fafc; }

      .user-dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: 200px;
        background: white;
        border-radius: 16px;
        border: 1px solid #f1f5f9;
        box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        padding: 8px;
        z-index: 2000;
        animation: slideIn 0.2s ease-out;
      }
      @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      .dropdown-item {
        display: block;
        width: 100%;
        padding: 10px 15px;
        text-decoration: none;
        color: #475569;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 10px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        transition: 0.2s;
      }
      .dropdown-item:hover { background: #f8fafc; color: #0f172a; }
      .logout-red { color: #ef4444 !important; }
      .logout-red:hover { background: #fee2e2 !important; }
      .dropdown-header { padding: 8px 15px; border-bottom: 1px solid #f1f5f9; margin-bottom: 5px; color: #0f172a; }

      .user-avatar-mini {
        width: 32px;
        height: 32px;
        background: #0f172a;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.8rem;
      }

      .user-name-nav {
        font-weight: 700;
        font-size: 0.85rem;
        color: #0f172a;
        padding-right: 5px;
      }

      .btn-primary-nav {
        background: #0f172a;
        color: white;
        text-decoration: none;
        padding: 0.75rem 1.5rem;
        border-radius: 14px;
        font-weight: 700;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: 0.3s;
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
      }

      @media (max-width: 768px) {
        .navbar-wrapper { padding: 0.5rem 0; }
        .desktop-only { display: none !important; }
        .user-nav-box { padding: 4px; border: none; background: transparent; box-shadow: none; }
        .user-name-nav { display: none; }
        .login-btn-mobile { padding: 0.6rem 1rem !important; border-radius: 10px !important; font-size: 0.8rem !important; }
        .user-dropdown { right: 0; width: 180px; }
      }

      .btn-primary-nav:hover {
        background: black;
        transform: translateY(-2px);
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #e2e8f0;
        padding: 0.75rem 1.5rem;
        border-radius: 14px;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        color: #475569;
        transition: 0.2s;
      }
      .btn-outline:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }

      .footer-wrapper {
        background: #0f172a;
        color: white;
        padding: 4rem 0 2rem;
        margin-top: 4rem;
      }
      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 3rem;
        margin-bottom: 3rem;
      }
      .footer-section h4 {
        margin-bottom: 1rem;
        font-weight: 800;
      }
      .footer-section ul {
        list-style: none;
        padding: 0;
      }
      .footer-section ul li {
        margin-bottom: 0.75rem;
      }
      .footer-section ul li a {
        color: #94a3b8;
        font-size: 0.9rem;
        text-decoration: none;
        transition: 0.2s;
      }
      .footer-section ul li a:hover {
        color: white;
      }
      .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 2rem;
        text-align: center;
        font-size: 0.8rem;
        color: #64748b;
      }

      @media (max-width: 768px) {
        .desktop-only { display: none; }
        .mobile-hide { display: none; }
        .navbar { padding: 0.5rem 0; }
      }
       .mb-1 { margin-bottom: 1rem; }
    `}} />
  );
}
