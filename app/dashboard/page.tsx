"use client";

import { useEffect, useState } from "react";
import ClientSolveForm from "@/components/ClientSolveForm";

type Item = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/history", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Question form (dashboard ke andar) */}
      <ClientSolveForm />

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold">Recent answers</h2>

        {loading ? (
          <p className="text-sm text-zinc-600 mt-2">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-600 mt-2">No submissions yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="rounded-lg border p-3">
                <div className="text-xs text-zinc-500">
                  {new Date(it.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 text-sm font-medium">Q: {it.question}</div>
                <div className="mt-2 text-sm whitespace-pre-wrap text-zinc-700">
                  {it.answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
