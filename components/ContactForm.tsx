"use client";

import { useState } from "react";
import { Arrow } from "./ui";

type Props = { interests: string[]; submitLabel: string; confirmation: string };
type Errors = Record<string, string>;

export default function ContactForm({ interests, submitLabel, confirmation }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setErrors({});
    setFailure("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      const result = await response.json().catch(() => ({}));
      setErrors(result.errors ?? {});
      setFailure(result.error ?? "The message was not sent. Try again.");
    } catch {
      setFailure("No connection to the server. Check your internet and try again.");
    }
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="form-sent" role="status">
        <p className="form-sent-title">Message sent</p>
        <p>{confirmation}</p>
        <button type="button" className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: string) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] && (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    );

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input {...field("name")} type="text" autoComplete="name" maxLength={100} required />
        {error("name")}
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input {...field("email")} type="email" autoComplete="email" maxLength={200} required />
        {error("email")}
      </div>
      <div className="field">
        <label htmlFor="phone">
          Phone number <span className="optional">optional</span>
        </label>
        <input {...field("phone")} type="tel" autoComplete="tel" maxLength={30} />
        {error("phone")}
      </div>
      <div className="field">
        <label htmlFor="company">
          Company / organisation <span className="optional">optional</span>
        </label>
        <input {...field("company")} type="text" autoComplete="organization" maxLength={150} />
      </div>
      <div className="field field-wide">
        <label htmlFor="interest">I’m interested in</label>
        <select id="interest" name="interest" defaultValue={interests.at(-1)}>
          {interests.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="field field-wide">
        <label htmlFor="message">Your message</label>
        <textarea {...field("message")} rows={6} maxLength={4000} required />
        {error("message")}
      </div>
      <div className="trap" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field-wide form-foot">
        <button type="submit" className="btn btn-primary btn-arrow" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : submitLabel}
          <span className="btn-icon">
            <Arrow />
          </span>
        </button>
        {failure && (
          <p className="form-failure" role="alert">
            {failure}
          </p>
        )}
      </div>
    </form>
  );
}
