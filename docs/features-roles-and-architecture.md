# Sendrift: Roles, Prospecting Module, and Advanced Feature Roadmap

© 2026 Venkataramana. All rights reserved.
Author: Venkataramana

> Companion to `content-and-design-spec.md`. This document adds three things the base plan did not
> cover: (A) the multi-tenant SaaS model with Super Admin, Admin, and User roles, (B) a new
> Prospecting, Validation, and Enrichment module (email verification, email finder, enrichment, and
> validate-plus-enrich on form submit), and (C) an advanced-feature roadmap drawn from competitor
> research (Hunter, Apollo, Snov, ZeroBounce, Clearbit/Breeze, Dropcontact, Klaviyo, HubSpot, Brevo,
> Omnisend, and others). No em dashes are used anywhere in this document. Nothing here is built yet.

---

## Part A. Multi-tenant model and roles

### A.1 Tenancy model
Sendrift is a multi-tenant SaaS. Three layers:

1. **Platform** (Sendrift itself, operated by you). One global layer.
2. **Account** (a customer company, also called a workspace or tenant). Every customer signs up and
   gets one Account. All data (contacts, campaigns, automations, domains) is scoped to an Account.
3. **User** (a person who belongs to an Account, or a platform operator).

Data isolation: every domain row carries `accountId` and is filtered by it in the data-access layer,
so one Account can never read another Account's data. The Super Admin is the only role that can cross
Accounts, and every cross-account action is written to an audit log.

### A.2 The three core roles (as requested)

| Role | Scope | Who it is | Core powers |
|---|---|---|---|
| **Super Admin** | Platform (all Accounts) | You / Sendrift operators | Manage all Accounts and Users; billing and plans control; system and deliverability settings; full data and reports access across every Account |
| **Admin** | One Account | The customer's account owner | Manage their team and roles, their billing, their sender identities and domains, and everything inside their Account |
| **User** | One Account | A member of a customer's team | Create and edit contacts, campaigns, templates, and automations; limited settings; no billing or team management |

Two optional Account roles are recommended for larger teams and can ship later:
- **Manager**: like Admin for content and sending, but no billing, no team management, no destructive account settings.
- **Viewer / Analyst**: read-only access to campaigns and reports.

### A.3 Super Admin capabilities (all four you selected)
1. **Manage all accounts and users**: create, suspend, reactivate, and delete Accounts; create and
   disable Users; reset access; **impersonate** a User for support (time-boxed, consent-flagged, fully
   audited).
2. **Billing and plans control**: define plans, limits, quotas, and pricing; grant credits; view MRR,
   usage, and revenue across all Accounts.
3. **System and deliverability settings**: global sending configuration, shared IP pools and domains,
   third-party provider API keys, feature flags, and audit logs.
4. **Full data and reports access**: view campaigns, contacts, and analytics for any Account (read
   access is audited; edits happen through impersonation so the audit trail stays clean).

### A.4 Permission matrix (representative)

| Capability | Super Admin | Admin | Manager | User | Viewer |
|---|---|---|---|---|---|
| View all accounts | Yes | No | No | No | No |
| Create / suspend accounts | Yes | No | No | No | No |
| Impersonate a user | Yes | No | No | No | No |
| Set global plans, pricing, provider keys | Yes | No | No | No | No |
| Manage account billing | Yes | Yes | No | No | No |
| Invite and manage team, set roles | Yes | Yes | No | No | No |
| Manage sender identities and domains | Yes | Yes | No | No | No |
| Create and send campaigns | Yes | Yes | Yes | Yes | No |
| Manage contacts, segments, automations | Yes | Yes | Yes | Yes | No |
| Use finder, verify, enrichment | Yes | Yes | Yes | Yes | No |
| View reports | Yes | Yes | Yes | Yes | Yes |
| Delete account data | Yes | Yes | No | No | No |

