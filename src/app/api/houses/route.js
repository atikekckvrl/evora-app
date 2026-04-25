import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { city, district, neighborhood, street, buildingNo, flatNo } = data;

    if (!city || !district || !neighborhood || !street || !buildingNo || !flatNo) {
      return NextResponse.json({ error: "Lütfen tüm adres alanlarını doldurun." }, { status: 400 });
    }

    // Build a deterministic addressKey
    const rawKey = `${city}-${district}-${neighborhood}-${street}-${buildingNo}-${flatNo}`.toLowerCase();
    const addressKey = rawKey.replace(/\s+/g, '-');

    // Mülk zaten varsa onu bul
    let house = await prisma.house.findUnique({
      where: { addressKey }
    });

    // 1. Koordinatları Al (Geocoding)
    let latitude = house?.latitude || null;
    let longitude = house?.longitude || null;

    if (!latitude || !longitude) {
      try {
        const queryParams = [
          `${street} ${buildingNo}, ${neighborhood}, ${district}, ${city}, Turkey`,
          `${street}, ${neighborhood}, ${district}, ${city}, Turkey`,
          `${neighborhood}, ${district}, ${city}, Turkey`,
          `${district}, ${city}, Turkey`
        ];

        for (const q of queryParams) {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
            headers: { 'User-Agent': 'EvoraApp/1.0' }
          });
          const geoData = await res.json();
          if (geoData && geoData.length > 0) {
            latitude = parseFloat(geoData[0].lat);
            longitude = parseFloat(geoData[0].lon);
            break;
          }
          await new Promise(r => setTimeout(r, 200)); // Rate limit buffer
        }

        if (latitude && longitude && house) {
          house = await prisma.house.update({
            where: { id: house.id },
            data: { latitude, longitude }
          });
        }
      } catch (geoErr) {
        console.error("Geocoding hatası:", geoErr);
      }
    }

    if (!house) {
      house = await prisma.house.create({
        data: { city, district, neighborhood, street, buildingNo, flatNo, addressKey, latitude, longitude }
      });
    }

    return NextResponse.json({ id: house.id });
  } catch (error) {
    console.error("Ev kayıt hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const houses = await prisma.house.findMany({
      include: {
        reviews: {
          where: { targetType: "HOUSE", isVerified: true },
          select: { overallRating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedHouses = houses.map(house => {
      const reviewCount = house.reviews.length;
      const avgRating = reviewCount > 0
        ? (house.reviews.reduce((acc, rev) => acc + rev.overallRating, 0) / reviewCount).toFixed(1)
        : 0;

      // Hiyerarşik koordinat çözümü
      let lat = house.latitude;
      let lng = house.longitude;

      if (!lat || !lng) {
        const districtCenter = DISTRICT_COORDS[house.district];
        lat = districtCenter ? districtCenter[0] : 39.6484;
        lng = districtCenter ? districtCenter[1] : 27.8826;
      }

      return {
        id: house.id,
        title: `${house.district}, ${house.neighborhood}`,
        location: house.district,
        fullAddress: `${house.neighborhood} Mah. ${house.street} Sok. No:${house.buildingNo} D:${house.flatNo} ${house.city}`,
        ownerId: house.ownerId,
        createdAt: house.createdAt,
        rating: parseFloat(avgRating),
        reviews: reviewCount,
        lat,
        lng,
        isVerified: true
      };
    });

    return NextResponse.json(formattedHouses);
  } catch (error) {
    console.error("Ev listeleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
