"use client";

import { useState, useTransition } from "react";
import { createTemplate } from "@/app/templates/actions";

/* Add template modal. Sendrift. Copyright 2026 Venkataramana. */

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)", marginBottom: 14 };

const CATEGORIES = ["Newsletter", "Promotion", "Welcome", "Product announcement"];

export function TemplatePreview({ name, html }: { name: string; html: string }) {
  const [open, setOpen] = useState(false);
  const hasContent = Boolean(html && html.trim());

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>Preview</button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,22,34,.35)", display: "grid", placeItems: "center", zIndex: 100, padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 640, maxWidth: "100%", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 17 }}>{name}</h3>
              <div className="spacer" />
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Close</button>
            </div>
            {hasContent ? (
              <div
                style={{ maxHeight: "60vh", overflow: "auto", border: "1px solid var(--line-strong)", borderRadius: 10, background: "#FFFFFF", padding: 20, color: "#1A1C22" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="placeholder" style={{ border: "1px solid var(--line)", borderRadius: 10 }}>
                <h2>Nothing to preview yet</h2>
                <p>This template has no content. Open it in the builder to design it.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function AddTemplate() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Create template
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,22,34,.35)", display: "grid", placeItems: "center", zIndex: 100, padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 460, maxWidth: "100%", padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 16 }}>Create template</h3>
            <form
              action={(fd) => startTransition(async () => { await createTemplate(fd); setOpen(false); })}
            >
              <label style={labelStyle}>Name</label>
              <input name="name" required style={inputStyle} placeholder="Monthly newsletter" />
              <label style={labelStyle}>Category</label>
              <select name="category" style={inputStyle} defaultValue="Newsletter">
                {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>{pending ? "Saving..." : "Create template"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
