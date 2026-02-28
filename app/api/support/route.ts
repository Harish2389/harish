import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Email, subject, message required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: { email, subject, message },
    });

    return NextResponse.json({ ok: true, ticketId: ticket.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}