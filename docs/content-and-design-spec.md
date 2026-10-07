# Sendrift Content & Design Specification

© 2026 Venkataramana. All rights reserved.
Author: Venkataramana

> The single source of truth for **all copy** and **all design decisions**. Written before build so
> nothing gets invented ad-hoc during coding. Design foundation: **custom shadcn/ui** themed to the
> Sendrift system (not built on a purchased template). Envato Elements supplies accents only:
> illustrations, icons, email templates, photos, and fonts. See the **Envato Asset Shopping List** (§11).

- **Product working name:** Sendrift (single config constant `APP_NAME`, rename anytime)
- **Tagline:** *Send smarter. Grow faster.*
- **One-liner:** Sendrift is an email marketing and automation platform. Design beautiful emails,
  automate the follow-up, and see exactly what is working.

---

## Table of Contents
1. Brand Foundation (voice, tone, messaging)
2. Content Style Guide (writing rules, glossary, capitalization)
3. Design System (tokens: color, type, spacing, radius, elevation, motion)
4. Iconography and Imagery Direction
5. Component Library (specs, variants, states)
6. Marketing / Static Page Content (full copy)
7. Legal Page Content (structure plus boilerplate)
8. Auth and Onboarding Content (full copy)
9. App Microcopy (labels, empty states, toasts, errors, tooltips), per screen
10. Email Content (system emails plus starter template gallery)
11. Envato Asset Shopping List (exact items and where used)
12. Accessibility and Responsive rules
13. Deliverable checklist / handoff

---

## 1. Brand Foundation

### 1.1 Personality
Calm, confident, data-fluent, human. Sendrift is the tool that makes a powerful thing feel easy.
Not loud, not corporate, not cutesy. Think of a capable colleague who removes friction.

Five adjectives: **Clear, Warm, Precise, Effortless, Trustworthy.**

### 1.2 Voice (always) and Tone (varies by context)
**Voice, constant:**
- Plain language over jargon. Say "emails that reach the inbox," not "optimized deliverability infrastructure."
- Short sentences. Active verbs. Second person ("you," "your list").
- Confident, never hype-y. No exclamation-mark spam. One exclamation per screen, max.
- Helpful, not clever for its own sake. A little warmth is welcome.

**Tone by surface:**
| Surface | Tone |
|---|---|
| Marketing pages | Warm, benefit-led, a little aspirational |
| App UI / labels | Neutral, precise, terse |
| Empty states | Encouraging, action-oriented |
| Errors | Calm, blameless, points to the fix |
| Success/toasts | Brief, positive, no gloating |
| Legal | Formal but readable |
| Onboarding | Friendly, guiding, low-pressure |

### 1.3 Messaging pillars (the 6 things we always come back to)
1. **Design without the drag.** Beautiful, on-brand emails built in a real drag-and-drop editor.
2. **Automations that do the following-up.** Visual journeys anyone on the team can build.
3. **Know what worked, instantly.** Real-time analytics and click heatmaps you will actually read.
4. **Reach the inbox.** Guided authentication (DKIM, SPF, DMARC) plus deliverability tooling.
5. **Grow on every page.** Forms and landing pages that match your brand.
6. **Segment like a pro.** Behavior, tags, and fields together. No spreadsheets.

### 1.4 Boilerplate (reuse verbatim)
- **Short (1 line):** Sendrift is an email marketing and automation platform for growing teams.
- **Standard (elevator):** Sendrift helps growing teams design beautiful emails, automate the
  follow-up, and see exactly what is working, without the clutter of legacy tools.
- **Trust line (footers/CTAs):** No credit card required. 3,000 free emails a month. Cancel anytime.
- **Compliance line:** Built for CAN-SPAM, GDPR, and CASL, with one-click unsubscribe on every email.

---

## 2. Content Style Guide

