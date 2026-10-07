"use server";

import { promises as dns } from "dns";
import net from "net";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/* Find and verify server actions. Sendrift. Copyright 2026 Venkataramana.

   The verifier runs real checks in layers:
     1. Syntax (RFC-ish local@domain shape).
     2. Disposable / role / free-provider detection.
     3. DNS MX (with A-record fallback) to confirm the domain can receive mail.
     4. A live SMTP mailbox probe (RCPT TO) against the domain's mail server,
        compared with a known-fake address at the same domain, so a genuine
        inbox is told apart from a typo and from a catch-all domain.

   Honesty about limits: a specific mailbox can only be confirmed when the
   domain's mail server answers an SMTP probe. Outbound port 25 is blocked on
   many networks; when the probe cannot run we report Unknown (or Catch-all for
   accept-all providers) rather than a false Valid. Some providers (Gmail,
   Outlook, most Google Workspace / Microsoft 365 domains) accept every address
   at RCPT time, so those are reported Catch-all, which is the honest answer. */

const SYNTAX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const DISPOSABLE = new Set(["mailinator.com", "10minutemail.com", "tempmail.com", "temp-mail.org", "guerrillamail.com", "trashmail.com", "yopmail.com", "getnada.com", "tempmail.io"]);
const ROLE = new Set(["info", "sales", "admin", "support", "contact", "hello", "billing", "no-reply", "noreply"]);
const FREE = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "proton.me", "live.com", "aol.com"]);

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const rand = (n: number) => Math.floor(Math.random() * n);

// Some Windows setups leave Node's DNS resolver pointed at a server that refuses
// queries (ECONNREFUSED) even when the system resolver works. Try the default
// resolver first; on failure, switch Node to public DNS and retry. The switch
// is global and only happens once per process.
let dnsFixed = false;
async function resolveMxResilient(domain: string) {
  try {
    return await dns.resolveMx(domain);
  } catch (e) {
    if (!dnsFixed) {
      try { dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]); dnsFixed = true; } catch { /* ignore */ }
      return await dns.resolveMx(domain);
    }
    throw e;
  }
}

async function dnsReachable(): Promise<boolean> {
  try {
    const mx = await resolveMxResilient("google.com");
    return Array.isArray(mx) && mx.length > 0;
  } catch {
    return false;
  }
}

// Heuristic: does the local part look like random gibberish (likely fake)?
function looksGibberish(local: string) {
  const l = local.replace(/[._+-]/g, "");
  if (l.length < 7) return false;
  const letters = l.replace(/[^a-z]/gi, "");
  if (letters.length < 5) return false;
  const vowels = (letters.match(/[aeiou]/gi) || []).length;
  const vowelRatio = vowels / letters.length;
  const longConsonantRun = /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(letters);
  return vowelRatio < 0.18 || longConsonantRun;
}

type ProbeResult =
  | { ok: true; real: number; fake: number }
  | { ok: false; reason: "unreachable" };

// Open an SMTP conversation with the domain's mail server and ask whether the
// real address and a known-fake address at the same domain are accepted. The
// difference in the two RCPT responses is what separates a real inbox from a
// typo (both rejected = typo path; real accepted + fake rejected = genuine;
// both accepted = catch-all). Uses the null sender <> so no sender domain needs
// to validate. Resolves to unreachable on any timeout, block, or error.
function smtpProbe(mxHost: string, email: string, domain: string): Promise<ProbeResult> {
  return new Promise((resolve) => {
    const fakeAddr = `nx${Date.now().toString(36)}${rand(9999)}zq@${domain}`;
    let stage = 0;
    let real = 0;
    let fake = 0;
    let buf = "";
    let done = false;

    const socket = net.createConnection({ host: mxHost, port: 25 });
    const finish = (val: ProbeResult) => {
      if (done) return;
      done = true;
      try { socket.destroy(); } catch { /* ignore */ }
      resolve(val);
    };
    const write = (s: string) => { try { socket.write(s + "\r\n"); } catch { finish({ ok: false, reason: "unreachable" }); } };

    socket.setTimeout(8000, () => finish({ ok: false, reason: "unreachable" }));
    socket.on("error", () => finish({ ok: false, reason: "unreachable" }));
    socket.on("end", () => { if (!done) finish(real ? { ok: true, real, fake } : { ok: false, reason: "unreachable" }); });

    socket.on("data", (d) => {
      buf += d.toString();
      // Wait for a final response line (code followed by a space, not a dash).
      let code = 0;
      let isFinal = false;
      for (const line of buf.split(/\r?\n/)) {
        const m = /^(\d{3})([ -])/.exec(line);
        if (m) { code = parseInt(m[1], 10); isFinal = m[2] === " "; }
      }
      if (!isFinal) return;
      buf = "";
      step(code);
    });

    function step(code: number) {
      switch (stage) {
        case 0: // greeting banner
          if (code !== 220) return finish({ ok: false, reason: "unreachable" });
          stage = 1; write("EHLO verifier.sendrift.io"); break;
        case 1: // EHLO reply
          stage = 2; write("MAIL FROM:<>"); break;
        case 2: // MAIL FROM reply
          if (code >= 400) return finish({ ok: false, reason: "unreachable" });
          stage = 3; write(`RCPT TO:<${email}>`); break;
        case 3: // RCPT (real) reply
          real = code;
          stage = 4; write(`RCPT TO:<${fakeAddr}>`); break;
        case 4: // RCPT (fake) reply
          fake = code;
          write("QUIT");
          finish({ ok: true, real, fake });
          break;
      }
    }
  });
}

