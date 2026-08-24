"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReportTeaser } from "@/lib/reportEngine";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export default function ReportPreview() {
  const router = useRouter();
  const [report, setReport] = useState<ReportTeaser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const zip = localStorage.getItem("zipcode");
    if (!zip) {
      router.replace("/");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/report?zip=${encodeURIComponent(zip)}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) setReport(data);
        else setError(data.error || "Could not analyze that ZIP. Please try again.");
      } catch {
        if (!cancelled) setError("Could not analyze that ZIP. Please try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleCheckout() {
    if (!report) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: report.zip }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout. Please try again.");
      }
      window.location.href = data.url; // Stripe hosted checkout
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (!report) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-5">
        <p className="animate-pulse text-muted">Analyzing your area…</p>
      </main>
    );
  }

  const locationLabel = report.state
    ? `${report.city}, ${report.state}`
    : `ZIP ${report.zip}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Start over
      </Link>

      <div className="mt-4 card p-7">
        <p className="text-sm text-muted">Your ZIP: {report.zip}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {locationLabel}
        </h1>
        <p className="mt-2 text-muted">{report.snapshot}</p>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="Area Type" value={report.areaType} />
          <Stat label="Demand" value={report.marketDemand} />
          <Stat label="Competition" value={report.competition} />
        </div>
      </div>

      {/* Teaser: only the top opportunity's name is shown, the rest stay locked */}
      <div className="mt-6 card p-7">
        <h2 className="text-lg font-semibold">We found your best local opportunity</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3">
            <span className="text-accent">✓</span>
            <span className="font-medium">{report.topOpportunity.name}</span>
            <span className="ml-auto rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
              {report.topOpportunity.demand} demand
            </span>
          </li>
        </ul>
        {report.moreOpportunitiesCount > 0 && (
          <p className="mt-3 text-sm text-muted">
            + {report.moreOpportunitiesCount} more tailored opportunities waiting in your full report.
          </p>
        )}

        {/* Locked section */}
        <div className="relative mt-5 overflow-hidden rounded-xl border border-border bg-surface-2 p-5">
          <div className="blur-sm select-none" aria-hidden>
            <p className="text-sm text-muted">
              Best-paying option: typical local pricing, who buys it, and exactly why it works in {report.city}…
              Marketing channels ranked for your area… 48-hour start plan… what to avoid…
            </p>
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-background/70 px-4 py-1.5 text-sm font-medium">
              🔒 Full report locked
            </span>
          </div>
        </div>
      </div>

      {/* Unlock CTA */}
      <div className="mt-6 rounded-2xl border border-accent/40 bg-surface p-7 text-center hero-bg">
        <h2 className="text-xl font-semibold">Unlock your full report</h2>
        <p className="mt-2 text-sm text-muted">
          The complete breakdown for {locationLabel} — opportunities, pricing, marketing plan,
          and a 48-hour start plan.
        </p>
        <p className="mt-4 text-4xl font-semibold gold-text">$4.99</p>
        <p className="text-xs text-muted">One-time payment · Instant access</p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn-gold mt-5 w-full rounded-xl px-6 py-3.5 text-lg"
        >
          {loading ? "Starting secure checkout…" : "Get My Report — $4.99"}
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <p className="mt-3 text-xs text-muted">
          Secure payment by Stripe · Market research only. No income is promised or implied.
        </p>
      </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
