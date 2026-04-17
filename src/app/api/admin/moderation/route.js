import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim. Bu alan sadece yöneticiler içindir." }, { status: 403 });
        }

        const pendingReviews = await prisma.review.findMany({
            where: {
                OR: [
                    { status: "PENDING" },
                    { verificationDoc: { not: null }, isVerified: false }
                ]
            },
            include: {
                house: {
                    select: {
                        title: true,
                        neighborhood: true,
                        district: true
                    }
                },
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(pendingReviews);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
