/* Analytics, aggregates from the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import { prisma } from "@/lib/db";
import { AnalyticsRange } from "@/components/AnalyticsRange";
import { overviewStats, engagementSeries, contactGrowth, openHeatmap, campaignRates } from "@/lib/stats";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Build an SVG polyline (and optional area path) from a numeric series, sharing
// one vertical scale across all series so they are comparable.
function lineOf(values: number[], scaleMax: number, height: number, withArea = false) {
  const n = values.length;
  if (n === 0) return { line: "", area: "" };
  const max = scaleMax || 1;
  const x = (i: number) => (n === 1 ? 640 : (i / (n - 1)) * 640);
  const y = (v: number) => height - 12 - (v / max) * (height - 24);
  const pts = values.map((v, i) => `${x(i).toFixed(0)},${y(v).toFixed(0)}`);
  return { line: pts.join(" "), area: withArea ? `M0,${height} ${pts.join(" ")} ${x(n - 1).toFixed(0)},${height}Z` : "" };
}

export default async function AnalyticsPage() {
  const [o, series, growth, heat, sentCampaigns, totalContacts, subscribed] = await Promise.all([
    overviewStats(),
    engagementSeries(30),
    contactGrowth(30),
    openHeatmap(),
    prisma.campaign.findMany({ where: { status: "Sent" }, orderBy: { sentAt: "desc" } }),
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "Subscribed" } }),
  ]);
  const rates = await campaignRates(sentCampaigns.map((c) => c.id));

  const sentCount = sentCampaigns.length;
  const engMax = Math.max(1, ...series.sends, ...series.opens, ...series.clicks);
  const sendsLine = lineOf(series.sends, engMax, 200, true);
  const opensLine = lineOf(series.opens, engMax, 200);
  const clicksLine = lineOf(series.clicks, engMax, 200);
  const growthLine = lineOf(growth.points, Math.max(1, ...growth.points), 160, true);

  return (
    <>
      <div className="phead">
        <div>
          <h1>Analytics</h1>
          <div className="sub">Opens, clicks, and revenue across campaigns.</div>
        </div>
        <div className="spacer" />
        <AnalyticsRange />
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <Stat label="Total contacts" value={totalContacts.toLocaleString()} delta={`${subscribed.toLocaleString()} subscribed`} ico={<UsersIcon />} tone="var(--primary-subtle)" color="var(--primary)" />
        <Stat label="Emails sent" value={o.emailsSent.toLocaleString()} delta={o.emailsSent ? `${o.delivered.toLocaleString()} delivered` : "no sends yet"} ico={<SendIcon />} tone="var(--info-s)" color="var(--info)" />
        <Stat label="Avg open rate" value={`${o.openRate}%`} delta={`${o.opens.toLocaleString()} opens`} ico={<EyeIcon />} tone="var(--success-s)" color="var(--success)" />
        <Stat label="Avg click rate" value={`${o.clickRate}%`} delta={`${o.clicks.toLocaleString()} clicks`} ico={<ClickIcon />} tone="var(--warning-s)" color="var(--warning)" />
      </div>

      <div className="grid g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="chead"><h3>Sends and engagement</h3><div className="spacer" /><span className="chip">Last 30 days</span></div>
          <div className="cpad">
            <svg viewBox="0 0 640 200" width="100%" height="200" preserveAspectRatio="none" role="img" aria-label="Sends and engagement over the last 30 days">
              <line x1="0" y1="50" x2="640" y2="50" stroke="var(--line)" /><line x1="0" y1="100" x2="640" y2="100" stroke="var(--line)" /><line x1="0" y1="150" x2="640" y2="150" stroke="var(--line)" />
              <defs><linearGradient id="ae" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity="0.22" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
              {sendsLine.area ? <path d={sendsLine.area} fill="url(#ae)" /> : null}
              {sendsLine.line ? <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points={sendsLine.line} /> : null}
              {opensLine.line ? <polyline fill="none" stroke="var(--info)" strokeWidth="2" points={opensLine.line} /> : null}
              {clicksLine.line ? <polyline fill="none" stroke="var(--warning)" strokeWidth="2" strokeOpacity="0.85" points={clicksLine.line} /> : null}
            </svg>
            <div className="legend" style={{ marginTop: 10 }}>
              <span><i style={{ background: "var(--primary)" }} />Sends</span>
              <span><i style={{ background: "var(--info)" }} />Opens</span>
              <span><i style={{ background: "var(--warning)" }} />Clicks</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="chead"><h3>List growth</h3><div className="spacer" /><span className="chip">Last 30 days</span></div>
          <div className="cpad">
            <svg viewBox="0 0 640 160" width="100%" height="160" preserveAspectRatio="none" role="img" aria-label="Total contacts over the last 30 days">
              <line x1="0" y1="40" x2="640" y2="40" stroke="var(--line)" /><line x1="0" y1="80" x2="640" y2="80" stroke="var(--line)" /><line x1="0" y1="120" x2="640" y2="120" stroke="var(--line)" />
              <defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--success)" stopOpacity="0.2" /><stop offset="1" stopColor="var(--success)" stopOpacity="0" /></linearGradient></defs>
              {growthLine.area ? <path d={growthLine.area} fill="url(#lg)" /> : null}
              {growthLine.line ? <polyline fill="none" stroke="var(--success)" strokeWidth="2.5" points={growthLine.line} /> : null}
            </svg>
            <div className="legend" style={{ marginTop: 10 }}>
              <span><i style={{ background: "var(--success)" }} />Total contacts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="chead"><h3>Campaign performance</h3><div className="spacer" /><span className="chip tnum">{sentCount} sent</span></div>
        {sentCount === 0 ? (
          <div className="placeholder">
            <span className="pi">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="10" width="3" height="7" /><rect x="12" y="6" width="3" height="11" /><rect x="17" y="13" width="3" height="4" /></svg>
            </span>
            <h2>No sent campaigns yet</h2>
            <p>Performance shows up here once your first campaign goes out.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Campaign</th><th className="right">Recipients</th><th className="right">Open %</th><th className="right">Click %</th><th className="right">Sent date</th></tr>
            </thead>
            <tbody>
              {sentCampaigns.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.name}</b></td>
                  <td className="right tnum">{c.recipients.toLocaleString()}</td>
                  <td className="right tnum">{rates[c.id]?.openRate != null ? rates[c.id].openRate + "%" : "-"}</td>
                  <td className="right tnum">{rates[c.id]?.clickRate != null ? rates[c.id].clickRate + "%" : "-"}</td>
                  <td className="right">{fmtDate(c.sentAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="chead"><h3>Best send times</h3><div className="spacer" /><span className="chip">Opens by day and hour</span></div>
        <div className="cpad">
          {heat.total === 0 ? (
            <div style={{ color: "var(--sub)", fontSize: 13 }}>No opens recorded yet. This heatmap fills in as recipients open your emails.</div>
          ) : (
            <Heatmap grid={heat.grid} max={heat.max} />
          )}
        </div>
      </div>
    </>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];

function Heatmap({ grid, max }: { grid: number[][]; max: number }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `44px repeat(${HOURS.length}, 1fr)`, gap: 5, minWidth: 520 }}>
        <div />
        {HOURS.map((h) => (
          <div key={h} style={{ fontSize: 10, color: "var(--sub)", textAlign: "center" }}>{h}</div>
        ))}
        {DAYS.map((d, di) => (
          <FragmentRow key={d} label={d} row={grid[di]} max={max} />
        ))}
      </div>
      <div className="legend" style={{ marginTop: 12, alignItems: "center" }}>
        <span>Fewer opens</span>
        {[0.12, 0.3, 0.5, 0.7, 0.9].map((o) => (
          <i key={o} style={{ background: "var(--primary)", opacity: o, width: 14, height: 14, borderRadius: 4 }} />
        ))}
        <span>More opens</span>
      </div>
    </div>
  );
}

function FragmentRow({ label, row, max }: { label: string; row: number[]; max: number }) {
  return (
    <>
      <div style={{ fontSize: 11, color: "var(--sub)", display: "flex", alignItems: "center" }}>{label}</div>
      {HOURS.map((_, hi) => {
        const count = row[hi] || 0;
        const o = count === 0 ? 0.06 : 0.14 + (count / max) * 0.81;
        return (
          <div
            key={hi}
            title={`${label} ${HOURS[hi]}: ${count} open${count === 1 ? "" : "s"}`}
            style={{ aspectRatio: "1 / 1", borderRadius: 5, background: "var(--primary)", opacity: o }}
          />
        );
      })}
    </>
  );
}

function Stat({ label, value, delta, ico, tone, color }: { label: string; value: string; delta: string; up?: boolean; ico: JSX.Element; tone: string; color: string }) {
  return (
    <div className="card stat">
      <div className="top"><span className="label">{label}</span><span className="ico" style={{ background: tone, color }}>{ico}</span></div>
      <div className="value tnum">{value}</div>
      <div className="row tnum">{delta}</div>
    </div>
  );
}

const UsersIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>);
const EyeIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
const ClickIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 9 5 12 1.8-5.2L21 14Z" /></svg>);
