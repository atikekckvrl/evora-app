import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Get all favorite houses for the current user
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                house: {
                    include: {
                        reviews: {
                            where: { isVerified: true },
                            select: { overallRating: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format houses similar to the main houses list
        const formattedFavorites = favorites.map(fav => {
            const house = fav.house;
            const reviewCount = house.reviews.length;
            const avgRating = reviewCount > 0
                ? (house.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount).toFixed(1)
                : 0;

            return {
                id: house.id,
                title: `${house.district}, ${house.neighborhood}`,
                location: house.district,
                fullAddress: `${house.neighborhood} Mah. ${house.street} Sok. No:${house.buildingNo} D:${house.flatNo} ${house.city}`,
                rating: parseFloat(avgRating),
                reviews: reviewCount,
                addedAt: fav.createdAt
            };
        });

        return NextResponse.json(formattedFavorites);
    } catch (error) {
        console.error("Favorileri getirme hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
    }
}

// POST: Toggle favorite status for a specific house
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
        }

        const { houseId } = await req.json();
        if (!houseId) {
            return NextResponse.json({ error: "Ev ID'si gerekli." }, { status: 400 });
        }

        // Check if favorite exists
        const existingFav = await prisma.favorite.findUnique({
            where: {
                userId_houseId: {
                    userId: session.user.id,
                    houseId: houseId
                }
            }
        });

        if (existingFav) {
            // Unfavorite
            await prisma.favorite.delete({
                where: { id: existingFav.id }
            });
            return NextResponse.json({ isFavorited: false, message: "Favorilerden çıkarıldı." });
        } else {
            // Favorite
            await prisma.favorite.create({
                data: {
                    userId: session.user.id,
                    houseId: houseId
                }
            });
            return NextResponse.json({ isFavorited: true, message: "Favorilere eklendi." });
        }
    } catch (error) {
        console.error("Favori işlemi hatası:", error);
        return NextResponse.json({ error: "İşlem sırasında hata oluştu." }, { status: 500 });
    }
}
