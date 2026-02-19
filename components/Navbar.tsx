import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">AI Homework Helper</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/support" className="hover:underline">Support</Link>
        </nav>
      </div>
    </header>
  );
}
