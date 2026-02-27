import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";

export default async function AdminPage() {
  const session: any = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session?.user?.role !== "ADMIN") redirect("/");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2">Welcome, Admin!</p>
    </div>
  );
}