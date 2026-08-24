// Turns real Census data for a ZIP into a tailored market report using Claude.
// The model reads the actual local numbers and selects service businesses that
// fit THIS area, with a concrete how-to-start plan for each. Honest framing:
// "data-informed recommendations", never income promises.

import type { LocalData } from "./census";
import type { Report } from "@/data/reports";

const MODEL = "claude-opus-5";

// JSON schema mirroring the Report type (minus zip, which we set ourselves).
// Structured outputs guarantee the model returns exactly this shape.
const REPORT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    city: { type: "string" },
    state: { type: "string" },
    areaType: { type: "string" },
    snapshot: { type: "string" },
    summary: { type: "string" },
    opportunities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          priceRange: { type: "string" },
          demand: { type: "string", enum: ["High", "Medium", "Low"] },
          customers: { type: "string" },
          whyHere: { type: "string" },
        },
        required: ["name", "priceRange", "demand", "customers", "whyHere"],
      },
    },
    marketDemand: { type: "string", enum: ["High", "Medium", "Low"] },
    competition: { type: "string", enum: ["High", "Medium", "Low"] },
    keyInsight: { type: "string" },
    channels: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          why: { type: "string" },
          firstAction: { type: "string" },
        },
        required: ["name", "why", "firstAction"],
      },
    },
    quickStart: {
      type: "object",
      additionalProperties: false,
      properties: {
        day1: { type: "array", items: { type: "string" } },
        day2: { type: "array", items: { type: "string" } },
      },
      required: ["day1", "day2"],
    },
    avoid: { type: "array", items: { type: "string" } },
    edge: { type: "string" },
  },
  required: [
    "city", "state", "areaType", "snapshot", "summary", "opportunities",
    "marketDemand", "competition", "keyInsight", "channels", "quickStart",
    "avoid", "edge",
  ],
} as const;

function dollars(n: number | null): string {
  return n == null ? "unknown" : `$${n.toLocaleString()}`;
}

function buildPrompt(data: LocalData): string {
  return `You are a local market analyst producing a report for someone who wants to start a small local service business in ZIP code ${data.zip}.

Here is the REAL U.S. Census (ACS 5-year) data for this ZIP:
- Population: ${data.population?.toLocaleString() ?? "unknown"}
- Median household income: ${dollars(data.medianHouseholdIncome)}
- Median age: ${data.medianAge ?? "unknown"}
- Homeowners: ${data.ownerOccupiedPct ?? "unknown"}% | Renters: ${data.renterOccupiedPct ?? "unknown"}%
- Median home value: ${dollars(data.medianHomeValue)}
- Adults with a bachelor's degree or higher: ${data.bachelorsPlusPct ?? "unknown"}%
- Unemployment rate: ${data.unemploymentPct ?? "unknown"}%

Using THIS specific data, select exactly 3 realistic local SERVICE businesses that genuinely fit this area, and build a report. Ground every choice in the numbers above (e.g. lots of renters → move-out cleaning; high income + older residents → home services / senior help; families → pet care, tutoring; high home values → premium detailing / landscaping).

Rules:
- Base "marketDemand" and "competition" on the data, honestly. Not every area is "High".
- "priceRange" = typical local rates customers PAY for that service (e.g. "$110-$260 per job"). This is market pricing, NOT a promise of the reader's income.
- In "whyHere" and "keyInsight", reference the actual local characteristics (income, renters, age, education) so it's clearly specific to this ZIP.
- "opportunities": exactly 3. "channels": exactly 3 marketing channels with a concrete first action each. "quickStart": 3 items in day1 and 3 in day2. "avoid": 2 items.
- "areaType" = a short label like "Urban / Downtown", "Suburban / Family", "Rural", "Affluent Suburb", "Coastal / Tourist".
- "city" and "state": your best inference of the city and 2-letter state for ZIP ${data.zip}. If genuinely unsure, use empty strings.
- Tone: practical, encouraging, honest. Never promise income or earnings. This is market research only.`;
}

// Calls Claude to generate a Report from local data. Throws on API failure so
// the engine can fall back to the generic report rather than serving garbage.
export async function generateReport(data: LocalData): Promise<Report> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      thinking: { type: "disabled" },
      output_config: { format: { type: "json_schema", schema: REPORT_SCHEMA }, effort: "medium" },
      messages: [{ role: "user", content: buildPrompt(data) }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  const text: string = (json.content || []).find((b: { type: string }) => b.type === "text")?.text;
  if (!text) throw new Error("No text in Anthropic response");

  const parsed = JSON.parse(text) as Omit<Report, "zip">;
  return { ...parsed, zip: data.zip };
}
