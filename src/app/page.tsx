"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

function ZipForm({ id }: { id: string }) {
  const [zip, setZip] = useState("");
  const router = useRouter();
  const valid = /^\d{5}$/.test(zip);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    localStorage.setItem("zipcode", zip);
    router.push("/report-preview");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter your ZIP code"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-center text-lg tracking-widest outline-none transition focus:border-accent sm:text-left"
          aria-label="ZIP code"
        />
        <button type="submit" disabled={!valid} className="btn-gold rounded-xl px-6 py-3.5 text-lg">
          Get My Report →
        </button>
      </div>
    </form>
  );
}

const FEATURES: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "Local Opportunities",
    body: "Real services people in your area already pay for.",
    icon: (
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Demand + Competition",
    body: "A clear read on what's worth doing — and what to skip.",
    icon: (
      <path d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Marketing Game Plan",
    body: "Exactly where and how to find your first local customers.",
    icon: (
      <path d="M3 11l18-7-7 18-2.5-8.5L3 11z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "48-Hour Start Plan",
    body: "Concrete steps to get moving right away.",
    icon: (
      <path d="M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="hero-bg">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
            <img
              src="/nomad-logo.jpg"
              alt="Nomad Consulting"
              width={72}
              height={72}
              className="mx-auto mb-6 h-18 w-18 rounded-2xl ring-1 ring-border"
              style={{ height: 72, width: 72 }}
            />
            <p className="mb-4 inline-block rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium tracking-[0.15em] text-accent">
              LOCAL MARKET INTELLIGENCE
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Find the money <span className="gold-text">already moving</span> in your ZIP code
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
              A focused local market report: real service opportunities, demand and competition,
              and a concrete plan to land your first customers — built for your exact area.
            </p>

            <div className="mt-8">
              <ZipForm id="zip-hero" />
              <p className="mt-3 text-sm text-muted">
                ✔ Takes 10 seconds&nbsp;&nbsp;·&nbsp;&nbsp;✔ Instant access&nbsp;&nbsp;·&nbsp;&nbsp;✔ One-time $4.99 — no subscription
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-5">
          {/* Why this helps */}
          <section className="card p-7 sm:p-9">
            <h2 className="text-xl font-semibold">Stop guessing. Start with a real read.</h2>
            <p className="mt-2 text-muted">Most people get stuck on the same three questions:</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                "What kind of service should I start?",
                "Is there actually demand for it here?",
                "Where do I find my first customers?",
              ].map((q, i) => (
                <div key={q} className="rounded-xl border border-border bg-surface/60 p-4">
                  <span className="gold-text text-lg font-semibold">0{i + 1}</span>
                  <p className="mt-1 text-sm">{q}</p>
                </div>
              ))}
            </div>
            <p className="mt-5">
              Your report answers all three — grounded in your specific location, not generic advice.
            </p>
          </section>

          {/* What you get */}
          <section className="mt-8">
            <h2 className="text-center text-2xl font-semibold">What&apos;s inside your report</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="card card-hover flex gap-4 p-6">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-border bg-surface-2 text-accent">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      {f.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Who it's for */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <h3 className="font-semibold text-accent">Who this is for</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                <li>✓ People who want to earn extra income locally</li>
                <li>✓ Anyone stuck on &ldquo;what should I start?&rdquo;</li>
                <li>✓ New movers learning their area</li>
                <li>✓ Action-takers who want a local edge</li>
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold">Who it&apos;s not for</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                <li>✗ People chasing get-rich-quick schemes</li>
                <li>✗ People who won&apos;t take action on a plan</li>
              </ul>
            </div>
          </section>

          {/* Honest note */}
          <section className="mt-8 rounded-2xl border border-border bg-surface-2 p-7">
            <h2 className="text-lg font-semibold">A straight note on results</h2>
            <p className="mt-2 text-sm text-muted">
              This is market research, not a guarantee. It points you toward real, local
              opportunities and a plan to pursue them — but what you earn depends on the effort and
              consistency you put in. No income is promised or implied.
            </p>
          </section>

          {/* Final CTA */}
          <section className="mt-12 overflow-hidden rounded-2xl border border-border hero-bg p-9 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              See what&apos;s <span className="gold-text">waiting in your area</span>
            </h2>
            <p className="mt-2 text-muted">Enter your ZIP code and get your custom plan now.</p>
            <div className="mt-6">
              <ZipForm id="zip-footer" />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
