"use client";

import { useState } from "react";
import type { Message } from "@/lib/store";

type Props = { messages: Message[]; onChange: (messages: Message[]) => void };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function Messages({ messages, onChange }: Props) {
  const [error, setError] = useState("");

  async function call(id: string, init: RequestInit, next: Message[]) {
    setError("");
    const response = await fetch(`/api/admin/messages/${id}`, init).catch(() => null);
    if (response?.ok) {
      onChange(next);
      return;
    }
    const result = await response?.json().catch(() => ({}));
    setError(result?.error ?? "The change was not saved. Reload the page and try again.");
  }

  const setRead = (target: Message, read: boolean) =>
    call(
      target.id,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read }) },
      messages.map((message) => (message.id === target.id ? { ...message, read } : message)),
    );

  const remove = (target: Message) => {
    if (!window.confirm(`Delete the message from ${target.name}? This cannot be undone.`)) return;
    call(target.id, { method: "DELETE" }, messages.filter((message) => message.id !== target.id));
  };

  if (messages.length === 0) {
    return (
      <div className="admin-empty">
        <h1 className="t-h3">No messages yet</h1>
        <p>Messages sent from the contact page appear here.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="t-h3">Messages</h1>
      {error && (
        <p className="form-failure" role="alert">
          {error}
        </p>
      )}
      <ul className="messages">
        {messages.map((message) => (
          <li key={message.id} className="message" data-unread={!message.read}>
            <div className="message-head">
              <div>
                <strong>{message.name}</strong>
                {message.company && <span> · {message.company}</span>}
              </div>
              <time dateTime={message.createdAt} suppressHydrationWarning>
                {when(message.createdAt)}
              </time>
            </div>
            <p className="message-meta">
              <a href={`mailto:${message.email}`}>{message.email}</a>
              {message.phone && <a href={`tel:${message.phone.replace(/\s/g, "")}`}>{message.phone}</a>}
              <span className="tag">{message.interest}</span>
            </p>
            <p className="message-body">{message.message}</p>
            <div className="message-actions">
              <button className="link-button" onClick={() => setRead(message, !message.read)}>
                {message.read ? "Mark as unread" : "Mark as read"}
              </button>
              <button className="link-button danger" onClick={() => remove(message)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
