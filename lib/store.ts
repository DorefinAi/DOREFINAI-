import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { conform, defaultContent, type Content } from "./content";

const DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const file = (name: string) => path.join(/*turbopackIgnore: true*/ DIR, name);

export type Message = {
  id: string;
  createdAt: string;
  read: boolean;
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
};

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file(name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

// Writes are queued so two requests can't interleave a read-modify-write.
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function writeJson(name: string, data: unknown) {
  await fs.mkdir(DIR, { recursive: true });
  const target = file(name);
  const tmp = `${target}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

export async function getContent(): Promise<Content> {
  return conform(defaultContent, await readJson<unknown>("content.json", null));
}

export function saveContent(input: unknown): Promise<Content> {
  return enqueue(async () => {
    const content = conform(defaultContent, input);
    await writeJson("content.json", content);
    return content;
  });
}

export async function getMessages(): Promise<Message[]> {
  return readJson<Message[]>("messages.json", []);
}

export function addMessage(fields: Omit<Message, "id" | "createdAt" | "read">) {
  return enqueue(async () => {
    const messages = await getMessages();
    messages.unshift({ id: randomUUID(), createdAt: new Date().toISOString(), read: false, ...fields });
    await writeJson("messages.json", messages);
  });
}

export function setMessageRead(id: string, read: boolean) {
  return enqueue(async () => {
    const messages = await getMessages();
    const found = messages.find((m) => m.id === id);
    if (!found) return false;
    found.read = read;
    await writeJson("messages.json", messages);
    return true;
  });
}

export function deleteMessage(id: string) {
  return enqueue(async () => {
    const messages = await getMessages();
    const rest = messages.filter((m) => m.id !== id);
    if (rest.length === messages.length) return false;
    await writeJson("messages.json", rest);
    return true;
  });
}
