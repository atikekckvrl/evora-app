import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Tüm alanları doldurun" }, { status: 400 });
    }

    // 1. Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı veya e-posta ile kayıtlı değil" }, { status: 404 });
    }

    // 2. Mevcut şifreyi kontrol et
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Mevcut şifreniz hatalı" }, { status: 400 });
    }

    // 3. Yeni şifreyi hashle
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // 4. Güncelle
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ message: "Şifreniz başarıyla güncellendi" });
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
