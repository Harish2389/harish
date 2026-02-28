import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name ?? "" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      // attach credits/plan for quick checks
      if (token?.email) {
        const u = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { credits: true, plan: true, subscriptionActive: true, subscriptionEndsAt: true },
        });
        if (u) Object.assign(token, u);
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.credits = token.credits ?? 0;
      session.user.plan = token.plan ?? "FREE";
      session.user.subscriptionActive = token.subscriptionActive ?? false;
      session.user.subscriptionEndsAt = token.subscriptionEndsAt ?? null;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};