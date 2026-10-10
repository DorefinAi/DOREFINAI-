"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: new FormData(event.currentTarget).get("password") }),
      });
      if (response.ok) {
        router.refresh();
        return;
      }
      setError((await response.json().catch(() => ({}))).error ?? "Sign-in failed. Try again.");
    } catch {
      setError("No connection to the server. Try again.");
    }
    setBusy(false);
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <p className="kicker">Dorefin AI</p>
        <h1 className="t-h3">Admin sign-in</h1>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" autoFocus required />
        </div>
        {error && (
          <p className="form-failure" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
