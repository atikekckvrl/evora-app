import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
        }

        const body = await req.json();
        const { ownershipDoc } = body;

        const { id } = await params;

        // MVP için basitleştirilmiş "Evi Sahiplen" API'si.
        // İleride burası belge yükleme ve admin onayı gerektirecek bir akışa dönüşebilir.
        // Şimdilik belge kontrolü yapıyoruz ve ardından işlemi yapan kişiyi direkt "owner" atıyoruz.
        if (!ownershipDoc) {
            return NextResponse.json({ error: "Lütfen tapu belgenizi yükleyiniz." }, { status: 400 });
        }

        const house = await prisma.house.findUnique({ where: { id } });

        if (!house) {
            return NextResponse.json({ error: "Ev bulunamadı." }, { status: 404 });
        }

        if (house.ownerId && house.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Bu ev halihazırda başka bir ev sahibi tarafından doğrulanmış." }, { status: 400 });
        }

        // Sahiplenme talebini "Yorum (Review)" modeli üzerinden Moderasyon kuyruğuna atıyoruz
        // targetType: OWNERSHIP_CLAIM olarak işaretleyerek Admin panelinde ayırt ediyoruz.
        await prisma.review.create({
            data: {
                houseId: house.id,
                authorId: session.user.id,
                targetType: "OWNERSHIP_CLAIM",
                content: "Ev Sahipliği Doğrulama Talebi",
                status: "PENDING",
                isVerified: false,
                verificationDoc: ownershipDoc,
                anonId: "Ev Sahibi",
                overallRating: 0
            }
        });

        return NextResponse.json({ success: true, message: "Talebiniz alınmıştır. Yönetici onayının ardından aktifleşecektir." });
    } catch (error) {
        console.error("Ev sahiplenme hatası:", error);
        return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
    }
}
