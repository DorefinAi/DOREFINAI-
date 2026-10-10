import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readBody, sameOrigin } from "@/lib/http";
import { saveContent } from "@/lib/store";

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Sign in again to save." }, { status: 401 });

  try {
    const content = await saveContent(await readBody(request));
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("admin: could not save content", error);
    return NextResponse.json({ error: "The content could not be written to disk." }, { status: 500 });
  }
}
