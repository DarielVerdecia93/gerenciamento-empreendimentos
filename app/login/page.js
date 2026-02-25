"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingProgressBar from "@/app/components/loading-progress-bar";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível iniciar sessão.");
      }

      router.push("/dashboard/resumo");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
        <section className="w-full rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <LoadingProgressBar active={loading} className="mb-4" />

          <h1 className="text-2xl font-semibold text-sky-900">Acesso ao Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Faça login para visualizar os empreendimentos.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700">Usuário</span>
              <input
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-slate-700">Senha</span>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