### A.5 Super Admin console (separate area)
A separate platform console, served at `/admin` and gated by a platform-admin flag on the User (not a
normal Account login). Screens:
- **Accounts**: table of all customer accounts (plan, status, usage, MRR, last active), create and suspend.
- **Account detail**: usage and limits, plan, users, sender domains, and an Impersonate action.
- **Users**: global user search, disable, reset access.
- **Plans and billing**: plan definitions, limits, pricing, credits, revenue dashboard.
- **System settings**: sending providers (SES and others), IP pools, third-party provider keys, feature flags.
- **Deliverability (global)**: reputation across shared IPs and domains, blocklist monitoring, complaint rates.
- **Audit log**: every cross-account and privileged action, immutable.
- **Support tools**: impersonation sessions, ticket context, account health.

### A.6 Data model and auth additions for roles
- `User.isPlatformAdmin` boolean (or a separate `PlatformAdmin` table) gates the `/admin` console.
- `Account` gains `status` (active, suspended, cancelled), `planId`, `limits` JSON.
- `Membership.role` enum extended: OWNER (Admin), MANAGER, MEMBER (User), VIEWER.
- `AuditLog` (actorUserId, accountId, action, target, before/after JSON, ip, createdAt).
- `ImpersonationSession` (superAdminId, targetUserId, accountId, startedAt, endedAt, reason).
- Route protection: `/admin/**` requires `isPlatformAdmin`; all Account routes require membership in
  the active Account (already in the base plan).

---

## Part B. Prospecting, Validation, and Enrichment module

New product area in the app, suggested nav label **Find and Verify**. It turns Sendrift from a sending
tool into a find, verify, enrich, then send workflow. This directly covers your asks: real-time email
validation, "add company details and get contact details," "extract email," and "submit a person
profile and get their email too."

### B.1 Email verification (validation)
- **Modes**: single (real-time, in the UI and via API) and bulk (CSV upload to an async job).
- **Check stack (cheap to expensive)**: syntax (RFC 5322), domain and MX or DNS, SMTP mailbox
  handshake (accept or reject without sending), catch-all or accept-all detection, disposable or
  temporary domain detection, role-based detection (info@, sales@, admin@), free vs business, intelligent
  greylisting retry, gibberish detection, spam-trap risk, and a blended deliverability score from 0 to 100.
- **Result categories**: Valid, Invalid, Risky, Unknown, Catch-all. Extra flags: disposable, role, free.
- **List cleaning workflow**: verify a list, keep Valid, drop Invalid, quarantine Risky and Unknown,
  segment Catch-all for a warmed sender or verify-on-send, and show an estimated bounce rate before and
  after. This keeps bounce rate under the mailbox-provider threshold and protects sender reputation.
- **Build vs buy**: build the core in-house (owning it is cheap per check and central to a sending
  product); optionally integrate a specialist verifier (Bouncer, ZeroBounce) as a fallback for hard
  catch-all domains.

### B.2 Email finder
- **Individual finder**: name plus company or domain returns the most likely email, a confidence score,
  and the source.
- **Domain or company search**: enter a company or domain and get all known contacts (name, role,
  department filter, confidence, sources), exportable.
- **Bulk finder**: upload a CSV of names and companies, or a list of domains, run an async job, and
  download an enriched CSV. Charge only for emails actually found.
- **How it works**: detect the organization's email pattern from known addresses, generate the most
  likely candidate, confirm it with an SMTP handshake, handle catch-all domains with pattern confidence
  plus corroborating sources, and return a confidence score.
- **Build vs buy**: build the pattern-detection and SMTP-confirm layer in-house; buy the seed and people
  data (Hunter, People Data Labs, Prospeo) rather than trying to out-crawl the big databases.

### B.3 Lead and data enrichment
- **Person enrichment**: email or LinkedIn URL returns title, seniority, company, location, phone, and
  social links.
- **Company enrichment**: domain or company name returns industry, size, revenue, location, tech stack,
  logo, description, and socials. This is the "add company details and get contact details" flow.
- **Bulk enrichment** of existing lists and scheduled refresh to keep records current.
- **Waterfall enrichment engine**: chain multiple data providers cheapest first, stop at the first
  verified hit, then auto-verify the result. This is the highest-leverage architectural choice and
  matches what buyers now expect. Build the orchestration and caching layer; buy the providers.
- **Build vs buy**: buy the underlying person and company data (People Data Labs, Apollo, a
  Clearbit successor, Cognism for compliant EU and phone data); build the orchestration, cache, and
  normalization.

