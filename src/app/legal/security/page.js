import { ShieldCheck, Lock, UploadCloud, EyeOff } from "lucide-react";

export const metadata = {
    title: 'Güvenlik Standartları - Evora',
};

export default function SecurityPage() {
    return (
        <div className="legal-container container mb-5 mt-5" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '4rem auto', minHeight: '60vh' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <ShieldCheck size={56} style={{ color: '#f59e0b', marginBottom: '1rem', display: 'inline-block' }} />
                <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '900' }}>Evora Keşfedilemez Güvenlik Katmanı</h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>Platformumuz, en üstün kriptografik yöntemlerle şifrelenmiştir ve kullanıcı gizliliği hiçbir şartta ikinci plana atılmaz.</p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>

                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', background: '#0f172a', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <EyeOff size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginBottom: '0.5rem' }}>%100 Anonimlik ve İzolasyon</h3>
                        <p style={{ lineHeight: 1.6, color: '#475569', fontSize: '1rem' }}>
                            Bıraktığınız bir emlak incelemesi ile profiliniz teknik olarak izole edilir. İncelemenizi okuyan hiç kimse, hatta diğer üye ev sahipleri sistemin arka ucuna erişimi olmadan sizin gerçek profilinizi bağlayamaz ve göremez.
                        </p>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', background: '#0f172a', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Lock size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginBottom: '0.5rem' }}>Uçtan Uca Parola Şifrelemesi</h3>
                        <p style={{ lineHeight: 1.6, color: '#475569', fontSize: '1rem' }}>
                            Evora, hiçbir parolanızı veritabanında metin (plain text) olarak saklamaz. Şifreleriniz sektör standardı, tek yönlü karma işlevi olan bcrypt(Salt + Hash) ile kriptolanır. Kötü niyetli girişimlerde dahi şifreleriniz çözülemez.
                        </p>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', background: '#0f172a', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <UploadCloud size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginBottom: '0.5rem' }}>Belge Güvenliği</h3>
                        <p style={{ lineHeight: 1.6, color: '#475569', fontSize: '1rem' }}>
                            "Mavi Rozet" veya Elite statüsü elde etmek için sisteme yüklenen faturalar gibi doğrulama belgeleri, geçerliliği onaylandıktan sonra izole bir kovada (S3 Bucket) şifrelenir veya sistemden tamamen imha edilir.
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
}