### 2.1 Writing rules
- **Sentence case** for everything: headings, buttons, menu items, table headers. (Not Title Case.)
- Buttons use **verb plus noun**: "Create campaign," "Import contacts," "Save draft." Avoid "Submit" and "OK."
- Numbers: use numerals (3,000 emails, 12 contacts). Abbreviate large: 1.2M, 24.3k. Use `tabular-nums`.
- Dates: "Sep 30, 2025" (absolute) in data; "2 hours ago" (relative) in activity feeds.
- Percentages: one decimal in reports (24.3%), whole numbers in casual copy.
- Oxford comma: yes. Contractions: yes (you're, we'll, don't). They keep it human.
- Never blame the user in errors. "That file is too large," not "You uploaded an invalid file."
- Avoid: "simply," "just," "easy" (dismissive), "obviously," "please note."

### 2.2 Terminology (use these exact terms, consistently)
| Use | Not |
|---|---|
| Contact | Subscriber, lead, user (in UI) |
| List | Audience, group |
| Segment | Filter, smart list |
| Campaign | Blast, newsletter (except marketing copy) |
| Automation | Workflow, flow, sequence, journey |
| Template | Layout, theme |
| Sender identity / sending domain | From-address / domain (in settings) |
| Suppression | Blocklist, do-not-send |
| Deliverability | Inboxing |

### 2.3 Capitalization of feature names
Feature names stay lowercase in prose ("the automation builder," "your contact list") and are
capitalized only when they are a nav label or page title. Product name **Sendrift** is always capitalized.

### 2.4 Status vocabulary (must match enums in code)
Campaign: Draft, Scheduled, Sending, Sent, Paused, Cancelled, Failed.
Contact: Subscribed, Unsubscribed, Pending, Bounced, Complained, Cleaned.
Domain auth: Verified, Pending, Failed.

---

## 3. Design System

> Source of truth in code: CSS variables in `app/globals.css` plus `tailwind.config.ts` theme. Every
> color is a token, never a raw hex in a component. Dark mode via `.dark` class on `<html>`.

### 3.1 Color tokens (light / dark)

**Brand**
| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | `#5B4BE6` | `#8B7CFF` | Buttons, active nav, links, primary charts |
| `--primary-hover` | `#4A3BD1` | `#A296FF` | Hover |
| `--primary-foreground` | `#FFFFFF` | `#14121F` | Text on primary |
| `--primary-subtle` | `#EEEBFF` | `#241F45` | Selected rows, tint chips |
| `--accent` | `#FF6B4A` | `#FF8566` | Sparingly: upgrade CTAs, highlights |
| `--accent-foreground` | `#FFFFFF` | `#1A0E0A` | Text on accent |

**Neutrals / surfaces**
| Token | Light | Dark |
|---|---|---|
| `--background` | `#F7F8FA` | `#0E0F13` |
| `--card` | `#FFFFFF` | `#17181D` |
| `--popover` | `#FFFFFF` | `#1E1F26` |
| `--muted` | `#F1F2F5` | `#1E1F26` |
| `--border` | `#E4E6EB` | `#2A2C34` |
| `--input` | `#D8DAE0` | `#33353F` |
| `--ring` | `#5B4BE6` | `#8B7CFF` |
| `--foreground` | `#16181D` | `#F3F4F7` |
| `--muted-foreground` | `#5C6270` | `#A0A4AF` |
| `--text-disabled` | `#9AA0AC` | `#6A6E7A` |

**Semantic** (each has a subtle bg for badges)
| Token | Light | Dark | Subtle (light / dark) |
|---|---|---|---|
| `--success` | `#12A150` | `#3ECF7C` | `#E4F7ED` / `#10281B` |
| `--warning` | `#E0900A` | `#F5B942` | `#FDF3E0` / `#2A2109` |
| `--destructive` | `#E5484D` | `#FF6166` | `#FDECEC` / `#2C1214` |
| `--info` | `#0B84D9` | `#4BB3F0` | `#E5F3FD` / `#0C2233` |

**Email-status color mapping:** Delivered/Opened maps to success. Clicked maps to primary. Bounced/Complaint maps to destructive. Queued/Pending maps to warning. Unsubscribed maps to muted-foreground.

**Data-viz categorical (in order, color-blind-aware):**
Indigo `#5B4BE6`, Teal `#0FB5AE`, Coral `#FF6B4A`, Amber `#E0900A`, Violet `#A855C7`, Sky `#0B84D9`, Rose `#E5487F`, Lime `#7BB026`.
Rules: single series uses primary; never hue-only (pair with labels); sequential indigo ramp
`#EEEBFF` to `#5B4BE6` to `#2A1F8A` for heatmaps; gridlines use `--border` at 50%; deltas use success/destructive.

### 3.2 Typography
Fonts (Google plus Envato licensed option): **Inter** (UI and body, use `tabular-nums` for metrics),
**Space Grotesk** (marketing hero display only), **JetBrains Mono** (API keys, merge tags, code).

| Style | Size / line-height | Weight | Use |
|---|---|---|---|
| Display | 48 to 64 / 1.05 | 600 | Marketing hero only |
| H1 | 32 / 40 | 700 | Page title |
| H2 | 24 / 32 | 600 | Section header |
| H3 | 20 / 28 | 600 | Card title |
| H4 | 16 / 24 | 600 | Sub-section |
| Body-lg | 16 / 24 | 400 | Marketing body |
| Body | 14 / 22 | 400 | App default |
| Body-sm | 13 / 20 | 400 | Secondary UI |
| Caption | 12 / 16 | 500 | Labels, metadata |
| Overline | 11 / 16 | 600, +0.06em, UPPERCASE | Eyebrows, table headers |
| Mono | 13 / 20 | 400 | Keys, merge tags |

### 3.3 Spacing / radius / elevation / motion
- **Spacing (4px base):** 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Page gutter 24 mobile / 32 desktop. Card padding 20 to 24. Control heights: 40 default, 32 compact, 48 large.
- **Radius:** base 10 (`--radius`); sm 6 (chips/badges), md 10 (buttons/inputs/cards), lg 14 (modals), full (avatars/pills).
- **Elevation:** flat (border only), then `shadow-sm` (hover/dropdown), then `shadow-md` (popover/sheet), then `shadow-lg` (modal). Dark mode leans on border plus lighter surface. Focus ring 2px solid `--ring` plus 2px offset everywhere.
- **Motion:** 150ms ease-out (micro), 200 to 250ms (panels/sheets), 300ms (page/route). Respect `prefers-reduced-motion` (disable non-essential). No auto-advancing carousels.

---

## 4. Visual Assets, Imagery, and Motion

A complete map of every visual asset type the product uses, plus where each appears. All families
come from one cohesive Envato set so nothing clashes. Nine asset types:

### 4.1 Icons and symbols
- **UI icons:** `lucide-react`, stroke 1.75; sizes 16 inline, 20 nav/actions, 24 empty states.
  Canonical set: Users (contacts), List, SlidersHorizontal (segments), Send/Mail (campaigns),
  Workflow (automations), LayoutTemplate (templates), FileText (forms/pages), BarChart3 (analytics),
  ShieldCheck (auth/security, deliverability), KeyRound (API), Webhook, Search (finder), BadgeCheck
  (verification), Settings.
- **Symbol / glyph accents:** small brand symbols and pictograms for feature tiles, plan badges,
  status emblems, and step markers. Envato icon or symbol pack (§11) for richer marketing and
  onboarding spots where lucide is too plain.

### 4.2 Logo and brand marks
- Stylized paper-plane and drifting-wave "S," indigo-to-coral gradient. Logo lockup only, never inside
  dense UI. Variants: full lockup, icon-only mark, monochrome, and a favicon. Used in the top bar,
  auth pages, marketing header and footer, email headers, and the app icon.

### 4.3 Illustrations
- Light, geometric, two-color (indigo plus coral) line-and-fill style. One cohesive Envato family.
- Used for: empty states, onboarding steps, 404/403/500 pages, feature rows on marketing, and
  success or celebration moments (first campaign sent).

### 4.4 Infographic images
- Simple, on-brand diagrams that explain a concept at a glance: how deliverability and authentication
  work (SPF, DKIM, DMARC), how an automation flows, the find, verify, enrich, and send loop, and how
  segmentation works. Used on marketing feature pages, in-app help tips, onboarding, and the blog.
- Built as inline SVG where they should follow the theme and animate; static images where sourced.

### 4.5 Banner images
- Wide hero and section banners: the home hero, feature-page heroes, pricing header, CTA bands,
  in-app announcement bars (new feature, upgrade nudge), email campaign banner blocks, and blog and
  social share headers. Sourced from Envato banner and background packs (§11) or generated from the
  gradient-mesh and pattern assets, always with a readable text overlay.

### 4.6 Photography (marketing only)
- Bright, real, diverse teams at work, desaturated slightly toward the brand's cool neutral. No cheesy
  stock handshakes. Used on the home hero secondary, About, Customers and case studies, and blog
  headers. From Envato photo packs (§11).

### 4.7 Patterns, textures, and backgrounds
- Subtle gradient mesh, soft grid, and dot patterns for hero backgrounds, CTA bands, the auth side
  panel, and card accents. Low contrast so they never fight the content.

### 4.8 Product screenshots
- Real UI in both light and dark, framed in subtle device or browser chrome with a soft shadow. Used
  across marketing and the help center.

### 4.9 Motion and animation
- **Micro-interactions:** button, toggle, tab, and hover transitions (150ms ease-out); toast and side
  sheet slides (200 to 250ms); route changes (300ms). Respect `prefers-reduced-motion`.
- **Loading:** skeletons for pages and cards, progress bars for imports, sends, verification, and
  finder jobs; never a full-page spinner.
- **Delight moments (used sparingly):** a subtle confetti or send animation when the first campaign
  goes out, an animated checkmark on domain verification, and gentle count-up on dashboard KPI tiles.
- **Marketing:** a short looping hero animation or animated product demo, hover micro-interactions on
  feature cards, and scroll-reveal from a visible resting state (never left invisible).
- **Automation and chart:** animated flow connectors in the automation canvas and ease-in draw on
  charts on first load.
- **Sources:** Lottie or CSS for lightweight motion; keep files small; provide a static fallback.

### 4.10 Asset-to-usage map (quick reference)
| Asset type | Primary uses |
|---|---|
| UI icons | Nav, buttons, table cells, statuses everywhere |
| Symbols / badges | Feature tiles, plan badges, status emblems |
| Logo marks | Top bar, auth, marketing, email headers, favicon |
| Illustrations | Empty states, onboarding, error pages, marketing rows |
| Infographics | Feature pages, help, onboarding, blog |
| Banners | Heroes, CTA bands, announcement bars, email banners, blog headers |
| Photography | Home, About, Customers, blog headers |
| Patterns / mesh | Hero and CTA backgrounds, auth panel |
| Screenshots | Marketing, help center |
| Motion | Micro-interactions, loading, delight, marketing, charts |

---

## 5. Component Library (shadcn/ui, themed)

Built in `components/ui/` on Radix/shadcn primitives; feature components in `components/`.

| Component | Variants | Key states |
|---|---|---|
| **Button** | primary, accent (upgrade/high-intent only), secondary, outline, ghost, destructive, link; sizes sm/md/lg; icon-only (tooltip) | default, hover, active, focus-ring, disabled (50%, no shadow), loading (spinner, width preserved) |
| **Input** | text, textarea, number, select, combobox (searchable), multi-select tag input, search (leading icon), password (reveal), date/time, file dropzone, OTP; prefix/suffix groups | default, focus, filled, error (helper becomes error text plus icon), disabled, read-only |
| **Card** | default (border, flat), interactive (hover shadow-sm), section (header, action, divider), stat tile | n/a |
| **Stat tile** | with/without sparkline, with icon chip | loading shows skeleton bars |
| **Data table** | select checkboxes, sortable, pinned columns, expandable rows, density toggle, column-visibility menu, pagination, sticky bulk-action bar | empty (first-run), empty (filtered, "Clear filters"), loading (skeleton rows), error (retry) |
| **Modal / Dialog** | sm 420 / md 560 / lg 720; destructive (red primary plus typed confirm for dangerous deletes) | n/a |
| **Side sheet** | right 400 to 520px; stackable; sticky footer actions | n/a |
| **Tabs** | underline (app), segmented/pill (filters), vertical (settings) | n/a |
| **Toast** | success, error, warning, info; persistent (long ops with progress) | auto-dismiss 5s; optional action ("Undo"/"View") |
| **Badge / status pill** | status (dot plus label), count, tag chip (removable), plan badge; sizes sm/md | n/a |
| **Dropdown/menu** | item, item plus icon, checkbox item, radio group, submenu, section label, separator, destructive | n/a |
| Other | avatar (initials, deterministic tint), progress bar/ring, switch, slider, tooltip (dark surface), popover, breadcrumbs, accordion, calendar, color picker, code block (copy), **Command-K command palette** | n/a |
| **States kit** | empty, loading (skeleton, never full-page spinner), error (inline field / section retry / full-page), 404, 403 | n/a |

---

## 6. Marketing / Static Page Content (final copy)

### 6.1 Home (`/`)
**Hero**
- Eyebrow: `EMAIL MARKETING AND AUTOMATION`
- H1 (Display): **Send emails that land. Run campaigns that run themselves.**
- Sub: Sendrift helps growing teams design beautiful emails, automate the follow-up, and see exactly what is working. No clutter, no guesswork.
- Primary CTA: **Start free** and Secondary: **See a live demo**
- Trust line: No credit card required. 3,000 free emails a month. Cancel anytime.
- Visual: dashboard product shot (light and dark).

**Logo strip:** `Trusted by fast-moving teams at 4,000+ companies`

**Feature highlights** (3-up, then alternating image rows)
1. **Design without the drag.** Build on-brand emails in a true drag-and-drop editor. Start from a template or a blank canvas, preview on every device, and hit send with confidence.
2. **Automations that do the following-up.** Welcome new subscribers, win back the quiet ones, and nurture leads on autopilot with a visual workflow builder anyone can run.
3. **Know what worked, instantly.** Real-time opens, clicks, and revenue in dashboards you will actually read. Click heatmaps show you exactly where people tapped.
4. **Reach the inbox, not the spam folder.** Guided domain authentication (DKIM, SPF, DMARC) and deliverability tooling keep your sender reputation strong.
5. **Grow your list on every page.** Popups, embedded forms, and landing pages that match your brand and capture the right people.
6. **Segment like a pro.** Combine behavior, tags, and custom fields to send the right message to the right people. No spreadsheets required.

**Social proof** (3 testimonial cards)
- "We replaced three tools with Sendrift and our open rates went up 22%." *Maya R., Head of Growth*
- "The automation builder is the first one my whole team actually understands." *Devin O., Marketing Lead*
- "Setup took an afternoon. Our first campaign paid for the year." *Priya N., Founder*
- Metric band: `120M+ emails delivered monthly · 99.2% average deliverability · 4.8/5 average rating`

**Pricing teaser**
- H2: **Simple pricing that grows with your list.**
- Body: Start free. Upgrade when you are ready. Every plan includes the builder, automations, and analytics.
- CTA: **Compare plans**

**Footer CTA band**
- H2: **Your next campaign is waiting.**
- Sub: Join thousands of teams sending smarter with Sendrift.
- CTA: **Create your free account**

**Footer nav** Product: Features, Templates, Automations, Landing Pages, Pricing, Integrations. Resources: Blog, Guides, Help Center, Deliverability, API Docs. Company: About, Careers, Contact. Legal: Privacy, Terms, GDPR, Anti-spam. Newsletter signup plus social icons. Line: `© Sendrift. Built for CAN-SPAM, GDPR, and CASL.`

### 6.2 Features (`/features`)
- Hero H1: **Everything you need to send, automate, and grow, in one place.**
- Sub: From the first signup form to the follow-up nobody had time to write, Sendrift covers the whole journey.

Sections (H2 plus 2 to 3 line body, each with a product visual):
- **Drag-and-drop email builder.** Design emails that look hand-crafted without touching code. Reusable brand blocks, saved rows, and instant mobile preview mean every send looks right.
- **Visual automation builder.** Map customer journeys on a single canvas. Add triggers, delays, conditions, and goals, then let Sendrift run the rest.
- **Contacts and segmentation.** One clean home for every subscriber, with a full activity timeline and segments that update themselves as people engage.
- **Signup forms and landing pages.** Capture leads with popups, embeds, and standalone pages that publish in minutes and match your brand automatically.
- **Analytics and reporting.** Deliverability, engagement, link heatmaps, and best-send-time insights: the numbers that tell you what to do next.
- **Deliverability and compliance.** Domain authentication, list hygiene, and built-in unsubscribe handling keep you compliant and in the inbox.
- **Team and API.** Roles for everyone, an API and webhooks for developers, and integrations for the tools you already use.
- Closing CTA band: **Start free** / **Talk to sales**.

### 6.3 Pricing (`/pricing`)
- Hero H1: **Pricing that scales with your audience, not your ambition.**
- Sub: Pick a plan by contact count. All plans include unlimited automations, forms, and reporting.
- Toggle: **Monthly / Annual (save 20%)**

| | Free | Starter | **Growth** (Most popular) | Scale |
|---|---|---|---|---|
| Price (annual) | $0 | $19/mo | $49/mo | $99/mo |
| Contacts | Up to 500 | Up to 2,500 | Up to 10,000 | Up to 25,000 |
| Monthly emails | 3,000 | 15,000 | Unlimited | Unlimited |
| Best for | Trying it out | Solo and small teams | Growing marketing teams | High-volume senders |
| CTA | Start free | Start 14-day trial | Start 14-day trial | Start 14-day trial |

**Feature matrix**
| Feature | Free | Starter | Growth | Scale |
|---|---|---|---|---|
| Drag-and-drop builder | Yes | Yes | Yes | Yes |
| Templates library | Yes | Yes | Yes | Yes |
| Signup forms | Yes | Yes | Yes | Yes |
| Landing pages | 1 | 3 | Unlimited | Unlimited |
| Automations | 1 | 5 | Unlimited | Unlimited |
| Segmentation | Basic | Advanced | Advanced | Advanced |
| A/B testing | No | Yes | Yes | Yes |
| Send-time optimization | No | No | Yes | Yes |
| Click heatmaps and advanced reports | No | Yes | Yes | Yes |
| Custom domain and DKIM | No | Yes | Yes | Yes |
| Team members | 1 | 3 | 10 | Unlimited |
| API and webhooks | No | Yes | Yes | Yes |
| Dedicated IP | No | No | Add-on | Yes |
| Sendrift branding in footer | Yes | Removable | Removed | Removed |
| Support | Community | Email | Priority | Priority plus onboarding |

- Below matrix: **Need more than 25,000 contacts?** Contact sales for custom volume and enterprise features (SSO, SLA, dedicated success manager).
- FAQ accordion: What counts as a contact? Can I change plans anytime? What happens if I go over my limit? Do you offer refunds? Is there a nonprofit discount?

### 6.4 About (`/about`)
- H1: **Email should feel effortless, for the sender and the reader.**
- Body: Sendrift started with a simple frustration: the best email tools were either too basic to grow with or too bloated to enjoy. So we built the one we wanted, powerful automation and analytics wrapped in an interface that gets out of your way. Today we help thousands of teams turn a blank canvas into campaigns their customers actually look forward to.
- Values row: **Clarity over clutter. Deliverability first. Built for teams. Privacy by default.**
- CTA: **Join us** (Careers) / **Start free**

### 6.5 Contact (`/contact`)
- H1: **Let's talk.**
- Sub: Questions about plans, a demo, or just want to say hi? We usually reply within one business day.
- 3 cards: **Sales**, see Sendrift in action, Book a demo. **Support**, already a customer? Visit Help Center / Email support. **General**, hello@sendrift.com
- Form: Name, Work email, Company, Reason (dropdown), Message, consent checkbox, button **Send message**. (Explicit-action submit; no third-party data sharing beyond submission.)

### 6.6 Secondary marketing pages (structure, copy filled at build)
- **Integrations** (`/integrations`): searchable grid; each card has logo, name, one-line, "Connect." Detail page has overview, setup steps, CTA.
- **Customers** (`/customers`): logo wall plus case-study cards ("How {company} grew its list 3x with Sendrift").
- **Blog** (`/blog`): post cards, category filter, search; article template with author, TOC, related posts. Seed 3 launch posts: "A 5-minute guide to email deliverability," "Welcome automations that actually convert," "How to segment without a spreadsheet."
- **Resources** (`/resources/[type]`): guides, templates, and webinars hubs.

---

## 7. Legal Pages (`/legal/*`)

> Provide readable, standard boilerplate; the user's counsel reviews before launch. Each page has a
> title, effective date, version, table of contents, and prose sections.

- **Terms of Service:** accounts, acceptable use, billing, termination, liability, changes.
- **Privacy Policy:** data collected, purpose, processors (SES/Neon/Upstash), retention, subject rights, contact.
- **GDPR / DPA:** controller/processor roles, DPA request/download, sub-processors list, SCCs.
- **Anti-spam / Acceptable Use:** permission-based sending only, prohibited content, consequences.
- **Cookie Policy:** cookie table (essential vs analytics), manage-preferences link.
- **Cookie consent banner** copy: "We use cookies to run Sendrift and improve it. You choose what is on." Buttons: **Accept all, Reject non-essential, Preferences.** Default is non-essential OFF.

---

## 8. Auth and Onboarding Content

| Screen | Key copy |
|---|---|
| **Login** | H1 "Welcome back". Fields Email, Password. "Forgot password?". Button **Log in**. Divider "or". "Continue with Google". Footer "New to Sendrift? **Create an account**" |
| **Signup** | H1 "Start sending in minutes". Sub trust line. Fields Name, Work email, Password (strength meter). Consent checkbox "I agree to the Terms and Anti-spam policy". Button **Create free account**. "Already have an account? **Log in**" |
| **Forgot password** | H1 "Reset your password". "Enter your email and we will send a reset link." Button **Send reset link**. Success "Check your inbox. If that email exists, a link is on its way." |
| **Reset password** | H1 "Set a new password". New password, confirm, and strength. Button **Update password** |
| **Verify email** | H1 "Confirm your email". "We sent a link to {email}. Click it to activate your account." **Resend email**. "Wrong address? Update it" |
| **Accept invite** | H1 "{Inviter} invited you to {Workspace}". New user sets name and password, then **Join workspace** |

**Onboarding wizard** (`/onboarding`), 5 steps, skippable, progress rail:
1. **About you.** "What best describes you?" (role) plus "What will you send?" (use case). Copy: "This helps us set smart defaults. You can change everything later."
2. **Your brand.** Company name, logo upload, brand color. "We will pre-fill your email footer and builder."
3. **Sender identity.** Add a from-email and start domain verification. "Verified senders reach the inbox. We will walk you through the DNS records."
4. **Import contacts.** CSV upload or "I'll do this later." Reassurance: "Only import people who opted in."
5. **You're set.** "You're ready to send. Here's your first move:" then CTA **Create your first campaign** plus setup checklist.

---

## 9. App Microcopy (per screen)

> Rules: sentence case, verb plus noun buttons, blameless errors. Below: page title, empty state,
> primary action, and notable toasts/errors for each key screen.

### 9.1 Dashboard
- Title: "Good {morning/afternoon/evening}, {firstName}"
- New-account empty: card **"Welcome to Sendrift"** plus checklist: Verify your domain, Import contacts, Design your first email, Send a campaign. CTA **Create campaign**.
- KPI tiles: "Total contacts," "Emails sent (30d)," "Avg open rate," "Avg click rate," each with "up/down x% vs previous 30 days."
- Widget error: "Couldn't load this metric. **Retry**."

### 9.2 Contacts
- Title "Contacts" plus count "24,318 contacts"
- Buttons: **Import** (secondary), **Add contact** (primary)
- Empty (first): "No contacts yet. Import a list or add your first contact." CTA **Import contacts**.
- Empty (filtered): "No contacts match these filters." CTA **Clear filters**.
- Bulk bar: "{n} selected". Add to list. Add tag. Export. Unsubscribe. Delete.
- Toasts: "Added {n} contacts to {list}." "Import started. We'll email you when it's done." "{n} contacts exported."
- Destructive confirm: "Delete {n} contacts? This can't be undone. Their suppression status is kept." Confirm button **Delete contacts**.

### 9.3 Contact detail
- Tabs: Overview, Activity, Lists and tags, Notes
- Empty timeline: "No activity yet."
- Consent block label: "Opted in via {source} on {date}."

### 9.4 Lists and Segments
- Lists empty: "Create your first list to start collecting contacts." CTA **Create list**.
- Segment builder: match toggle "Contacts match **All / Any** of these rules". "Add condition". "Add group". Live count "About 3,420 contacts match". Footer **Save segment**.
- Segment error: "Couldn't calculate segment size. **Retry**."

### 9.5 Campaign wizard
- Stepper: Type, Recipients, Setup, Design, Review
- Step 2 callout: "{n} unique recipients after removing duplicates and unsubscribes."
- Step 3 subject helper: "Keep it under 60 characters for mobile. {n} chars." plus "Try AI suggestions."
- Step 5 checklist (all must pass): "Recipients selected. Sender verified. Subject set. Links valid. Unsubscribe link present."
- Send options: **Send now**, **Schedule**, **Optimize send time**
- Confirm dialog: "Send '{campaign}' to {n} contacts now? You can't unsend." Button **Send campaign**.
- Blocking error example: "No unsubscribe link found. We can add one to the footer automatically. **Add and continue**."
- Autosave indicator: "Saved" / "Saving..."

### 9.6 Email builder
- Placeholder (blank): "Drag a block here to start, or pick a template."
- Buttons: **Send test**, **Save**, **Exit**. Test toast: "Test sent to {email}."
- Load error: "Editor failed to load. **Reload**."
- Small screen banner: "The builder works best on a larger screen. You can preview here."

### 9.7 Templates
- Empty (mine): "You haven't saved any templates. Start from the library or create one." CTA **Browse library**.
- Card actions: Preview, Use, Duplicate, Edit, Delete.

### 9.8 Automations
- List empty: "Automations do the follow-up for you. Build your first one." CTA **Create automation**.
- Builder empty canvas node: "Add a trigger to start."
- Incomplete node tooltip: "Finish setting up this step."
- Save toast: "Automation saved." Activate confirm: "Turn on '{name}'? New contacts will start entering right away." Button **Turn on**.

### 9.9 Campaign report
- Just-sent empty: "Results will appear as recipients engage. Check back shortly."
- Tabs on recipient table: Openers, Clickers, Bounced, Unsubscribed. Action: **Save as segment**.

### 9.10 Settings
- Senders/domains status badges: Verified (success), Pending (warning), Failed (destructive). Helper: "Add these DNS records at your domain provider, then verify."
- API key create: "Copy your key now. You won't see it again." Button **Copy key**.
- Team invite: "Invite sent to {email}." Role helper per role.
- Billing: usage meter "{used} of {limit} contacts" / "{used} of {limit} emails this month." Upgrade nudge at 80%: "You're close to your limit. **Upgrade** to keep sending."
- Destructive (revoke key/remove member/delete domain): typed-confirm dialogs.

### 9.11 Global
- Command-K palette placeholder: "Search contacts, campaigns, settings..."
- Notifications empty: "You're all caught up."
- 404: "We couldn't find that page." CTA **Back to dashboard**. 403: "You don't have access to this." 500: "Something went wrong on our end. **Try again**."
- Generic save error: "Couldn't save. Check your connection and try again."

---

## 10. Email Content

### 10.1 System (transactional) emails, subject plus purpose
| Email | Subject | Notes |
|---|---|---|
| Verify email | "Confirm your email to start with Sendrift" | Button "Confirm email"; expires 24h |
| Welcome | "Welcome to Sendrift, let's send your first campaign" | Next steps plus link to onboarding |
| Password reset | "Reset your Sendrift password" | "If you didn't request this, ignore it." |
| Team invite | "{Inviter} invited you to join {Workspace} on Sendrift" | Accept button |
| Import complete | "Your contact import is ready" | Summary: created/updated/skipped plus error CSV link |
| Campaign sent | "'{name}' is on its way to your contacts" | Quick stats after send window |
| Send failed | "Action needed: '{name}' didn't send" | Reason plus fix link |
| Deliverability alert | "Heads up: your bounce rate is climbing" | Guidance plus link |
| Weekly summary | "Your week on Sendrift, at a glance" | Opt-in digest |

All system emails: Sendrift header, single clear CTA, plain-text alt, footer with address and unsubscribe (for non-essential digests only), light/dark-friendly.

### 10.2 Starter marketing template gallery (ship with the product)
Categories with 2 to 3 templates each (sourced/adapted from Envato email packs §11, re-skinned to tokens):
Newsletter, Promotion / sale, Welcome, Product announcement, Event / webinar, Re-engagement,
Transactional (receipt/confirmation), Plain-text. Each is responsive, merge-tag ready, with an enforced
unsubscribe plus address footer, and a light-background default.

---

## 11. Envato Asset Shopping List

> You said you can provide an Admin dashboard UI kit, Email templates, Illustrations and icons, Stock
> photos, and fonts. We build the app **custom on shadcn/ui**, so the admin kit is a **reference**
> (layout/spacing/chart inspiration plus any freely-licensed sub-assets), not the base. For each item:
> what to search on Envato Elements, and exactly where it is used. **License note:** keep the Envato
> license/registration per item; verify each asset's license permits use in a SaaS UI and in emails.

| # | Asset (search terms) | Where it's used | Priority |
|---|---|---|---|
| 1 | **Admin dashboard UI kit**: "Next.js Tailwind admin dashboard," "SaaS analytics dashboard UI" | Reference for dashboard layout, chart styling, table density, spacing rhythm. Do **not** copy code wholesale; mirror structure in our shadcn components. | Med |
| 2 | **Email template pack (HTML/MJML)**: "responsive email template pack Mailchimp," "MJML email templates newsletter" | Starter template gallery (§10.2) plus system emails, re-skinned to Sendrift tokens | **High** |
| 3 | **Illustration set**: "2-color line illustrations SaaS," "flat vector illustrations onboarding," "empty state illustrations" (one cohesive family) | Empty states, onboarding steps, 404/403/500 pages, marketing feature rows | **High** |
| 4 | **Icon pack**: "line icon set 1.75 stroke," "SaaS UI icons" (supplement lucide) | Marketing feature tiles, onboarding, integration cards (lucide covers app UI) | Low |
| 5 | **Logo / brand mark**: "paper plane logo," "abstract S monogram gradient" (as a starting point) | App logo lockup, favicon, marketing header/footer, email header | **High** |
| 6 | **Stock photos**: "diverse team working laptop bright," "startup office candid" | Home hero secondary, About page, Customers/case studies, blog headers | Med |
| 7 | **Fonts (if not using Google Inter/Space Grotesk)**: licensed display font for hero | Marketing hero display only (optional; Google Fonts is the default) | Low |
| 8 | **Social / OG image templates**: "social media template pack SaaS" | Marketing OG images, blog share cards, changelog | Low |
| 9 | **Pattern/texture or gradient mesh**: "subtle gradient mesh background," "grid pattern SVG" | Hero background, CTA bands, auth page side panel | Low |

**When to connect Envato:** items 2, 3, and 5 are needed for the **visual mockup (Phase A)**; 1 and 6 help polish; 4, 7, 8, and 9 are optional/late. I'll flag the exact moment I need each so you can pull it.

---

## 12. Accessibility and Responsive

- **Contrast:** WCAG 2.1 AA, body at 4.5:1 or higher, large text/UI at 3:1 or higher; dark-mode tokens tuned to keep `--muted-foreground` at 4.5:1 or higher. Never status-by-color-alone (dot plus label).
- **Keyboard:** full tab order, visible 2px focus ring, focus trap in modals/sheets (Esc closes, restore on close), Command-K palette, keyboard alternatives for drag-drop (move up/down, insert menu).
- **Screen readers:** landmarks (nav/main/header), ARIA labels on icon-only buttons, `aria-live` for toasts plus async counts plus import/send progress, proper table `th`/scope, chart text/data-table fallback.
- **Forms:** visible labels (not placeholder-only), errors via `aria-describedby`, required marked in text.
- **Motion:** honor `prefers-reduced-motion`.
- **Breakpoints (Tailwind):** sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Primary navigation is a **top bar** with horizontal tabs (chosen over a left sidebar); on narrow screens the nav scrolls horizontally or collapses into a menu, and the search field hides behind an icon. Tables become cards under md; KPI tiles become a scroll-snap row on mobile; **builders are desktop-first** (read-only preview plus banner on phones). Marketing fully responsive with a sticky mobile CTA. Touch targets 44px or larger.

---

## 13. Deliverable Checklist / Handoff

Before we write app code, these are "done":
- [x] Brand voice, tone, messaging pillars, boilerplate
- [x] Content style guide, glossary, and status vocabulary
- [x] Full design tokens (color light/dark, type, spacing, radius, elevation, motion)
- [x] Icon, imagery, and illustration direction
- [x] Component library spec (variants plus states)
- [x] Final copy: all marketing pages, legal structure, auth and onboarding, per-screen app microcopy
- [x] Email content: system emails plus starter template gallery plan
- [x] Envato asset shopping list mapped to usage
- [ ] **Next:** you review this spec, then I build the **Phase A visual mockup** of key screens using
      these tokens and copy (I'll request Envato items 2, 3, and 5 at that point), then Phase 0 build.

*Rename from "Sendrift" anytime. It is a single config constant `APP_NAME`.*
