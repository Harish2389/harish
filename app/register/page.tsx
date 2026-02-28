"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onRegister = async () => {
    setMsg("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || "Register failed");
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>

      <input className="w-full border p-2 mb-3" placeholder="Name"
        value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full border p-2 mb-3" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full border p-2 mb-3" type="password" placeholder="Password (min 6)"
        value={password} onChange={(e) => setPassword(e.target.value)} />

      {msg ? <p className="text-sm text-red-600 mb-3">{msg}</p> : null}

      <button className="w-full border p-2" onClick={onRegister}>Register</button>

      <p className="text-sm mt-3">
        Already have an account? <Link className="underline" href="/login">Login</Link>
      </p>
    </div>
  );
}