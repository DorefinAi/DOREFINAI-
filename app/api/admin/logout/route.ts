import { NextResponse } from "next/server";
import { endSession } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  await endSession();
  return NextResponse.json({ ok: true });
}
