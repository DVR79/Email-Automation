"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/* Template server actions. Sendrift. Copyright 2026 Venkataramana. */

export async function createTemplate(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  if (!name) return;
  await prisma.template.create({
    data: {
      name,
      category: category || "Newsletter",
      html: "",
    },
  });
  revalidatePath("/templates");
}

export async function deleteTemplate(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.template.delete({ where: { id } });
  revalidatePath("/templates");
}
