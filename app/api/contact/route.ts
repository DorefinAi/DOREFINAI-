import { NextResponse } from "next/server";
import { clientIp, rateLimited, readBody } from "@/lib/http";
import { addMessage, getContent } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (rateLimited(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = await readBody(request);

  // Hidden field real visitors never fill in. Bots get a quiet success.
  if (text(body.website, 200)) return NextResponse.json({ ok: true }, { status: 201 });

  const name = text(body.name, 100);
  const email = text(body.email, 200);
  const phone = text(body.phone, 30);
  const company = text(body.company, 150);
  const message = text(body.message, 4000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Enter your full name.";
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (phone && !/^[+\d][\d\s().-]{5,}$/.test(phone)) errors.phone = "Enter a valid phone number, or leave it empty.";
  if (message.length < 10) errors.message = "Write at least a sentence so we know how to help.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Check the highlighted fields.", errors }, { status: 400 });
  }

  const { interests } = (await getContent()).contact;
  const picked = text(body.interest, 100);
  const interest = interests.includes(picked) ? picked : (interests.at(-1) ?? "");

  try {
    await addMessage({ name, email, phone, company, interest, message });
  } catch (error) {
    console.error("contact: could not save message", error);
    return NextResponse.json(
      { error: "The message could not be saved. Try again, or email us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
