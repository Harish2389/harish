import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          AI Homework Helper
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>

          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>

          <Link href="/support" className="hover:underline">
            Support
          </Link>

          <Link href="/login" className="hover:underline">
            Login
          </Link>

          <Link href="/admin" className="hover:underline text-red-600">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}