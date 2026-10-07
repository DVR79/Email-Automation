"use client";

import { useTransition } from "react";
import { toggleAutomation } from "@/app/automations/actions";

/* Automation status toggle. Sendrift. Copyright 2026 Venkataramana. */

export function AutomationRow({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const active = status === "Active";

  return (
    <button
      className={"btn btn-sm " + (active ? "btn-outline" : "btn-primary")}
      disabled={pending}
      onClick={() => startTransition(async () => { await toggleAutomation(id); })}
    >
      {pending ? "..." : active ? "Pause" : "Turn on"}
    </button>
  );
}
