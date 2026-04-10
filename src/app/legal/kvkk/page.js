export const metadata = {
    title: 'KVKK Aydınlatma Metni - Evora',
};

export default function KVKKPage() {
    return (
        <div className="legal-container container mb-5 mt-5" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '4rem auto', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '900', marginBottom: '2rem' }}>KVKK Aydınlatma Metni</h1>

            <div className="legal-content">
                <p style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    <strong>Veri Sorumlusu:</strong> Evora Platform (“Platform”, “Evora”, “Biz”), 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verilerinizi veri sorumlusu sıfatıyla işlemektedir. Bu aydınlatma metni, kimliğimizin ve iletişim bilgilerimizin, kişisel verilerinizin hangi amaçlarla işlendiğinin, kimlere ve hangi amaçlarla aktarılabileceğinin, veri toplama yöntemimizin ve hukuki sebebi ile KVKK’nın 11. maddesinde sayılan haklarınızın açıklanması amacıyla hazırlanmıştır.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginTop: '2rem', marginBottom: '1rem' }}>1. İşlenen Kişisel Verileriniz ve Toplama Yöntemi</h3>
                <p style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    Platform’a üye olurken ve/veya Platform içi etkileşimleriniz (inceleme, rozet doğrulama işlemleri) vasıtasıyla sağladığınız kişisel verileriniz (örn. ad, soyad, e-posta, telefon numarası, IP adresi, profil kullanım verileri, meslek/kullanıcı tipi) elektronik ortamda, üyelik formları ve çerezler otomatik veya kısmen otomatik yöntemlerle toplanmaktadır. Elit rozet doğrulama işlemleri kapsamında yüklenen fatura ve resmi evraklar sadece onay amacı için okunup daha sonra kişisel veriden arındırılarak geri dönülemez şekilde imha edilebilir veya tamamen opsiyonel biçimde güvenli sistemlerimizde korunur.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginTop: '2rem', marginBottom: '1rem' }}>2. Kişisel Verilerin İşlenme Amaçları</h3>
                <ul style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                    <li>Kullanıcı güvenliğinin sağlanması ve sahte hesapların engellenmesi,</li>
                    <li>Topluluk deneyiminin kalitesinin güvence altına alınması ve dürüst yorum sisteminin yürütülmesi,</li>
                    <li>Kullanıcıların kendi aralarındaki iletişimlerinin sağlıklı yürümesi,</li>
                    <li>Gerekli hallerde yasal otoritelerle mevzuata uygun bilgi paylaşımı yapılması.</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', margin: '2rem 0 1rem' }}>3. Verilerin Aktarımı ve Saklanması</h3>
                <p style={{ lineHeight: 1.8, color: '#475569', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    Platform topluluğunun temel amacı olan %100 anonimlik prensibi gereği; platformda yayınlanan ev incelemelerinde adınız ve soyadınız hiçbir kullanıcı veya ev sahibi ile açıkça paylaşılmaz. Evora, yorumlarınızı "Beyaz Yakalı", "Maceracı Öğrenci", "Kiracı #A09" gibi anonim rumuzlar vasıtasıyla yayınlar. Yalnızca yasal tebligatlar ve mahkeme kararı doğrultusunda gerekli kurumlarla veri paylaşımı yapılır.
                </p>

                <hr style={{ margin: '3rem 0', borderColor: '#e2e8f0' }} />
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Son Güncelleme: Nisan 2026</p>
            </div>
        </div>
    );
}
