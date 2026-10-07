import { prisma } from "@/lib/db";

/* Real engagement aggregates, computed from Message (what was sent) and
   EmailEvent (opens / clicks / unsubscribes). Replaces seeded sample numbers.
   Sendrift. Copyright 2026 Venkataramana. */

const round1 = (n: number) => Math.round(n * 10) / 10;

export type CampaignStats = {
  recipients: number; // contacts targeted (delivered successfully)
  sent: number; // attempted (delivered + failed)
  delivered: number;
  failed: number;
  deliveredRate: number;
  opens: number; // unique recipients who opened
  clicks: number; // unique recipients who clicked
  unsubs: number;
  openRate: number;
  clickRate: number;
  topLinks: { url: string; clicks: number }[];
};

// Count unique messages (recipients) that produced an event of a given type.
async function uniqueByMessage(campaignId: string, type: string) {
  const rows = await prisma.emailEvent.findMany({
    where: { campaignId, type },
    distinct: ["messageId"],
    select: { messageId: true },
  });
  return rows.length;
}

export async function campaignStats(campaignId: string): Promise<CampaignStats> {
  const [delivered, failed, opens, clicks, unsubs, clickEvents] = await Promise.all([
    prisma.message.count({ where: { campaignId, status: "Sent" } }),
    prisma.message.count({ where: { campaignId, status: "Failed" } }),
    uniqueByMessage(campaignId, "open"),
    uniqueByMessage(campaignId, "click"),
    prisma.emailEvent.count({ where: { campaignId, type: "unsubscribe" } }),
    prisma.emailEvent.findMany({ where: { campaignId, type: "click" }, select: { url: true } }),
  ]);

  const sent = delivered + failed;
  const linkMap = new Map<string, number>();
  for (const e of clickEvents) {
    if (e.url) linkMap.set(e.url, (linkMap.get(e.url) || 0) + 1);
  }
  const topLinks = [...linkMap.entries()]
    .map(([url, c]) => ({ url, clicks: c }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 6);

  return {
    recipients: delivered,
    sent,
    delivered,
    failed,
    deliveredRate: sent ? round1((delivered / sent) * 100) : 0,
    opens,
    clicks,
    unsubs,
    openRate: delivered ? round1((opens / delivered) * 100) : 0,
    clickRate: delivered ? round1((clicks / delivered) * 100) : 0,
    topLinks,
  };
}

export type OverviewStats = {
  contacts: number;
  emailsSent: number;
  delivered: number;
  failed: number;
  deliverability: number;
  openRate: number;
  clickRate: number;
  opens: number;
  clicks: number;
  unsubs: number;
};

export async function overviewStats(): Promise<OverviewStats> {
  const [contacts, delivered, failed, openRows, clickRows, unsubs] = await Promise.all([
    prisma.contact.count(),
    prisma.message.count({ where: { kind: "campaign", status: "Sent" } }),
    prisma.message.count({ where: { kind: "campaign", status: "Failed" } }),
    prisma.emailEvent.findMany({ where: { type: "open" }, distinct: ["messageId"], select: { messageId: true } }),
    prisma.emailEvent.findMany({ where: { type: "click" }, distinct: ["messageId"], select: { messageId: true } }),
    prisma.emailEvent.count({ where: { type: "unsubscribe" } }),
  ]);
  const opens = openRows.length;
  const clicks = clickRows.length;
  return {
    contacts,
    emailsSent: delivered,
    delivered,
    failed,
    deliverability: delivered + failed ? round1((delivered / (delivered + failed)) * 100) : 0,
    openRate: delivered ? round1((opens / delivered) * 100) : 0,
    clickRate: delivered ? round1((clicks / delivered) * 100) : 0,
    opens,
    clicks,
    unsubs,
  };
}

// Cumulative contact count per day over the window, plus new / unsubscribed /
// net totals. Drives the dashboard's audience-growth chart from real data.
export async function contactGrowth(days = 30): Promise<{ points: number[]; newContacts: number; unsubscribed: number; net: number; total: number }> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const [all, newInRange, unsubInRange] = await Promise.all([
    prisma.contact.findMany({ select: { createdAt: true } }),
    prisma.contact.count({ where: { createdAt: { gte: since } } }),
    prisma.emailEvent.count({ where: { type: "unsubscribe", createdAt: { gte: since } } }),
  ]);

  const points: number[] = [];
  for (let i = 0; i < days; i++) {
    const dayEnd = new Date(since.getTime() + (i + 1) * 86400000);
    points.push(all.filter((c) => c.createdAt < dayEnd).length);
  }
  return { points, newContacts: newInRange, unsubscribed: unsubInRange, net: newInRange - unsubInRange, total: all.length };
}

