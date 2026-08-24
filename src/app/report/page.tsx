import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getFullReport } from "@/lib/reportEngine";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { UNLOCK_COOKIE, isUnlocked } from "@/lib/unlock";

export default async function FullReport({
  searchParams,
}: {
  searchParams: Promise<{ zip?: string }>;
}) {
  const { zip: zipParam } = await searchParams;
  const zip = (zipParam || "").trim();
  const cookieValue = (await cookies()).get(UNLOCK_COOKIE)?.value;

  // Server-side paywall: only a Stripe-confirmed, signed cookie unlocks the report.
  if (!zip || !isUnlocked(cookieValue, zip)) {
    redirect("/report-preview");
  }

  const report = await getFullReport(zip);

  const locationLabel = report.state
    ? `${report.city}, ${report.state}`
    : `ZIP ${report.zip}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Nomad Edge Market Report</p>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          Home
        </Link>
      </div>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{locationLabel}</h1>
      <p className="text-muted">
        ZIP {report.zip} · {report.areaType}
      </p>

      {/* Summary */}
      <Card title="Read this first">
        <p>{report.summary}</p>
        <div className="mt-4 flex gap-3 text-sm">
          <Badge>Demand: {report.marketDemand}</Badge>
          <Badge>Competition: {report.competition}</Badge>
        </div>
        <p className="mt-4 text-sm text-muted">{report.keyInsight}</p>
      </Card>

      {/* Opportunities */}
      <Card title="Top local opportunities">
        <div className="space-y-4">
          {report.opportunities.map((o, i) => (
            <div key={o.name} className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">
                  {i + 1}. {o.name}
                </h3>
                <span className="whitespace-nowrap text-sm text-accent">{o.priceRange}</span>
              </div>
              <p className="mt-1 text-sm text-muted">
                <span className="text-foreground">Demand:</span> {o.demand} ·{" "}
                <span className="text-foreground">Customers:</span> {o.customers}
              </p>
              <p className="mt-2 text-sm">{o.whyHere}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Prices shown are typical local rates customers pay — not a projection of your earnings.
        </p>
      </Card>

      {/* Marketing */}
      <Card title="How to get your first customers">
        <div className="space-y-4">
          {report.channels.map((c, i) => (
            <div key={c.name}>
              <h3 className="font-semibold">
                {i + 1}. {c.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{c.why}</p>
              <p className="mt-1 text-sm">
                <span className="text-accent">First action:</span> {c.firstAction}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 48-hour plan */}
      <Card title="48-hour start plan">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">Day 1</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {report.quickStart.day1.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Day 2</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {report.quickStart.day2.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Avoid */}
      <Card title="What to avoid here">
        <ul className="space-y-1 text-sm text-muted">
          {report.avoid.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </Card>

      {/* Edge */}
      <Card title="Your edge">
        <p>{report.edge}</p>
      </Card>

      <p className="mt-8 text-center text-xs text-muted">
        Nomad Consulting · Market research only. What you earn depends on your effort and
        consistency. No income is promised or implied.
      </p>
      </main>
      <SiteFooter />
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 card p-7">
      <h2 className="text-lg font-semibold text-accent">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted">
      {children}
    </span>
  );
}
