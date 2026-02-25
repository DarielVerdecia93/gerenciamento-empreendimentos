"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingProgressBar from "@/app/components/loading-progress-bar";

const SEGMENTOS = [
  "Tecnologia",
  "Comércio",
  "Indústria",
  "Serviços",
  "Agronegócio",
];

export default function ResumoPage() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/empreendimentos", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Não foi possível carregar o resumo.");
        }

        setItens(data);
      } catch (err) {
        setError(err.message || "Não foi possível carregar o resumo.");
      }

      setLoading(false);
    }

    load();
  }, []);

  const ativos = useMemo(
    () => itens.filter((item) => item.status === "ativo").length,
    [itens],
  );
  const inativos = itens.length - ativos;

  const statusData = [
    { name: "Ativo", total: ativos },
    { name: "Inativo", total: inativos },
  ];

  const segmentoData = SEGMENTOS.map((segmento) => ({
    name: segmento,
    total: itens.filter((item) => item.segmento === segmento).length,
  }));

  const topMunicipios = Object.entries(
    itens.reduce((acc, item) => {
      acc[item.municipio] = (acc[item.municipio] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 7);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "0.5rem",
      color: "#e2e8f0",
    },
    labelStyle: {
      color: "#f8fafc",
      fontWeight: 600,
    },
    itemStyle: {
      color: "#cbd5e1",
    },
    cursor: {
      fill: "rgba(148, 163, 184, 0.16)",
    },
  };

  return (
    <div className="space-y-6">
      <LoadingProgressBar active={loading} />

      <header>
        <h2 className="text-2xl font-semibold text-white">Resumo</h2>
        <p className="text-sm text-slate-300">Indicadores e comportamento dos empreendimentos.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs uppercase text-cyan-300">Total</p>
          <p className="mt-2 text-2xl font-semibold text-white">{itens.length}</p>
        </article>
        <Link
          href="/dashboard/empreendimentos?status=ativo"
          className="rounded-xl border border-slate-700 bg-slate-900 p-4 transition hover:border-emerald-400/50 hover:bg-slate-800"
        >
          <p className="text-xs uppercase text-emerald-300">Ativos</p>
          <p className="mt-2 text-2xl font-semibold text-white">{ativos}</p>
        </Link>
        <Link
          href="/dashboard/empreendimentos?status=inativo"
          className="rounded-xl border border-slate-700 bg-slate-900 p-4 transition hover:border-amber-400/50 hover:bg-slate-800"
        >
          <p className="text-xs uppercase text-amber-300">Inativos</p>
          <p className="mt-2 text-2xl font-semibold text-white">{inativos}</p>
        </Link>
        <article className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs uppercase text-violet-300">Segmentos</p>
          <p className="mt-2 text-2xl font-semibold text-white">{SEGMENTOS.length}</p>
        </article>
      </section>

      {loading ? (
        <p className="text-sm text-slate-300">Carregando métricas...</p>
      ) : error ? (
        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-slate-200">Status</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="total" nameKey="name" outerRadius={80}>
                    <Cell fill="#16a34a" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-slate-700 bg-slate-900 p-4 lg:col-span-2">
            <h3 className="mb-3 text-sm font-medium text-slate-200">Segmentos</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#cbd5e1" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#cbd5e1" }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="total" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-slate-700 bg-slate-900 p-4 lg:col-span-3">
            <h3 className="mb-3 text-sm font-medium text-slate-200">Top municípios</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMunicipios} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: "#cbd5e1" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 12, fill: "#cbd5e1" }}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="total" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
