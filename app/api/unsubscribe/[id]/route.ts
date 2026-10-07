import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

/* One-click unsubscribe. The footer link points here; this records an
   unsubscribe event, flips the contact to Unsubscribed, and shows a simple
   confirmation page. Sendrift. Copyright 2026 Venkataramana. */

export const dynamic = "force-dynamic";

function page(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f5f8;color:#1a1c22;display:grid;place-items:center;min-height:100vh}
.card{background:#fff;border:1px solid #ececf1;border-radius:14px;padding:36px 32px;max-width:440px;text-align:center;box-shadow:0 10px 26px rgba(20,22,34,.06)}
.badge{width:52px;height:52px;border-radius:999px;background:#E6F7EE;color:#12A150;display:grid;place-items:center;margin:0 auto 16px;font-size:26px}
h1{font-size:20px;margin:0 0 8px}p{color:#6b7280;line-height:1.6;margin:0}</style></head>
<body><div class="card"><div class="badge">&#10003;</div><h1>${title}</h1><p>${body}</p></div></body></html>`;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let email = "";
  try {
    const msg = await prisma.message.findUnique({ where: { id } });
    if (msg) {
      email = msg.email;
      await prisma.emailEvent.create({
        data: { messageId: id, campaignId: msg.campaignId, contactId: msg.contactId, email: msg.email, type: "unsubscribe" },
      });
      if (msg.contactId) {
        await prisma.contact.update({ where: { id: msg.contactId }, data: { status: "Unsubscribed" } }).catch(() => {});
      } else {
        await prisma.contact.updateMany({ where: { email: msg.email }, data: { status: "Unsubscribed" } });
      }
    }
  } catch {
    // Show the confirmation regardless.
  }
  const who = email ? ` <strong>${email.replace(/[<>&]/g, "")}</strong>` : "";
  const html = page("You're unsubscribed", `We've removed${who} from this list. You won't receive further emails from this campaign.`);
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
