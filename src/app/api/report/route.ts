import { NextResponse } from "next/server";
import { getFullReport, toTeaser } from "@/lib/reportEngine";

// Lightweight per-IP rate limit so nobody can spam random ZIPs and run up the
// AI generation bill. In-memory sliding window; resets on redeploy. Enough to
// stop casual abuse — a persistent limiter (Upstash) is the next step at scale.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_HITS = 25; // per IP per window
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

// Returns the preview-safe teaser for a ZIP. Generating the teaser warms the
// full-report cache server-side, so the paid /report page renders instantly
// after checkout. The full report is never exposed here — only the teaser.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = (searchParams.get("zip") || "").trim();

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  try {
    const report = await getFullReport(zip);
    return NextResponse.json(toTeaser(report));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
