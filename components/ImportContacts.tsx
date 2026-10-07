"use client";

import { useState, useTransition } from "react";
import { importContacts } from "@/app/contacts/actions";

/* Import contacts modal. Sendrift. Copyright 2026 Venkataramana. */

const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };
const input: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)", marginBottom: 14 };
const area: React.CSSProperties = { width: "100%", minHeight: 120, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "10px 12px", font: "inherit", color: "var(--fg)", marginBottom: 14, resize: "vertical" };

export function ImportContacts() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [list, setList] = useState("");
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);
  const [pending, startTransition] = useTransition();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result || ""));
    reader.readAsText(f);
  }

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("data", text);
      fd.set("list", list);
      const res = await importContacts(fd);
      setResult(res);
      setText("");
    });
  }

  return (
    <>
      <button className="btn btn-outline btn-sm" onClick={() => { setOpen(true); setResult(null); }}>Import</button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(20,22,34,.35)", display: "grid", placeItems: "center", zIndex: 100, padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 520, maxWidth: "100%", padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Import contacts</h3>
            <p style={{ color: "var(--sub)", fontSize: 13, marginBottom: 16 }}>Paste one email per line, or use email,name. You can also choose a CSV file.</p>
            <label style={label}>Add to list (optional)</label>
            <input style={input} value={list} onChange={(e) => setList(e.target.value)} placeholder="Newsletter" />
            <label style={label}>Contacts</label>
            <textarea style={area} value={text} onChange={(e) => setText(e.target.value)} placeholder={"jane@company.com, Jane Cooper\nsam@company.com"} />
            <input type="file" accept=".csv,.txt" onChange={onFile} style={{ marginBottom: 14, fontSize: 13 }} />
            {result && (
              <div style={{ marginBottom: 12, fontSize: 13 }}>
                <span className="badge b-s">Imported {result.added}</span>{" "}
                {result.skipped > 0 ? <span className="badge b-m">Skipped {result.skipped}</span> : null}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Close</button>
              <button type="button" className="btn btn-primary btn-sm" disabled={pending || !text.trim()} onClick={submit}>{pending ? "Importing..." : "Import contacts"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
