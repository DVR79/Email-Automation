/* Diagnostic: run a live SMTP mailbox probe against one or more addresses and
   print the raw server response codes. Mirrors what the Find & Verify screen
   does internally. Usage:

     node scripts/verify-probe.mjs real@example.com typo@example.com

   Reading the output:
     realCode 250 + fakeCode >=500  -> mailbox exists      (tool shows Valid)
     realCode >=500                 -> no such mailbox      (tool shows Invalid)
     realCode 250 + fakeCode 250    -> accept-all domain    (tool shows Catch-all)
     err / 4xx                      -> blocked or greylisted (tool shows Unknown)

   Sendrift. Copyright 2026 Venkataramana. */

import { promises as dns } from "dns";
import net from "net";

// Some Windows setups leave Node's DNS resolver pointed at a server that refuses
// queries (ECONNREFUSED) even though the system resolver works. Try the default
// first, then fall back to public DNS so MX lookups succeed.
let dnsFixed = false;
async function resolveMxResilient(domain) {
  try { return await dns.resolveMx(domain); }
  catch (e) {
    if (!dnsFixed) {
      try { dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]); dnsFixed = true; } catch { /* ignore */ }
      return await dns.resolveMx(domain);
    }
    throw e;
  }
}

function probe(mxHost, email, domain) {
  return new Promise((resolve) => {
    const fake = `nx${Date.now().toString(36)}${Math.floor(Math.random() * 9999)}zq@${domain}`;
    let stage = 0, real = 0, fk = 0, buf = "", done = false;
    const s = net.createConnection({ host: mxHost, port: 25 });
    const fin = (v) => { if (done) return; done = true; try { s.destroy(); } catch { /* ignore */ } resolve(v); };
    const w = (t) => s.write(t + "\r\n");
    s.setTimeout(9000, () => fin({ err: "timeout" }));
    s.on("error", (e) => fin({ err: e.message }));
    s.on("data", (d) => {
      buf += d.toString();
      let code = 0, final = false;
      for (const line of buf.split(/\r?\n/)) { const m = /^(\d{3})([ -])/.exec(line); if (m) { code = +m[1]; final = m[2] === " "; } }
      if (!final) return; buf = "";
      switch (stage) {
        case 0: if (code !== 220) return fin({ err: "banner " + code }); stage = 1; w("EHLO verifier.sendrift.io"); break;
        case 1: stage = 2; w("MAIL FROM:<>"); break;
        case 2: if (code >= 400) return fin({ err: "mailfrom " + code }); stage = 3; w(`RCPT TO:<${email}>`); break;
        case 3: real = code; stage = 4; w(`RCPT TO:<${fake}>`); break;
        case 4: fk = code; w("QUIT"); fin({ realCode: real, fakeCode: fk }); break;
      }
    });
  });
}

async function run(email) {
  const domain = email.split("@")[1];
  if (!domain) { console.log(email, "-> invalid syntax"); return; }
  let mx;
  try { mx = await resolveMxResilient(domain); } catch (e) { console.log(email, "-> MX lookup failed:", e.code || e.message); return; }
  if (!mx || mx.length === 0) { console.log(email, "-> no MX records (domain cannot receive mail)"); return; }
  const host = mx.sort((a, b) => a.priority - b.priority)[0].exchange;
  const r = await probe(host, email, domain);
  console.log(email, "-> mx:", host, JSON.stringify(r));
}

const args = process.argv.slice(2);
if (args.length === 0) { console.log("Usage: node scripts/verify-probe.mjs email1 [email2 ...]"); process.exit(0); }
for (const a of args) { await run(a).catch((e) => console.log(a, "ERR", e.message)); }
