"use client";

import { useState, useTransition } from "react";
import { createCampaign } from "@/app/campaigns/actions";

/* Add campaign modal. Sendrift. Copyright 2026 Venkataramana. */

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)", marginBottom: 14 };

export function AddCampaign() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Create campaign
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,22,34,.35)", display: "grid", placeItems: "center", zIndex: 100, padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 460, maxWidth: "100%", padding: 24 }}>
            <h3 style={{ fontSize: 17, marginBottom: 16 }}>Create campaign</h3>
            <form
              action={(fd) => startTransition(async () => { await createCampaign(fd); setOpen(false); })}
            >
              <label style={labelStyle}>Name</label>
              <input name="name" required style={inputStyle} placeholder="October Newsletter" />
              <label style={labelStyle}>Subject</label>
              <input name="subject" style={inputStyle} placeholder="What is inside this month" />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>{pending ? "Saving..." : "Create campaign"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
