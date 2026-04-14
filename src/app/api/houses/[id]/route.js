import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const houseId = params.id;
    if (!houseId) return NextResponse.json({ error: "House ID gerekli" }, { status: 400 });

    const house = await prisma.house.findUnique({
      where: { id: houseId }
    });

    if (!house) {
      return NextResponse.json({ error: "Ev bulunamadı" }, { status: 404 });
    }

    // Get actual review stats
    const reviewsData = await prisma.review.findMany({
      where: { houseId: house.id, targetType: "HOUSE" }
    });

    const reviewCount = reviewsData.length;
    const avgRating = reviewCount > 0
      ? (reviewsData.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount).toFixed(1)
      : 0;

    return NextResponse.json({
      id: house.id,
      title: `${house.district}, ${house.neighborhood} konumunda Konut`,
      location: `${house.city}, ${house.district}, ${house.neighborhood}`,
      rating: parseFloat(avgRating),
      reviews: reviewCount,
      desc: `${house.street} Sokak, No: ${house.buildingNo}, D: ${house.flatNo} adresindeki konut. İncelemelere veya puanlara katkıda bulunabilirsiniz.`,
      images: ["/apartman.jpg", "/salon.jpg", "/banyo.jpg"] // Fallback images
    });

  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
