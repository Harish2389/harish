import { NextResponse } from "next/server";
import { groqSolve } from "@/src/lib/groq";
import { checkAndIncrementUsage } from "@/src/lib/usage";

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Item = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

const g = globalThis as unknown as { __HISTORY__?: Item[] };
if (!g.__HISTORY__) g.__HISTORY__ = [];

function getIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: Request) {
  try {
    // ✅ Login required
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
    }

    // ✅ Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    // ✅ Subscription check (expiry supported)
    const isPro =
      user.subscriptionActive &&
      (!user.subscriptionEndsAt || user.subscriptionEndsAt > new Date());

    // ✅ Credits gate
    if (!isPro && user.credits <= 0) {
      return NextResponse.json({ error: "NO_CREDITS" }, { status: 403 });
    }

    // ✅ Input
    const body = await req.json().catch(() => ({}));
    const question = String(body?.question || "").trim();
    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    // ✅ Basic abuse limit by IP (optional)
    const ip = getIp(req);
    const usage = checkAndIncrementUsage(ip);
    if (!usage.ok) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", limit: usage.limit },
        { status: 429 }
      );
    }

    // ✅ Solve
    const answer = await groqSolve(question);

    // ✅ Deduct 1 credit (only FREE users)
    let newCredits = user.credits;
    if (!isPro) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
        select: { credits: true },
      });
      newCredits = updated.credits;
    }

    // ✅ In-memory recent history (still ok)
    const item: Item = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      question,
      answer,
      createdAt: new Date().toISOString(),
    };
    g.__HISTORY__!.unshift(item);
    g.__HISTORY__ = g.__HISTORY__!.slice(0, 10);

    return NextResponse.json({
      answer,
      remaining: usage.remaining,
      limit: usage.limit,
      credits: isPro ? "PRO" : newCredits,
      plan: isPro ? "PRO" : "FREE",
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}