import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border p-8">
        <h1 className="text-3xl font-bold leading-tight">
          Homework help in simple Hindi + English — step by step.
        </h1>
        <p className="mt-3 text-zinc-600 max-w-2xl">
          Ask any question from Maths, Science, English, SST and get a tutor-style explanation.
          Free daily limit included. Upgrade to Pro for unlimited.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-zinc-900 text-white">
            Try it now
          </Link>
          <Link href="/pricing" className="px-4 py-2 rounded-xl border hover:bg-zinc-50">
            Pricing
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {["Step-by-step solutions", "Hindi + English", "Safe study helper"].map((t) => (
          <div key={t} className="rounded-2xl border p-5">
            <div className="font-semibold">{t}</div>
            <div className="mt-2 text-sm text-zinc-600">
              Designed as a tutor — explains concepts instead of just giving answers.
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-3 list-decimal pl-5 text-zinc-700 space-y-2">
          <li>Open Dashboard and ask a question</li>
          <li>Type your question</li>
          <li>Get a step-by-step explanation</li>
        </ol>
      </section>
    </div>
  );
}
