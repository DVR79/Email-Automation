"use client";

import { useState, useTransition } from "react";
import { sendCampaign } from "@/app/campaigns/actions";

/* Send a draft campaign (local). Two-step confirm. Sendrift. Copyright 2026 Venkataramana. */

export function SendCampaign({ id, size = "sm" }: { id: string; size?: "sm" | "md" }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const cls = "btn btn-primary" + (size === "sm" ? " btn-sm" : "");

  function send() {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => { await sendCampaign(fd); });
  }

  if (!confirm) {
    return (
      <button className={cls} onClick={() => setConfirm(true)}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>
        Send
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <button className={cls} disabled={pending} onClick={send}>{pending ? "Sending..." : "Confirm send"}</button>
      {!pending ? <button className={"btn btn-ghost" + (size === "sm" ? " btn-sm" : "")} onClick={() => setConfirm(false)}>Cancel</button> : null}
    </span>
  );
}
