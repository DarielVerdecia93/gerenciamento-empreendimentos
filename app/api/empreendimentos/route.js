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

export async function GET() {
  const authError = await ensureAuthenticated();
  if (authError) {
    return authError;
  }

  const items = await getEmpreendimentos();
  return NextResponse.json(items);
}

export async function POST(request) {
  const authError = await ensureAuthenticated();
  if (authError) {
    return authError;
  }

  const body = await request.json();
  const errors = validateEmpreendimento(body);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const items = await getEmpreendimentos();

  const novo = {
    id: crypto.randomUUID(),
    nomeEmpreendimento: body.nomeEmpreendimento.trim(),
    nomeEmpreendedor: body.nomeEmpreendedor.trim(),
    municipio: body.municipio.trim(),
    segmento: body.segmento,
    contato: body.contato.trim(),
    status: body.status,
    createdAt: new Date().toISOString(),
  };

  const atualizados = [novo, ...items];
  await saveEmpreendimentos(atualizados);

  return NextResponse.json(novo, { status: 201 });
}