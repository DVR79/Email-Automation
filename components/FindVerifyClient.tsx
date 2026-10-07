"use client";

import { useRef, useState } from "react";

/* Interactive, demo-only pieces for the Find and verify page: a sub-view tab
   switch, a find-an-email card, an enrich card, and a CSV dropzone. No backend
   is called here; the single-email verifier remains the real thing.
   Sendrift. Copyright 2026 Venkataramana. */

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)", marginBottom: 14 };

// Normalize whatever the user pastes (a URL, www prefix, a path) into a bare domain.
function cleanDomain(input: string) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/^www\./, "");
  d = d.split(/[/?#]/)[0]; // drop any path, query, or hash
  d = d.replace(/\.$/, "");
  return d;
}

// The registrable label of a domain, e.g. "edstellar.com" -> "edstellar".
function rootLabel(dom: string) {
  const parts = dom.split(".").filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] || "company";
}

const TABS = ["Verify", "Find emails", "Enrich", "Jobs"] as const;
type Tab = (typeof TABS)[number];

export function FindTabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Tab>("Verify");
  return (
    <>
      <div className="tabs" style={{ marginBottom: 18 }}>
        {TABS.map((t) => (
          <button key={t} className={"tab" + (active === t ? " active" : "")} onClick={() => setActive(t)}>
            {t}
          </button>
        ))}
      </div>
      {active === "Verify" ? children : <ComingSoon tab={active} />}
    </>
  );
}

function ComingSoon({ tab }: { tab: string }) {
  return (
    <div className="card">
      <div className="placeholder">
        <span className="pi">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        </span>
        <h2>{tab} is coming soon</h2>
        <p>This view is not wired up yet. Single-email Verify is fully functional today.</p>
      </div>
    </div>
  );
}

export function FindEmailCard() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parts = name.trim().toLowerCase().replace(/[^a-z\s.-]/g, "").split(/\s+/).filter(Boolean);
  const local = parts.length ? parts.join(".") : "jane.cooper";
  const dom = cleanDomain(domain) || "company.com";
  const guessed = `${local}@${dom}`;

  function find() {
    setPhase("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("done"), 700);
  }

  return (
    <div className="card">
      <div className="chead"><h3>Find an email</h3></div>
      <div className="cpad">
        <label style={labelStyle}>Full name</label>
        <input style={inputStyle} placeholder="Jane Cooper" value={name} onChange={(e) => setName(e.target.value)} />
        <label style={labelStyle}>Company domain</label>
        <input style={inputStyle} placeholder="company.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <button className="btn btn-primary btn-sm" onClick={find} disabled={phase === "loading"}>
          {phase === "loading" ? "Finding..." : "Find email"}
        </button>
        {phase !== "idle" && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: "var(--sub)", marginBottom: 8 }}>Sample result</div>
            {phase === "loading" ? (
              <div style={{ color: "var(--sub)", fontSize: 13 }}>Searching public sources...</div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span className="em">{guessed}</span>
                <span className="badge b-s">92%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function EnrichCard() {
  const [domain, setDomain] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dom = cleanDomain(domain);
  const company = dom ? titleCase(rootLabel(dom)) + ", Inc." : "Company, Inc.";

  function enrich() {
    setPhase("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("done"), 700);
  }

  return (
    <div className="card">
      <div className="chead"><h3>Enrich from a company</h3></div>
      <div className="cpad">
        <label style={labelStyle}>Company domain</label>
        <input style={inputStyle} placeholder="company.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <button className="btn btn-primary btn-sm" onClick={enrich} disabled={phase === "loading"}>
          {phase === "loading" ? "Enriching..." : "Enrich"}
        </button>
        {phase === "loading" && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 14, color: "var(--sub)", fontSize: 13 }}>
            Looking up company profile...
          </div>
        )}
        {phase === "done" && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
            <KV k="Company" v={company} />
            <KV k="Domain" v={dom || "company.com"} />
            <KV k="Industry" v="Software" />
            <KV k="Size" v="201-500" />
            <KV k="Location" v="Austin, TX" />
            <KV k="Contacts found" v="48" />
          </div>
        )}
      </div>
    </div>
  );
}

function titleCase(s: string) {
  return s.replace(/(^|[\s.-])([a-z])/g, (_, sep, c) => sep + c.toUpperCase());
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--sub)" }}>{k}</span>
      <b>{v}</b>
    </div>
  );
}

export function CsvVerifyCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="card">
      <div className="chead"><h3>Verify a list</h3></div>
      <div className="cpad">
        <div
          style={{
            border: "2px dashed var(--line-strong)",
            borderRadius: 12,
            padding: "34px 18px",
            textAlign: "center",
            background: "var(--muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ color: "var(--sub)" }}>
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></svg>
          </span>
          <div style={{ fontWeight: 600 }}>Drop a CSV to verify in bulk</div>
          <div style={{ fontSize: 12, color: "var(--sub)" }}>Up to 50,000 rows. One email per line or a column named email.</div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: "none" }}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <button className="btn btn-outline btn-sm" style={{ marginTop: 4 }} onClick={() => inputRef.current?.click()}>
            Choose file
          </button>
          {fileName && (
            <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 6 }}>
              Selected <b style={{ color: "var(--fg)" }}>{fileName}</b>. Bulk verification is coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
