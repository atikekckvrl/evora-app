import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Search, PlusCircle, User, Star, ShieldCheck } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Evora - Doğrulanmış Ev ve Kiracı Yorumları",
  description: "Ev tadında bir deneyim için kiracı ve ev sahiplerini şeffaflıkla buluşturan platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className={jakarta.className}>
        {/* Navigation Wrapper */}
        <header className="navbar-wrapper">
          <nav className="container navbar">
            <div className="logo-section">
              <ShieldCheck className="logo-icon" />
              <span className="logo-text">EVORA</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="nav-links desktop-only">
              <a href="#" className="nav-link">Keşfet</a>
              <a href="#" className="nav-link">Nasıl Çalışır?</a>
              <a href="#" className="nav-link">Hakkımızda</a>
            </div>

            <div className="nav-actions">
              <button className="btn btn-outline desktop-only">Giriş Yap</button>
              <button className="btn btn-primary">
                <PlusCircle size={20} />
                <span className="mobile-hide">Yorum Yaz</span>
              </button>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="footer-wrapper">
          <div className="container footer-content">
            <div className="footer-section">
              <div className="logo-section mb-1">
                <ShieldCheck className="logo-icon" />
                <span className="logo-text">EVORA</span>
              </div>
              <p className="text-muted">Güvenli ve şeffaf ev kiralama deneyimi.</p>
            </div>
            <div className="footer-section">
              <h4>Bağlantılar</h4>
              <ul>
                <li><a href="#">Şartlar & Koşullar</a></li>
                <li><a href="#">Gizlilik Politikası</a></li>
                <li><a href="#">Destek</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Evora. Tüm hakları saklıdır.</p>
          </div>
        </footer>

        {/* Global Styles for Layout Components */}
        <style dangerouslySetInnerHTML={{ __html: `
          .navbar-wrapper {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 1rem 0;
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
            font-weight: 800;
            font-size: 1.5rem;
            color: var(--primary);
            letter-spacing: -0.5px;
          }

          .logo-icon {
            stroke-width: 2.5px;
          }

          .nav-links {
            display: flex;
            gap: 2rem;
          }

          .nav-link {
            font-size: 0.9375rem;
            font-weight: 500;
            color: var(--text-muted);
            transition: color 0.2s;
          }

          .nav-link:hover {
            color: var(--primary);
          }

          .nav-actions {
            display: flex;
            gap: 1rem;
          }

          .footer-wrapper {
            background: var(--surface);
            border-top: 1px solid var(--border);
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
          }

          .footer-section ul {
            list-style: none;
          }

          .footer-section ul li {
            margin-bottom: 0.5rem;
          }

          .footer-section ul li a {
            color: var(--text-muted);
            font-size: 0.875rem;
          }

          .footer-bottom {
            border-top: 1px solid var(--border);
            padding-top: 2rem;
            text-align: center;
            font-size: 0.875rem;
            color: var(--text-muted);
          }

          @media (max-width: 768px) {
            .desktop-only { display: none; }
            .mobile-hide { display: none; }
            .navbar { padding: 0.5rem 0; }
          }
           .mb-1 { margin-bottom: 1rem; }
        `}} />
      </body>
    </html>
  );
}
