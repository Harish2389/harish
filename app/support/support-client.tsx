"use client";

import { useState } from "react";

export default function SupportClient() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error ?? "Failed to send.");
        return;
      }
      setEmail("");
      setSubject("");
      setMessage("");
      setStatus("✅ Ticket created! We'll contact you if you provided an email.");
    } catch (e: any) {
      setStatus(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border p-4 space-y-3">
      <div>
        <label className="text-sm font-medium">Your email (optional)</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border p-2"
          placeholder="you@gmail.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-xl border p-2"
          placeholder="Example: Bug report"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full min-h-[120px] rounded-xl border p-2"
          placeholder="Write details..."
          required
        />
      </div>
      <button disabled={loading} className="px-4 py-2 rounded-xl bg-zinc-900 text-white disabled:opacity-60">
        {loading ? "Sending..." : "Send"}
      </button>
      {status && <div className="text-sm text-zinc-700">{status}</div>}
    </form>
  );
}
