"use client";

import { useState, useTransition } from "react";
import { saveBuilder, sendTestEmail } from "@/app/builder/actions";

/* Email builder editor with live preview. Sendrift. Copyright 2026 Venkataramana. */

export function BuilderEditor({ initialHtml, templateId, templateName }: { initialHtml: string; templateId: string; templateName: string }) {
  const [html, setHtml] = useState(initialHtml);
  const [pending, startTransition] = useTransition();
  const [testing, startTest] = useTransition();
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<{ msg: string; ok: boolean } | null>(null);

  function flashNotice(msg: string, ok = true) {
    setNotice({ msg, ok });
    window.setTimeout(() => setNotice(null), 3800);
  }

  function onSave() {
    setSaved(false);
    startTransition(async () => {
      await saveBuilder(templateId, html);
      setSaved(true);
      flashNotice("Template saved");
    });
  }

  function onSendTest() {
    startTest(async () => {
      const res = await sendTestEmail(html);
      if (res.ok) flashNotice(`Test sent to ${res.to}. Open Mailpit at localhost:8025`);
      else flashNotice(`Test failed. Is Mailpit running on port 1025? ${res.error}`, false);
    });
  }

  return (
    <>
      <div className="phead">
        <div>
          <h1>Email builder</h1>
          <div className="sub">{templateName ? `Editing ${templateName}` : "Craft your email, preview it live."}</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginLeft: "auto" }}>
          {notice && (
            <span className={"badge " + (notice.ok ? "b-s" : "b-e")} role="status">{notice.msg}</span>
          )}
          <button className="btn btn-outline btn-sm" onClick={onSendTest} disabled={testing}>{testing ? "Sending..." : "Send test"}</button>
          <button className="btn btn-primary btn-sm" onClick={onSave} disabled={pending}>{pending ? "Saving..." : saved ? "Saved" : "Save"}</button>
        </div>
      </div>

      <style>{`.builder-cols{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:stretch}@media(max-width:900px){.builder-cols{grid-template-columns:1fr}}`}</style>
      <div className="builder-cols">
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="chead"><h3>HTML</h3><div className="spacer" /><span className="chip">Editor</span></div>
          <div style={{ padding: 14, flex: 1 }}>
            <textarea
              value={html}
              onChange={(e) => { setHtml(e.target.value); setSaved(false); }}
              spellCheck={false}
              style={{
                width: "100%",
                minHeight: 460,
                height: "100%",
                border: "1px solid var(--line-strong)",
                borderRadius: 10,
                background: "var(--bg)",
                padding: 14,
                color: "var(--fg)",
                fontFamily: "var(--mono)",
                fontSize: 13,
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="chead"><h3>Preview</h3><div className="spacer" /><span className="chip">Live</span></div>
          <div style={{ padding: 14, flex: 1 }}>
            <div
              style={{ minHeight: 460, height: "100%", border: "1px solid var(--line-strong)", borderRadius: 10, background: "#FFFFFF", padding: 20, overflow: "auto", color: "#1A1C22" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
