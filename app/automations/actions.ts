"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/* Automation server actions. Sendrift. Copyright 2026 Venkataramana. */

export async function createAutomation(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const trigger = String(formData.get("trigger") || "Joins list").trim();
  if (!name) return;
  await prisma.automation.create({
    data: {
      name,
      trigger: trigger || "Joins list",
      status: "Draft",
      enrolled: 0,
    },
  });
  revalidatePath("/automations");
}

export async function toggleAutomation(id: string) {
  if (!id) return;
  const current = await prisma.automation.findUnique({ where: { id } });
  if (!current) return;
  const next = current.status === "Active" ? "Paused" : "Active";
  await prisma.automation.update({ where: { id }, data: { status: next } });
  revalidatePath("/automations");
}

export async function deleteAutomation(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.automation.delete({ where: { id } });
  revalidatePath("/automations");
}
