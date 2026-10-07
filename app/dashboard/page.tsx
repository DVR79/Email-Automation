/* Dashboard, backed by the local database. Sendrift. Copyright 2026 Venkataramana. */

import Link from "next/link";
import { prisma } from "@/lib/db";
import { overviewStats, contactGrowth, campaignRates } from "@/lib/stats";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  switch (status) {
    case "Sent": return "b-s";
    case "Scheduled": return "b-i";
    case "Sending": return "b-w";
    case "Failed": return "b-e";
    default: return "b-m";
  }
}
function fmt(n: number) { return n.toLocaleString("en-US"); }

// Map the cumulative-contacts series to an SVG polyline over a 640x200 box.
function seriesPoints(values: number[]) {
  const n = values.length;
  if (n === 0) return { line: "", area: "" };
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const x = (i: number) => (n === 1 ? 640 : (i / (n - 1)) * 640);
  const y = (v: number) => 185 - ((v - min) / span) * 165;
  const pts = values.map((v, i) => `${x(i).toFixed(0)},${y(v).toFixed(0)}`);
  return { line: pts.join(" "), area: `M0,200 ${pts.join(" ")} ${x(n - 1).toFixed(0)},200Z` };
}

export default async function DashboardPage() {
  const [o, growth, campaigns] = await Promise.all([
    overviewStats(),
    contactGrowth(30),
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const rates = await campaignRates(campaigns.map((c) => c.id));
  const chart = seriesPoints(growth.points);
  const circ = 2 * Math.PI * 52; // deliverability donut circumference
  const dash = (o.deliverability / 100) * circ;

  return (
    <>
      <div className="phead">
        <div>
          <h1>Good afternoon, Venkataramana</h1>
          <div className="sub">Here is how your sending looks.</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginLeft: "auto" }}>
          <Link href="/contacts" className="btn btn-outline btn-sm">Import contacts</Link>
          <Link href="/campaigns" className="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Create campaign
          </Link>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <Stat label="Total contacts" value={fmt(o.contacts)} note={`${fmt(growth.newContacts)} added in 30 days`} ico={<UsersIcon />} tone="var(--primary-subtle)" color="var(--primary)" />
        <Stat label="Emails sent" value={fmt(o.emailsSent)} note={o.emailsSent ? `${fmt(o.delivered)} delivered` : "no sends yet"} ico={<SendIcon />} tone="var(--info-s)" color="var(--info)" />
        <Stat label="Open rate" value={o.openRate + "%"} note={`${fmt(o.opens)} unique opens`} ico={<EyeIcon />} tone="var(--success-s)" color="var(--success)" />
        <Stat label="Click rate" value={o.clickRate + "%"} note={`${fmt(o.clicks)} unique clicks`} ico={<ClickIcon />} tone="var(--warning-s)" color="var(--warning)" />
      </div>

      <div className="grid g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="chead"><h3>Audience growth</h3><div className="spacer" /><span className="chip">Last 30 days</span></div>
          <div className="cpad">
            <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
              <Mini label="New contacts" value={"+" + fmt(growth.newContacts)} />
              <Mini label="Unsubscribed" value={fmt(growth.unsubscribed)} />
              <Mini label="Net growth" value={(growth.net >= 0 ? "+" : "") + fmt(growth.net)} color={growth.net >= 0 ? "var(--success)" : "var(--error)"} />
            </div>
            <svg viewBox="0 0 640 200" width="100%" height="200" preserveAspectRatio="none" role="img" aria-label="Cumulative contacts over the last 30 days">
              <line x1="0" y1="50" x2="640" y2="50" stroke="var(--line)" /><line x1="0" y1="100" x2="640" y2="100" stroke="var(--line)" /><line x1="0" y1="150" x2="640" y2="150" stroke="var(--line)" />
              <defs><linearGradient id="gg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity="0.22" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
              {chart.area ? <path d={chart.area} fill="url(#gg)" /> : null}
              {chart.line ? <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points={chart.line} /> : null}
            </svg>
            <div className="legend" style={{ marginTop: 10 }}>
              <span><i style={{ background: "var(--primary)" }} />Total contacts over time</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="chead"><h3>Deliverability</h3></div>
          <div className="cpad" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <svg viewBox="0 0 130 130" width="150" height="150" role="img" aria-label={`Deliverability ${o.deliverability} percent`}>
              <circle cx="65" cy="65" r="52" fill="none" stroke="var(--muted)" strokeWidth="16" />
              {dash > 0 ? <circle cx="65" cy="65" r="52" fill="none" stroke="var(--success)" strokeWidth="16" strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`} strokeLinecap="round" transform="rotate(-90 65 65)" /> : null}
              <text x="65" y="61" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--fg)">{o.deliverability}%</text>
              <text x="65" y="80" textAnchor="middle" fontSize="11" fill="var(--sub)">delivered</text>
            </svg>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
              <DelivRow badge="b-s" label="Delivered" value={fmt(o.delivered)} />
              <DelivRow badge="b-e" label="Failed" value={fmt(o.failed)} />
              <DelivRow badge="b-m" label="Unsubscribes" value={fmt(o.unsubs)} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="chead"><h3>Recent campaigns</h3><div className="spacer" /><Link href="/campaigns" className="btn btn-ghost btn-sm">View all</Link></div>
          <table>
            <thead><tr><th>Campaign</th><th>Status</th><th className="right">Open</th><th className="right">Click</th></tr></thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.name}</b><div className="cn em" style={{ color: "var(--sub)", fontSize: 12 }}>{c.subject || c.status}</div></td>
                  <td><span className={"badge " + statusBadge(c.status)}>{c.status}</span></td>
                  <td className="right tnum">{rates[c.id]?.openRate != null ? rates[c.id].openRate + "%" : "-"}</td>
                  <td className="right tnum">{rates[c.id]?.clickRate != null ? rates[c.id].clickRate + "%" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="chead"><h3>Finish setting up</h3></div>
          <div className="cpad checklist">
            <div className="it"><span className="dot done"><Check /></span> Verify your sending domain</div>
            <div className="it"><span className="dot done"><Check /></span> Import your contacts</div>
            <div className="it"><span className="dot todo" /> Design your first template</div>
            <div className="it"><span className="dot todo" /> Turn on a welcome automation</div>
            <div style={{ marginTop: 10 }}><Link href="/settings" className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>Continue setup</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, note, ico, tone, color }: { label: string; value: string; note: string; ico: JSX.Element; tone: string; color: string }) {
  return (
    <div className="card stat">
      <div className="top"><span className="label">{label}</span><span className="ico" style={{ background: tone, color }}>{ico}</span></div>
      <div className="value tnum">{value}</div>
      <div className="row">{note}</div>
    </div>
  );
}
function Mini({ label, value, color }: { label: string; value: string; color?: string }) {
  return (<div><div style={{ color: "var(--sub)", fontSize: 12 }}>{label}</div><div style={{ fontSize: 22, fontWeight: 700, color }} className="tnum">{value}</div></div>);
}
function DelivRow({ badge, label, value }: { badge: string; label: string; value: string }) {
  return (<div style={{ display: "flex", justifyContent: "space-between" }}><span className={"badge " + badge}>{label}</span><b className="tnum">{value}</b></div>);
}
const Check = () => (<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>);
const EyeIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
const ClickIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 9 5 12 1.8-5.2L21 14Z" /></svg>);
