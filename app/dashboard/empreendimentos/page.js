"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingProgressBar from "@/app/components/loading-progress-bar";

const SEGMENTOS = [
  "Tecnologia",
  "Comércio",
  "Indústria",
  "Serviços",
  "Agronegócio",
];

const initialForm = {
  nomeEmpreendimento: "",
  nomeEmpreendedor: "",
  municipio: "",
  segmento: SEGMENTOS[0],
  contato: "",
  status: "ativo",
};

export default function EmpreendimentosPage() {
  const searchParams = useSearchParams();
  const statusQuery = searchParams.get("status");

  const [form, setForm] = useState(initialForm);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [processingAction, setProcessingAction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [segmentoFilter, setSegmentoFilter] = useState("todos");
  const [municipioFilter, setMunicipioFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const showToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  }

  const loadEmpreendimentos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/empreendimentos", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Não foi possível carregar os empreendimentos.");
      }

      setItens(data);
    } catch {
      setError("Não foi possível carregar os empreendimentos.");
      showToast("Não foi possível carregar os empreendimentos.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadEmpreendimentos();
  }, [loadEmpreendimentos]);

  useEffect(() => {
    if (statusQuery === "ativo" || statusQuery === "inativo" || statusQuery === "todos") {
      setStatusFilter(statusQuery);
      setCurrentPage(1);
    }
  }, [statusQuery]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingId);
      const endpoint = isEditing
        ? `/api/empreendimentos/${editingId}`
        : "/api/empreendimentos";

      const res = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0] || "Não foi possível salvar.");
      }

      if (isEditing) {
        setItens((prev) => prev.map((item) => (item.id === data.id ? data : item)));
        showToast("Empreendimento atualizado com sucesso.");
      } else {
        setItens((prev) => [data, ...prev]);
        showToast("Empreendimento criado com sucesso.");
      }

      closeModal();
    } catch (submitError) {
      setError(submitError.message);
      showToast(submitError.message, "error");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item) {
    setForm({
      nomeEmpreendimento: item.nomeEmpreendimento,
      nomeEmpreendedor: item.nomeEmpreendedor,
      municipio: item.municipio,
      segmento: item.segmento,
      contato: item.contato,
      status: item.status,
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  }

  async function toggleStatus(item) {
    setProcessingAction(true);
    try {
      const novoStatus = item.status === "ativo" ? "inativo" : "ativo";

      const res = await fetch(`/api/empreendimentos/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: novoStatus }),
      });

      if (!res.ok) {
        setError("Não foi possível atualizar o status.");
        showToast("Não foi possível atualizar o status.", "error");
        return;
      }

      const atualizado = await res.json();
      setItens((prev) => prev.map((it) => (it.id === atualizado.id ? atualizado : it)));
      showToast("Status atualizado com sucesso.");
    } finally {
      setProcessingAction(false);
    }
  }

  async function removeItem(id) {
    setProcessingAction(true);
    try {
      const res = await fetch(`/api/empreendimentos/${id}`, { method: "DELETE" });

      if (!res.ok) {
        setError("Não foi possível excluir o empreendimento.");
        showToast("Não foi possível excluir o empreendimento.", "error");
        return;
      }

      setItens((prev) => prev.filter((item) => item.id !== id));
      setItemToDelete(null);
      showToast("Empreendimento excluído com sucesso.");
    } finally {
      setProcessingAction(false);
    }
  }

  const municipios = useMemo(() => {
    return [...new Set(itens.map((item) => item.municipio))].sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
  }, [itens]);

  const filteredItens = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return itens.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        item.nomeEmpreendimento.toLowerCase().includes(term) ||
        item.nomeEmpreendedor.toLowerCase().includes(term) ||
        item.municipio.toLowerCase().includes(term) ||
        item.contato.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
      const matchesSegmento =
        segmentoFilter === "todos" || item.segmento === segmentoFilter;
      const matchesMunicipio =
        municipioFilter === "todos" || item.municipio === municipioFilter;

      return matchesSearch && matchesStatus && matchesSegmento && matchesMunicipio;
    });
  }, [itens, municipioFilter, searchTerm, segmentoFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItens.length / itemsPerPage));
  const startEntry = filteredItens.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filteredItens.length);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "todos" ||
    segmentoFilter !== "todos" ||
    municipioFilter !== "todos";

  const paginatedItens = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItens.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItens]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, segmentoFilter, municipioFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("todos");
    setSegmentoFilter("todos");
    setMunicipioFilter("todos");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <LoadingProgressBar active={loading || saving || processingAction} />

      <div className="fixed right-4 top-4 z-[60] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.type === "error"
                ? "border-rose-400/40 bg-rose-500/10 text-rose-300"
                : "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <header>
        <h2 className="text-2xl font-semibold text-white">Empreendimentos</h2>
        <p className="text-sm text-slate-300">Cadastro e listagem com visual em painel.</p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-100">Ações rápidas</p>
            <p className="text-xs text-slate-400">Gerencie seu cadastro sem sair da lista.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setIsModalOpen(true);
              }}
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950"
            >
              + Novo empreendimento
            </button>
            <button
              type="button"
              onClick={loadEmpreendimentos}
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              Atualizar
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-100">Lista de empreendimentos</h3>
          <p className="text-sm text-slate-400">Total filtrado: {filteredItens.length}</p>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            type="text"
            placeholder="Buscar por nome, responsável, município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          <select
            value={segmentoFilter}
            onChange={(e) => setSegmentoFilter(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="todos">Todos os segmentos</option>
            {SEGMENTOS.map((segmento) => (
              <option key={segmento} value={segmento}>
                {segmento}
              </option>
            ))}
          </select>

          <select
            value={municipioFilter}
            onChange={(e) => setMunicipioFilter(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="todos">Todos os municípios</option>
            {municipios.map((municipio) => (
              <option key={municipio} value={municipio}>
                {municipio}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpar filtros
          </button>
        </div>

        {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-slate-300">Carregando dados...</p>
        ) : filteredItens.length === 0 ? (
          <p className="text-sm text-slate-300">Nenhum empreendimento cadastrado.</p>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {paginatedItens.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
                  <p><span className="font-medium">Empreendimento:</span> {item.nomeEmpreendimento}</p>
                  <p><span className="font-medium">Responsável:</span> {item.nomeEmpreendedor}</p>
                  <p><span className="font-medium">Município:</span> {item.municipio}</p>
                  <p><span className="font-medium">Segmento:</span> {item.segmento}</p>
                  <p><span className="font-medium">Contato:</span> {item.contato}</p>
                  <p className="mt-1">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.status === "ativo"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-md border border-sky-500/50 px-3 py-1 text-xs text-sky-300"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-200"
                    >
                      {item.status === "ativo" ? "Inativar" : "Ativar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="rounded-md border border-rose-500/50 px-3 py-1 text-xs text-rose-300"
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-slate-300">
                    <th className="px-3 py-2 font-medium">Empreendimento</th>
                    <th className="px-3 py-2 font-medium">Responsável</th>
                    <th className="px-3 py-2 font-medium">Município</th>
                    <th className="px-3 py-2 font-medium">Segmento</th>
                    <th className="px-3 py-2 font-medium">Contato</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItens.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800 align-top text-slate-200">
                      <td className="px-3 py-2">{item.nomeEmpreendimento}</td>
                      <td className="px-3 py-2">{item.nomeEmpreendedor}</td>
                      <td className="px-3 py-2">{item.municipio}</td>
                      <td className="px-3 py-2">{item.segmento}</td>
                      <td className="px-3 py-2">{item.contato}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            item.status === "ativo"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-md border border-sky-500/50 px-3 py-1 text-xs text-sky-300"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(item)}
                            className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-200"
                          >
                            {item.status === "ativo" ? "Inativar" : "Ativar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="rounded-md border border-rose-500/50 px-3 py-1 text-xs text-rose-300"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-400">
                Mostrando {startEntry} a {endEntry} de {filteredItens.length} registros
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-200 disabled:opacity-50"
                >
                  «
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-200 disabled:opacity-50"
                >
                  ‹
                </button>
                <span className="rounded-md bg-sky-500 px-3 py-1 text-sm font-medium text-slate-950">
                  {currentPage}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-200 disabled:opacity-50"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-200 disabled:opacity-50"
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <h3 className="text-lg font-medium text-slate-100">
                {editingId ? "Editar empreendimento" : "Novo empreendimento"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-slate-600 px-3 py-1 text-sm text-slate-300"
              >
                Fechar
              </button>
            </div>

            <form className="grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1 text-sm text-slate-200">
                Nome do empreendimento
                <input
                  name="nomeEmpreendimento"
                  value={form.nomeEmpreendimento}
                  onChange={handleInputChange}
                  className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-200">
                Nome do(a) empreendedor(a) responsável
                <input
                  name="nomeEmpreendedor"
                  value={form.nomeEmpreendedor}
                  onChange={handleInputChange}
                  className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-200">
                Município de Santa Catarina
                <input
                  name="municipio"
                  value={form.municipio}
                  onChange={handleInputChange}
                  className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-200">
                Segmento de atuação
                <select
                  name="segmento"
                  value={form.segmento}
                  onChange={handleInputChange}
                  className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
                  required
                >
                  {SEGMENTOS.map((segmento) => (
                    <option key={segmento} value={segmento}>
                      {segmento}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-200">
                E-mail ou meio de contato
                <input
                  name="contato"
                  value={form.contato}
                  onChange={handleInputChange}
                  className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-200">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
                  required
                >
                  <option value="ativo">ativo</option>
                  <option value="inativo">inativo</option>
                </select>
              </label>

              <div className="sm:col-span-2 flex justify-end gap-2 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Salvar alterações"
                      : "Guardar empreendimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {itemToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-100">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-slate-300">
              Deseja realmente excluir o empreendimento
              <span className="font-medium text-white"> {itemToDelete.nomeEmpreendimento}</span>?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => removeItem(itemToDelete.id)}
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
