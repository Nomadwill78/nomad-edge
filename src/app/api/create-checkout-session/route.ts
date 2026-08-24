import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// Work out the site's base URL from the incoming request, so redirects work on
// localhost, Vercel preview, and production without hardcoding a domain.
function getBaseUrl(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3007";
}

export async function POST(request: Request) {
  try {
    const { zip } = await request.json().catch(() => ({ zip: "" }));
    const baseUrl = getBaseUrl(request);

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      // Carry the ZIP through so the success page can unlock the right report.
      metadata: { zip: String(zip ?? "") },
      // Pass the session id back so the success page can verify payment server-side.
      success_url: `${baseUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/report-preview`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
