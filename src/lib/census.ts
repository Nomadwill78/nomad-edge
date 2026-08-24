// Pulls real local data for a ZIP code from the U.S. Census Bureau's
// American Community Survey (ACS 5-year). Free public data; requires a free
// API key (CENSUS_API_KEY). This is the "real market intelligence" input —
// the generation layer turns these numbers into a tailored report.

// ACS variables we request, mapped to friendly names.
const ACS_VARS = {
  B01003_001E: "population",
  B19013_001E: "medianHouseholdIncome",
  B01002_001E: "medianAge",
  B25003_001E: "occupiedUnits",
  B25003_002E: "ownerOccupied",
  B25003_003E: "renterOccupied",
  B25077_001E: "medianHomeValue",
  B11003_001E: "families",
  B15003_022E: "bachelorsDegrees", // population 25+ with a bachelor's degree
  B15003_001E: "educationBase", // population 25+ (denominator)
  B23025_002E: "laborForce",
  B23025_005E: "unemployed",
} as const;

export type LocalData = {
  zip: string;
  name: string; // e.g. "ZCTA5 38103"
  population: number | null;
  medianHouseholdIncome: number | null;
  medianAge: number | null;
  ownerOccupiedPct: number | null; // % of occupied homes that are owner-occupied
  renterOccupiedPct: number | null;
  medianHomeValue: number | null;
  familyHouseholds: number | null;
  bachelorsPlusPct: number | null; // % of adults 25+ with a bachelor's+
  unemploymentPct: number | null;
};

// Census encodes "no data" / suppressed values as large negatives. Treat those
// (and non-numbers) as null so downstream logic never trusts a junk figure.
function num(v: string | null | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= -666666666) return null;
  return n;
}

function pct(part: number | null, whole: number | null): number | null {
  if (part == null || whole == null || whole <= 0) return null;
  return Math.round((part / whole) * 1000) / 10; // one decimal place
}

// Fetches ACS data for one ZIP (ZCTA). Returns null if the ZIP has no ACS
// record (some ZIPs aren't ZCTAs) or the request fails — callers fall back.
export async function fetchLocalData(zipRaw: string): Promise<LocalData | null> {
  const zip = (zipRaw || "").trim();
  if (!/^\d{5}$/.test(zip)) return null;

  const key = process.env.CENSUS_API_KEY;
  if (!key) {
    throw new Error("CENSUS_API_KEY is not set. Get a free key at https://api.census.gov/data/key_signup.html");
  }

  const vars = Object.keys(ACS_VARS);
  const url =
    `https://api.census.gov/data/2022/acs/acs5?get=NAME,${vars.join(",")}` +
    `&for=zip%20code%20tabulation%20area:${zip}&key=${key}`;

  let rows: string[][];
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null; // 204/404 → ZIP not a ZCTA, or bad request
    rows = (await res.json()) as string[][];
  } catch {
    return null;
  }

  if (!Array.isArray(rows) || rows.length < 2) return null;

  // rows[0] is the header; rows[1] is our ZIP's data. Build a name→value map.
  const header = rows[0];
  const values = rows[1];
  const raw: Record<string, string> = {};
  header.forEach((h, i) => (raw[h] = values[i]));

  const ownerOcc = num(raw.B25003_002E);
  const renterOcc = num(raw.B25003_003E);
  const occupied = num(raw.B25003_001E);
  const bachelors = num(raw.B15003_022E);
  const eduBase = num(raw.B15003_001E);
  const labor = num(raw.B23025_002E);
  const unemployed = num(raw.B23025_005E);

  return {
    zip,
    name: raw.NAME || `ZCTA5 ${zip}`,
    population: num(raw.B01003_001E),
    medianHouseholdIncome: num(raw.B19013_001E),
    medianAge: num(raw.B01002_001E),
    ownerOccupiedPct: pct(ownerOcc, occupied),
    renterOccupiedPct: pct(renterOcc, occupied),
    medianHomeValue: num(raw.B25077_001E),
    familyHouseholds: num(raw.B11003_001E),
    bachelorsPlusPct: pct(bachelors, eduBase),
    unemploymentPct: pct(unemployed, labor),
  };
}
