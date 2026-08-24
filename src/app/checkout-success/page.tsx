"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutSuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "error">("verifying");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.paid && data.zip) {
          // Payment confirmed by Stripe — verify-session set a signed httpOnly
          // cookie that unlocks /report for this ZIP. Keep zipcode for nav UX.
          localStorage.setItem("zipcode", data.zip);
          router.replace(`/report?zip=${encodeURIComponent(data.zip)}`);
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border text-2xl">
          !
        </div>
        <h1 className="mt-5 text-2xl font-semibold">We couldn&apos;t confirm your payment</h1>
        <p className="mt-2 text-muted">
          If you were charged, contact support and we&apos;ll sort it out right away. Otherwise you
          can try again.
        </p>
        <Link
          href="/report-preview"
          className="mt-6 rounded-xl bg-accent-strong px-6 py-3 font-semibold text-[#04120a] transition hover:brightness-110"
        >
          Back to checkout
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-strong text-2xl text-[#04120a]">
        ✓
      </div>
      <h1 className="mt-5 text-2xl font-semibold">Confirming your payment…</h1>
      <p className="mt-2 text-muted">One moment while we build your report.</p>
    </main>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-5">
          <p className="animate-pulse text-muted">Loading…</p>
        </main>
      }
    >
      <CheckoutSuccessInner />
    </Suspense>
  );
}
