"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientSolveForm() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        setError("Server returned invalid response.");
        return;
      }

      // 🔒 LOGIN REQUIRED
      if (res.status === 401 && data?.error === "LOGIN_REQUIRED") {
        router.push("/login");
        return;
      }

      // 💳 NO CREDITS → Auto Pricing Redirect
      if (res.status === 403 && data?.error === "NO_CREDITS") {
        router.push("/pricing");
        return;
      }

      // ⛔ Daily IP limit (optional)
      if (data?.error === "LIMIT_REACHED") {
        setError(
          `Daily free limit reached (${data.limit}/day). Please try tomorrow.`
        );
        return;
      }

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        return;
      }

      setAnswer(data.answer);
      setRemaining(data.remaining ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border p-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="text-sm font-medium">
          Ask your homework question
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: Solve x^2 - 5x + 6 = 0"
          className="w-full min-h-[110px] rounded-xl border p-3"
          required
        />

        <button
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-zinc-900 text-white disabled:opacity-60"
        >
          {loading ? "Solving..." : "Solve"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-zinc-500">
            {remaining !== null
              ? `Free remaining today: ${remaining}`
              : ""}
          </div>

          <div className="rounded-xl border p-3 whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}