import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

/* Open-tracking pixel. The email embeds <img src=".../api/track/open/{id}">;
   loading it records an open event and returns a 1x1 transparent GIF.
   Sendrift. Copyright 2026 Venkataramana. */

export const dynamic = "force-dynamic";

const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const msg = await prisma.message.findUnique({ where: { id } });
    if (msg) {
      await prisma.emailEvent.create({
        data: { messageId: id, campaignId: msg.campaignId, contactId: msg.contactId, email: msg.email, type: "open" },
      });
    }
  } catch {
    // Never fail the pixel request.
  }
  return new Response(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
