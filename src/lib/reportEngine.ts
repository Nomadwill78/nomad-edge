// Orchestrates report generation for any ZIP:
//   1. Curated ZIPs (hand-written, best quality) → served directly.
//   2. Any other ZIP → real Census data → AI-generated report, cached.
//   3. Census miss or any failure → honest generic fallback.
// Always returns a Report; never throws.

import { getReport, hasCuratedReport, type Report } from "@/data/reports";
import { fetchLocalData } from "./census";
import { generateReport } from "./generateReport";

// In-memory cache so a preview + the paid report for the same ZIP (and repeat
// visitors) don't each pay for a fresh AI generation. Resets on redeploy /
// cold start — a persistent store (Supabase/KV) is the next optimization.
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const cache = new Map<string, { report: Report; at: number }>();

export async function getFullReport(zipRaw: string): Promise<Report> {
  const zip = (zipRaw || "").trim();

  // 1. Curated ZIPs win — hand-written and free.
  if (hasCuratedReport(zip)) return getReport(zip);

  // 2. Cache hit.
  const hit = cache.get(zip);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.report;

  // 3. Real data → AI report.
  try {
    const data = await fetchLocalData(zip);
    if (data && data.population && data.population > 0) {
      const report = await generateReport(data);
      cache.set(zip, { report, at: Date.now() });
      return report;
    }
  } catch (err) {
    console.error(`Report generation failed for ${zip}:`, err instanceof Error ? err.message : err);
  }

  // 4. Fallback (getReport returns the generic report for uncurated ZIPs).
  return getReport(zip);
}

// The public-safe subset shown on the preview page BEFORE payment. The full
// report (pricing details, marketing plan, 48-hour plan) stays server-side.
export type ReportTeaser = {
  zip: string;
  city: string;
  state: string;
  areaType: string;
  snapshot: string;
  marketDemand: Report["marketDemand"];
  competition: Report["competition"];
  opportunities: { name: string; demand: string }[];
};

export function toTeaser(r: Report): ReportTeaser {
  return {
    zip: r.zip,
    city: r.city,
    state: r.state,
    areaType: r.areaType,
    snapshot: r.snapshot,
    marketDemand: r.marketDemand,
    competition: r.competition,
    opportunities: r.opportunities.map((o) => ({ name: o.name, demand: o.demand })),
  };
}
