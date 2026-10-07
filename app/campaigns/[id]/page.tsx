/* Campaign report, backed by the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SendCampaign } from "@/components/SendCampaign";
import { campaignStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "not sent yet";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function linkLabel(url: string) {
  try {
    const u = new URL(url);
    const path = (u.pathname + u.search).replace(/\/$/, "");
    return u.host + (path && path !== "/" ? path : "");
  } catch {
    return url;
  }
}

export default async function CampaignReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.campaign.findUnique({ where: { id } });
  if (!c) notFound();

  const s = await campaignStats(id);
  const isSent = c.status === "Sent";
  const recipients = s.delivered || c.recipients;
  const deliveredRate = s.deliveredRate;
  const openRate = s.openRate;
  const clickRate = s.clickRate;

  const sent = s.sent;
  const delivered = s.delivered;
  const opened = s.opens;
  const clicked = s.clicks;
  const unsubs = s.unsubs;

  const funnel = [
    { label: "Sent", value: sent, color: "var(--v6)" },
    { label: "Delivered", value: delivered, color: "var(--v1)" },
    { label: "Opened", value: opened, color: "var(--v2)" },
    { label: "Clicked", value: clicked, color: "var(--v3)" },
  ];
  const funnelMax = sent || 1;

  const topLinks = s.topLinks;
  const linkMax = Math.max(1, ...topLinks.map((l) => l.clicks));

  return (
    <>
      <div className="phead">
        <div>
          <h1>{c.name}</h1>
          <div className="sub">{isSent ? `Sent ${fmtDate(c.sentAt)} to ${recipients.toLocaleString()} recipients` : `${c.status}. Not sent yet.`}</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginLeft: "auto" }}>
          {(c.status === "Draft" || c.status === "Scheduled") ? <SendCampaign id={c.id} /> : null}
          <Link href="/campaigns" className="btn btn-outline btn-sm">Back to campaigns</Link>
        </div>
      </div>

      <div className="sub" style={{ marginTop: -14, marginBottom: 16, fontSize: 12.5 }}>
        {isSent ? "Open and click numbers update live as recipients engage." : "Numbers appear here once the campaign is sent."}
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <StatTile label="Delivered" value={deliveredRate + "%"} note={delivered.toLocaleString() + " delivered"} tone="var(--success-s)" color="var(--success)" ico={<CheckIcon />} />
        <StatTile label="Open rate" value={openRate + "%"} note={opened.toLocaleString() + " opens"} tone="var(--primary-subtle)" color="var(--primary)" ico={<EyeIcon />} />
        <StatTile label="Click rate" value={clickRate + "%"} note={clicked.toLocaleString() + " clicks"} tone="var(--warning-s)" color="var(--warning)" ico={<ClickIcon />} />
        <StatTile label="Unsubscribes" value={unsubs.toLocaleString()} note="this send" tone="var(--error-s)" color="var(--error)" ico={<UserOffIcon />} />
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="chead"><h3>Engagement funnel</h3></div>
          <div className="cpad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {funnel.map((f) => (
              <div key={f.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{f.label}</span>
                  <span className="tnum" style={{ color: "var(--sub)" }}>{f.value.toLocaleString()} ({Math.round((f.value / funnelMax) * 100)}%)</span>
                </div>
                <div style={{ height: 12, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(f.value / funnelMax) * 100}%`, background: f.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chead"><h3>Top links</h3></div>
          <div className="cpad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {topLinks.length === 0 ? (
              <div style={{ color: "var(--sub)", fontSize: 13, padding: "8px 0" }}>No link clicks yet. They appear here as recipients click links in this email.</div>
            ) : (
              topLinks.map((l) => (
                <div key={l.url}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, gap: 12 }}>
                    <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{linkLabel(l.url)}</span>
                    <span className="tnum" style={{ color: "var(--sub)", flex: "none" }}>{l.clicks.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(l.clicks / linkMax) * 100}%`, background: "var(--primary)", borderRadius: 999 }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StatTile({ label, value, note, tone, color, ico }: { label: string; value: string; note: string; tone: string; color: string; ico: React.ReactNode }) {
  return (
    <div className="card stat">
      <div className="top"><span className="label">{label}</span><span className="ico" style={{ background: tone, color }}>{ico}</span></div>
      <div className="value tnum">{value}</div>
      <div className="row">{note}</div>
    </div>
  );
}

const CheckIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const EyeIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
const ClickIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 9 5 12 1.8-5.2L21 14Z" /></svg>);
const UserOffIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M17 8h6" /></svg>);
