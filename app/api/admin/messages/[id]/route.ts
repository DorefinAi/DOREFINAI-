import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readBody, sameOrigin } from "@/lib/http";
import { deleteMessage, setMessageRead } from "@/lib/store";

type Context = { params: Promise<{ id: string }> };

async function guard(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Sign in again to continue." }, { status: 401 });
  return null;
}

const notFound = () => NextResponse.json({ error: "That message no longer exists." }, { status: 404 });

export async function PATCH(request: Request, { params }: Context) {
  const denied = await guard(request);
  if (denied) return denied;
  const { read } = await readBody(request);
  const found = await setMessageRead((await params).id, read === true);
  return found ? NextResponse.json({ ok: true }) : notFound();
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await guard(request);
  if (denied) return denied;
  const found = await deleteMessage((await params).id);
  return found ? NextResponse.json({ ok: true }) : notFound();
}