### B.4 Validate and enrich at capture (your key request)
On any form submission or profile submission:
- **Real-time validation**: check syntax, MX, disposable, and role at the instant of submit; block
  clearly invalid addresses and offer a typo correction ("did you mean gmail.com").
- **Real-time enrichment**: enrich the new contact behind the scenes from the email, domain, or IP
  (company, title, size, location), and support progressive profiling so returning visitors are asked
  only for new fields (form shortening).
- **Profile to email**: a "submit a person and get their email and full contact details" flow, exposed
  in the UI, the API, and the embeddable form widget. Submitting company details alone returns the
  company's contacts; submitting a person returns their email.

### B.5 Delivery surfaces
- **REST API**: single and bulk (async job) endpoints for verify, finder, and enrich; credit consumed
  per successful result.
- **Webhooks**: job-complete and real-time capture callbacks.
- **Bulk CSV**: upload, process async, download.
- **Browser extension** (roadmap): reveal a verified email and phone on a LinkedIn or company page and
  push to Sendrift or a CRM.
- **CRM sync** (roadmap): two-way sync with auto-enrich on create and scheduled refresh.

### B.6 Credits
Credit-based metering per Account: one credit per verified, found, or enriched result; phone or mobile
lookups cost premium credits; failed lookups are not charged. Credit balance and usage shown in the app
and controlled by the Super Admin per plan.

### B.7 Compliance for prospecting data (a marketable wedge)
- Track consent source, lawful basis (typically legitimate interest for B2B), and capture context per
  record.
- Maintain a global suppression list and honor opt-out, right-to-object, and erasure.
- Offer EU data residency as an option, and screen phone numbers against DNC registries (roadmap).
- Be transparent about data sources. This posture (in the style of Dropcontact and Cognism) is a real
  differentiator against US-centric incumbents.

### B.8 Data model additions
- `VerificationJob`, `VerificationResult` (email, status, checks JSON, score).
- `FinderJob`, `FinderResult` (input, foundEmail, confidence, sources JSON).
- `EnrichmentRecord` (contactId optional, personData JSON, companyData JSON, provider, fetchedAt).
- `Company` (domain unique, firmographics JSON).
- `CreditLedger` and `CreditBalance` (per Account, per credit type).
- `ProviderConfig` (platform level: which third-party providers and keys, managed by Super Admin).

### B.9 API additions
- `POST /api/v1/verify` (single), `POST /api/v1/verify/bulk`, `GET /api/v1/verify/:jobId`.
- `POST /api/v1/finder/email` (name plus domain), `POST /api/v1/finder/domain`, bulk variant.
- `POST /api/v1/enrich/person`, `POST /api/v1/enrich/company`, bulk variant.
- Form widget submit hook that runs validate and enrich, gated by per-form toggles.

### B.10 App screens and nav additions
- New **Find and Verify** section with tabs: Verify a list, Find emails, Enrich, Jobs, Credits.
- The form builder gains two toggles: "Validate email on submit" and "Enrich on submit."
- Background jobs: `verify:bulk`, `finder:bulk`, `enrich:bulk`, `enrich:refresh`, plus the waterfall
  orchestration worker.

---

## Part C. Advanced feature roadmap (from competitor research)

These features come from studying Mailchimp, Brevo, ActiveCampaign, HubSpot, Klaviyo, Omnisend,
MailerLite, GetResponse, Customer.io, and others. They are slotted into phases so the base platform
ships first.

### Phase 1: quick wins (high value, build on what exists)
- Resend to non-openers (one click, new subject).
- Send-time optimization per recipient.
- Real-time email validation on form submit (also in Part B).
- Deliverability and authentication cockpit: guided SPF, DKIM, DMARC, one-click List-Unsubscribe, BIMI,
  and a reputation score. Required by Gmail and Yahoo bulk-sender rules.
- Preference center plus granular consent and GDPR tooling.
- AI copywriting and subject-line generation and scoring.
- Rule-based lead scoring with decay and engagement tiers (engaged, at-risk, cold).
- A/B testing inside automations with auto-winner.
- RSS-to-email.
- Click maps and heatmap reporting.
- Webhook and HTTP-request steps plus wait-for-condition in journeys.

