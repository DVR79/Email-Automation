"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/* Settings server actions. Sendrift. Copyright 2026 Venkataramana. */

export async function saveAccount(formData: FormData) {
  const accountName = String(formData.get("accountName") || "").trim();
  const fromName = String(formData.get("fromName") || "").trim();
  const replyTo = String(formData.get("replyTo") || "").trim();
  const address = String(formData.get("address") || "").trim();

  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: { accountName, fromName, replyTo, address },
    create: { id: "singleton", accountName, fromName, replyTo, address },
  });

  revalidatePath("/settings");
}
