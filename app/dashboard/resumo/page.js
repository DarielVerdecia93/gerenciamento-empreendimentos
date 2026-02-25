"use client";

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

  return (
    <div className="space-y-6">
      <LoadingProgressBar active={loading} />

      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Resumo</h2>
        <p className="text-sm text-slate-600">Indicadores e comportamento dos empreendimentos.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs uppercase text-cyan-700">Total</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-900">{itens.length}</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs uppercase text-emerald-700">Ativos</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">{ativos}</p>
        </article>
        <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs uppercase text-amber-700">Inativos</p>
          <p className="mt-2 text-2xl font-semibold text-amber-900">{inativos}</p>
        </article>
        <article className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-xs uppercase text-violet-700">Segmentos</p>
          <p className="mt-2 text-2xl font-semibold text-violet-900">{SEGMENTOS.length}</p>
        </article>
      </section>

      {loading ? (
        <p className="text-sm text-slate-600">Carregando métricas...</p>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-medium text-slate-700">Status</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="total" nameKey="name" outerRadius={80}>
                    <Cell fill="#16a34a" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <h3 className="mb-3 text-sm font-medium text-slate-700">Segmentos</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <h3 className="mb-3 text-sm font-medium text-slate-700">Top municípios</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMunicipios} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                  <Tooltip />
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
