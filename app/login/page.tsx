"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onLogin = async () => {
    setErr("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    if (res?.error) setErr("Invalid email/password");
    else window.location.href = "/dashboard";
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <input className="w-full border p-2 mb-3" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full border p-2 mb-3" type="password" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)} />

      {err ? <p className="text-sm text-red-600 mb-3">{err}</p> : null}
      <button className="w-full border p-2" onClick={onLogin}>Login</button>

      <p className="text-sm mt-3">
        New user? <Link className="underline" href="/register">Create account</Link>
      </p>
    </div>
  );
}