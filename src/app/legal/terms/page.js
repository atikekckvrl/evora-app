export const metadata = {
    title: 'Kullanım Koşulları - Evora',
};

export default function TermsPage() {
    return (
        <div className="legal-container container mb-5 mt-5" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '4rem auto', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '900', marginBottom: '2rem' }}>Kullanım Koşulları</h1>

            <div className="legal-content">
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginTop: '2rem', marginBottom: '1rem' }}>1. Platformun Amacı ve Kapsamı</h3>
                <p style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    Evora, kiracılar ve ev sahipleri arasında şeffaf, dürüst ve güvenilir bir deneyim paylaşım ağı kurmak amacıyla geliştirilmiştir. Kullanıcılar site üzerinden belirli ev veya ev sahipleri için yaşadıkları deneyimleri puanlar ve yorumlar vasıtasıyla aktarırlar. Platformda sunulan her türlü içerik bilgi verme amaçlıdır.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', margin: '2rem 0 1rem' }}>2. Kullanıcı Yükümlülükleri ve Davranış Kuralları</h3>
                <ul style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                    <li>Kullanıcılar ekledikleri değerlendirme ve yorumlarda hakaret, küfür, ayrımcılık, yalan/asılsız beyan, iftira gibi Türk Ceza Kanunu kapsamında suç teşkil eden içerikler paylaşamaz.</li>
                    <li>Yorumlar gerçeği yansıtmalı ve doğrudan tecrübe edilmiş olmalıdır.</li>
                    <li>Kullanıcılar platformun anonimlik sağladığını bilerek bu durumu hukuk dışı eylemler veya asılsız karalama kampanyaları için istismar edemez.</li>
                    <li>Elit doğrulanmış rozeti almak için sunulan kanıt belgelerinde sahtecilik (forgery) yapmak tamamen yasaktır ve tespitinde hesap kalıcı olarak silinir.</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', margin: '2rem 0 1rem' }}>3. Fikri Mülkiyet Hakları</h3>
                <p style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    Evora markası, logoları, özel "Premium Evora Avatarları" ve uygulamanın yazılım kodları, tasarımı ve her türlü fikri telif hakkı Evora'ya aittir. İzinsiz kopyalanamaz veya kullanılamaz. Kullanıcılar yayınladıkları içeriklerin (yorumların) platformda anonim olarak yayınlanması konusunda Evora'ya genişletilmiş lisans vermiş sayılırlar.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', margin: '2rem 0 1rem' }}>4. Sorumluluk Reddi</h3>
                <p style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    Platformdaki adreslerin ve incelemelerin %100 kesin doğruluğu platform yönetimi tarafından denetim sağlansa bile garanti edilemez. Yapılan yorumlar o anki kullanıcı deneyimini yansıtır. Ev kiralarken son karar daima kullanıcıların sorumluluğundadır.
                </p>

                <hr style={{ margin: '3rem 0', borderColor: '#e2e8f0' }} />
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Son Güncelleme: Nisan 2026</p>
            </div>
        </div>
    );
}
