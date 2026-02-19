import { NextResponse } from "next/server";
import { groqSolve } from "@/src/lib/groq";
import { checkAndIncrementUsage } from "@/src/lib/usage";

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
    const body = await req.json().catch(() => ({}));
    const question = String(body?.question || "").trim();
    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    const ip = getIp(req);
    const usage = checkAndIncrementUsage(ip);

    if (!usage.ok) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", limit: usage.limit },
        { status: 429 }
      );
    }

    const answer = await groqSolve(question);

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
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
