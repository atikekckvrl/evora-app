import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        // Admin kontrolü (Kesinleştirildi)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
        }

        const body = await req.json();
        const { action } = body; // 'APPROVE' or 'REJECT'

        if (action === "APPROVE") {
            const existingReview = await prisma.review.findUnique({ where: { id: id } });

            const review = await prisma.review.update({
                where: { id: id },
                data: {
                    status: "APPROVED",
                    isVerified: true // Belge onaylandığı için doğrulanmış sayıyoruz
                }
            });

            // Eğer onaylanan şey bir Ev Sahiplenme Talebi ise, Ev tablosunu da güncelle
            if (existingReview && existingReview.targetType === "OWNERSHIP_CLAIM") {
                await prisma.house.update({
                    where: { id: existingReview.houseId },
                    data: { ownerId: existingReview.authorId }
                });
            }

            return NextResponse.json({ success: true, review });
        } else if (action === "REJECT") {
            const review = await prisma.review.update({
                where: { id: id },
                data: {
                    status: "REJECTED",
                    isVerified: false
                }
            });
            return NextResponse.json({ success: true, review });
        }

        return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
