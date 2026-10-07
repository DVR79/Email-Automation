"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/* Contacts search + status filter (URL-driven). Sendrift. Copyright 2026 Venkataramana. */

const selectStyle: React.CSSProperties = { height: 36, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--card)", padding: "0 12px", font: "inherit", color: "var(--fg)", fontWeight: 500, cursor: "pointer" };

export function ContactsFilter() {
  const router = useRouter();
  const sp = useSearchParams();
  const urlQ = sp.get("q") || "";
  const status = sp.get("status") || "All";
  const [q, setQ] = useState(urlQ);
  const [soon, setSoon] = useState(false);

  // Keep local input in sync if the URL changes elsewhere.
  useEffect(() => { setQ(urlQ); }, [urlQ]);

  // Debounced search push.
  useEffect(() => {
    if (q === urlQ) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(sp.toString());
      if (q) params.set("q", q); else params.delete("q");
      router.push(params.toString() ? `/contacts?${params.toString()}` : "/contacts");
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function setStatus(next: string) {
    const params = new URLSearchParams(sp.toString());
    if (next && next !== "All") params.set("status", next); else params.delete("status");
    router.push(params.toString() ? `/contacts?${params.toString()}` : "/contacts");
  }

  const active = Boolean(q) || status !== "All";

  return (
    <div className="card toolbar" style={{ padding: "14px 18px", marginBottom: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <div className="search" style={{ maxWidth: 300, margin: 0 }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" />
      </div>
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle} aria-label="Filter by status">
        <option value="All">All statuses</option>
        <option value="Subscribed">Subscribed</option>
        <option value="Pending">Pending</option>
        <option value="Unsubscribed">Unsubscribed</option>
        <option value="Bounced">Bounced</option>
      </select>
      {active ? <button className="btn btn-ghost btn-sm" onClick={() => { setQ(""); router.push("/contacts"); }}>Clear</button> : null}
      <div className="spacer" />
      {soon ? <span className="chip" style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}>Column options coming soon</span> : null}
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSoon(true); setTimeout(() => setSoon(false), 2400); }}>Columns</button>
    </div>
  );
}
