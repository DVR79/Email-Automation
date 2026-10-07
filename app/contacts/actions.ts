"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/* Contact server actions. Sendrift. Copyright 2026 Venkataramana. */

export async function createContact(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();
  if (!email || !email.includes("@")) return;
  await prisma.contact.upsert({
    where: { email },
    update: { name: name || undefined },
    create: {
      email,
      name: name || undefined,
      status: "Subscribed",
      source: "Manual",
      lastActivityAt: new Date(),
    },
  });
  revalidatePath("/contacts");
}

export async function deleteContact(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.contact.delete({ where: { id } });
  revalidatePath("/contacts");
}

export async function importContacts(formData: FormData): Promise<{ added: number; skipped: number }> {
  const raw = String(formData.get("data") || "");
  const list = String(formData.get("list") || "").trim();
  let added = 0;
  let skipped = 0;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Support "email", "email,name", or "name,email" (email is the token containing @).
    const parts = trimmed.split(",").map((p) => p.trim());
    const email = (parts.find((p) => p.includes("@")) || "").toLowerCase();
    const name = parts.filter((p) => !p.includes("@")).join(" ").trim();
    if (!email || !email.includes("@")) { skipped++; continue; }
    if (email.toLowerCase() === "email") { skipped++; continue; } // header row
    try {
      await prisma.contact.upsert({
        where: { email },
        update: { name: name || undefined, lists: list || undefined },
        create: { email, name: name || undefined, lists: list || undefined, status: "Subscribed", source: "Import", lastActivityAt: new Date() },
      });
      added++;
    } catch {
      skipped++;
    }
  }
  revalidatePath("/contacts");
  return { added, skipped };
}
