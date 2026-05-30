import { createHmac, randomBytes } from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "fallback-dev-secret";
const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function createResetToken(email: string): string {
  const expiry = Date.now() + EXPIRY_MS;
  const payload = `${email}|${expiry}`;
  const salt = randomBytes(8).toString("hex");
  const sig = createHmac("sha256", SECRET).update(`${payload}|${salt}`).digest("hex");
  return Buffer.from(`${payload}|${salt}|${sig}`).toString("base64url");
}

export function verifyResetToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");
    if (parts.length !== 4) return null;
    const [email, expiry, salt, sig] = parts;
    if (Date.now() > parseInt(expiry)) return null;
    const expected = createHmac("sha256", SECRET).update(`${email}|${expiry}|${salt}`).digest("hex");
    if (expected !== sig) return null;
    return email;
  } catch {
    return null;
  }
}
