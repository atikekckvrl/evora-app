"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Users, MessageSquareQuote, Home } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Yorum Moderasyonu", href: "/admin/moderation", icon: MessageSquareQuote },
    { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <ShieldCheck size={28} color="#b45309" />
          <span>Evora Panel</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className={`nav-btn-v3 ${pathname === item.href ? 'active' : ''}`}>
                <item.icon size={20} />
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginTop: 'auto' }}>
            <div className="nav-btn-v3 return-site">
              <Home size={20} />
              <span>Siteye Dön</span>
            </div>
          </Link>
        </nav>
      </aside>

      <main className="admin-content">
        {children}
      </main>

      <style jsx>{`
        .admin-layout { display: flex; min-height: 100vh; background: #f1f5f9; }
        
        .admin-sidebar { 
          width: 310px; 
          background: #0f172a; 
          padding: 2.5rem 1.5rem; 
          display: flex; 
          flex-direction: column;
          position: sticky; 
          top: 0; 
          height: 100vh;
          box-shadow: 25px 0 50px -12px rgba(0,0,0,0.5);
          z-index: 100;
        }
        
        .sidebar-brand { 
          display: flex; 
          align-items: center; 
          gap: 14px; 
          margin-bottom: 4rem; 
          padding: 0 0.5rem;
        }
        .sidebar-brand span { 
          font-weight: 900; 
          font-size: 1.6rem; 
          letter-spacing: -1.5px; 
          color: white; 
        }
        
        .sidebar-nav { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          flex: 1; 
        }
        
        /* YENİ NESİL GERÇEK BUTONLAR */
        .nav-btn-v3 { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          padding: 16px 20px; 
          border-radius: 14px; 
          color: rgba(255, 255, 255, 0.65); 
          font-weight: 800; 
          font-size: 0.95rem; 
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          user-select: none;
        }

        .nav-btn-v3:hover { 
          background: rgba(255, 255, 255, 0.1); 
          color: white; 
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        
        .nav-btn-v3.active { 
          background: white; 
          color: #0f172a; 
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          border: none;
          transform: scale(1.05);
        }

        .nav-btn-v3.active :global(svg) {
          color: #0f172a;
        }
        
        .return-site { 
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
          justify-content: center;
          font-size: 0.85rem;
        }
        .return-site:hover {
          background: white;
          color: #0f172a;
          transform: scale(1.03);
        }
        
        .admin-content { 
          flex: 1; 
          padding: 50px; 
          overflow-y: auto; 
          background: white; 
          border-radius: 40px 0 0 40px; /* Modern iç köşe yumuşatması */
          margin-top: 10px;
          margin-bottom: 10px;
          box-shadow: -10px 0 30px rgba(0,0,0,0.02);
        }
        
        @media (max-width: 1024px) {
          .admin-sidebar { 
            width: 100%; 
            height: auto; 
            padding: 1.5rem; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .sidebar-nav { flex-direction: row; overflow-x: auto; gap: 10px; }
          .nav-item { white-space: nowrap; }
          .admin-content { border-radius: 0; padding: 25px; margin: 0; }
        }
      `}</style>
    </div>
  );
}
