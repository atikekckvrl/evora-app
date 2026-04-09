import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Yetkisiz işlem. Lütfen giriş yapın." }, { status: 401 });
    }

    const body = await req.json();
    const { 
      houseId, 
      role, 
      ratings, 
      comment 
    } = body;

    // Evi bul veya oluştur (Test için)
    let house = await prisma.house.findUnique({
      where: { id: houseId.toString() }
    });

    if (!house) {
      house = await prisma.house.create({
        data: {
          id: houseId.toString(),
          city: "İstanbul",
          district: "Merkez",
          neighborhood: "Örnek",
          street: "Deneme",
          buildingNo: "1",
          flatNo: "1",
          addressKey: `test-house-${houseId}`
        }
      });
    }

    // Anonim ID oluştur (Örn: Kiracı #A12)
    const anonId = role === 'tenant' 
      ? `Kiracı #${Math.random().toString(36).substring(2, 5).toUpperCase()}` 
      : `Ev Sahibi #${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Yorumu kaydet
    const review = await prisma.review.create({
      data: {
        houseId: house.id,
        authorId: session.user.id,
        targetType: role === 'tenant' ? 'HOUSE' : 'TENANT',
        content: comment || "",
        anonId: anonId,
        status: "APPROVED",
        overallRating: 4,
        
        // Tenant Ratings
        humidityRating: ratings.q1 || null,
        sunlightRating: ratings.q2 || null,
        noiseRating: ratings.q3 || null,
        landlordRating: ratings.q4 || null,
        
        // Landlord Ratings
        paymentRating: ratings.l_q1 || null,
        cleanRating: ratings.l_q2 || null,
        neighborRating: ratings.l_q3 || null,
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Yorum gönderme hatası:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const houseId = searchParams.get('houseId');

    if (!houseId) {
      return NextResponse.json({ error: "houseId gerekli" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { houseId: houseId.toString() },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
