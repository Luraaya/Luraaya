import Stripe from "stripe";
import { supabase } from "../../api/_lib/supabase";

// Server-only: NEVER use VITE_ secrets on server
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
if (!STRIPE_SECRET_KEY) {
  // Fail fast in server logs; handler will throw when used
  console.error("STRIPE_SECRET_KEY missing (server-side).");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

type PriceMapRow = {
  stripe_price_id: string;
  plan_tier: string;
  active: boolean;
};

const toIsoFromUnixSeconds = (s?: number | null): string | null => {
  if (!s) return null;
  return new Date(s * 1000).toISOString();
};

const getUserIdFromEvent = (event: Stripe.Event): string | null => {
  const anyObj: any = event?.data?.object as any;
  const metaUser = anyObj?.metadata?.user_id;
  if (metaUser) return String(metaUser);

  // Some events may not carry metadata; try customer metadata as fallback
  const customerId = anyObj?.customer;
  if (!customerId || typeof customerId !== "string") return null;
  // Fallback resolution needs async call; handled in resolver below
  return null;
};

const resolveUserId = async (event: Stripe.Event): Promise<string | null> => {
  const anyObj: any = event?.data?.object as any;

  // 1) direct metadata on event object
  const metaUser = anyObj?.metadata?.user_id;
  if (metaUser) return String(metaUser);

  // 2) customer metadata (we set it in create-customer)
  const customerId = anyObj?.customer;
  if (customerId && typeof customerId === "string") {
    try {
      const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
      const uid = customer?.metadata?.user_id;
      if (uid) return String(uid);
    } catch {
      // ignore, handled by null return
    }
  }

  return null;
};

const extractPriceId = (event: Stripe.Event): string | null => {
  const obj: any = event?.data?.object as any;

  // subscription events
  if (obj?.items?.data?.[0]?.price?.id) return String(obj.items.data[0].price.id);

  // checkout.session.completed: use line_items if expanded (often not), otherwise use subscription lookup later
  if (obj?.mode === "subscription" && obj?.subscription) {
    // price id will be resolved from subscription retrieve in handler
    return null;
  }

  // invoice events: invoice lines
  if (obj?.lines?.data?.[0]?.price?.id) return String(obj.lines.data[0].price.id);

  return null;
};

const extractSubscriptionId = (event: Stripe.Event): string | null => {
  const obj: any = event?.data?.object as any;
  if (obj?.id && typeof obj.id === "string" && obj.object === "subscription") return obj.id;
  if (obj?.subscription && typeof obj.subscription === "string") return obj.subscription;
  return null;
};

const extractCustomerId = (event: Stripe.Event): string | null => {
  const obj: any = event?.data?.object as any;
  const c = obj?.customer;
  return c && typeof c === "string" ? c : null;
};

const loadPlanTierFromDb = async (stripePriceId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("stripe_price_map")
    .select("stripe_price_id, plan_tier, active")
    .eq("stripe_price_id", stripePriceId)
    .eq("active", true)
    .maybeSingle();

  if (error) return null;
  const row = data as PriceMapRow | null;
  if (!row?.plan_tier) return null;
  return String(row.plan_tier);
};

const upsertSubscription = async (args: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  status: string;
  planTier: string;
  currentPeriodEndIso: string | null;
  cancelAtPeriodEnd: boolean;
}) => {
  const {
    userId,
    stripeCustomerId,
    stripeSubscriptionId,
    status,
    planTier,
    currentPeriodEndIso,
    cancelAtPeriodEnd,
  } = args;

  const { error } = await supabase.from("subscription").upsert(
    {
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      status,
      plan_tier: planTier,
      current_period_end: currentPeriodEndIso,
      cancel_at_period_end: cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
      // trial_used is not touched here
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
};

const markStripeEvent = async (args: {
  eventId: string;
  processStatus: "processed" | "failed";
  error?: string | null;
}) => {
  const { eventId, processStatus, error } = args;

  await supabase
    .from("stripe_event")
    .update({
      process_status: processStatus,
      processed_at: new Date().toISOString(),
      error: error || null,
    })
    .eq("event_id", eventId);
};

const insertStripeEventIdempotent = async (event: Stripe.Event): Promise<"inserted" | "duplicate"> => {
  const payload = event as any;

  const { error } = await supabase.from("stripe_event").insert({
    event_id: event.id,
    type: event.type,
    payload,
    process_status: "received",
  });

  if (!error) return "inserted";

  // Duplicate primary key => already processed or in-flight
  const msg = String((error as any)?.message || "");
  if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already exists")) {
    return "duplicate";
  }

  // Unknown insert error
  throw error;
};

const deriveStatusFromEvent = (event: Stripe.Event, currentStripeStatus?: string | null): string | null => {
  if (event.type === "invoice.payment_failed") return "past_due";
  if (event.type === "invoice.paid") return "active";
  if (event.type === "customer.subscription.deleted") return "canceled";

  // For subscription events, prefer Stripe status on the object
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    return currentStripeStatus ? String(currentStripeStatus) : null;
  }

  if (event.type === "checkout.session.completed") {
    // checkout session itself doesn't have definitive subscription status, subscription retrieve will provide it
    return currentStripeStatus ? String(currentStripeStatus) : null;
  }

  return null;
};

