/* Settings. Sendrift. Copyright 2026 Venkataramana. */

import { prisma } from "@/lib/db";
import { SettingsPanels } from "@/components/SettingsPanels";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let s = await prisma.setting.findUnique({ where: { id: "singleton" } });
  if (!s) s = await prisma.setting.create({ data: { id: "singleton" } });

  return (
    <>
      <div className="phead">
        <div>
          <h1>Settings</h1>
          <div className="sub">Manage your account, team, sending, and billing.</div>
        </div>
      </div>

      <SettingsPanels setting={s} />

      <div style={{ marginTop: 28, fontSize: 12, color: "var(--faint)" }}>
        Sendrift, designed and built by Venkataramana, copyright 2026
      </div>
    </>
  );
}
