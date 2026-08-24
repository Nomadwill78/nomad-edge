import Stripe from "stripe";

// Lazy singleton: the Stripe client is only created (and the key only required)
// when a request actually needs it — so a missing key never breaks the build.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set. Add it in your environment variables.");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}
