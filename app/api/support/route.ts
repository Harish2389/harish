import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim() || null;
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: { email, subject, message },
  });

  return NextResponse.json({ ok: true, ticketId: ticket.id });
}
