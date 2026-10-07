"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";

/* Shows the app shell on app routes, and nothing extra on the marketing landing.
   Sendrift. Copyright 2026 Venkataramana. */

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = pathname === "/";

  if (isMarketing) return <>{children}</>;

  return (
    <div className="appcol">
      <TopNav />
      <div className="work">
        <div className="work-in">{children}</div>
      </div>
    </div>
  );
}
