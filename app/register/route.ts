import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const cleanEmail = String(email || "").toLowerCase().trim();
  const cleanPass = String(password || "");

  if (!cleanEmail || !cleanPass || cleanPass.length < 6) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const hash = await bcrypt.hash(cleanPass, 10);

  await prisma.user.create({
    data: {
      name: String(name || ""),
      email: cleanEmail,
      passwordHash: hash,
      credits: Number(process.env.FREE_DAILY_LIMIT || 50), // initial free credits
      plan: "FREE",
      subscriptionActive: false,
    },
  });

  return NextResponse.json({ ok: true });
}