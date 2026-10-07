# Sendrift

An email marketing and automation platform. Design beautiful emails, manage contacts and lists, send real campaigns, verify addresses, and see real engagement analytics.

Copyright 2026 Venkataramana. All rights reserved.

## Features

- **Dashboard** with real numbers computed from the database (contacts, emails sent, open rate, click rate, deliverability, audience growth).
- **Contacts** with full CRUD, CSV import, search, and status filtering.
- **Campaigns** with a send flow, per recipient delivery records, and a live report (delivered, opens, clicks, unsubscribes, top links).
- **Email builder** with a live HTML preview and a test send.
- **Templates** gallery.
- **Automations** with a visual journey preview (trigger, send, wait, condition, branch).
- **Find and verify** with a real mailbox probe: syntax, DNS MX, disposable and role detection, a live SMTP check, and catch all detection.
- **Settings** for sender identity, reply to, address, and brand.
- **Admin console** view.
- **Real sending** over SMTP (local capture with Mailpit) and **open, click, and unsubscribe tracking** that feeds the analytics.

## Tech stack

- Next.js 15 (App Router) and React 19
- TypeScript
- Prisma ORM with SQLite for local development
- Nodemailer for SMTP delivery

## Getting started (local)

Requirements: Node.js 18 or newer.

```bash
# 1. Install dependencies
npm install

# 2. Create the local database and tables
npm run db:push

# 3. (Optional) seed example data
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000.

### Capturing emails locally with Mailpit

Real sends go out over SMTP. For local development, Mailpit captures every message so nothing reaches real inboxes.

```bash
# install once (Windows)
winget install axllent.mailpit

# run it (keep this window open)
mailpit
```

Mailpit listens for SMTP on port 1025 and shows captured mail at http://localhost:8025. The default `.env` already points there. Send a campaign or a test email, then open the Mailpit inbox to see it.

## Environment variables

Copy `.env.example` to `.env` and adjust as needed. Never commit `.env`.

| Variable | Purpose | Local default |
| --- | --- | --- |
| `DATABASE_URL` | Prisma database connection | `file:./dev.db` |
| `SMTP_HOST` | SMTP server host | `localhost` |
| `SMTP_PORT` | SMTP server port | `1025` (Mailpit) |
| `SMTP_USER` | SMTP username (real provider only) | unset |
| `SMTP_PASS` | SMTP password (real provider only) | unset |
| `MAIL_FROM` | Default from address | `Sendrift <hello@sendrift.local>` |
| `APP_URL` | Base URL used by tracking links | `http://localhost:3000` |

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run db:push` | Apply the Prisma schema to the database |
| `npm run db:seed` | Load example data |
| `npm run db:studio` | Open Prisma Studio |

## Email verification note

Find and verify performs a live SMTP mailbox probe on outbound port 25. This works where port 25 is open (a local machine or a normal server). Some networks and serverless hosts block port 25, in which case the verifier reports Unknown rather than a false result. Large providers such as Gmail and Outlook accept every address at probe time, so those are reported as Catch all, which is the honest answer.

## Deployment

The app runs anywhere Node.js runs. Deploying to a serverless host requires a hosted database (the local SQLite file is not persistent there) and an email provider HTTP API instead of raw SMTP. A standard server or container keeps every feature working as is.

## License

Proprietary. See `LICENSE`.
