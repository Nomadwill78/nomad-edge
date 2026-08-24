import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { UNLOCK_COOKIE, addZipToCookie } from "@/lib/unlock";

// Confirms with Stripe that a checkout session was actually paid.
// This is the server-side gate: the browser cannot fake a "paid" answer here,
// because we look the session up directly against Stripe. On a confirmed
// payment we also set a signed, httpOnly cookie that /report checks — so the
// unlock can't be forged from the browser.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ paid: false, error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const zip = (session.metadata?.zip as string) || "";

    const res = NextResponse.json({ paid, zip });

    if (paid && zip) {
      const existing = (await cookies()).get(UNLOCK_COOKIE)?.value;
      res.cookies.set(UNLOCK_COOKIE, addZipToCookie(existing, zip), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ paid: false, error: message }, { status: 500 });
  }
}
