import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, startSession } from "@/lib/auth";
import { clientIp, rateLimited, readBody, sameOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "No admin password is set. Add ADMIN_PASSWORD to .env.local and restart." },
      { status: 503 },
    );
  }
  if (rateLimited(`login:${clientIp(request)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Wait 10 minutes and try again." }, { status: 429 });
  }

  const { password } = await readBody(request);
  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  }

  await startSession();
  return NextResponse.json({ ok: true });
}
