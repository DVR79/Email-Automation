"use client";

import { useState, useTransition } from "react";
import { createAutomation } from "@/app/automations/actions";

/* Add automation modal. Sendrift. Copyright 2026 Venkataramana. */

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)", marginBottom: 14 };

const TRIGGERS = ["Joins list", "Tag added", "Form submitted", "Date based"];

export function AddAutomation() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>Create automation</button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,22,34,.35)", display: "grid", placeItems: "center", zIndex: 100, padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 460, maxWidth: "100%", padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 16 }}>Create automation</h3>
            <form
              action={(fd) => startTransition(async () => { await createAutomation(fd); setOpen(false); })}
            >
              <label style={labelStyle}>Name</label>
              <input name="name" required style={inputStyle} placeholder="Welcome series" />
              <label style={labelStyle}>Trigger</label>
              <select name="trigger" defaultValue="Joins list" style={inputStyle}>
                {TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>{pending ? "Saving..." : "Create automation"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
