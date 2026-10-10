"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Content } from "@/lib/content";
import type { Message } from "@/lib/store";
import ContentEditor from "./ContentEditor";
import Messages from "./Messages";

type Props = { initialContent: Content; initialMessages: Message[] };

export default function AdminApp({ initialContent, initialMessages }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"messages" | "content">("messages");
  const [messages, setMessages] = useState(initialMessages);
  const unread = messages.filter((message) => !message.read).length;

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <span className="admin-brand">Dorefin AI · Admin</span>
        <div className="admin-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "messages"} onClick={() => setTab("messages")}>
            Messages{unread > 0 && <span className="badge">{unread}</span>}
          </button>
          <button role="tab" aria-selected={tab === "content"} onClick={() => setTab("content")}>
            Site content
          </button>
        </div>
        <div className="admin-bar-end">
          <Link href="/" target="_blank">
            View site
          </Link>
          <button className="link-button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-main">
        {tab === "messages" ? (
          <Messages messages={messages} onChange={setMessages} />
        ) : (
          <ContentEditor initialContent={initialContent} />
        )}
      </main>
    </div>
  );
}
