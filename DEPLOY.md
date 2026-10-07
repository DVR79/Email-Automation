# Deploying Sendrift to Vercel

The app is configured for Vercel with PostgreSQL. This guide uses Vercel's own
Postgres so you only need one login (Vercel, via GitHub).

## 1. Import the repo
1. Go to https://vercel.com and sign in with GitHub (the account that can see
   `DVR79/Email-Automation`).
2. **Add New -> Project** -> import `DVR79/Email-Automation`.
3. Do not deploy yet. Add the database and environment variables first.

## 2. Create the database
1. In the project, open the **Storage** tab -> **Create Database** -> **Postgres**.
2. Vercel adds a `DATABASE_URL` (and related vars) to the project automatically.

## 3. Set environment variables
In **Settings -> Environment Variables** add:

| Name | Value |
| --- | --- |
| `APP_URL` | your Vercel URL, e.g. `https://email-automation-xxxx.vercel.app` |
| `MAIL_FROM` | `Sendrift <onboarding@resend.dev>` to start, or a verified domain address |
| `RESEND_API_KEY` | your Resend key (only when you want real sending; can add later) |

`DATABASE_URL` is already set by step 2.

## 4. Create the tables
The build does not create tables. Run this once from your computer, pointing at
the production database (copy its `DATABASE_URL` from Vercel Storage):

```bash
# temporarily set the prod URL for this one command
$env:DATABASE_URL="<paste the Vercel Postgres URL>"; npx prisma db push
# optional sample data:
$env:DATABASE_URL="<paste the Vercel Postgres URL>"; npm run db:seed
```

## 5. Deploy
Back in Vercel, click **Deploy**. When it finishes, open the URL.

## Notes
- **Sending:** with `RESEND_API_KEY` set, mail goes through Resend. Without it,
  the app still runs but sends fail (there is no SMTP server on Vercel).
- **Find and verify:** the live port 25 mailbox probe does not work on Vercel
  (serverless blocks port 25); it returns Unknown there. It works locally.
- **Local development** now also uses Postgres. Put a Postgres `DATABASE_URL` in
  your local `.env` (a free Neon database or the Vercel one), then
  `npm run db:push` and `npm run dev`.
