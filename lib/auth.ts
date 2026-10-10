import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "dorefin_admin";
const MAX_AGE = 60 * 60 * 8; // seconds

const sha256 = (value: string) => createHash("sha256").update(value).digest();

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

// Tied to the password too, so changing it signs everyone out.
function secret() {
  return sha256(`${process.env.SESSION_SECRET ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`);
}

function sign(expires: string) {
  return createHmac("sha256", secret()).update(expires).digest("hex");
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(sha256(candidate), sha256(expected));
}

export async function startSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
