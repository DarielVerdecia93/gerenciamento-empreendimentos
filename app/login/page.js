"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
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
    <main className="min-h-[calc(100dvh-46px)] bg-slate-950 text-foreground">
      <div className="mx-auto flex min-h-[calc(100dvh-46px)] w-full max-w-md items-center px-4 py-4">
        <section className="w-full rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg shadow-black/25 md:p-7">
          <LoadingProgressBar active={loading} className="mb-5" />

          <span className="inline-flex rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
            Balcão do Empreendedor
          </span>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            Acesso corporativo
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Informe suas credenciais institucionais para entrar no sistema.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-200">Usuário</span>
              <input
                className="h-11 w-full rounded-md border border-slate-600 bg-slate-950 px-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-200">Senha</span>
              <input
                type="password"
                className="h-11 w-full rounded-md border border-slate-600 bg-slate-950 px-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-300" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-100 px-6 font-semibold text-slate-900 transition hover:bg-white disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-slate-950"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no sistema</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Problemas para acessar?{" "}
            <a
              href="mailto:magiatech.labs@outlook.com.br"
              className="font-medium text-slate-200 underline underline-offset-2 hover:text-white"
            >
              Contacte o suporte por e-mail
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}