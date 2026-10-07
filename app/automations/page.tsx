/* Automations, backed by the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import { prisma } from "@/lib/db";
import { AddAutomation } from "@/components/AddAutomation";
import { AutomationRow } from "@/components/AutomationRow";
import { deleteAutomation } from "./actions";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  switch (status) {
    case "Active": return "b-s";
    case "Paused": return "b-w";
    case "Draft": return "b-m";
    default: return "b-m";
  }
}

export default async function AutomationsPage() {
  const automations = await prisma.automation.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="phead">
        <div>
          <h1>Automations</h1>
          <div className="sub">Journeys that follow up for you.</div>
        </div>
        <div className="spacer" />
        <AddAutomation />
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        {automations.length === 0 ? (
          <div className="placeholder">
            <span className="pi">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a2 2 0 0 1 2 2v7" /></svg>
            </span>
            <h2>No automations yet</h2>
            <p>Create your first journey to welcome, nurture, and win back contacts on autopilot.</p>
          </div>
        ) : (
          <table className="rt">
            <thead>
              <tr><th>Name</th><th>Trigger</th><th>Status</th><th className="right">Enrolled</th><th /></tr>
            </thead>
            <tbody>
              {automations.map((a) => (
                <tr key={a.id}>
                  <td className="main"><b>{a.name}</b></td>
                  <td data-label="Trigger"><span className="chip">{a.trigger}</span></td>
                  <td data-label="Status"><span className={"badge " + statusBadge(a.status)}>{a.status}</span></td>
                  <td className="right tnum" data-label="Enrolled">{a.enrolled.toLocaleString()}</td>
                  <td className="right act">
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
                      <AutomationRow id={a.id} status={a.status} />
                      <form action={deleteAutomation}>
                        <input type="hidden" name="id" value={a.id} />
                        <button className="btn btn-ghost btn-sm" title="Delete automation" aria-label="Delete automation">
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

      <div className="card">
        <div className="chead"><h3>Welcome series</h3><div className="spacer" /><span className="chip">Preview</span></div>
        <div className="cpad">
          <div className="flow-canvas">
            <div className="flow">
              <FlowNode tone="var(--primary-subtle)" color="var(--primary)" kind="Trigger" label="Joins list" ico={<BoltIcon />} />
              <Connector />
              <FlowNode tone="var(--info-s)" color="var(--info)" kind="Send" label="Welcome email" ico={<SendIcon />} />
              <Connector />
              <FlowNode tone="var(--warning-s)" color="var(--warning)" kind="Wait" label="2 days" ico={<ClockIcon />} />
              <Connector />
              <FlowNode tone="var(--success-s)" color="var(--success)" kind="Condition" label="Opened?" ico={<SplitIcon />} />
              <Connector />
              <div className="fbranch">
                <BranchCol tag="YES" tagColor="var(--success)" label="Send offer" />
                <BranchCol tag="NO" tagColor="var(--faint)" label="Send reminder" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FlowNode({ kind, label, ico, tone, color }: { kind: string; label: string; ico: JSX.Element; tone: string; color: string }) {
  return (
    <div className="fnode">
      <span className="fico" style={{ background: tone, color }}>{ico}</span>
      <div>
        <div className="fkind">{kind}</div>
        <div className="flabel">{label}</div>
      </div>
    </div>
  );
}

function BranchCol({ tag, tagColor, label }: { tag: string; tagColor: string; label: string }) {
  return (
    <div className="fbcol">
      <div className="bnode">
        <div className="btag" style={{ color: tagColor }}>{tag}</div>
        <div className="flabel">{label}</div>
      </div>
    </div>
  );
}

function Connector() {
  return <div className="fconn" />;
}

const BoltIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9Z" /></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>);
const ClockIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
const SplitIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v6a4 4 0 0 0 4 4h8" /><path d="m15 10 3 3-3 3" /><path d="M6 21v-6" /></svg>);
