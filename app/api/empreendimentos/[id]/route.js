import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getEmpreendimentos,
  saveEmpreendimentos,
  validateEmpreendimento,
} from "@/lib/empreendimentosStore";
import { getSessionFromCookie } from "@/lib/authStore";

export const runtime = "nodejs";

async function ensureAuthenticated() {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  return null;
}

export async function PUT(request, { params }) {
  const authError = await ensureAuthenticated();
  if (authError) {
    return authError;
  }

  const { id } = await params;
  const body = await request.json();

  const items = await getEmpreendimentos();
  const index = items.findIndex((item) => item.id === id);

  if (index < 0) {
    return NextResponse.json({ error: "Empreendimento não encontrado." }, { status: 404 });
  }

  const payload = {
    nomeEmpreendimento: body.nomeEmpreendimento,
    nomeEmpreendedor: body.nomeEmpreendedor,
    municipio: body.municipio,
    segmento: body.segmento,
    contato: body.contato,
    status: body.status,
  };

  const errors = validateEmpreendimento(payload);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const atualizado = {
    ...items[index],
    ...payload,
    nomeEmpreendimento: payload.nomeEmpreendimento.trim(),
    nomeEmpreendedor: payload.nomeEmpreendedor.trim(),
    municipio: payload.municipio.trim(),
    contato: payload.contato.trim(),
    updatedAt: new Date().toISOString(),
  };

  items[index] = atualizado;
  await saveEmpreendimentos(items);

  return NextResponse.json(atualizado);
}

export async function DELETE(_request, { params }) {
  const authError = await ensureAuthenticated();
  if (authError) {
    return authError;
  }

  const { id } = await params;
  const items = await getEmpreendimentos();
  const filtrados = items.filter((item) => item.id !== id);

  if (filtrados.length === items.length) {
    return NextResponse.json({ error: "Empreendimento não encontrado." }, { status: 404 });
  }

  await saveEmpreendimentos(filtrados);
  return NextResponse.json({ ok: true });
}