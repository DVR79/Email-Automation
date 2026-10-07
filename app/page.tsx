/* Sendrift marketing landing page (route "/"). Copyright 2026 Venkataramana. */

const CSS = `
.lp{
  --ink:#141620; --sub:#5C6270; --faint:#8A90A0; --bg:#FFFFFF; --soft:#F6F7FB;
  --card:#FFFFFF; --line:#E7E8EE; --line-soft:#EFF0F4; --display:'Space Grotesk',var(--font);
  color:var(--ink); font-family:var(--font); font-size:16px; line-height:1.6; background:#fff;
}
.lp h1,.lp h2,.lp h3{margin:0;letter-spacing:-.02em}
.lp p{margin:0}
.lp a{color:inherit;text-decoration:none}
.lp .wrap{max-width:1140px;margin:0 auto;padding-left:24px;padding-right:24px}
.lp .tnum{font-variant-numeric:tabular-nums}
.lp .btn{display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 22px;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;border:1px solid transparent;font-family:var(--font)}
.lp .btn svg{width:18px;height:18px}
.lp .btn-primary{background:var(--primary);color:#fff;box-shadow:0 8px 20px rgba(91,75,230,.25)}
.lp .btn-primary:hover{background:var(--primary-hover)}
.lp .btn-outline{background:#fff;border-color:var(--line);color:var(--ink)}
.lp .btn-outline:hover{background:var(--soft)}
.lp .btn-ghost{background:transparent;color:var(--ink)}
.lp .btn-ghost:hover{background:var(--soft)}
.lp .btn-sm{height:40px;padding:0 16px;font-size:14px;border-radius:10px}
.lp header.nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line-soft)}
.lp .nav-in{display:flex;align-items:center;gap:26px;height:70px}
.lp .brand{display:flex;align-items:center;gap:11px;font-family:var(--display);font-weight:600;font-size:20px}
.lp .brand .mk{width:34px;height:34px;border-radius:10px}
.lp .nav-links{display:flex;gap:24px;margin-left:14px;color:var(--sub);font-weight:500;font-size:15px}
.lp .nav-links a:hover{color:var(--ink)}
.lp .nav-cta{margin-left:auto;display:flex;align-items:center;gap:10px}
@media(max-width:820px){.lp .nav-links{display:none}}
.lp .hero{position:relative;overflow:hidden;padding-block:0;background:radial-gradient(60% 80% at 85% -10%, #EEEBFF 0%, rgba(238,235,255,0) 60%),radial-gradient(50% 70% at 5% 0%, #FFE9E2 0%, rgba(255,233,226,0) 55%)}
.lp .hero-in{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center;padding-block:72px}
@media(max-width:900px){.lp .hero-in{grid-template-columns:1fr;padding-block:48px;gap:32px}}
.lp .eyebrow{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--primary);background:var(--primary-subtle);padding:6px 12px;border-radius:999px;margin-bottom:18px}
.lp .hero h1{font-family:var(--display);font-size:clamp(34px,5vw,54px);line-height:1.05;font-weight:600}
.lp .hero p.lead{font-size:19px;color:var(--sub);margin-top:18px;max-width:34ch}
.lp .hero-cta{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}
.lp .trust{margin-top:18px;color:var(--faint);font-size:13.5px}
.lp .shot{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 30px 60px rgba(20,22,32,.14);overflow:hidden}
.lp .shot-bar{display:flex;align-items:center;gap:6px;padding:12px 14px;border-bottom:1px solid var(--line-soft);background:var(--soft)}
.lp .shot-bar i{width:10px;height:10px;border-radius:999px;background:#D8DAE2;display:inline-block}
.lp .shot-body{padding:16px}
.lp .shot-tiles{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
.lp .shot-tile{border:1px solid var(--line-soft);border-radius:11px;padding:11px}
.lp .shot-tile .l{font-size:10.5px;color:var(--faint);font-weight:600}
.lp .shot-tile .v{font-size:19px;font-weight:700}
.lp .shot-chart{border:1px solid var(--line-soft);border-radius:11px;padding:12px}
.lp section{padding-block:72px}
.lp .sec-soft{background:var(--soft)}
.lp .sec-head{text-align:center;max-width:640px;margin:0 auto 44px}
.lp .sec-head .k{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--primary);margin-bottom:12px}
.lp .sec-head h2{font-size:clamp(26px,3.4vw,38px);font-family:var(--display);font-weight:600}
.lp .sec-head p{color:var(--sub);margin-top:12px;font-size:17px}
.lp .strip{text-align:center;color:var(--faint);font-weight:600;font-size:13px}
.lp .strip .row{display:flex;justify-content:center;gap:38px;flex-wrap:wrap;margin-top:20px;opacity:.65}
.lp .strip .row span{font-family:var(--display);font-weight:600;font-size:19px;color:var(--sub)}
.lp .fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
@media(max-width:900px){.lp .fgrid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.lp .fgrid{grid-template-columns:1fr}}
.lp .fcard{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px}
.lp .fcard .ico{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;background:var(--primary-subtle);color:var(--primary);margin-bottom:16px}
.lp .fcard .ico.coral{background:#FFE9E2;color:var(--accent)}
.lp .fcard .ico.teal{background:#DDF6F2;color:#0FB5AE}
.lp .fcard h3{font-size:18px;margin-bottom:8px}
.lp .fcard p{color:var(--sub);font-size:14.5px}
.lp .flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-items:stretch}
@media(max-width:820px){.lp .flow{grid-template-columns:1fr 1fr}}
@media(max-width:460px){.lp .flow{grid-template-columns:1fr}}
.lp .step{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px;text-align:center}
.lp .step .n{width:30px;height:30px;border-radius:999px;background:var(--primary);color:#fff;font-weight:700;display:grid;place-items:center;margin:0 auto 12px;font-size:14px}
.lp .step h4{margin:0 0 6px;font-size:16px}
.lp .step p{font-size:13px;color:var(--sub)}
.lp .step .si{margin:0 auto 10px;color:var(--primary)}
.lp .tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
@media(max-width:820px){.lp .tgrid{grid-template-columns:1fr}}
.lp .tcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px}
.lp .tcard .stars{color:var(--accent);letter-spacing:2px;margin-bottom:12px}
.lp .tcard p{font-size:16px}
.lp .tcard .who{margin-top:16px;color:var(--sub);font-size:13.5px;font-weight:600}
.lp .metricband{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-top:44px;text-align:center}
.lp .metricband .m .v{font-family:var(--display);font-size:30px;font-weight:600;color:var(--primary)}
.lp .metricband .m .l{color:var(--sub);font-size:13.5px}
.lp .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:stretch}
@media(max-width:900px){.lp .pgrid{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.lp .pgrid{grid-template-columns:1fr}}
.lp .pcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:8px}
.lp .pcard.pop{border-color:var(--primary);box-shadow:0 12px 30px rgba(91,75,230,.14);position:relative}
.lp .pcard .tag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px}
.lp .pcard .pn{font-weight:700;font-size:15px}
.lp .pcard .pr{font-family:var(--display);font-size:30px;font-weight:600}
.lp .pcard .pr small{font-size:14px;color:var(--faint);font-weight:400}
.lp .pcard .pd{color:var(--sub);font-size:13px}
.lp .pcard ul{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-direction:column;gap:7px;font-size:13.5px;color:var(--sub)}
.lp .pcard li{display:flex;gap:8px;align-items:flex-start}
.lp .pcard li svg{width:15px;height:15px;color:var(--success);flex:none;margin-top:3px}
.lp .pcard .btn{margin-top:14px;justify-content:center}
.lp .ctaband{border-radius:22px;padding:52px 32px;text-align:center;color:#fff;background:linear-gradient(120deg,#5B4BE6,#7C5CFF 48%,#FF6B4A)}
.lp .ctaband h2{font-family:var(--display);font-size:clamp(26px,3.4vw,38px);font-weight:600}
.lp .ctaband p{opacity:.92;margin-top:10px;font-size:17px}
.lp .ctaband .btn{margin-top:24px;background:#fff;color:var(--primary)}
.lp footer{background:#0E0F14;color:#C7CAD3;padding-block:52px 28px}
.lp .fcols{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:28px}
@media(max-width:820px){.lp .fcols{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.lp .fcols{grid-template-columns:1fr}}
.lp footer .fbrand{color:#fff;margin-bottom:12px;font-family:var(--display);font-weight:600;font-size:20px;display:flex;align-items:center;gap:11px}
.lp footer h5{color:#fff;font-size:13px;margin:0 0 12px}
.lp footer a{display:block;color:#9AA0AE;font-size:14px;padding:5px 0}
.lp footer a:hover{color:#fff}
.lp .fbot{border-top:1px solid #23252E;margin-top:34px;padding-top:20px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:#7C808C;font-size:13px}
.lp .grad-txt{background:linear-gradient(120deg,#5B4BE6,#FF6B4A);-webkit-background-clip:text;background-clip:text;color:transparent}
`;

