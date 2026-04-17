import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        const users = await prisma.user.findMany({
            where: query ? {
                OR: [
                    { email: { contains: query } },
                    { name: { contains: query } }
                ]
            } : {},
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
