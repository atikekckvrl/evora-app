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

        const { id } = await params;

        // MVP için basitleştirilmiş "Evi Sahiplen" API'si.
        // İleride burası belge yükleme ve admin onayı gerektirecek bir akışa dönüşebilir.
        // Şimdilik işlemi yapan kişiyi direkt "owner" atıyoruz.

        const house = await prisma.house.findUnique({ where: { id } });

        if (!house) {
            return NextResponse.json({ error: "Ev bulunamadı." }, { status: 404 });
        }

        if (house.ownerId && house.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Bu ev halihazırda başka bir ev sahibi tarafından doğrulanmış." }, { status: 400 });
        }

        const updatedHouse = await prisma.house.update({
            where: { id },
            data: { ownerId: session.user.id }
        });

        return NextResponse.json({ success: true, house: updatedHouse });
    } catch (error) {
        console.error("Ev sahiplenme hatası:", error);
        return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
    }
}
