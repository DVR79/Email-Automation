"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendMail, renderCampaignEmail, senderFrom } from "@/lib/mail";

/* Campaign server actions. Sendrift. Copyright 2026 Venkataramana. */

export async function createCampaign(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  if (!name) return;
  await prisma.campaign.create({
    data: {
      name,
      subject: subject || undefined,
      type: "Regular",
      status: "Draft",
    },
  });
  revalidatePath("/campaigns");
}

export async function deleteCampaign(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/campaigns");
}

// Real send: resolve subscribed recipients, render a personalized email for each,
// and dispatch via SMTP (Mailpit in local dev). Records a Message per recipient and
// marks the campaign Sent (or Failed if nothing could be delivered).
export async function sendCampaign(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign || campaign.status === "Sent" || campaign.status === "Sending") return;

  const [contacts, setting] = await Promise.all([
    prisma.contact.findMany({ where: { status: "Subscribed" } }),
    prisma.setting.findUnique({ where: { id: "singleton" } }),
  ]);
  const address = setting?.address || "Sendrift, 21 Riverside Way, Bengaluru";
  // From uses the verified sender; the account reply address goes in Reply-To.
  const from = senderFrom(setting?.fromName);
  const replyTo = setting?.replyTo || undefined;

  await prisma.campaign.update({ where: { id }, data: { status: "Sending" } });

  let sent = 0;
  let failed = 0;
  for (const c of contacts) {
    // Create the per-recipient record first so its id can seed the tracking
    // links embedded in the email, then send and record the outcome.
    const msg = await prisma.message.create({
      data: { campaignId: id, contactId: c.id, email: c.email, status: "Queued", kind: "campaign" },
    });
    const { subject, html, text } = renderCampaignEmail(campaign, c, { address, messageId: msg.id });
    const res = await sendMail({ to: c.email, subject, html, text, from, replyTo });
    await prisma.message.update({
      where: { id: msg.id },
      data: {
        subject,
        status: res.ok ? "Sent" : "Failed",
        providerId: res.ok ? res.id : undefined,
        error: res.ok ? undefined : res.error,
      },
    });
    if (res.ok) sent++;
    else failed++;
  }

  // If nothing went out (for example Mailpit is not running) mark Failed, not Sent.
  const finalStatus = sent === 0 && failed > 0 ? "Failed" : "Sent";
  await prisma.campaign.update({
    where: { id },
    data: { status: finalStatus, sentAt: finalStatus === "Sent" ? new Date() : null, recipients: sent },
  });

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}
