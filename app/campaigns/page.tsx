/* Campaigns list, backed by the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import Link from "next/link";
import { prisma } from "@/lib/db";
import { AddCampaign } from "@/components/AddCampaign";
import { SendCampaign } from "@/components/SendCampaign";
import { campaignRates } from "@/lib/stats";
import { deleteCampaign } from "./actions";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  switch (status) {
    case "Sent": return "b-s";
    case "Scheduled": return "b-i";
    case "Sending": return "b-w";
    case "Draft": return "b-m";
    case "Failed": return "b-e";
    default: return "b-m";
  }
}

function fmtDate(d: Date | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function pct(v: number | null) {
  return v == null ? "-" : v + "%";
}

const TABS = [
  { label: "All", value: "" },
  { label: "Drafts", value: "Draft" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Sent", value: "Sent" },
];

export default async function CampaignsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const where = status && status !== "All" ? { status } : {};
  const active = status || "";
  const campaigns = await prisma.campaign.findMany({ where, orderBy: { createdAt: "desc" } });
  const rates = await campaignRates(campaigns.map((c) => c.id));

  return (
    <>
      <div className="phead">
        <div>
          <h1>Campaigns</h1>
          <div className="sub">Every send in one place.</div>
        </div>
        <div className="spacer" />
        <AddCampaign />
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <Link key={t.label} href={t.value ? `/campaigns?status=${t.value}` : "/campaigns"} className={"tab" + (active === t.value ? " active" : "")}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="card">
        {campaigns.length === 0 ? (
          <div className="placeholder">
            <span className="pi">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" /><path d="m4 7 8 6 8-6" /></svg>
            </span>
            <h2>No campaigns yet</h2>
            <p>Create your first campaign to start sending.</p>
          </div>
        ) : (
          <table className="rt">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Type</th>
                <th>Status</th>
                <th className="right">Recipients</th>
                <th className="right">Open</th>
                <th className="right">Click</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="main">
                    <Link href={`/campaigns/${c.id}`}><b>{c.name}</b></Link>
                    <div className="cn em" style={{ color: "var(--sub)", fontSize: 12 }}>{c.subject || "No subject"}</div>
                  </td>
                  <td data-label="Type"><span className="chip">{c.type}</span></td>
                  <td data-label="Status"><span className={"badge " + statusBadge(c.status)}>{c.status}</span></td>
                  <td className="right tnum" data-label="Recipients">{c.recipients.toLocaleString()}</td>
                  <td className="right tnum" data-label="Open">{pct(rates[c.id]?.openRate ?? null)}</td>
                  <td className="right tnum" data-label="Click">{pct(rates[c.id]?.clickRate ?? null)}</td>
                  <td data-label="Date">{fmtDate(c.sentAt ?? c.scheduledAt)}</td>
                  <td className="right act">
                    <div style={{ display: "inline-flex", gap: 6, alignItems: "center", justifyContent: "flex-end" }}>
                      {(c.status === "Draft" || c.status === "Scheduled") ? <SendCampaign id={c.id} /> : null}
                      <form action={deleteCampaign}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="btn btn-ghost btn-sm" title="Delete campaign" aria-label="Delete campaign">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                        </button>
                      </form>
                    </div>
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
