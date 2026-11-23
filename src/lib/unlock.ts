import crypto from "node:crypto";

// Signs the "this visitor paid for ZIP X" proof stored in an httpOnly cookie.
// The browser can read the cookie exists but cannot forge a valid signature
// without UNLOCK_SECRET, so the /report paywall can't be bypassed from devtools.
// Read at request time so builds need no secret. No environment has a fallback.
function unlockSecret(): string {
  const secret = process.env.UNLOCK_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("UNLOCK_SECRET must contain at least 32 characters");
  }
  return secret;
}

export const UNLOCK_COOKIE = "ne_unlock";

function sign(zip: string): string {
  return crypto.createHmac("sha256", unlockSecret()).update(zip).digest("hex").slice(0, 32);
}

// One token per paid ZIP, e.g. "38103.<sig>".
export function tokenFor(zip: string): string {
  return `${zip}.${sign(zip)}`;
}

// The cookie holds space-separated tokens — one for every ZIP the visitor paid for.
export function parseUnlockedZips(cookieValue: string | undefined): string[] {
  if (!cookieValue) return [];
  const zips: string[] = [];
  for (const token of cookieValue.split(/[\s,]+/).filter(Boolean)) {
    const dot = token.lastIndexOf(".");
    if (dot < 1) continue;
    const zip = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    if (!/^\d{5}$/.test(zip) || !/^[a-f0-9]{32}$/.test(sig)) continue;
    const expected = sign(zip);
    if (
      sig.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      zips.push(zip);
    }
  }
  return zips;
}

export function isUnlocked(cookieValue: string | undefined, zip: string): boolean {
  return parseUnlockedZips(cookieValue).includes(zip);
}

// Adds a newly-paid ZIP to any existing cookie value (deduped).
export function addZipToCookie(cookieValue: string | undefined, zip: string): string {
  const zips = new Set(parseUnlockedZips(cookieValue));
  zips.add(zip);
  return Array.from(zips)
    .map(tokenFor)
    .join(" ");
}