const check = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;

const FEATURES = [
  { tone: "", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>, h: "Design without the drag", p: "Build on-brand emails in a true drag-and-drop editor. Start from a template or a blank canvas, preview on every device, and hit send with confidence." },
  { tone: "teal", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a2 2 0 0 1 2 2v7" /></svg>, h: "Automations that follow up", p: "Welcome new subscribers, win back the quiet ones, and nurture leads on autopilot with a visual workflow builder anyone can run." },
  { tone: "coral", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="10" width="3" height="7" /><rect x="12" y="6" width="3" height="11" /><rect x="17" y="13" width="3" height="4" /></svg>, h: "Know what worked, instantly", p: "Real-time opens, clicks, and revenue in dashboards you will actually read. Click heatmaps show you exactly where people tapped." },
  { tone: "", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>, h: "Reach the inbox", p: "Guided domain authentication (DKIM, SPF, DMARC) and deliverability tooling keep your sender reputation strong." },
  { tone: "coral", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>, h: "Grow on every page", p: "Popups, embedded forms, and landing pages that match your brand and capture the right people." },
  { tone: "teal", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /><path d="m8.5 11 2 2 3-3.5" /></svg>, h: "Find and verify", p: "Find emails, verify addresses, and enrich contacts before you send, so your list stays clean and your bounces stay low." },
];

const STEPS = [
  { n: 1, h: "Design", p: "Build a beautiful email with the drag-and-drop editor." },
  { n: 2, h: "Verify", p: "Clean your list so every address is worth sending to." },
  { n: 3, h: "Automate", p: "Set up journeys that follow up while you sleep." },
  { n: 4, h: "Analyze", p: "See opens, clicks, and revenue, then do more of what works." },
];

const TESTIMONIALS = [
  { q: "We replaced three tools with Sendrift and our open rates went up 22%.", who: "Maya R., Head of Growth" },
  { q: "The automation builder is the first one my whole team actually understands.", who: "Devin O., Marketing Lead" },
  { q: "Setup took an afternoon. Our first campaign paid for the year.", who: "Priya N., Founder" },
];

const PLANS = [
  { name: "Free", price: "$0", per: "", contacts: "Up to 500 contacts", features: ["3,000 emails a month", "Drag-and-drop builder", "1 automation"], cta: "Start free", pop: false },
  { name: "Starter", price: "$19", per: "/mo", contacts: "Up to 2,500 contacts", features: ["15,000 emails a month", "A/B testing", "Custom domain and DKIM"], cta: "Start trial", pop: false },
  { name: "Growth", price: "$49", per: "/mo", contacts: "Up to 10,000 contacts", features: ["Unlimited emails", "Send-time optimization", "Click heatmaps"], cta: "Start trial", pop: true },
  { name: "Scale", price: "$99", per: "/mo", contacts: "Up to 25,000 contacts", features: ["Unlimited emails", "Dedicated IP", "Priority support"], cta: "Start trial", pop: false },
];

const Logo = ({ size = 34 }: { size?: number }) => (
  <svg className="mk" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <defs><linearGradient id="lg0" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#5B4BE6" /><stop offset="0.55" stopColor="#7C5CFF" /><stop offset="1" stopColor="#FF6B4A" /></linearGradient></defs>
    <rect width="48" height="48" rx="13" fill="url(#lg0)" />
    <path d="M35 13.5 13.5 23l9.1 3.1 3.1 9.1Z" fill="#fff" />
    <path d="M35 13.5 22.6 26.1l3.1 9.1Z" fill="#fff" fillOpacity="0.72" />
    <circle cx="14.6" cy="30.4" r="1.5" fill="#fff" fillOpacity="0.85" />
    <circle cx="18.9" cy="33.9" r="1.1" fill="#fff" fillOpacity="0.6" />
  </svg>
);

export default function Landing() {
  return (
    <div className="lp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top"><Logo />Sendrift</a>
          <nav className="nav-links"><a href="#features">Product</a><a href="#pricing">Pricing</a><a href="#customers">Customers</a><a href="#resources">Resources</a></nav>
          <div className="nav-cta"><a className="btn btn-ghost btn-sm" href="/dashboard">Log in</a><a className="btn btn-primary btn-sm" href="/dashboard">Start free</a></div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow">Email marketing and automation</span>
            <h1>Send emails that land. <span className="grad-txt">Run campaigns that run themselves.</span></h1>
            <p className="lead">Sendrift helps growing teams design beautiful emails, automate the follow-up, and see exactly what is working. No clutter, no guesswork.</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="/dashboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg> Start free</a>
              <a className="btn btn-outline" href="/dashboard">See a live demo</a>
            </div>
            <div className="trust">No credit card required. 3,000 free emails a month. Cancel anytime.</div>
          </div>
          <div className="shot" aria-hidden="true">
            <div className="shot-bar"><i /><i /><i /></div>
            <div className="shot-body">
              <div className="shot-tiles">
                <div className="shot-tile"><div className="l">CONTACTS</div><div className="v tnum">24,318</div></div>
                <div className="shot-tile"><div className="l">OPEN RATE</div><div className="v tnum">42.6%</div></div>
                <div className="shot-tile"><div className="l">CLICKS</div><div className="v tnum">7.9%</div></div>
              </div>
              <div className="shot-chart">
                <div style={{ fontSize: 11, color: "var(--faint)", fontWeight: 600, marginBottom: 6 }}>AUDIENCE GROWTH</div>
                <svg width="100%" height="96" viewBox="0 0 320 96" preserveAspectRatio="none"><defs><linearGradient id="af" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5B4BE6" stopOpacity=".22" /><stop offset="1" stopColor="#5B4BE6" stopOpacity="0" /></linearGradient></defs><path d="M0,74 40,66 80,70 120,52 160,58 200,38 240,44 280,24 320,18 320,96 0,96Z" fill="url(#af)" /><polyline points="0,74 40,66 80,70 120,52 160,58 200,38 240,44 280,24 320,18" fill="none" stroke="#5B4BE6" strokeWidth="2.5" /><polyline points="0,86 40,82 80,84 120,76 160,80 200,70 240,74 280,64 320,60" fill="none" stroke="#FF6B4A" strokeWidth="2" strokeOpacity=".7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBlock: 40 }}>
        <div className="wrap strip">Trusted by fast-moving teams at 4,000+ companies
          <div className="row"><span>Northwind</span><span>Brightpath</span><span>Ridgeline</span><span>Lumen</span><span>Evergreen</span></div>
        </div>
      </section>

      <section className="sec-soft" id="features">
        <div className="wrap">
          <div className="sec-head"><div className="k">Everything in one place</div><h2>From the first signup to the follow-up nobody had time to write</h2><p>Design, automate, and grow, without stitching three tools together.</p></div>
          <div className="fgrid">
            {FEATURES.map((f) => (
              <div className="fcard" key={f.h}><div className={"ico" + (f.tone ? " " + f.tone : "")}>{f.icon}</div><h3>{f.h}</h3><p>{f.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head"><div className="k">How it works</div><h2>Four steps from a blank canvas to a campaign that converts</h2></div>
          <div className="flow">
            {STEPS.map((s) => (
              <div className="step" key={s.n}><div className="n">{s.n}</div><h4>{s.h}</h4><p>{s.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-soft" id="customers">
        <div className="wrap">
          <div className="sec-head"><div className="k">Loved by teams</div><h2>The results speak for themselves</h2></div>
          <div className="tgrid">
            {TESTIMONIALS.map((t) => (
              <div className="tcard" key={t.who}><div className="stars">{"★★★★★"}</div><p>&quot;{t.q}&quot;</p><div className="who">{t.who}</div></div>
            ))}
          </div>
          <div className="metricband">
            <div className="m"><div className="v tnum">120M+</div><div className="l">emails delivered monthly</div></div>
            <div className="m"><div className="v tnum">99.2%</div><div className="l">average deliverability</div></div>
            <div className="m"><div className="v tnum">4.8/5</div><div className="l">average rating</div></div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="wrap">
          <div className="sec-head"><div className="k">Pricing</div><h2>Simple pricing that grows with your list</h2><p>Start free. Upgrade when you are ready. Every plan includes the builder, automations, and analytics.</p></div>
          <div className="pgrid">
            {PLANS.map((p) => (
              <div className={"pcard" + (p.pop ? " pop" : "")} key={p.name}>
                {p.pop ? <span className="tag">Most popular</span> : null}
                <div className="pn">{p.name}</div>
                <div className="pr">{p.price}{p.per ? <small>{p.per}</small> : null}</div>
                <div className="pd">{p.contacts}</div>
                <ul>{p.features.map((f) => (<li key={f}>{check} {f}</li>))}</ul>
                <a className={"btn " + (p.pop ? "btn-primary" : "btn-outline")} href="/dashboard">{p.cta}</a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--sub)", marginTop: 22, fontSize: 14 }}>Need more than 25,000 contacts? <a href="/dashboard" style={{ color: "var(--primary)", fontWeight: 600 }}>Contact sales</a> for custom volume and enterprise features.</p>
        </div>
      </section>

      <section id="resources">
        <div className="wrap">
          <div className="ctaband">
            <h2>Your next campaign is waiting</h2>
            <p>Join thousands of teams sending smarter with Sendrift.</p>
            <a className="btn" href="/dashboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg> Create your free account</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="fcols">
            <div>
              <div className="fbrand"><Logo size={30} />Sendrift</div>
              <p style={{ color: "#9AA0AE", fontSize: 14, maxWidth: "26ch" }}>Email marketing and automation for growing teams. Built for CAN-SPAM, GDPR, and CASL.</p>
            </div>
            <div><h5>Product</h5><a href="#features">Features</a><a href="/templates">Templates</a><a href="/automations">Automations</a><a href="#pricing">Pricing</a><a href="/dashboard">Integrations</a></div>
            <div><h5>Resources</h5><a href="#">Blog</a><a href="#">Guides</a><a href="#">Help center</a><a href="#">Deliverability</a><a href="#">API docs</a></div>
            <div><h5>Company</h5><a href="#">About</a><a href="#customers">Customers</a><a href="#">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div>
          </div>
          <div className="fbot"><span>Copyright 2026 Sendrift. Designed and built by Venkataramana.</span><span>Built for CAN-SPAM, GDPR, and CASL.</span></div>
        </div>
      </footer>
    </div>
  );
}
