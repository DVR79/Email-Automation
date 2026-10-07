import { PrismaClient } from "@prisma/client";

/* Seed sample data. Sendrift. Copyright 2026 Venkataramana.

   The sent campaigns generate real Message and EmailEvent rows so every number
   in the app (dashboard, reports, analytics) is consistent and computed from
   actual records rather than hardcoded. Re-running resets the demo data. */

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

const days = (n) => new Date(Date.now() - n * 86400000);

// Create a sent campaign plus real per-recipient messages and engagement events
// against the currently subscribed contacts.
async function seedSentCampaign(campaign, subscribers, { opens, clicks, links }) {
  const created = await prisma.campaign.create({
    data: { ...campaign, status: "Sent", recipients: subscribers.length, openRate: null, clickRate: null },
  });
  let i = 0;
  for (const c of subscribers) {
    const msg = await prisma.message.create({
      data: { campaignId: created.id, contactId: c.id, email: c.email, subject: campaign.subject, status: "Sent", kind: "campaign", createdAt: campaign.sentAt },
    });
    const base = { messageId: msg.id, campaignId: created.id, contactId: c.id, email: c.email };
    if (i < opens) {
      await prisma.emailEvent.create({ data: { ...base, type: "open", createdAt: new Date(campaign.sentAt.getTime() + 3600000) } });
      if (i < clicks) {
        await prisma.emailEvent.create({ data: { ...base, type: "click", url: links[i % links.length], createdAt: new Date(campaign.sentAt.getTime() + 5400000) } });
      }
    }
    i++;
  }
  return created;
}

async function main() {
  // Reset demo data so re-runs are consistent (Setting/List/Tag are kept).
  await prisma.emailEvent.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.automation.deleteMany({});
  await prisma.template.deleteMany({});
  await prisma.contact.deleteMany({});

  let i = contacts.length;
  for (const c of contacts) {
    const createdAt = days(i);
    i--;
    await prisma.contact.create({ data: { ...c, source: "Import", createdAt, lastActivityAt: createdAt } });
  }
  for (const l of lists) await prisma.list.upsert({ where: { name: l.name }, update: {}, create: l });
  for (const t of tags) await prisma.tag.upsert({ where: { name: t.name }, update: {}, create: t });
  for (const t of templates) await prisma.template.create({ data: t });
  for (const a of automations) await prisma.automation.create({ data: a });

  const subscribers = await prisma.contact.findMany({ where: { status: "Subscribed" }, orderBy: { createdAt: "asc" } });
  const links = ["https://sendrift.example/learn-more", "https://sendrift.example/view-offer", "https://sendrift.example/read-case-study"];

  // Two realistic sent campaigns with engagement.
  await seedSentCampaign(
    { name: "October Newsletter", subject: "Your October learning picks are here", type: "Regular", listName: "Newsletter", sentAt: days(2) },
    subscribers,
    { opens: 3, clicks: 2, links },
  );
  await seedSentCampaign(
    { name: "Autumn Skills Bootcamp", subject: "Three courses to finish in a lunch break", type: "AB", listName: "Leads", sentAt: days(6) },
    subscribers,
    { opens: 2, clicks: 1, links },
  );

  // Not-yet-sent campaigns (no messages, recipients 0).
  await prisma.campaign.create({ data: { name: "Black Friday preview", subject: "A first look at our Black Friday deals", type: "Regular", status: "Scheduled", listName: "Newsletter", recipients: 0, scheduledAt: days(-2) } });
  await prisma.campaign.create({ data: { name: "Win-back: quiet 90 days", subject: "We miss you", type: "Regular", status: "Draft", listName: "Leads", recipients: 0 } });

  await prisma.setting.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });

  const [cC, caC, tC, aC, mC, eC] = await Promise.all([
    prisma.contact.count(), prisma.campaign.count(), prisma.template.count(),
    prisma.automation.count(), prisma.message.count(), prisma.emailEvent.count(),
  ]);
  console.log(`Seed complete. Contacts: ${cC}, Campaigns: ${caC}, Templates: ${tC}, Automations: ${aC}, Messages: ${mC}, Events: ${eC}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
