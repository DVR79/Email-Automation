"use client";

import { useEffect, useRef, useState } from "react";

/* Date-range selector for the Analytics header. Demo-only: it switches the
   displayed range label so the control is functional rather than a dead chip.
   Sendrift. Copyright 2026 Venkataramana. */

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"];

export function AnalyticsRange() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Last 30 days");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="chip"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ cursor: "pointer", border: "1px solid var(--line-strong)", display: "inline-flex", alignItems: "center", gap: 6, font: "inherit" }}
      >
        {value}
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 50,
            background: "var(--card)",
            border: "1px solid var(--line-strong)",
            borderRadius: 10,
            padding: 6,
            minWidth: 168,
            boxShadow: "0 6px 24px rgba(20,22,34,.14)",
          }}
        >
          {RANGES.map((r) => (
            <button
              key={r}
              role="option"
              aria-selected={r === value}
              onClick={() => { setValue(r); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 7,
                border: "none",
                background: r === value ? "var(--primary-soft)" : "transparent",
                color: r === value ? "var(--primary)" : "var(--fg)",
                cursor: "pointer",
                font: "inherit",
                fontSize: 13,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
