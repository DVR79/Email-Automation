/* Templates gallery, backed by the local SQLite database. Sendrift. Copyright 2026 Venkataramana. */

import Link from "next/link";
import { prisma } from "@/lib/db";
import { AddTemplate, TemplatePreview } from "@/components/AddTemplate";
import { deleteTemplate } from "./actions";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="phead">
        <div>
          <h1>Templates</h1>
          <div className="sub">Reusable designs for every send.</div>
        </div>
        <div className="spacer" />
        <AddTemplate />
      </div>

      {templates.length === 0 ? (
        <div className="card">
          <div className="placeholder">
            <span className="pi">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
            </span>
            <h2>No templates yet</h2>
            <p>Create your first template to reuse across campaigns.</p>
          </div>
        </div>
      ) : (
        <div className="grid g3">
          {templates.map((t) => (
            <div key={t.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ padding: 14 }}>
                <div
                  aria-hidden
                  style={{ height: 150, borderRadius: 10, border: "1px solid var(--line)", background: "var(--muted)", overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  <div style={{ height: 34, background: "var(--primary-soft)", borderBottom: "1px solid var(--line)" }} />
                  <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 12, width: "70%", borderRadius: 4, background: "var(--line-strong)" }} />
                    <div style={{ height: 8, width: "100%", borderRadius: 4, background: "var(--line)" }} />
                    <div style={{ height: 8, width: "92%", borderRadius: 4, background: "var(--line)" }} />
                    <div style={{ height: 8, width: "80%", borderRadius: 4, background: "var(--line)" }} />
                    <div style={{ marginTop: "auto", height: 26, width: 96, borderRadius: 7, background: "var(--primary)" }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <b style={{ fontSize: 15 }}>{t.name}</b>
                  <div className="spacer" />
                  <span className="chip">{t.category || "Newsletter"}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: "auto", alignItems: "center" }}>
                  <TemplatePreview name={t.name} html={t.html} />
                  <Link href={`/builder?template=${t.id}`} className="btn btn-outline btn-sm">Use</Link>
                  <Link href={`/builder?template=${t.id}`} className="btn btn-primary btn-sm">Edit</Link>
                  <div className="spacer" />
                  <form action={deleteTemplate}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="btn btn-ghost btn-sm" title="Delete template" aria-label="Delete template">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