// Pick the best (lowest-priority-number) MX host for a domain.
async function bestMxHost(domain: string): Promise<string | null> {
  try {
    const mx = await resolveMxResilient(domain);
    if (!Array.isArray(mx) || mx.length === 0) return null;
    return mx.slice().sort((a, b) => a.priority - b.priority)[0].exchange;
  } catch {
    return null;
  }
}

export async function verifyEmail(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return;

  const flags: string[] = [];
  let status = "Valid";
  let score = 95;
  let gibberish = false;

  const [localpart, domain] = [email.split("@")[0] || "", email.split("@")[1] || ""];
  const syntaxOk = SYNTAX.test(email);

  if (!syntaxOk) {
    flags.push("syntax");
    status = "Invalid";
    score = clamp(5 + rand(10));
  } else {
    const disposable = DISPOSABLE.has(domain);
    const isRole = ROLE.has(localpart);
    const isFree = FREE.has(domain);
    gibberish = looksGibberish(localpart);
    if (isRole) flags.push("role");
    if (isFree) flags.push("free");

    if (disposable) {
      flags.push("disposable");
      status = "Invalid";
      score = clamp(8 + rand(8));
    } else if (!(await dnsReachable())) {
      // No outbound DNS in this environment: cannot verify the domain. Be honest.
      flags.push("mx-unchecked");
      if (isFree) { flags.push("accept-all"); status = "Catch-all"; score = clamp(55 + rand(8)); }
      else if (isRole) { status = "Risky"; score = clamp(45 + rand(10)); }
      else { status = "Unknown"; score = clamp(48 + rand(6)); }
    } else {
      const mxHost = await bestMxHost(domain);
      let hasA = false;
      if (!mxHost) { try { const a = await dns.resolve(domain); hasA = Array.isArray(a) && a.length > 0; } catch { hasA = false; } }

      if (!mxHost && !hasA) {
        flags.push("no-mx");
        status = "Invalid";
        score = clamp(6 + rand(9));
      } else if (!mxHost && hasA) {
        // Domain resolves but advertises no mail server: it probably cannot
        // receive mail. Not a confident Valid.
        flags.push("no-mx", "a-only");
        status = "Risky";
        score = clamp(35 + rand(10));
      } else {
        // Domain has a mail server. Probe the actual mailbox.
        const probe = await smtpProbe(mxHost as string, email, domain);
        if (!probe.ok) {
          // Could not complete an SMTP probe (port 25 blocked, greylisted, or
          // the server refused). Fall back to a domain-level answer.
          flags.push("smtp-unreachable");
          if (isFree) { flags.push("accept-all"); status = "Catch-all"; score = clamp(55 + rand(8)); }
          else if (isRole) { status = "Risky"; score = clamp(45 + rand(10)); }
          else { status = "Unknown"; score = clamp(48 + rand(6)); }
        } else {
          const acceptReal = probe.real >= 200 && probe.real < 300;
          const acceptFake = probe.fake >= 200 && probe.fake < 300;
          const rejectReal = probe.real >= 500;
          if (acceptReal && !acceptFake) {
            // Server accepts the real address but rejects a random one: the
            // mailbox genuinely exists.
            flags.push("smtp-verified");
            status = "Valid";
            score = clamp(96 - rand(4));
          } else if (acceptReal && acceptFake) {
            // Server accepts everything: catch-all, mailbox not confirmable.
            flags.push("accept-all");
            status = "Catch-all";
            score = clamp(55 + rand(8));
          } else if (rejectReal) {
            // Server rejected the address: no such mailbox (the typo case).
            flags.push("no-mailbox");
            status = "Invalid";
            score = clamp(6 + rand(8));
          } else {
            // Temporary / greylisted / ambiguous response.
            flags.push("smtp-inconclusive");
            status = "Unknown";
            score = clamp(48 + rand(6));
          }
        }
      }
    }
  }

  // A gibberish local part strongly suggests a fake address, even on a catch-all
  // provider. Downgrade anything not already Invalid or SMTP-verified.
  if (gibberish && status !== "Invalid" && !flags.includes("smtp-verified")) {
    status = "Risky";
    if (!flags.includes("gibberish")) flags.push("gibberish");
    score = clamp(Math.min(score, 38));
  }

  try {
    await prisma.verificationResult.create({ data: { email, status, score, flags: flags.join(",") } });
  } catch {
    // Never throw to the client.
  }

  revalidatePath("/find-verify");
}
