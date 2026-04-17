import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
        }

        // Kendini adminlikten çıkarmayı engelle (Opsiyonel ama güvenli)
        if (session.user.id === id) {
            return NextResponse.json({ error: "Kendi yetkinizi değiştiremezsiniz." }, { status: 400 });
        }

        const body = await req.json();
        const { role } = body;

        if (!['ADMIN', 'TENANT'].includes(role)) {
            return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { role }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
