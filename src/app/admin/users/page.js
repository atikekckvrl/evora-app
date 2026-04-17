"use client";
import React, { useState, useEffect } from "react";
import { Search, ShieldAlert, User, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function UsersManagementPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (query = "") => {
        try {
            const res = await fetch(`/api/admin/users${query ? `?q=${query}` : ""}`);
            const data = await res.json();
            if (Array.isArray(data)) setUsers(data);
        } catch (err) {
            console.error("Kullanıcılar yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleAdmin = async (user) => {
        const newRole = user.role === "ADMIN" ? "TENANT" : "ADMIN";
        const confirmMsg = `${user.email} kullanıcısını ${newRole === 'ADMIN' ? 'YÖNETİCİ' : 'STANDART KULLANICI'} yapmak istediğinize emin misiniz?`;

        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole })
            });

            const data = await res.json();
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
            } else {
                alert(data.error || "Hata oluştu.");
            }
        } catch (err) {
            alert("İşlem başarısız.");
        }
    };

    return (
        <div className="users-page">
            <header className="page-header">
                <h1>Kullanıcı Yönetimi</h1>
                <div className="search-bar">
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="E-posta veya isim ile ara..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            fetchUsers(e.target.value);
                        }}
                    />
                </div>
            </header>

            <div className="users-list">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Kullanıcı</th>
                            <th>E-posta</th>
                            <th>Rol</th>
                            <th>Kayıt Tarihi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar-mini">{user.name?.charAt(0) || <User size={14} />}</div>
                                        <span>{user.name || "İsimsiz Kullanıcı"}</span>
                                    </div>
                                </td>
                                <td><div className="email-cell"><Mail size={14} /> {user.email}</div></td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role === 'ADMIN' ? 'Yönetici' : 'Kiracı'}
                                    </span>
                                </td>
                                <td>
                                    <div className="date-cell">
                                        <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className={`btn-action ${user.role === 'ADMIN' ? 'demote' : 'promote'}`}
                                        onClick={() => toggleAdmin(user)}
                                    >
                                        {user.role === 'ADMIN' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                                        {user.role === 'ADMIN' ? 'Yetkiyi Kaldır' : 'Yönetici Yap'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!loading && users.length === 0 && (
                    <div className="empty-state">Kullanıcı bulunamadı.</div>
                )}
            </div>

            <style jsx>{`
        .users-page { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .page-header h1 { font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin: 0; }
        
        .search-bar { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 15px; display: flex; align-items: center; gap: 10px; width: 350px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .search-bar input { border: none; outline: none; font-size: 0.9rem; width: 100%; font-weight: 500; }

        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .admin-table th { background: #f8fafc; padding: 16px 20px; text-align: left; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 16px 20px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
        .admin-table tr:last-child td { border-bottom: none; }
        
        .user-cell { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #0f172a; }
        .avatar-mini { width: 32px; height: 32px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: #64748b; font-weight: 800; }
        
        .email-cell, .date-cell { display: flex; align-items: center; gap: 8px; color: #64748b; font-weight: 500; }
        
        .role-badge { padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .role-badge.admin { background: #fff7ed; color: #b45309; border: 1px solid #ffedd5; }
        .role-badge.tenant { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
        
        .btn-action { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-action:hover { background: #f8fafc; border-color: #cbd5e1; }
        .btn-action.promote { color: #166534; }
        .btn-action.demote { color: #ef4444; }
        
        .empty-state { padding: 40px; text-align: center; color: #64748b; font-weight: 600; }
      `}</style>
        </div>
    );
}
