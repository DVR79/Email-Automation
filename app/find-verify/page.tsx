/* Find and verify. Sendrift. Copyright 2026 Venkataramana. */

import { prisma } from "@/lib/db";
import { VerifyForm } from "@/components/VerifyForm";
import { FindTabs, FindEmailCard, EnrichCard, CsvVerifyCard } from "@/components/FindVerifyClient";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  switch (status) {
    case "Valid": return "b-s";
    case "Risky": return "b-w";
    case "Invalid": return "b-e";
    case "Unknown": return "b-i";
    case "Catch-all": return "b-w";
    default: return "b-m";
  }
}

function fmtTime(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function FindVerifyPage() {
  const results = await prisma.verificationResult.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <>
      <div className="phead">
        <div>
          <h1>Find and verify</h1>
          <div className="sub">Find emails, verify addresses, and enrich contacts before you send.</div>
        </div>
      </div>

      <FindTabs>
        <div className="grid g2" style={{ marginBottom: 18 }}>
          <div className="card">
            <div className="chead"><h3>Verify a single email</h3></div>
            <div className="cpad">
              <VerifyForm />
            </div>
          </div>
          <CsvVerifyCard />
        </div>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="chead"><h3>Recent verifications</h3><div className="spacer" /><span className="chip">Latest {results.length}</span></div>
          {results.length === 0 ? (
            <div className="placeholder">
              <span className="pi">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
              </span>
              <h2>No verifications yet</h2>
              <p>Verify a single email above to see live results here.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Email</th><th>Status</th><th>Flags</th><th className="right">Score</th><th>Checked</th></tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const flags = (r.flags || "").split(",").map((f) => f.trim()).filter(Boolean);
                  return (
                    <tr key={r.id}>
                      <td className="em">{r.email}</td>
                      <td><span className={"badge " + statusBadge(r.status)}>{r.status}</span></td>
                      <td>
                        {flags.length === 0
                          ? <span style={{ color: "var(--faint)" }}>-</span>
                          : <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>{flags.map((f) => <span key={f} className="chip">{f}</span>)}</span>}
                      </td>
                      <td className="right tnum">{r.score ?? "-"}</td>
                      <td style={{ color: "var(--sub)", fontSize: 12 }}>{fmtTime(r.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="grid g2">
          <FindEmailCard />
          <EnrichCard />
        </div>
      </FindTabs>
    </>
  );
}
