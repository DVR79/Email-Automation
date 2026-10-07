/* Placeholder screen for routes not yet built out. Author: Venkataramana. */

export function Placeholder({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <div className="phead">
        <div><h1>{title}</h1><div className="sub">{sub}</div></div>
      </div>
      <div className="card">
        <div className="placeholder">
          <span className="pi">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8M8 12h8" />
            </svg>
          </span>
          <h2>{title} is coming next</h2>
          <p>This screen is part of the build plan. The design is ready in the mockup and will be wired up here.</p>
        </div>
      </div>
    </>
  );
}
