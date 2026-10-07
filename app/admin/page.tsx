/* Admin console. Sendrift. Copyright 2026 Venkataramana. */

import { FeedbackButton } from "@/components/FeedbackButton";

export const dynamic = "force-dynamic";

const accounts = [
  { name: "Acme Inc", domain: "acme.com", plan: "Growth", status: ["b-s", "Active"], users: "10", contacts: "7,240", mrr: "$49", action: "Impersonate" },
  { name: "Brightpath", domain: "brightpath.io", plan: "Starter", status: ["b-s", "Active"], users: "3", contacts: "1,980", mrr: "$19", action: "Impersonate" },
  { name: "Ridgeline", domain: "ridgeline.co", plan: "Scale", status: ["b-s", "Active"], users: "24", contacts: "41,300", mrr: "$99", action: "Impersonate" },
  { name: "Lumen Design", domain: "lumen.design", plan: "Free", status: ["b-w", "Trial"], users: "1", contacts: "320", mrr: "$0", action: "Impersonate" },
  { name: "Northstar", domain: "northstar.team", plan: "Growth", status: ["b-e", "Suspended"], users: "8", contacts: "9,100", mrr: "$49", action: "Review" },
  { name: "Evergreen", domain: "evergreen.eu", plan: "Starter", status: ["b-s", "Active"], users: "4", contacts: "2,540", mrr: "$19", action: "Impersonate" },
];

export default function AdminPage() {
  return (
    <>
      <div className="phead">
        <div>
          <h1>Admin console</h1>
          <div className="sub">Platform overview across all accounts.</div>
        </div>
        <div className="spacer" />
        <span className="badge b-p">Super Admin</span>
      </div>

      <div style={{ borderRadius: "var(--r)", padding: "22px 24px", color: "#fff", background: "linear-gradient(120deg,#5B4BE6,#7C5CFF 48%,#FF6B4A)", display: "flex", alignItems: "center", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Platform is healthy</div>
          <div style={{ fontSize: 13.5, opacity: 0.92, marginTop: 6 }}>1,284 accounts, 12.4M emails sent this month, 99.1% delivered.</div>
        </div>
        <svg viewBox="0 0 120 80" width="140" height="80" fill="none" aria-hidden="true">
          <rect x="6" y="46" width="16" height="28" rx="3" fill="#fff" fillOpacity="0.35" />
          <rect x="30" y="34" width="16" height="40" rx="3" fill="#fff" fillOpacity="0.5" />
          <rect x="54" y="22" width="16" height="52" rx="3" fill="#fff" fillOpacity="0.7" />
          <rect x="78" y="10" width="16" height="64" rx="3" fill="#fff" fillOpacity="0.9" />
          <circle cx="102" cy="20" r="15" fill="#fff" />
          <path d="M95 20l5 5 9-10" stroke="#5B4BE6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <Stat label="Total accounts" value="1,284" delta="6.1%" up sub="vs last 30 days" ico={<BuildingIcon />} tone="var(--primary-subtle)" color="var(--primary)" />
        <Stat label="Active users" value="5,932" delta="3.4%" up sub="vs last 30 days" ico={<UsersIcon />} tone="var(--info-s)" color="var(--info)" />
        <Stat label="MRR" value="$48,120" delta="8.9%" up sub="vs last 30 days" ico={<DollarIcon />} tone="var(--success-s)" color="var(--success)" />
        <Stat label="Emails sent (30d)" value="12.4M" sub="99.1% delivered" ico={<SendIcon />} tone="var(--warning-s)" color="var(--warning)" />
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="chead"><h3>Accounts</h3><div className="spacer" /><span className="chip">1,284 total</span><FeedbackButton className="btn btn-outline btn-sm" message="Account export is coming soon.">Export</FeedbackButton></div>
        <table>
          <thead>
            <tr>
              <th>Account</th><th>Plan</th><th>Status</th>
              <th className="right">Users</th><th className="right">Contacts</th><th className="right">MRR</th><th />
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.domain}>
                <td><b>{a.name}</b><div className="em" style={{ color: "var(--sub)", fontSize: 12 }}>{a.domain}</div></td>
                <td><span className="chip">{a.plan}</span></td>
                <td><span className={"badge " + a.status[0]}>{a.status[1]}</span></td>
                <td className="right tnum">{a.users}</td>
                <td className="right tnum">{a.contacts}</td>
                <td className="right tnum">{a.mrr}</td>
                <td className="right"><FeedbackButton className="btn btn-ghost btn-sm" message={`${a.action === "Review" ? "Account review" : "Impersonation"} is coming soon.`}>{a.action}</FeedbackButton></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="chead"><h3>System and deliverability</h3></div>
          <div className="cpad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <KV label="Sending provider"><b>Amazon SES</b><span className="badge b-s">Healthy</span></KV>
            <KV label="Reputation"><b className="tnum">99.1%</b><span className="badge b-s">Good</span></KV>
            <KV label="Complaint rate"><b className="tnum">0.03%</b></KV>
            <KV label="Send queue"><b className="tnum">1,204 jobs</b><span className="sub" style={{ fontSize: 12.5 }}>no backlog</span></KV>
            <KV label="Blocklists"><span className="badge b-s">Clear</span></KV>
          </div>
        </div>

        <div className="card">
          <div className="chead"><h3>Recent activity</h3></div>
          <div className="cpad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Activity dot="var(--success)" title="New account" text="Evergreen signed up on the Starter plan." />
            <Activity dot="var(--info)" title="Plan change" text="Ridgeline upgraded to Scale." />
            <Activity dot="var(--error)" title="Suspended" text="Northstar was suspended for review." />
            <Activity dot="var(--primary)" title="Impersonation" text="Support viewed Acme Inc." />
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, delta, up, sub, ico, tone, color }: { label: string; value: string; delta?: string; up?: boolean; sub: string; ico: React.ReactNode; tone: string; color: string }) {
  return (
    <div className="card stat">
      <div className="top"><span className="label">{label}</span><span className="ico" style={{ background: tone, color }}>{ico}</span></div>
      <div className="value tnum">{value}</div>
      <div className="row">
        {delta ? <span className={"delta " + (up ? "up" : "down")}>{up ? "▲" : "▼"} {delta}</span> : null}
        {" "}{sub}
      </div>
    </div>
  );
}

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", gap: 12, fontSize: 13.5 }}>
      <span className="sub">{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>{children}</span>
    </div>
  );
}

function Activity({ dot, title, text }: { dot: string; title: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, marginTop: 6, flex: "none" }} />
      <div>
        <b style={{ fontSize: 13.5 }}>{title}</b>
        <div className="sub" style={{ fontSize: 12.5, marginTop: 1 }}>{text}</div>
      </div>
    </div>
  );
}

const BuildingIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /></svg>);
const DollarIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>);
