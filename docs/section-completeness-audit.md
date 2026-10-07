# Sendrift: Section-by-Section Completeness Audit

© 2026 Venkataramana. All rights reserved.
Author: Venkataramana

> A manual pass through every section of the product. For each one: its purpose, the must-have
> elements, what is missing or should be added, and the imagery and motion it needs. Then a full
> Settings specification (a must-have area) and the renaming behavior (app-level and in-app). No em
> dashes are used. Legend: **Have** means already specified, **Add** means a gap to build in.

---

## Marketing site

### Home (`/`)
- **Must have:** hero with headline and CTAs, logo strip, 6 feature highlights, testimonials, metric
  band, pricing teaser, footer CTA, full footer. **Have.**
- **Add:** cookie consent banner on first visit, a sticky mobile CTA, an announcement bar slot.
- **Imagery:** hero banner plus product screenshot (light and dark), feature-row illustrations,
  customer logos, a short looping hero animation, scroll-reveal on sections.

### Features, Pricing, About, Contact
- **Must have:** all copy is written (§6 of the content spec). **Have.**
- **Add:** on Pricing, a live monthly/annual toggle and a plan comparison that collapses on mobile; on
  Contact, spam protection on the form (honeypot plus rate limit).
- **Imagery:** feature-page heroes and infographics (deliverability, automation, find-verify-enrich),
  pricing header banner, About team photos and values icons, Contact map or office image.

### Integrations, Customers, Blog, Resources
- **Must have:** structure defined (§6.6). **Have.**
- **Add:** integrations search and category filter, integration detail pages, case-study template,
  blog article template with author and related posts, resource gating for downloads.
- **Imagery:** integration logos, customer logos and case-study banners, blog header images and social
  share cards.

---

## Legal (`/legal/*`)
- **Must have:** Terms, Privacy, GDPR/DPA, Anti-spam, Cookie policy, cookie consent banner. **Have.**
- **Add:** a sub-processors list page and a public status or uptime link in the footer.
- **Imagery:** none beyond the logo; keep these plain and readable.

---

## Auth and onboarding
- **Must have:** login, signup, forgot and reset password, verify email, accept invite, 5-step
  onboarding. **Have.**
- **Add:** two-factor prompt at login when enabled, Google and Microsoft social login, an SSO entry
  point for enterprise (later), and clear error and lockout states.
- **Imagery:** auth side panel with gradient mesh and a product illustration, onboarding step
  illustrations, an animated success on completion.

---

## App: Dashboard
- **Must have:** greeting, 4 KPI tiles, audience-growth chart, deliverability donut, recent campaigns,
  setup checklist. **Have.**
- **Add:** a date-range switcher on the charts, a quick-actions row, a deliverability or reputation
  alert card when at risk, and an empty first-run state for brand-new accounts.
- **Imagery:** KPI icons, count-up animation on the tiles, ease-in chart draw, welcome illustration for
  the empty state.

## Contacts
- **Must have:** table with search, filter, bulk actions, import, add, status and tags. **Have.**
- **Add:** saved views, column configuration, a "select all matching filter" affordance, CSV export,
  and a filtered-empty state distinct from the first-run empty state.
- **Imagery:** empty-state illustration, avatar color tints, import success animation.

## Contact detail
- **Must have:** profile with inline edit, consent and source, engagement tiles, activity timeline,
  tabs. **Have.**
- **Add:** enrichment panel (show enriched company and person data from the Find and Verify module),
  notes, and a "verify this email" action.
- **Imagery:** timeline event icons, empty-timeline illustration.

## Lists and Segments
- **Must have:** lists table, segment rule builder with live count. **Have.**
- **Add:** list growth mini-chart, duplicate and archive, and a static-vs-dynamic segment toggle.
- **Imagery:** empty-state illustrations for both.

## Tags and Custom fields
- **Must have:** tag management, custom field schema. **Have.**
- **Add:** merge and rename tags, reorder custom fields, field type icons.
- **Imagery:** small type icons per field kind.

## Campaigns (list plus 5-step wizard)
- **Must have:** campaign list by status, wizard (Type, Recipients, Setup, Design, Review), report.
  **Have.**
- **Add:** duplicate, A/B setup within the wizard, spam-score and preview in Review, resend to
  non-openers action on a sent campaign, and schedule with timezone.
- **Imagery:** campaign-type icons in step 1, device preview frames, an animated send confirmation.

## Email builder
- **Must have:** canvas, blocks, merge tags, test send, save, preview. **Have.**
- **Add:** saved rows and brand blocks, AI subject and copy assist, a spam and link check, and the
  enforced unsubscribe and address footer.
- **Imagery:** block icons, a small-screen "edit on desktop" banner illustration.

## Templates
- **Must have:** gallery with categories, preview, use, duplicate. **Have.**
- **Add:** a starter template library (from Envato email packs, re-skinned) and template locking for
  non-designers.
- **Imagery:** template thumbnails, category icons.

## Automations (plus report)
- **Must have:** list, visual builder with trigger, action, delay, condition, exit nodes, report.
  **Have.**
- **Add:** A/B split node, webhook and HTTP node, wait-for-condition, goals, and the AI "build from a
  prompt" entry point (later).
- **Imagery:** node icons, animated flow connectors, funnel heat overlay in the report.

## Forms and Landing pages
- **Must have:** form builder (embedded, popup, hosted), landing page builder, publish. **Have.**
- **Add:** the two capture-time toggles "Validate email on submit" and "Enrich on submit," double
  opt-in, multi-step forms, and gamified opt-in (later).
