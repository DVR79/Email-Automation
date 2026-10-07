import { PrismaClient } from "@prisma/client";

/* Seed sample data into the local database. Sendrift. Copyright 2026 Venkataramana. */

const prisma = new PrismaClient();

const contacts = [
  { email: "aisha.malik@brightpath.io", name: "Aisha Malik", status: "Subscribed", lists: "Newsletter", tags: "customer" },
  { email: "tom@ridgeline.co", name: "Tom Nguyen", status: "Subscribed", lists: "Newsletter, Leads", tags: "trial" },
  { email: "rhea.k@lumen.design", name: "Rhea Kapoor", status: "Pending", lists: "Leads", tags: "webinar" },
  { email: "devin@acme.com", name: "Devin Osei", status: "Subscribed", lists: "Newsletter", tags: "vip" },
  { email: "maria.p@evergreen.eu", name: "Maria Popescu", status: "Bounced", lists: "Leads", tags: "" },
  { email: "jcole@harborworks.com", name: "Jordan Cole", status: "Unsubscribed", lists: "Newsletter", tags: "churned" },
  { email: "sana@fablehouse.studio", name: "Sana Liang", status: "Subscribed", lists: "Newsletter, VIP", tags: "customer" },
];

const campaigns = [
  { name: "October Newsletter", subject: "Your October learning picks are here", type: "Regular", status: "Sent", listName: "Newsletter", recipients: 18204, openRate: 44.1, clickRate: 8.6, sentAt: new Date(Date.now() - 2 * 86400000) },
  { name: "Autumn Skills Bootcamp", subject: "Three courses to finish in a lunch break", type: "AB", status: "Sent", listName: "Leads", recipients: 9530, openRate: 39.8, clickRate: 7.1, sentAt: new Date(Date.now() - 6 * 86400000) },
  { name: "Black Friday preview", subject: "A first look at our Black Friday deals", type: "Regular", status: "Scheduled", listName: "Newsletter", recipients: 21900, scheduledAt: new Date(Date.now() + 2 * 86400000) },
  { name: "Win-back: quiet 90 days", subject: "We miss you", type: "Regular", status: "Draft", listName: "Leads" },
];

const templates = [
  { name: "Simple Newsletter", category: "Newsletter", html: "<h1>Newsletter</h1><p>Your update goes here.</p>" },
  { name: "Product Announcement", category: "Product announcement", html: "<h1>Something new</h1><p>Announce it here.</p>" },
  { name: "Welcome Email", category: "Welcome", html: "<h1>Welcome</h1><p>Glad you are here.</p>" },
  { name: "Promotion", category: "Promotion", html: "<h1>Special offer</h1><p>Details here.</p>" },
];

const automations = [
  { name: "Welcome series", trigger: "Joins list: Newsletter", status: "Active", enrolled: 312 },
  { name: "Abandoned browse", trigger: "Visited product page", status: "Paused", enrolled: 88 },
  { name: "Re-engagement", trigger: "No open in 60 days", status: "Draft", enrolled: 0 },
];

const lists = [
  { name: "Newsletter", description: "Main subscriber list" },
  { name: "Leads", description: "Prospects and trials" },
  { name: "VIP", description: "Top customers" },
];

const tags = [{ name: "customer" }, { name: "trial" }, { name: "vip" }, { name: "webinar" }, { name: "churned" }];

async function main() {
  let i = contacts.length;
  for (const c of contacts) {
    const createdAt = new Date(Date.now() - i * 86400000);
    i--;
    await prisma.contact.upsert({ where: { email: c.email }, update: {}, create: { ...c, source: "Import", createdAt, lastActivityAt: createdAt } });
  }
  for (const l of lists) await prisma.list.upsert({ where: { name: l.name }, update: {}, create: l });
  for (const t of tags) await prisma.tag.upsert({ where: { name: t.name }, update: {}, create: t });

  if ((await prisma.campaign.count()) === 0) for (const c of campaigns) await prisma.campaign.create({ data: c });
  if ((await prisma.template.count()) === 0) for (const t of templates) await prisma.template.create({ data: t });
  if ((await prisma.automation.count()) === 0) for (const a of automations) await prisma.automation.create({ data: a });

  await prisma.setting.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });

  console.log(`Seed complete. Contacts: ${await prisma.contact.count()}, Campaigns: ${await prisma.campaign.count()}, Templates: ${await prisma.template.count()}, Automations: ${await prisma.automation.count()}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
