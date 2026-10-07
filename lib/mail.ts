import nodemailer from "nodemailer";

/* Email sending via SMTP. In local development this points at Mailpit
   (localhost:1025), which captures every message and shows it at
   http://localhost:8025. Swap the SMTP_* env vars to use a real provider later.
   Sendrift. Copyright 2026 Venkataramana. */

const host = process.env.SMTP_HOST || "localhost";
const port = Number(process.env.SMTP_PORT || 1025);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const DEFAULT_FROM = process.env.MAIL_FROM || "Sendrift <hello@sendrift.local>";

// Base URL the tracking links point back to. Must be reachable from wherever
// the email is opened; in local dev that is the dev server itself.
export const APP_URL = process.env.APP_URL || "http://localhost:3000";

// Mailpit needs no auth; a real provider sets SMTP_USER / SMTP_PASS.
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  ignoreTLS: port === 1025, // Mailpit speaks plain SMTP
  auth: user && pass ? { user, pass } : undefined,
  connectionTimeout: 8000,
});

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string; from?: string }): Promise<SendResult> {
  try {
    const info = await transporter.sendMail({
      from: opts.from || DEFAULT_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text || htmlToText(opts.html),
    });
    return { ok: true, id: info.messageId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/* ---------- rendering helpers ---------- */

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function htmlToText(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function firstName(contact: { name?: string | null; email: string }) {
  const n = (contact.name || "").trim().split(/\s+/)[0];
  return n || "there";
}

// Replace merge tags: {{firstName}}, {{name}}, {{email}}.
export function personalize(str: string, contact: { name?: string | null; email: string }) {
  if (!str) return "";
  const first = firstName(contact);
  return str
    .replace(/\{\{\s*firstname\s*\}\}/gi, first)
    .replace(/\{\{\s*name\s*\}\}/gi, contact.name || first)
    .replace(/\{\{\s*email\s*\}\}/gi, contact.email);
}

// Wrap body HTML in a branded, responsive email shell with a compliant footer.
export function wrapEmail(bodyHtml: string, opts: { address: string; unsubscribeUrl?: string; preheader?: string }) {
  const unsub = opts.unsubscribeUrl || "#";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f4f5f8;font-family:Arial,Helvetica,sans-serif;color:#1a1c22;">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(opts.preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ececf1;">
        <tr><td style="padding:24px 28px 8px;">
          <div style="font-weight:700;font-size:18px;color:#5B4BE6;">Sendrift</div>
        </td></tr>
        <tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6;color:#1a1c22;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:18px 28px;border-top:1px solid #ececf1;font-size:12px;color:#8a90a0;line-height:1.6;">
          ${escapeHtml(opts.address)}<br>
          <a href="${unsub}" style="color:#5B4BE6;">Unsubscribe</a> &middot; <a href="${unsub}" style="color:#5B4BE6;">Update preferences</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Add engagement tracking to a finished email: rewrite outbound links through
// the click redirect and append a 1x1 open pixel. The unsubscribe link (which
// points back at /api/unsubscribe/) is left untouched so it is not counted as
// a click. baseUrl must be reachable from the recipient's mail client.
export function injectTracking(html: string, messageId: string, baseUrl = APP_URL) {
  const unsubPrefix = `${baseUrl}/api/unsubscribe/`;
  let out = html.replace(/href="(https?:\/\/[^"]+)"/gi, (m, url: string) => {
    if (url.startsWith(unsubPrefix)) return m;
    return `href="${baseUrl}/api/track/click/${messageId}?u=${encodeURIComponent(url)}"`;
  });
  const pixel = `<img src="${baseUrl}/api/track/open/${messageId}" width="1" height="1" alt="" style="display:none;max-height:0;overflow:hidden" />`;
  out = out.includes("</body>") ? out.replace("</body>", pixel + "</body>") : out + pixel;
  return out;
}

type CampaignLike = { name: string; subject?: string | null; preheader?: string | null; html?: string | null };

// Build the full, tracked email for one recipient from a campaign. The caller
// creates the Message row first and passes its id so tracking links resolve.
export function renderCampaignEmail(
  campaign: CampaignLike,
  contact: { name?: string | null; email: string },
  opts: { address: string; messageId: string; baseUrl?: string },
) {
  const baseUrl = opts.baseUrl || APP_URL;
  const subject = personalize(campaign.subject || campaign.name, contact);
  const first = firstName(contact);
  const body =
    campaign.html && campaign.html.trim()
      ? personalize(campaign.html, contact)
      : `<h1 style="font-size:22px;margin:0 0 12px;">${escapeHtml(personalize(campaign.subject || campaign.name, contact))}</h1>
         <p style="margin:0 0 14px;">Hi ${escapeHtml(first)},</p>
         <p style="margin:0 0 20px;color:#4b5563;">This is a message from your Sendrift campaign "${escapeHtml(campaign.name)}". Edit the content in the email builder to make it your own.</p>
         <p style="margin:0 0 8px;"><a href="${baseUrl}" style="background:#5B4BE6;color:#ffffff;padding:11px 20px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;">Take a look</a></p>`;
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe/${opts.messageId}`;
  let html = wrapEmail(body, { address: opts.address, unsubscribeUrl, preheader: campaign.preheader || undefined });
  html = injectTracking(html, opts.messageId, baseUrl);
  return { subject, html, text: htmlToText(html) };
}
