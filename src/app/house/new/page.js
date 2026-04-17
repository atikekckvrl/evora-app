"use client";
import { useState } from "react";
import { MapPin, Navigation, ArrowRight, Building, DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const ALTIEYLUL_MAHALLELER = [
  "Bahçelievler", "Plevne", "Hasan Basri Çantay", "Gümüşçeşme", 
  "Gündoğan", "Dinkçiler", "Kasaplar", "Yıldız", "Sütlüce", 
  "Altıeylül", "Gaziosmanpaşa", "Çınarlıdere", "Aslıhantepe"
].sort();

export default function NewHousePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    city: "Balıkesir",
    district: "Altıeylül",
    neighborhood: "",
    street: "",
    buildingNo: "",
    flatNo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/house/${data.id}`);
      } else {
        alert(data.error || "Ev kaydedilirken bir hata oluştu.");
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Sunucuya bağlanılamadı.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container section fade-in">
      <div className="form-card card-lux">
        <div className="form-header">
          <div className="icon-badge">
             <MapPin size={32} color="white" />
          </div>
          <h2>Altıeylül'de Ev Ekle</h2>
          <p>Şu anda sadece <strong>Balıkesir, Altıeylül</strong> bölgesi için hizmet veriyoruz. Lütfen mahalle ve sokak bilgilerini girin.</p>
        </div>

        <form onSubmit={handleSubmit} className="house-form">
          <div className="form-grid">
            
            <div className="form-row">
              <div className="input-group flex-1">
                <label className="input-label">İl</label>
                <div className="static-field">Balıkesir</div>
              </div>
              <div className="input-group flex-1">
                <label className="input-label">İlçe</label>
                <div className="static-field">Altıeylül</div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Mahalle</label>
              <select name="neighborhood" className="input-field" onChange={handleChange} value={formData.neighborhood} required>
                <option value="">Mahalle Seçiniz</option>
                {ALTIEYLUL_MAHALLELER.map((mh, idx) => (
                  <option key={idx} value={mh}>{mh} Mahallesi</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Sokak / Cadde</label>
              <div className="input-with-icon">
                <Navigation size={18} className="input-icon" />
                <input type="text" name="street" placeholder="Örn: 105. Sokak veya Soma Cd." className="input-field pr-icon" onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group flex-1">
                <label className="input-label">Bina No</label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <input type="text" name="buildingNo" placeholder="Örn: 12" className="input-field pr-icon" onChange={handleChange} required />
                </div>
              </div>
              <div className="input-group flex-1">
                <label className="input-label">Daire No</label>
                <div className="input-with-icon">
                  <DoorOpen size={18} className="input-icon" />
                  <input type="text" name="flatNo" placeholder="Örn: 4" className="input-field pr-icon" onChange={handleChange} required />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Ev Ekleniyor...' : 'Evi Kaydet ve İncele'}
            {!isSubmitting && <ArrowRight size={20} />}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-card {
          max-width: 650px;
          margin: 2rem auto;
          background: #ffffff;
          padding: 3rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-badge {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(180, 151, 90, 0.3);
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .form-header p {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 85%;
          margin: 0 auto;
          line-height: 1.5;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .flex-1 { flex: 1; }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: #334155;
        }

        .static-field {
          background: #f8fafc;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-weight: 600;
          cursor: not-allowed;
          display: flex;
          align-items: center;
          min-height: 46px;
        }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon .input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          font-weight: 500;
          transition: all 0.2s;
          background: white;
          color: #0f172a;
          min-height: 46px;
        }

        .input-field.pr-icon {
          padding-left: 2.8rem;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(180, 151, 90, 0.15);
        }

        .w-full { width: 100%; }
        .mt-4 { margin-top: 2rem; }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          padding: 1rem;
          text-transform: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .form-card { padding: 1.5rem; margin: 1rem; }
          .form-row { flex-direction: column; gap: 1rem; }
          .form-header h2 { font-size: 1.5rem; }
          .form-header p { max-width: 100%; }
        }
      `}} />
    </div>
  );
}
