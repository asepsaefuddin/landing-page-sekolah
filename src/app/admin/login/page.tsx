"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.ok) {
      router.replace("/admin");
    } else {
      setErr(data.error || "Gagal login");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-emerald-50 to-white">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow"
      >
        <h1 className="mb-4 text-center text-2xl font-bold text-emerald-700">
          Admin Login
        </h1>
        {err && (
          <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{err}</p>
        )}
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
        <input
          className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
          type="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-emerald-600 p-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Masuk
        </button>
      </form>
    </main>
  );
}
