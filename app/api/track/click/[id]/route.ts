import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { APP_URL } from "@/lib/mail";

/* Click-tracking redirect. Links in the email point here with the real
   destination in ?u=; this records a click (and an implied open), then
   302-redirects the recipient onward. Sendrift. Copyright 2026 Venkataramana. */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = req.nextUrl.searchParams.get("u") || "";
  let target = APP_URL;
  try {
    const dec = decodeURIComponent(raw);
    if (/^https?:\/\//i.test(dec)) target = dec;
  } catch {
    // keep default
  }
  try {
    const msg = await prisma.message.findUnique({ where: { id } });
    if (msg) {
      const base = { messageId: id, campaignId: msg.campaignId, contactId: msg.contactId, email: msg.email };
      await prisma.emailEvent.create({ data: { ...base, type: "click", url: target } });
      await prisma.emailEvent.create({ data: { ...base, type: "open" } });
    }
  } catch {
    // Never block the redirect on a logging failure.
  }
  return NextResponse.redirect(target, 302);
}
