import { Stripe } from "stripe";
import { supabase } from "../../api/_lib/supabase";

// Use server-side secret in serverless context (support both env names)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});

// Map Stripe subscription status to our app's plan types
const mapSubscriptionStatus = (stripeStatus: string, priceId: string): string => {
  // If subscription is active or trialing, determine plan based on price ID
  if (stripeStatus === "active" || stripeStatus === "trialing") {
    const basicPriceId = import.meta.env.VITE_STRIPE_PRICE_BASIC;
    const premiumPriceId = import.meta.env.VITE_STRIPE_PRICE_PREMIUM;
    
    if (priceId === basicPriceId) {
      return "basic";
    } else if (priceId === premiumPriceId) {
      return "premium";
    }
  }
  
  // For canceled, incomplete, past_due, etc., return the raw status
  return stripeStatus;
};

const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  
  // Get user ID from customer metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.user_id;
  
  if (!userId) {
    console.error("No user_id found in customer metadata");
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  const mappedStatus = mapSubscriptionStatus(subscription.status, priceId);

  // Update user's subscription status in database
  const { error } = await supabase
    .from("users")
    .update({
      subscription_status: mappedStatus,
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      subscription_plan: priceId
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user subscription:", error);
  }
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  // Similar to created, but only update necessary fields
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.user_id;

  if (!userId) {
    console.error("No user_id found in customer metadata");
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  const mappedStatus = mapSubscriptionStatus(subscription.status, priceId);

  const { error } = await supabase
    .from("users")
    .update({
      subscription_status: mappedStatus,
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user subscription:", error);
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.user_id;

  if (!userId) {
    console.error("No user_id found in customer metadata");
    return;
  }

  const { error } = await supabase
    .from("users")
    .update({
      subscription_status: "canceled",
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user subscription:", error);
  }
};

export const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw error;
  }
};
