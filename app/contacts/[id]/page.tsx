/* Contact detail, backed by the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteContact } from "../actions";

export const dynamic = "force-dynamic";

const PALETTE = ["--v1", "--v2", "--v3", "--v4", "--v5", "--v6", "--v7", "--v8"];

function pickColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `var(${PALETTE[h % PALETTE.length]})`;
}

function initials(name: string | null, email: string) {
  const base = (name && name.trim()) || email;
  const parts = base.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? base[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

function statusBadge(status: string) {
  switch (status) {
    case "Subscribed": return "b-s";
    case "Pending": return "b-w";
    case "Bounced": return "b-e";
    case "Unsubscribed": return "b-m";
    default: return "b-m";
  }
}

function fmtDate(d: Date | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function splitTokens(v: string | null) {
  return (v || "").split(",").map((t) => t.trim()).filter(Boolean);
}

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.contact.findUnique({ where: { id } });
  if (!c) notFound();

  const lists = splitTokens(c.lists);
  const tags = splitTokens(c.tags);

  return (
    <>
      <div className="phead">
        <div className="cn">
          <span className="av" style={{ background: pickColor(c.email), width: 44, height: 44, fontSize: 15 }}>{initials(c.name, c.email)}</span>
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {c.name || c.email.split("@")[0]}
              <span className={"badge " + statusBadge(c.status)}>{c.status}</span>
            </h1>
            <div className="sub">{c.email}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginLeft: "auto" }}>
          <Link href="/contacts" className="btn btn-outline btn-sm">Back to contacts</Link>
          <form action={deleteContact}>
            <input type="hidden" name="id" value={c.id} />
            <button className="btn btn-ghost btn-sm" title="Delete contact" aria-label="Delete contact">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
            </button>
          </form>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="chead"><h3>Profile</h3></div>
          <div className="cpad" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Field label="Email" value={c.email} />
            <Field label="Status" value={<span className={"badge " + statusBadge(c.status)}>{c.status}</span>} />
            <Field label="Lists" value={lists.length ? <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{lists.map((l) => <span key={l} className="chip">{l}</span>)}</span> : <Dash />} />
            <Field label="Tags" value={tags.length ? <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{tags.map((t) => <span key={t} className="chip">{t}</span>)}</span> : <Dash />} />
            <Field label="Source" value={c.source || <Dash />} />
            <Field label="Created" value={fmtDate(c.createdAt)} />
            <Field label="Last activity" value={fmtDate(c.lastActivityAt)} last />
          </div>
        </div>

        <div className="card">
          <div className="chead"><h3>Activity</h3></div>
          <div className="placeholder" style={{ padding: "48px 20px" }}>
            <span className="pi">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </span>
            <h2>No activity yet</h2>
            <p>Opens, clicks, and sends for this contact will show up here.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Dash() {
  return <span style={{ color: "var(--faint)" }}>-</span>;
}

function Field({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: last ? "none" : "1px solid var(--line)" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>{label}</span>
      <span style={{ fontSize: 14, color: "var(--fg)", minWidth: 0 }}>{value}</span>
    </div>
  );
}
