import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";
import { getContent, getMessages } from "@/lib/store";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const [content, messages] = await Promise.all([getContent(), getMessages()]);
  return <AdminApp initialContent={content} initialMessages={messages} />;
}
