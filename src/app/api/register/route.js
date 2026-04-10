import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, phone, password, userType, interests, avatarSelection, linkedInUrl, verificationDoc } = await req.json();

    if (!name || (!email && !phone) || !password || !userType) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları (Kullanıcı Tipi dahil) doldurun." },
        { status: 400 }
      );
    }

    // 1. E-posta veya Telefon numarası kontrolü
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 400 });
      }
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone }
      });
      if (existingPhone) {
        return NextResponse.json({ error: "Bu telefon numarası zaten kayıtlı." }, { status: 400 });
      }
    }

    // 2. Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        userType,
        interests: interests ? JSON.stringify(interests) : null,
        avatarSelection: avatarSelection || null,
        linkedInVerified: linkedInUrl ? true : false,
        isVerified: verificationDoc ? true : false,
      },
    });

    return NextResponse.json({ success: true, user: { email: user.email, phone: user.phone, name: user.name } });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
