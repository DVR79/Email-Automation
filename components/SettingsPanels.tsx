"use client";

import { useState } from "react";
import { saveAccount } from "@/app/settings/actions";
import { FeedbackButton } from "@/components/FeedbackButton";

/* Settings panels with left sub-nav. Sendrift. Copyright 2026 Venkataramana. */

type Setting = {
  id: string;
  accountName: string;
  fromName: string;
  replyTo: string;
  address: string;
  displayName: string;
  brandColor: string;
};

const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };

const NAV = [
  "Profile",
  "Account",
  "Branding",
  "Team and roles",
  "Billing and plans",
  "Senders and domains",
  "API keys",
  "Webhooks",
  "Notifications",
  "Security",
  "Data and privacy",
] as const;

type Panel = (typeof NAV)[number];

export function SettingsPanels({ setting }: { setting: Setting }) {
  const [active, setActive] = useState<Panel>("Profile");

  return (
    <div className="set-wrap">
      <style>{`
        .set-wrap{display:grid;grid-template-columns:212px 1fr;gap:22px;align-items:start}
        .set-nav{display:flex;flex-direction:column;gap:2px;position:sticky;top:18px}
        @media(max-width:860px){.set-wrap{grid-template-columns:1fr}.set-nav{flex-direction:row;flex-wrap:wrap;position:static}}
      `}</style>

      <nav className="set-nav">
        {NAV.map((item) => {
          const on = active === item;
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              style={{
                textAlign: "left",
                border: "none",
                cursor: "pointer",
                font: "inherit",
                fontSize: 13.5,
                padding: "9px 12px",
                borderRadius: 9,
                background: on ? "var(--primary-soft)" : "transparent",
                color: on ? "var(--primary)" : "var(--sub)",
                fontWeight: on ? 600 : 500,
              }}
            >
              {item}
            </button>
          );
        })}
      </nav>

      <div>
        {active === "Profile" && <ProfilePanel />}
        {active === "Account" && <AccountPanel setting={setting} />}
        {active === "Branding" && <BrandingPanel setting={setting} />}
        {active === "Team and roles" && <TeamPanel />}
        {active === "Billing and plans" && <BillingPanel />}
        {active === "Senders and domains" && <SendersPanel />}
        {active === "API keys" && <ApiKeysPanel />}
        {active === "Webhooks" && <WebhooksPanel />}
        {active === "Notifications" && <NotificationsPanel />}
        {active === "Security" && <SecurityPanel />}
        {active === "Data and privacy" && <DataPanel />}
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

function PanelCard({ title, desc, action, children }: { title: string; desc?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="chead">
        <div>
          <h3>{title}</h3>
          {desc ? <div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>{desc}</div> : null}
        </div>
        <div className="spacer" />
        {action}
      </div>
      <div className="cpad">{children}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
      <div style={{ width: 180, flex: "none", fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>{label}</div>
      <div style={{ flex: 1, minWidth: 220 }}>{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange?: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        border: "none",
        cursor: onChange ? "pointer" : "default",
        padding: 3,
        background: on ? "var(--primary)" : "var(--line-strong)",
        display: "inline-flex",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background .15s",
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: 999, background: "#fff", display: "block", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
    </button>
  );
}

function selectStyle(): React.CSSProperties {
  return { ...inputStyle, cursor: "pointer" };
}

/* ---------- Profile ---------- */

function ProfilePanel() {
  const [twoFa, setTwoFa] = useState(true);
  return (
    <PanelCard title="Profile" desc="Your personal details and preferences.">
      <FieldRow label="Name"><input style={inputStyle} defaultValue="Venkataramana" /></FieldRow>
      <FieldRow label="Email"><input style={inputStyle} type="email" defaultValue="ramana.personal998@gmail.com" /></FieldRow>
      <FieldRow label="Password"><FeedbackButton message="Password change is coming soon.">Change password</FeedbackButton></FieldRow>
      <FieldRow label="Two-factor authentication">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Toggle on={twoFa} onChange={() => setTwoFa((v) => !v)} />
          <span className="sub" style={{ fontSize: 12.5 }}>{twoFa ? "On" : "Off"}</span>
        </div>
      </FieldRow>
      <FieldRow label="Language">
        <select style={selectStyle()} defaultValue="English">
          <option>English</option><option>Hindi</option><option>Spanish</option>
        </select>
      </FieldRow>
      <div style={{ padding: "10px 0" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 180, flex: "none", fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>Timezone</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <select style={selectStyle()} defaultValue="(GMT+05:30) India Standard Time">
              <option>(GMT+05:30) India Standard Time</option>
              <option>(GMT+00:00) Coordinated Universal Time</option>
              <option>(GMT-05:00) Eastern Time</option>
              <option>(GMT-08:00) Pacific Time</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <FeedbackButton className="btn btn-primary btn-sm" message="Profile preferences are coming soon.">Save changes</FeedbackButton>
      </div>
    </PanelCard>
  );
}

/* ---------- Account (persisted) ---------- */

function AccountPanel({ setting }: { setting: Setting }) {
  return (
    <PanelCard title="Account" desc="Sender identity used across your campaigns. Saved to the local database.">
      <form action={saveAccount}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Account name</label>
          <input name="accountName" style={inputStyle} defaultValue={setting.accountName} placeholder="Acme Inc" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>From name</label>
          <input name="fromName" style={inputStyle} defaultValue={setting.fromName} placeholder="Acme Team" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Reply-to email</label>
          <input name="replyTo" type="email" style={inputStyle} defaultValue={setting.replyTo} placeholder="name@company.com" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Mailing address</label>
          <input name="address" style={inputStyle} defaultValue={setting.address} placeholder="Street, city, postal code" />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary btn-sm">Save</button>
        </div>
      </form>
    </PanelCard>
  );
}

/* ---------- Branding ---------- */

function BrandingPanel({ setting }: { setting: Setting }) {
  const swatches = ["--primary", "--v3", "--v5", "--accent"];
  const [picked, setPicked] = useState(0);
  const [removeBrand, setRemoveBrand] = useState(false);
  return (
    <PanelCard title="Branding" desc="Customize how your emails and account look.">
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Display name</label>
        <input style={inputStyle} defaultValue={setting.displayName} placeholder="Sendrift" />
      </div>
      <FieldRow label="Logo"><FeedbackButton message="Logo upload is coming soon.">Upload logo</FeedbackButton></FieldRow>
      <div style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 180, flex: "none", fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>Brand color</div>
          <div style={{ display: "flex", gap: 10 }}>
            {swatches.map((v, i) => (
              <button
                key={v}
                onClick={() => setPicked(i)}
                aria-label={"Brand color " + (i + 1)}
                style={{
                  width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                  background: `var(${v})`,
                  border: picked === i ? "2px solid var(--fg)" : "2px solid transparent",
                  boxShadow: "0 0 0 1px var(--line)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ margin: "16px 0" }}>
        <label style={labelStyle}>Email footer</label>
        <input style={inputStyle} defaultValue="Acme Inc, 21 Riverside Way, Bengaluru 560001" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Toggle on={removeBrand} onChange={() => setRemoveBrand((v) => !v)} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Remove Sendrift branding</span>
        <span className="chip">Growth</span>
      </div>
    </PanelCard>
  );
}

/* ---------- Team and roles ---------- */

function TeamPanel() {
  const members = [
    { name: "Venkataramana", email: "ramana.personal998@gmail.com", role: ["b-p", "Admin"], status: ["b-s", "Active"], you: true },
    { name: "Devin Osei", email: "devin@acme.com", role: ["b-i", "Manager"], status: ["b-s", "Active"], you: false },
    { name: "Aisha Malik", email: "aisha@acme.com", role: ["b-m", "User"], status: ["b-s", "Active"], you: false },
    { name: "Jordan Cole", email: "jordan@acme.com", role: ["b-m", "Viewer"], status: ["b-w", "Invited"], you: false },
  ];
  return (
    <>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="chead">
          <div><h3>Team and roles</h3><div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>People with access to this account.</div></div>
          <div className="spacer" />
          <FeedbackButton className="btn btn-primary btn-sm" message="Team invites are coming soon.">Invite member</FeedbackButton>
        </div>
        <table>
          <thead><tr><th>Member</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email}>
                <td>
                  <div className="cn">
                    <span className="av" style={{ background: `var(--v${(m.name.length % 8) + 1})` }}>{initials(m.name)}</span>
                    <div>
                      <b>{m.name}{m.you ? <span className="chip" style={{ marginLeft: 8 }}>You</span> : null}</b>
                      <div className="em">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={"badge " + m.role[0]}>{m.role[1]}</span></td>
                <td><span className={"badge " + m.status[0]}>{m.status[1]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PanelCard title="What each role can do">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <RoleKey badge="b-p" name="Admin" text="Full access to settings, billing, team, sending, and all data." />
          <RoleKey badge="b-i" name="Manager" text="Manage campaigns, contacts, and automations. No billing or team changes." />
          <RoleKey badge="b-m" name="User" text="Create and edit campaigns and contacts. Cannot change account settings." />
          <RoleKey badge="b-m" name="Viewer" text="Read-only access to campaigns, contacts, and reports." />
        </div>
        <div className="sub" style={{ fontSize: 12.5, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          Platform Super Admin is managed in the separate admin console.
        </div>
      </PanelCard>
    </>
  );
}

function RoleKey({ badge, name, text }: { badge: string; name: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span className={"badge " + badge} style={{ flex: "none", minWidth: 74, justifyContent: "center" }}>{name}</span>
      <span style={{ fontSize: 13, color: "var(--sub)" }}>{text}</span>
    </div>
  );
}

/* ---------- Billing and plans ---------- */

function BillingPanel() {
  return (
    <>
      <div className="grid g2" style={{ marginBottom: 18 }}>
        <div className="card cpad">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div className="sub" style={{ fontSize: 12.5 }}>Current plan</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Growth</div>
              <div className="tnum" style={{ fontSize: 14, color: "var(--sub)", marginTop: 2 }}>$49<span style={{ fontSize: 12.5 }}>/mo</span></div>
            </div>
            <div className="spacer" />
            <span className="badge b-p">Active</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <FeedbackButton className="btn btn-primary btn-sm" message="Plan upgrades are coming soon.">Upgrade</FeedbackButton>
            <FeedbackButton message="Plan changes are coming soon.">Change plan</FeedbackButton>
          </div>
        </div>

        <div className="card cpad">
          <div className="sub" style={{ fontSize: 12.5, marginBottom: 4 }}>Payment method</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <span style={{ width: 42, height: 28, borderRadius: 6, background: "linear-gradient(120deg,#1a1f71,#3b5bdb)", color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, letterSpacing: ".05em" }}>VISA</span>
            <div>
              <b className="tnum" style={{ fontSize: 14 }}>Visa ending 4242</b>
              <div className="sub" style={{ fontSize: 12 }}>Expires 08/2028</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <FeedbackButton message="Card updates are coming soon.">Update card</FeedbackButton>
            <span className="chip">via Stripe</span>
          </div>
        </div>
      </div>

      <PanelCard title="Usage this period">
        <Meter label="Contacts" value="7,240" cap="10,000" pct={72.4} />
        <div style={{ height: 18 }} />
        <Meter label="Emails" value="186k" cap="unlimited" pct={38} />
      </PanelCard>
    </>
  );
}

function Meter({ label, value, cap, pct }: { label: string; value: string; cap: string; pct: number }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
        <b>{label}</b>
        <span className="tnum sub">{value} / {cap}</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,var(--primary),var(--accent))" }} />
      </div>
    </div>
  );
}

/* ---------- Senders and domains ---------- */

function SendersPanel() {
  return (
    <>
      <div className="card cpad" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <b style={{ fontSize: 15 }}>acme.com</b>
            <div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>Primary sending domain</div>
          </div>
          <div className="spacer" />
          <span className="badge b-s">Verified</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <span className="badge b-s">DKIM</span>
          <span className="badge b-s">SPF</span>
          <span className="badge b-s">DMARC</span>
        </div>
      </div>

      <div className="card cpad" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <b style={{ fontSize: 15 }}>mail.acme.com</b>
            <div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>Add these DNS records to finish verification.</div>
          </div>
          <div className="spacer" />
          <span className="badge b-w">Pending</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, marginBottom: 14, flexWrap: "wrap" }}>
          <span className="badge b-w">DKIM Pending</span>
          <span className="badge b-s">SPF Verified</span>
          <span className="badge b-e">DMARC Not found</span>
        </div>
        <div style={{ font: "13px/1.7 var(--mono)", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", color: "var(--sub)", overflowX: "auto" }}>
          <DnsRow type="CNAME" host="s1._domainkey.mail" value="s1.dkim.sendrift.net" />
          <DnsRow type="CNAME" host="s2._domainkey.mail" value="s2.dkim.sendrift.net" />
          <DnsRow type="TXT" host="mail" value="v=spf1 include:sendrift.net ~all" />
          <DnsRow type="TXT" host="_dmarc.mail" value="v=DMARC1; p=none; rua=mailto:dmarc@acme.com" />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <FeedbackButton className="btn btn-primary btn-sm" message="Re-checking DNS is coming soon.">Verify domain</FeedbackButton>
          <FeedbackButton
            message="DNS records copied to clipboard."
            onAction={() => {
              const text = [
                "CNAME  s1._domainkey.mail  ->  s1.dkim.sendrift.net",
                "CNAME  s2._domainkey.mail  ->  s2.dkim.sendrift.net",
                "TXT  mail  ->  v=spf1 include:sendrift.net ~all",
                "TXT  _dmarc.mail  ->  v=DMARC1; p=none; rua=mailto:dmarc@acme.com",
              ].join("\n");
              navigator.clipboard?.writeText(text).catch(() => {});
            }}
          >
            Copy all records
          </FeedbackButton>
        </div>
      </div>
    </>
  );
}

function DnsRow({ type, host, value }: { type: string; host: string; value: string }) {
  return (
    <div style={{ whiteSpace: "nowrap" }}>
      <span style={{ color: "var(--primary)", fontWeight: 600 }}>{type}</span>{"  "}
      <span style={{ color: "var(--fg)" }}>{host}</span>{"  ->  "}
      <span>{value}</span>
    </div>
  );
}

/* ---------- API keys ---------- */

function ApiKeysPanel() {
  const keys = [
    { name: "Production", key: "sk_live_••••••••••••7f2a", used: "2 hours ago" },
    { name: "Staging", key: "sk_test_••••••••••••91c4", used: "Sep 21" },
  ];
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="chead">
        <div><h3>API keys</h3><div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>Use these to authenticate API requests.</div></div>
        <div className="spacer" />
        <FeedbackButton className="btn btn-primary btn-sm" message="API key creation is coming soon.">Create key</FeedbackButton>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Key</th><th>Last used</th><th /></tr></thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k.name}>
              <td><b>{k.name}</b></td>
              <td><span className="mono" style={{ fontSize: 12.5, color: "var(--sub)" }}>{k.key}</span></td>
              <td className="sub">{k.used}</td>
              <td className="right"><FeedbackButton className="btn btn-ghost btn-sm" message="Key revocation is coming soon.">Revoke</FeedbackButton></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Webhooks ---------- */

function WebhooksPanel() {
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="chead">
        <div><h3>Webhooks</h3><div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>Receive event notifications at your endpoints.</div></div>
        <div className="spacer" />
        <FeedbackButton className="btn btn-primary btn-sm" message="Webhook endpoints are coming soon.">Add endpoint</FeedbackButton>
      </div>
      <table>
        <thead><tr><th>Endpoint</th><th>Events</th><th>Status</th></tr></thead>
        <tbody>
          <tr>
            <td><span className="mono" style={{ fontSize: 12.5 }}>https://api.acme.com/hooks</span></td>
            <td className="sub">Delivered, Opened, Bounced</td>
            <td><span className="badge b-s">Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Notifications ---------- */

function NotificationsPanel() {
  const rows = [
    ["Campaign sent", true],
    ["Import finished", true],
    ["Verify and finder jobs", true],
    ["Deliverability alerts", true],
    ["Team invites", false],
    ["Billing events", true],
  ] as [string, boolean][];
  const [state, setState] = useState(rows.map((r) => r[1]));
  return (
    <PanelCard title="Notifications" desc="Choose which emails you receive from Sendrift.">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) => (
          <div key={r[0]} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none" }}>
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r[0]}</span>
            <div className="spacer" />
            <Toggle on={state[i]} onChange={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))} />
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

/* ---------- Security ---------- */

function SecurityPanel() {
  const [twoFa, setTwoFa] = useState(true);
  return (
    <PanelCard title="Security" desc="Protect your account and manage access.">
      <FieldRow label="Two-factor for account">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Toggle on={twoFa} onChange={() => setTwoFa((v) => !v)} />
          <span className="sub" style={{ fontSize: 12.5 }}>{twoFa ? "On" : "Off"}</span>
        </div>
      </FieldRow>
      <FieldRow label="Active sessions"><FeedbackButton message="Session management is coming soon.">Manage sessions</FeedbackButton></FieldRow>
      <div style={{ padding: "10px 0" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 180, flex: "none", fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>SSO and SAML</div>
          <span className="badge b-m">Enterprise, coming soon</span>
        </div>
      </div>
    </PanelCard>
  );
}

/* ---------- Data and privacy ---------- */

function DataPanel() {
  return (
    <PanelCard title="Data and privacy" desc="Export, delete, and manage your data.">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <FeedbackButton message="Data export is coming soon.">Request export</FeedbackButton>
        <FeedbackButton message="Account deletion requests are coming soon.">Open delete request</FeedbackButton>
        <FeedbackButton message="The DPA download is coming soon.">Download DPA</FeedbackButton>
        <FeedbackButton message="The suppression list is coming soon.">View suppression</FeedbackButton>
      </div>
    </PanelCard>
  );
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}
