"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* Sendrift top navigation. Author: Venkataramana. */

type Item = { href: string; label: string; icon: JSX.Element; badge?: string };

const NAV: Item[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    href: "/contacts",
    label: "Contacts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" />
      </svg>
    ),
  },
  {
    href: "/builder",
    label: "Email builder",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    href: "/automations",
    label: "Automations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a2 2 0 0 1 2 2v7" />
      </svg>
    ),
  },
  {
    href: "/find-verify",
    label: "Find and verify",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /><path d="m8.5 11 2 2 3-3.5" />
      </svg>
    ),
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><rect x="7" y="10" width="3" height="7" /><rect x="12" y="6" width="3" height="11" /><rect x="17" y="13" width="3" height="4" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
    ),
  },
  {
    href: "/admin",
    label: "Admin console",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!createOpen && !notifOpen) return;
    function onDown(e: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [createOpen, notifOpen]);

  function runSearch() {
    const q = query.trim();
    router.push(q ? "/contacts?q=" + encodeURIComponent(q) : "/contacts");
  }

  return (
    <>
      <header className="bar1">
        <Link href="/dashboard" className="brand">
          <svg className="logo" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="srlogo" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5B4BE6" /><stop offset="0.55" stopColor="#7C5CFF" /><stop offset="1" stopColor="#FF6B4A" />
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="13" fill="url(#srlogo)" />
            <path d="M35 13.5 13.5 23l9.1 3.1 3.1 9.1Z" fill="#fff" />
            <path d="M35 13.5 22.6 26.1l3.1 9.1Z" fill="#fff" fillOpacity="0.72" />
            <circle cx="14.6" cy="30.4" r="1.5" fill="#fff" fillOpacity="0.85" />
            <circle cx="18.9" cy="33.9" r="1.1" fill="#fff" fillOpacity="0.6" />
          </svg>
          <span className="name">Sendrift</span>
        </Link>
        <div className="search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            placeholder="Search contacts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
            aria-label="Search contacts"
          />
          <span className="kbd mono">Ctrl K</span>
        </div>
        <div className="top-actions" ref={actionsRef}>
          <div className="menu-anchor">
            <button
              className="create"
              aria-haspopup="menu"
              aria-expanded={createOpen}
              onClick={() => { setCreateOpen((v) => !v); setNotifOpen(false); }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              Create
            </button>
            {createOpen ? (
              <div className="menu-pop" role="menu">
                <Link href="/campaigns" role="menuitem" onClick={() => setCreateOpen(false)}>Create campaign</Link>
                <Link href="/contacts" role="menuitem" onClick={() => setCreateOpen(false)}>Add contact</Link>
                <Link href="/builder" role="menuitem" onClick={() => setCreateOpen(false)}>New template</Link>
              </div>
            ) : null}
          </div>
          <div className="menu-anchor">
            <button
              className="iconbtn"
              aria-label="Notifications"
              aria-haspopup="dialog"
              aria-expanded={notifOpen}
              onClick={() => { setNotifOpen((v) => !v); setCreateOpen(false); }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
            </button>
            {notifOpen ? (
              <div className="menu-pop notif-pop" role="dialog" aria-label="Notifications">
                <div className="notif-head">Notifications</div>
                <div className="notif-empty">You&apos;re all caught up.</div>
              </div>
            ) : null}
          </div>
          <span className="avatar">VR</span>
        </div>
      </header>
      <nav className="topnav">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={"nav-item" + (active ? " active" : "")}>
              {item.icon}
              {item.label}
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
