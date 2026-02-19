import ClientSolveForm from "@/components/ClientSolveForm";
import { prisma } from "@/src/lib/prisma";

export default async function DashboardPage() {
  const recent = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-5">
        <div className="text-sm text-zinc-600">
          No login needed. Free daily limit applies per device/IP.
        </div>
      </div>

      <ClientSolveForm />

      <div className="rounded-2xl border p-5">
        <h2 className="font-semibold">Recent answers (latest 10)</h2>
        {recent.length === 0 ? (
          <div className="mt-2 text-sm text-zinc-600">No history yet.</div>
        ) : (
          <div className="mt-3 space-y-3">
            {recent.map((h) => (
              <div key={h.id} className="rounded-xl border p-3">
                <div className="text-sm font-medium">Q: {h.question}</div>
                <div className="mt-2 text-sm whitespace-pre-wrap text-zinc-700">{h.answer}</div>
                <div className="mt-2 text-xs text-zinc-500">
                  {h.createdAt.toISOString().slice(0,19).replace("T"," ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
