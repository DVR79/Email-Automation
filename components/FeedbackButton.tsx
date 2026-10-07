"use client";

import { useEffect, useRef, useState } from "react";

/* Reusable button that gives clear feedback instead of being silently dead.
   Shows a small transient toast with a message when clicked, so demo-only
   controls never look broken. Sendrift. Copyright 2026 Venkataramana. */

export function FeedbackButton({
  children,
  message,
  onAction,
  className = "btn btn-outline btn-sm",
  style,
  title,
}: {
  children: React.ReactNode;
  message: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function fire() {
    if (onAction) onAction();
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }

  return (
    <>
      <button type="button" className={className} style={style} title={title} onClick={fire}>
        {children}
      </button>
      {show && (
        <div
          role="status"
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 300,
            background: "var(--card)",
            border: "1px solid var(--line-strong)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--fg)",
            boxShadow: "0 6px 24px rgba(20,22,34,.14)",
            maxWidth: 340,
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--primary)", flex: "none" }} />
          {message}
        </div>
      )}
    </>
  );
}
