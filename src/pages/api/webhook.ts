import Stripe from "stripe";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";

import { handleStripeWebhook } from "../../lib/stripe-webhook";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

if (!STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY missing (server-side).");
}
if (!STRIPE_WEBHOOK_SECRET) {
  console.error("STRIPE_WEBHOOK_SECRET missing (server-side).");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Webhook signature missing");
  }
  if (!STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send("Webhook secret missing");
  }

  let event: Stripe.Event;

  try {
    const raw = await buffer(req);
    event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    const msg = err?.message || "Unknown";
    console.error("Stripe webhook signature verification failed:", msg);
    return res.status(400).send(`Webhook Error: ${msg}`);
  }

  try {
    await handleStripeWebhook(event);
    return res.status(200).json({ received: true });
  } catch (err: any) {
    const msg = err?.message || "Unknown";
    console.error("Stripe webhook handler failed:", msg);
    return res.status(500).json({ error: msg });
  }
}

// Required for Stripe signature verification (raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};
