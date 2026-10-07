"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendMail, wrapEmail, htmlToText, senderFrom } from "@/lib/mail";

/* Email builder server actions. Sendrift. Copyright 2026 Venkataramana. */

// Send a test of the current builder HTML to an address (defaults to the
// account reply-to). Delivered via SMTP (Mailpit in local dev).
export async function sendTestEmail(html: string, to?: string): Promise<{ ok: boolean; to: string; error?: string }> {
  const setting = await prisma.setting.findUnique({ where: { id: "singleton" } });
  const dest = (to && to.trim()) || setting?.replyTo || "test@sendrift.local";
  const address = setting?.address || "Sendrift, 21 Riverside Way, Bengaluru";
  const from = senderFrom(setting?.fromName);
  const replyTo = setting?.replyTo || undefined;
  const body = html && html.trim() ? html : "<p>This is a test email from Sendrift.</p>";
  const wrapped = wrapEmail(body, { address });
  const res = await sendMail({ to: dest, subject: "[Test] Sendrift email", html: wrapped, text: htmlToText(wrapped), from, replyTo });
  await prisma.message.create({
    data: { email: dest, subject: "[Test] Sendrift email", status: res.ok ? "Sent" : "Failed", providerId: res.ok ? res.id : undefined, error: res.ok ? undefined : res.error, kind: "test" },
  });
  return res.ok ? { ok: true, to: dest } : { ok: false, to: dest, error: res.error };
}

export async function saveBuilder(templateId: string, html: string) {
  const cleanId = templateId.trim();
  if (cleanId) {
    await prisma.template.update({ where: { id: cleanId }, data: { html } });
    revalidatePath("/templates");
    revalidatePath("/builder");
    return;
  }
  const created = await prisma.template.create({
    data: { name: "Untitled template", category: "Newsletter", html },
  });
  revalidatePath("/templates");
  redirect(`/builder?template=${created.id}`);
}
