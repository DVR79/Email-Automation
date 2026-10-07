/* Email builder page. Sendrift. Copyright 2026 Venkataramana. */

import { prisma } from "@/lib/db";
import { BuilderEditor } from "@/components/BuilderEditor";

export const dynamic = "force-dynamic";

const STARTER_HTML = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1C22;">
  <h1 style="font-size: 24px; margin: 0 0 12px;">Hello from Sendrift</h1>
  <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
    Start writing your email here. Edit the HTML on the left and watch the
    preview update live on the right.
  </p>
  <p style="margin: 24px 0;">
    <a href="#" style="background: #5B4BE6; color: #ffffff; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600;">Get started</a>
  </p>
  <p style="font-size: 12px; color: #9AA0AC;">You are receiving this because you subscribed to Sendrift updates.</p>
</div>`;

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const templateId = template?.trim() || "";

  let initialHtml = STARTER_HTML;
  let templateName = "";

  if (templateId) {
    const t = await prisma.template.findUnique({ where: { id: templateId } });
    if (t) {
      templateName = t.name;
      initialHtml = t.html && t.html.trim() ? t.html : STARTER_HTML;
    }
  }

  return <BuilderEditor initialHtml={initialHtml} templateId={templateId} templateName={templateName} />;
}