### Phase 2: core differentiators (medium build, high payoff)
- Form-submit data enrichment (also in Part B).
- Custom events and a website tracking pixel (behavioral triggers).
- Revenue attribution per campaign and per flow, plus ecommerce and conversion tracking.
- SMS as a native channel inside the journey canvas, with unified frequency capping.
- Abandoned cart, browse, and back-in-stock flows.
- Surveys and quizzes for zero-party data.
- Multi-user roles plus approval workflows (roles are in Part A; approvals add draft to review to send).
- Agency and multi-workspace mode (manage many client accounts, roll-up billing).
- Custom objects and a flexible data model (orders, subscriptions, and more).

### Phase 3: advanced and defining bets (heavy build)
- AI journey and campaign agent: describe a goal in plain language and Sendrift builds, launches, and
  optimizes the flow.
- Predictive analytics scores: predicted customer lifetime value, churn risk, and next-order date, with
  predictive segments.
- WhatsApp channel, with RCS readiness.
- CDP and unified profile with identity resolution and data pipelines.
- Generative on-brand email design from a brand kit.

### Sequencing rationale
Phase 1 closes parity gaps and ships your two flagged priorities cheaply (form validation and the
deliverability cockpit). Phase 2 builds the data, behavioral, and revenue backbone that the advanced
features depend on, plus the first multichannel and team features. Phase 3 are the capital-intensive
bets that decide whether Sendrift competes at the top tier, and they depend on the Phase 2 data layer.

---

## Part D. How this changes the earlier plan
- The base roadmap phases (0 through 3) in the master plan still hold for core sending. This document
  layers the prospecting module and advanced features on top, and adds the Super Admin console as a
  parallel workstream.
- Navigation grows by one tenant section (Find and Verify) and one platform area (the `/admin` console).
- The data model grows by the entities listed in A.6 and B.8.
- Compliance becomes a named, marketable feature rather than a background requirement.

### Recommended near-term focus once building starts
1. Core sending MVP (unchanged): contacts, builder, send pipeline, tracking, reports.
2. Email verification (Part B.1) as the first prospecting feature, because it is buildable in-house and
   directly protects deliverability.
3. Validate-and-enrich on form submit (Part B.4), your specific request.
4. Multi-tenant roles and the Super Admin console (Part A), since selling to multiple accounts depends
   on it.

---

## Part E. Gap features added (approved)

These six were flagged as missing in the feature audit and are now part of the plan. SMTP verification
infrastructure is deferred to a later decision, per direction.

| # | Feature | What it covers | Phase |
|---|---|---|---|
| 1 | **Payment provider (Stripe)** | Real billing rail behind the billing UI: subscriptions, plan changes, proration, invoices, tax, dunning, and webhooks into the account's plan and limits. Cards are handled by Stripe, never stored by Sendrift. | Phase 0 to 1 |
| 2 | **GDPR data-subject requests** | Self-serve export and delete for a contact's data, and for an account's own data; request log, verification, and a fulfillment workflow. Ties into the global suppression list. | Phase 1 |
| 3 | **Security: 2FA now, SSO/SAML later** | Two-factor authentication (TOTP and email) at signup and in profile settings for Phase 1. SSO and SAML plus SCIM provisioning for enterprise accounts in Phase 3. | 2FA Phase 1, SSO Phase 3 |
| 4 | **Notifications system** | In-app notification center plus email alerts for send completion, imports, verification and finder jobs, deliverability warnings, team invites, and billing events. Per-user notification preferences. | Phase 1 |
| 5 | **Localization and multi-language** | UI language switching and translatable system emails, with locale, timezone, date, number, and currency formatting. Decided early because it is cheap to design in and expensive to retrofit. Launch language English, framework ready for more. | Decide in Phase 0, expand later |
| 6 | **Tenant audit log** | An in-account activity log (who changed, sent, or deleted what) visible to account Admins, separate from the platform-level Super Admin audit log in A.6. | Phase 2 |

Data model additions for the gaps: `Subscription` and `Invoice` (Stripe-linked), `DataRequest`
(type export or delete, status, requestedBy, fulfilledAt), `TwoFactorSecret` on User, `Notification`
and `NotificationPreference`, `Locale` fields on User and Account, and `AccountAuditLog`.

*Rename from "Sendrift" anytime. It is a single config constant `APP_NAME`.*
