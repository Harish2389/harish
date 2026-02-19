import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AI Homework Helper",
  description: "AI tutor for step-by-step homework help",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
