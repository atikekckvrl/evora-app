"use client";
import { useState } from "react";
import { MapPin, Home, Navigation, ArrowRight } from "lucide-react";

export default function NewHousePage() {
  const [formData, setFormData] = useState({
    city: "",
    district: "",
    neighborhood: "",
    street: "",
    buildingNo: "",
    flatNo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ev Kayıt Verisi:", formData);
    alert("Ev başarıyla kaydedildi (Simülasyon). Şimdi yorum yapabilirsiniz!");
  };

  return (
    <div className="container section fade-in">
      <div className="form-card">
        <div className="form-header">
          <div className="icon-badge">
            <Home className="text-primary" />
          </div>
          <h2>Evi Kaydet</h2>
          <p>Yorum yapmadan önce evin adresini tam olarak girmelisin.</p>
        </div>

        <form onSubmit={handleSubmit} className="house-form">
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">İl</label>
              <select name="city" className="input-field" onChange={handleChange} required>
                <option value="">İl Seçiniz</option>
                <option value="istanbul">İstanbul</option>
                <option value="balikesir">Balıkesir</option>
                <option value="ankara">Ankara</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">İlçe</label>
              <input type="text" name="district" placeholder="Kadıköy" className="input-field" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label">Mahalle</label>
              <input type="text" name="neighborhood" placeholder="Moda" className="input-field" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label">Sokak</label>
              <input type="text" name="street" placeholder="Leylek Sk." className="input-field" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="input-group flex-1">
                <label className="input-label">Bina No</label>
                <input type="text" name="buildingNo" placeholder="12" className="input-field" onChange={handleChange} required />
              </div>
              <div className="input-group flex-1">
                <label className="input-label">Daire No</label>
                <input type="text" name="flatNo" placeholder="4" className="input-field" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-info">
            <Navigation size={16} />
            <span>Adres bilgileri ev eşleştirme algoritması için kullanılacaktır.</span>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Devam Et
            <ArrowRight size={20} />
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-card {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 3rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-badge {
          width: 3.5rem;
          height: 3.5rem;
          background: var(--accent);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .form-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: var(--text-muted);
          font-size: 0.9375rem;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .flex-1 { flex: 1; }

        .form-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--surface);
          padding: 1rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 1.5rem;
        }

        .w-full { width: 100%; }
        .mt-2 { margin-top: 2rem; }

        @media (max-width: 500px) {
          .form-card { padding: 1.5rem; }
          .form-row { flex-direction: column; gap: 0.5rem; }
        }
      `}} />
    </div>
  );
}
