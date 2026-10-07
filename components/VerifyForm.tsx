"use client";

import { useRef, useTransition } from "react";
import { verifyEmail } from "@/app/find-verify/actions";

/* Single email verify form. Sendrift. Copyright 2026 Venkataramana. */

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1px solid var(--line-strong)", borderRadius: 10, background: "var(--bg)", padding: "0 12px", font: "inherit", color: "var(--fg)" };

export function VerifyForm() {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(fd) => startTransition(async () => { await verifyEmail(fd); formRef.current?.reset(); })}
    >
      <label style={labelStyle}>Email address</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input name="email" type="email" required placeholder="name@company.com" style={{ ...inputStyle, flex: 1, minWidth: 180 }} disabled={pending} />
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>{pending ? "Verifying..." : "Verify"}</button>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--sub)" }}>
        Runs a live syntax, DNS MX, disposable, and role check.
      </div>
    </form>
  );
}
