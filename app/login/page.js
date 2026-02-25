"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, LockKeyhole, ShieldCheck, UserRound, AlertCircle } from "lucide-react";
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Fondo animado con círculos de blur */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-sky-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 animate-pulse rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 md:grid-cols-[1.1fr,0.9fr] md:px-8 lg:gap-12">
        {/* Sección de branding (visible en escritorio) */}
        <section className="hidden space-y-6 md:block">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-700/50 bg-sky-900/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-100 backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5" />
            Balcão do Empreendedor
          </span>

          <h1 className="max-w-xl text-4xl font-bold leading-tight text-white lg:text-5xl">
            Plataforma inteligente para gestão de empreendimentos
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-slate-300 lg:text-lg">
            Controle cadastros, acompanhe indicadores e tome decisões com uma experiência visual
            moderna, fluida e focada em produtividade.
          </p>

          <div className="space-y-3 pt-4">
            <div className="inline-flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 px-5 py-3 text-sm text-slate-200 backdrop-blur-sm transition hover:border-sky-700/30 hover:bg-slate-900/80">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <span>Acesso seguro ao painel administrativo</span>
            </div>
            <div className="inline-flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 px-5 py-3 text-sm text-slate-200 backdrop-blur-sm transition hover:border-sky-700/30 hover:bg-slate-900/80">
              <ArrowRight className="h-5 w-5 text-sky-300" />
              <span>Fluxo otimizado para uso diário</span>
            </div>
          </div>
        </section>

        {/* Tarjeta de login */}
        <section className="w-full rounded-3xl border border-slate-700/50 bg-slate-900/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 hover:border-sky-700/30 hover:shadow-sky-900/20 md:p-8 lg:p-10">
          <LoadingProgressBar active={loading} className="mb-5" />

          <span className="inline-flex items-center gap-2 rounded-full border border-sky-700/50 bg-sky-900/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-100 backdrop-blur-sm md:hidden">
            <Building2 className="h-3.5 w-3.5" />
            Balcão do Empreendedor
          </span>

          <h2 className="mt-3 text-2xl font-semibold text-white md:mt-0 lg:text-3xl">
            Acessar conta
          </h2>
          <p className="mt-2 text-sm text-slate-300 lg:text-base">
            Entre com seu usuário e senha para continuar.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-200">Usuário</span>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-950/50 px-4 transition-all duration-200 focus-within:scale-[1.02] focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-400/20">
                <UserRound className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-sky-400" />
                <input
                  className="h-12 w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-200">Senha</span>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-950/50 px-4 transition-all duration-200 focus-within:scale-[1.02] focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-400/20">
                <LockKeyhole className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-sky-400" />
                <input
                  type="password"
                  className="h-12 w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </label>

            {error && (
              <div className="flex animate-shake items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-300" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 px-6 font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:from-sky-400 hover:to-sky-300 hover:shadow-lg hover:shadow-sky-500/30 disabled:opacity-60 disabled:hover:scale-100"
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
                  <span>Entrar</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Enlace de ayuda (opcional, no afecta funcionalidad) */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Problemas para acessar? Contacte o suporte.
          </p>
        </section>
      </div>

      {/* Animación personalizada para el mensaje de error (agrega esto en tu archivo global.css si no existe) */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}