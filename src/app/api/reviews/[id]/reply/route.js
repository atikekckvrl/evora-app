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
        const body = await req.json();
        const { replyContent } = body;

        if (!replyContent || replyContent.trim().length < 10) {
            return NextResponse.json({ error: "Cevabınız çok kısa, lütfen daha açıklayıcı olun." }, { status: 400 });
        }

        // Yorumun hangi eve ait olduğunu ve evi kimin sahiplendiğini bulalım
        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                house: {
                    select: { ownerId: true }
                }
            }
        });

        if (!review) {
            return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 404 });
        }

        // Güvenlik: Kullanıcı bu evin sahibi mi?
        if (review.house.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Bu yoruma cevap verme yetkiniz yok. Sadece evin onaylı sahibi cevap verebilir." }, { status: 403 });
        }

        // Cevabı kaydet
        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                landlordReply: replyContent,
                landlordReplyAt: new Date()
            }
        });

        return NextResponse.json({ success: true, review: updatedReview });
    } catch (error) {
        console.error("Yorum yanıtlama hatası:", error);
        return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
    }
}