export const handleStripeWebhook = async (event: Stripe.Event) => {
  // 1) idempotent audit insert
  const ins = await insertStripeEventIdempotent(event);
  if (ins === "duplicate") return;

  try {
    // 2) resolve user_id (metadata or customer metadata)
    const userId = await resolveUserId(event);
    if (!userId) {
      await markStripeEvent({ eventId: event.id, processStatus: "failed", error: "missing user_id" });
      return;
    }

    const stripeCustomerId = extractCustomerId(event);
    if (!stripeCustomerId) {
      await markStripeEvent({ eventId: event.id, processStatus: "failed", error: "missing customer_id" });
      return;
    }

    // 3) resolve subscription + price id
    const subscriptionId = extractSubscriptionId(event);

    let stripeStatus: string | null = null;
    let cancelAtPeriodEnd = false;
    let currentPeriodEndIso: string | null = null;
    let priceId: string | null = extractPriceId(event);

    // For cases where we need to retrieve subscription (checkout.session.completed, some invoice events)
    if ((!priceId || !stripeStatus || !currentPeriodEndIso) && subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        stripeStatus = String(sub.status);
        cancelAtPeriodEnd = Boolean(sub.cancel_at_period_end);
        currentPeriodEndIso = toIsoFromUnixSeconds(sub.current_period_end);
        if (!priceId && sub.items?.data?.[0]?.price?.id) priceId = String(sub.items.data[0].price.id);
      } catch {
        // keep nulls; handled below
      }
    }

    // For subscription events, status and period exist on object itself
    const obj: any = event?.data?.object as any;
    if (!stripeStatus && (obj?.status || obj?.current_period_end)) {
      if (obj?.status) stripeStatus = String(obj.status);
      if (typeof obj?.cancel_at_period_end === "boolean") cancelAtPeriodEnd = obj.cancel_at_period_end;
      if (obj?.current_period_end) currentPeriodEndIso = toIsoFromUnixSeconds(obj.current_period_end);
      if (!priceId && obj?.items?.data?.[0]?.price?.id) priceId = String(obj.items.data[0].price.id);
    }

    if (!priceId) {
      await markStripeEvent({ eventId: event.id, processStatus: "failed", error: "missing price_id" });
      return;
    }

    // 4) plan_tier mapping (fail-closed)
    const planTier = await loadPlanTierFromDb(priceId);
    if (!planTier) {
      await markStripeEvent({
        eventId: event.id,
        processStatus: "failed",
        error: `no active price mapping for ${priceId}`,
      });
      return;
    }

    // 5) status derivation (payment_failed has priority by type)
    const status = deriveStatusFromEvent(event, stripeStatus);
    if (!status) {
      await markStripeEvent({ eventId: event.id, processStatus: "failed", error: "unable to derive status" });
      return;
    }

    // 6) upsert subscription (only writes subscription)
    await upsertSubscription({
      userId,
      stripeCustomerId,
      stripeSubscriptionId: subscriptionId,
      status,
      planTier,
      currentPeriodEndIso,
      cancelAtPeriodEnd,
    });

    // 7) mark event processed
    await markStripeEvent({ eventId: event.id, processStatus: "processed" });
  } catch (e: any) {
    await markStripeEvent({ eventId: event.id, processStatus: "failed", error: e?.message || "unknown error" });
    throw e;
  }
};