// Daily sends / opens / clicks over the window, for the analytics line chart.
export async function engagementSeries(days = 30): Promise<{ sends: number[]; opens: number[]; clicks: number[] }> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const [sends, events] = await Promise.all([
    prisma.message.findMany({ where: { kind: "campaign", status: "Sent", createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.emailEvent.findMany({ where: { createdAt: { gte: since }, type: { in: ["open", "click"] } }, select: { createdAt: true, type: true } }),
  ]);

  const sendsArr = new Array(days).fill(0);
  const opensArr = new Array(days).fill(0);
  const clicksArr = new Array(days).fill(0);
  const idx = (d: Date) => Math.floor((d.getTime() - since.getTime()) / 86400000);
  for (const m of sends) { const i = idx(m.createdAt); if (i >= 0 && i < days) sendsArr[i]++; }
  for (const e of events) {
    const i = idx(e.createdAt);
    if (i >= 0 && i < days) { if (e.type === "open") opensArr[i]++; else clicksArr[i]++; }
  }
  return { sends: sendsArr, opens: opensArr, clicks: clicksArr };
}

// Open counts by weekday (Mon..Sun) and 2-hour bucket starting 6am, for the
// "best send times" heatmap.
export async function openHeatmap(): Promise<{ grid: number[][]; max: number; total: number }> {
  const rows = await prisma.emailEvent.findMany({ where: { type: "open" }, select: { createdAt: true } });
  const grid = Array.from({ length: 7 }, () => new Array(12).fill(0));
  for (const r of rows) {
    const d = new Date(r.createdAt);
    const day = (d.getDay() + 6) % 7; // Mon=0 .. Sun=6
    const bucket = Math.floor(((d.getHours() - 6 + 24) % 24) / 2);
    grid[day][bucket]++;
  }
  let max = 0;
  for (const row of grid) for (const v of row) max = Math.max(max, v);
  return { grid, max, total: rows.length };
}

// Per-campaign open/click rates for the campaigns list and dashboard table,
// computed in a few batched queries rather than one per row.
export async function campaignRates(campaignIds: string[]): Promise<Record<string, { openRate: number | null; clickRate: number | null }>> {
  const out: Record<string, { openRate: number | null; clickRate: number | null }> = {};
  if (campaignIds.length === 0) return out;

  const [delivered, opens, clicks] = await Promise.all([
    prisma.message.groupBy({ by: ["campaignId"], where: { campaignId: { in: campaignIds }, status: "Sent" }, _count: { _all: true } }),
    prisma.emailEvent.findMany({ where: { campaignId: { in: campaignIds }, type: "open" }, distinct: ["messageId"], select: { campaignId: true } }),
    prisma.emailEvent.findMany({ where: { campaignId: { in: campaignIds }, type: "click" }, distinct: ["messageId"], select: { campaignId: true } }),
  ]);

  const deliveredBy: Record<string, number> = {};
  for (const d of delivered) if (d.campaignId) deliveredBy[d.campaignId] = d._count._all;
  const openBy: Record<string, number> = {};
  for (const o of opens) if (o.campaignId) openBy[o.campaignId] = (openBy[o.campaignId] || 0) + 1;
  const clickBy: Record<string, number> = {};
  for (const c of clicks) if (c.campaignId) clickBy[c.campaignId] = (clickBy[c.campaignId] || 0) + 1;

  for (const id of campaignIds) {
    const d = deliveredBy[id] || 0;
    out[id] = d
      ? { openRate: round1(((openBy[id] || 0) / d) * 100), clickRate: round1(((clickBy[id] || 0) / d) * 100) }
      : { openRate: null, clickRate: null };
  }
  return out;
}
