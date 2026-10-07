/* Contacts, backed by the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import Link from "next/link";
import { prisma } from "@/lib/db";
import { AddContact } from "@/components/AddContact";
import { ImportContacts } from "@/components/ImportContacts";
import { ContactsFilter } from "@/components/ContactsFilter";
import { deleteContact } from "./actions";

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
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const where: { OR?: object[]; status?: string } = {};
  if (q && q.trim()) where.OR = [{ email: { contains: q.trim() } }, { name: { contains: q.trim() } }];
  if (status && status !== "All") where.status = status;

  const contacts = await prisma.contact.findMany({ where, orderBy: { createdAt: "desc" } });
  const filtered = Boolean((q && q.trim()) || (status && status !== "All"));

  return (
    <>
      <div className="phead">
        <div>
          <h1>Contacts</h1>
          <div className="sub tnum">{contacts.length.toLocaleString()} {contacts.length === 1 ? "contact" : "contacts"}{filtered ? " match" : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginLeft: "auto" }}>
          <ImportContacts />
          <AddContact />
        </div>
      </div>

      <ContactsFilter />

      <div className="card">
        {contacts.length === 0 ? (
          <div className="placeholder">
            <span className="pi">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M19 8v6M22 11h-6" /></svg>
            </span>
            <h2>{filtered ? "No contacts match" : "No contacts yet"}</h2>
            <p>{filtered ? "Try a different search or clear the filters." : "Add your first contact to get started."}</p>
          </div>
        ) : (
          <table className="rt">
            <thead>
              <tr><th style={{ width: 18 }}><span className="ck" /></th><th>Name</th><th>Status</th><th>Lists</th><th>Tags</th><th>Added</th><th /></tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td className="sel"><span className="ck" /></td>
                  <td className="main">
                    <div className="cn">
                      <span className="av" style={{ background: pickColor(c.email) }}>{initials(c.name, c.email)}</span>
                      <div className="cn-id"><Link href={`/contacts/${c.id}`}><b>{c.name || c.email.split("@")[0]}</b></Link><div className="em">{c.email}</div></div>
                    </div>
                  </td>
                  <td data-label="Status"><span className={"badge " + statusBadge(c.status)}>{c.status}</span></td>
                  <td data-label="Lists">{c.lists || <span style={{ color: "var(--faint)" }}>-</span>}</td>
                  <td data-label="Tags">{c.tags ? <span className="chip">{c.tags}</span> : <span style={{ color: "var(--faint)" }}>-</span>}</td>
                  <td data-label="Added">{fmtDate(c.createdAt)}</td>
                  <td className="right act">
                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="btn btn-ghost btn-sm" title="Delete contact" aria-label="Delete contact">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
