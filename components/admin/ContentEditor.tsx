"use client";

import { useState } from "react";
import { blank, defaultContent, type Content } from "@/lib/content";

const pages: { key: keyof Content; label: string }[] = [
  { key: "company", label: "Company details" },
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "products", label: "Products" },
  { key: "careers", label: "Careers" },
  { key: "contact", label: "Contact" },
  { key: "faq", label: "FAQ" },
  { key: "legal", label: "Privacy & terms" },
];

// "primaryCta" -> "Primary cta"
const humanize = (key: string) => {
  const words = key.replace(/([A-Z])/g, " $1").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

type FieldProps = {
  label: string;
  value: unknown;
  shape: unknown; // matching default value; tells us what a new list item looks like
  onChange: (value: unknown) => void;
};

function Field({ label, value, shape, onChange }: FieldProps) {
  if (typeof value === "string") {
    const long = value.length > 70 || (typeof shape === "string" && shape.length > 70);
    return (
      <label className="edit-field">
        <span>{label}</span>
        {long ? (
          <textarea value={value} rows={Math.min(8, Math.ceil(value.length / 90) + 1)} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const template = Array.isArray(shape) && shape.length ? shape[0] : "";
    const replace = (index: number, item: unknown) => onChange(value.map((old, i) => (i === index ? item : old)));
    const move = (index: number, to: number) => {
      const next = [...value];
      next.splice(to, 0, next.splice(index, 1)[0]);
      onChange(next);
    };
    return (
      <fieldset className="edit-group">
        <legend>{label}</legend>
        {value.map((item, index) => (
          <div className="edit-item" key={index}>
            <Field label={`Item ${index + 1}`} value={item} shape={template} onChange={(next) => replace(index, next)} />
            <div className="edit-item-actions">
              <button type="button" className="link-button" disabled={index === 0} onClick={() => move(index, index - 1)}>
                Move up
              </button>
              <button type="button" className="link-button" disabled={index === value.length - 1} onClick={() => move(index, index + 1)}>
                Move down
              </button>
              <button type="button" className="link-button danger" onClick={() => onChange(value.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-small" onClick={() => onChange([...value, blank(template)])}>
          Add item
        </button>
      </fieldset>
    );
  }

  const record = value as Record<string, unknown>;
  const shapes = (shape ?? {}) as Record<string, unknown>;
  return (
    <fieldset className="edit-group">
      <legend>{label}</legend>
      {Object.keys(record).map((key) => (
        <Field
          key={key}
          label={humanize(key)}
          value={record[key]}
          shape={shapes[key]}
          onChange={(next) => onChange({ ...record, [key]: next })}
        />
      ))}
    </fieldset>
  );
}

export default function ContentEditor({ initialContent }: { initialContent: Content }) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(initialContent);
  const [page, setPage] = useState<keyof Content>("company");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const dirty = content !== saved;

  async function save() {
    setStatus("saving");
    setError("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    }).catch(() => null);
    const result = await response?.json().catch(() => ({}));
    if (response?.ok) {
      setContent(result.content);
      setSaved(result.content);
      setStatus("saved");
      return;
    }
    setError(result?.error ?? "Changes were not saved. Check your connection and try again.");
    setStatus("idle");
  }

  return (
    <div className="editor">
      <div className="editor-head">
        <h1 className="t-h3">Site content</h1>
        <div className="editor-save">
          {error && (
            <span className="form-failure" role="alert">
              {error}
            </span>
          )}
          {!error && dirty && <span className="muted">Unsaved changes</span>}
          {!error && !dirty && status === "saved" && <span className="muted" role="status">Changes saved. The site is updated.</span>}
          <button type="button" className="btn btn-ghost btn-small" disabled={!dirty} onClick={() => setContent(saved)}>
            Discard changes
          </button>
          <button type="button" className="btn btn-primary btn-small" disabled={!dirty || status === "saving"} onClick={save}>
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="editor-body">
        <nav className="editor-pages" aria-label="Content sections">
          {pages.map(({ key, label }) => (
            <button key={key} type="button" aria-current={page === key ? "page" : undefined} onClick={() => setPage(key)}>
              {label}
            </button>
          ))}
        </nav>
        <Field
          key={page}
          label={pages.find((entry) => entry.key === page)!.label}
          value={content[page]}
          shape={defaultContent[page]}
          onChange={(next) => {
            setContent({ ...content, [page]: next } as Content);
            setStatus("idle");
          }}
        />
      </div>
    </div>
  );
}