- **Imagery:** form and page template thumbnails, popup style presets, a success illustration.

## Find and Verify (new module)
- **Must have (from features doc B):** Verify a list, Find emails, Enrich, Jobs, Credits tabs. **Add
  the screens.**
- **Add:** single and bulk verify UI, individual and domain finder, enrichment views, a jobs list with
  progress and downloadable results, and a credits meter and history.
- **Imagery:** result-status badges (valid, risky, invalid, catch-all), progress animations on jobs,
  an infographic explaining find-verify-enrich.

## Analytics and Reports
- **Must have:** cross-campaign analytics, campaign report, audience growth. **Have.**
- **Add:** revenue attribution, click heatmaps, best-send-time heatmap, a custom dashboard or saved
  report builder, and scheduled exports.
- **Imagery:** chart set with consistent data-viz palette, heatmap gradients.

## Deliverability cockpit
- **Must have:** reputation, bounce and complaint rates, sending limits. **Have (base).**
- **Add:** SPF, DKIM, DMARC, and BIMI status with one-click fixes, one-click List-Unsubscribe status,
  blocklist monitoring, and a reputation score. Required by Gmail and Yahoo rules.
- **Imagery:** status badges, an authentication infographic, a reputation gauge.

## Super Admin console (`/admin`)
- **Must have (from features doc A.5):** Accounts, Account detail, Users, Plans and billing, System
  settings, global Deliverability, Audit log, Support tools. **Add the screens.**
- **Add:** revenue dashboard, impersonation banner and controls, feature-flag manager, and provider
  key management.
- **Imagery:** admin KPI icons, status badges, keep it dense and utilitarian.

## Global (shell)
- **Must have:** top-bar nav, search, Create button, credits, theme toggle, notifications, avatar.
  **Have.**
- **Add:** the Command-K palette, a working notifications drawer, a mobile nav menu, and consistent
  empty, loading, and error states across every screen.
- **Imagery:** loading skeletons, empty and error illustrations, notification icons.

---

## Settings (full specification, a must-have area)

Settings uses a left sub-nav inside a Settings layout. Every destructive action uses a typed-confirm
dialog. Sections:

1. **Profile** (per user): name, avatar, email, password change, **two-factor authentication** (TOTP
   and email), language and timezone, and personal notification preferences.
2. **Account** (the workspace): account name, logo, default from-name and reply-to, timezone, and the
   **physical mailing address** required for compliant sending.
3. **Branding and white-label** (see Renaming below): app or account display name, logo, brand color,
   email footer, custom unsubscribe page, and (on higher plans) removal of Sendrift footer branding
   and a custom sending domain for links.
4. **Team and roles**: member table (avatar, email, role, status, last active), invite by email with a
   role, pending invites, role assignment (Admin, Manager, User, Viewer), and remove. **Approval
   workflow** toggle (draft to review to send) for larger teams.
5. **Billing and plans**: current plan card, usage meters for contacts, emails, and credits, upgrade
   and downgrade, **Stripe-managed payment method** (never stored by Sendrift), invoice history and
   download, and usage-based add-ons.
6. **Senders and domains**: sender identities (verify a from-email), sending domains with DKIM, SPF,
   and DMARC status and copyable DNS records, custom return-path, and dedicated IP (paid).
7. **API keys**: create (shown once), revoke, scopes, last used.
8. **Webhooks**: endpoint URL, event subscriptions, signing secret, test send, and a delivery log with
   retry.
9. **Integrations**: connected apps, connect and disconnect, and OAuth.
10. **Notifications** (account level): which events send email or in-app alerts, and to whom.
11. **Security**: two-factor policy for the account, session management, and **SSO and SAML** for
    enterprise (later).
12. **Data and privacy**: **GDPR export and delete** requests, consent and suppression settings, data
    residency (later), and a data-processing agreement download.
13. **Audit log** (account level): who changed, sent, or deleted what, filterable and exportable.

Empty states per subsection (for example "No API keys yet," "No webhooks yet"). On mobile the left
sub-nav becomes a top dropdown and tables become cards.

---

## Renaming

Two distinct kinds of renaming, both required.

### 1. App-level renaming (white-label)
- The product name lives in a single config constant `APP_NAME`, so "Sendrift" can be changed
  everywhere at once (nav, emails, page titles, footer).
- On white-label plans, an **account** can set its own display name, logo, brand color, and email
  footer in Settings > Branding, and remove Sendrift footer branding. The Super Admin controls which
  plans allow white-label.
- Sending links and the unsubscribe and preference pages can use the account's own domain.

### 2. In-app inline renaming (entities)
Users can rename their own objects, consistently, everywhere:
- Renameable entities: campaigns, templates, lists, segments, tags, custom fields, automations, forms,
  landing pages, saved views, sender identities, API keys, webhooks, and team workspaces.
- Interaction pattern: click the title (or a rename item in the row kebab menu) to edit inline, with
  Enter to save and Escape to cancel, plus a "Renamed" toast. Full-screen builders show an editable
  title in the header.
- Rules: names are validated (not empty, length limit), duplicates are allowed except where a slug
  must be unique (landing page slug, tag name), and a rename never changes the object's id or breaks
  links. Renames are written to the account audit log.

---

## Summary of what this audit adds
- Per-section gaps are marked **Add** above and should be folded into the build backlog.
- Settings is fully specified with 13 sections, including the compliance and security areas.
- Renaming is defined at both the app level (white-label) and the entity level (inline).
- Imagery and motion needs are listed per section and map to the asset types in the content and design
  spec (§4).

*Rename from "Sendrift" anytime. It is a single config constant `APP_NAME`.*
