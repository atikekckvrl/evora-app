import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DISTRICT_COORDS = {
  "Altıeylül": [39.6410, 27.8820],
  "Karesi": [39.6533, 27.8924],
  "Bandırma": [40.3522, 27.9767],
  "Edremit": [39.5961, 27.0244],
  "Ayvalık": [39.3192, 26.6953],
  "Burhaniye": [39.5020, 26.9697],
  "Bigadiç": [39.3361, 28.1256],
  "Sındırgı": [39.2394, 28.1758],
  "Gönen": [40.1039, 27.6536],
  "Susurluk": [39.9142, 28.1578]
};

export async function GET(req, { params }) {
  try {
    const { id: houseId } = await params;
    if (!houseId) return NextResponse.json({ error: "House ID gerekli" }, { status: 400 });

    const house = await prisma.house.findUnique({
      where: { id: houseId }
    });

    if (!house) {
      return NextResponse.json({ error: "Ev bulunamadı" }, { status: 404 });
    }

    // Get actual review stats
    const reviewsData = await prisma.review.findMany({
      where: { houseId: house.id, targetType: "HOUSE", isVerified: true }
    });

    const reviewCount = reviewsData.length;
    const avgRating = reviewCount > 0
      ? (reviewsData.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount).toFixed(1)
      : 0;

    // Coordinate fallback
    let latitude = house.latitude;
    let longitude = house.longitude;
    if (!latitude || !longitude) {
      const districtCenter = DISTRICT_COORDS[house.district];
      latitude = districtCenter ? districtCenter[0] : 39.6484;
      longitude = districtCenter ? districtCenter[1] : 27.8826;
    }

    // Check if user has favorited
    let isFavorited = false;
    const session = await getServerSession(authOptions);
    if (session) {
      const fav = await prisma.favorite.findUnique({
        where: { userId_houseId: { userId: session.user.id, houseId: house.id } }
      });
      isFavorited = !!fav;
    }

    return NextResponse.json({
      id: house.id,
      title: `${house.district}, ${house.neighborhood} konumunda Konut`,
      location: `${house.city}, ${house.district}, ${house.neighborhood}`,
      fullAddress: `${house.neighborhood} Mah. ${house.street} Sok. No:${house.buildingNo} Daire:${house.flatNo} ${house.district}/${house.city}`,
      rating: parseFloat(avgRating),
      reviews: reviewCount,
      latitude,
      longitude,
      ownerId: house.ownerId,
      isFavorited,
      desc: `${house.street} Sokak, No: ${house.buildingNo}, D: ${house.flatNo} adresindeki konut. İncelemelere veya puanlara katkıda bulunabilirsiniz.`,
      images: ["/apartman.jpg", "/salon.jpg", "/banyo.jpg"] // Fallback images
    });

  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: houseId } = await params;
    if (!houseId) return NextResponse.json({ error: "House ID gerekli" }, { status: 400 });

    const house = await prisma.house.findUnique({
      where: { id: houseId }
    });

    if (!house) {
      return NextResponse.json({ error: "Ev bulunamadı" }, { status: 404 });
    }

    // Delete related reviews and favorites manually, then delete house
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { houseId: houseId } }),
      prisma.favorite.deleteMany({ where: { houseId: houseId } }),
      prisma.house.delete({ where: { id: houseId } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ev silme hatası:", error);
    return NextResponse.json({ error: "Ev silinirken sunucu hatası oluştu" }, { status: 500 });
  }
}
