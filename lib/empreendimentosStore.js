import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "empreendimentos.json");

export const SEGMENTOS = [
  "Tecnologia",
  "Comércio",
  "Indústria",
  "Serviços",
  "Agronegócio",
];

export const STATUS_VALIDOS = ["ativo", "inativo"];

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf-8");
  }
}

export async function getEmpreendimentos() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw);
}

export async function saveEmpreendimentos(items) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf-8");
}

export function validateEmpreendimento(data) {
  const errors = [];

  if (!data.nomeEmpreendimento?.trim()) {
    errors.push("Nome do empreendimento é obrigatório.");
  }

  if (!data.nomeEmpreendedor?.trim()) {
    errors.push("Nome do(a) empreendedor(a) responsável é obrigatório.");
  }

  if (!data.municipio?.trim()) {
    errors.push("Município de Santa Catarina é obrigatório.");
  }

  if (!SEGMENTOS.includes(data.segmento)) {
    errors.push("Segmento de atuação inválido.");
  }

  if (!data.contato?.trim()) {
    errors.push("E-mail ou meio de contato é obrigatório.");
  }

  if (!STATUS_VALIDOS.includes(data.status)) {
    errors.push("Status deve ser ativo ou inativo.");
  }

  return errors;
}