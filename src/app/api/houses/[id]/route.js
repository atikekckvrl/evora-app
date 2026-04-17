import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
      where: { houseId: house.id, targetType: "HOUSE" }
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
      desc: `${house.street} Sokak, No: ${house.buildingNo}, D: ${house.flatNo} adresindeki konut. İncelemelere veya puanlara katkıda bulunabilirsiniz.`,
      images: ["/apartman.jpg", "/salon.jpg", "/banyo.jpg"] // Fallback images
    });

  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
