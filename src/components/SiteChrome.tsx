import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nomad-logo.jpg"
            alt="Nomad Consulting"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg ring-1 ring-border"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide">NOMAD EDGE</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">by Nomad Consulting</p>
          </div>
        </Link>
        <span className="hidden text-xs text-muted sm:block">Local Market Intelligence</span>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nomad-logo.jpg"
          alt="Nomad Consulting"
          width={44}
          height={44}
          className="h-11 w-11 rounded-lg ring-1 ring-border"
        />
        <p className="text-sm font-medium">Nomad Consulting</p>
        <p className="max-w-md text-xs text-muted">
          Local market intelligence for people who want to take action. Market research only —
          what you earn depends on your effort and consistency. No income is promised or implied.
        </p>
      </div>
    </footer>
  );
}
