import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "usuarios.json");

const SESSION_COOKIE = "empre_session";
const SESSION_MAX_AGE = 60 * 60 * 8;
const SECRET = process.env.AUTH_SECRET || "empre-default-secret-change-me";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function ensureUsersFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(usersFile);
  } catch {
    const defaultUsers = [
      {
        username: "admin",
        passwordHash: hashPassword("admin123"),
        nome: "Administrador",
      },
    ];

    await fs.writeFile(usersFile, JSON.stringify(defaultUsers, null, 2), "utf-8");
  }
}

export async function getUsers() {
  await ensureUsersFile();
  const raw = await fs.readFile(usersFile, "utf-8");
  return JSON.parse(raw);
}

export async function validateUser(username, password) {
  const users = await getUsers();
  const passwordHash = hashPassword(password);
  return users.find((user) => user.username === username && user.passwordHash === passwordHash) || null;
}

function signPayload(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyPayload(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");

  if (signature !== expected) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));

  if (!payload.exp || Date.now() > payload.exp) {
    return null;
  }

  return payload;
}

export function createSessionToken(user) {
  return signPayload({
    username: user.username,
    nome: user.nome,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
}

export function getSessionFromCookie(cookieStore) {
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifyPayload(token);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionMaxAge() {
  return SESSION_MAX_AGE;
}