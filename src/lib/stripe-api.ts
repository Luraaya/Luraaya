import { APIClient } from "./api-client";

export interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: "month" | "year";
  };
}

export class StripeAPI extends APIClient {
  // Proxy to server: create or update Stripe customer
  static async createOrUpdateCustomer(
    userId: string,
    email: string,
    paymentMethodId?: string
  ) {
    try {
      const res = await fetch(`/api/stripe?action=create-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, paymentMethodId }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Create checkout session

  // Create subscription (proxy if needed)
  static async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId: string
  ) {
    try {
      const res = await fetch(`/api/stripe?action=create-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, priceId, paymentMethodId }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Cancel subscription

  // Update subscription
  static async updateSubscription(subscriptionId: string, priceId: string) {
    try {
      const res = await fetch(`/api/stripe?action=update-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, priceId }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  // List all prices
  static async listPrices() {
    try {
      const res = await fetch(`/api/stripe?action=list-prices`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data?.data ?? data?.prices ?? data; // flexible
    } catch (error) {
      return super.handleError(error);
    }
  }

  // Get customer's subscription
  static async getCustomerSubscription(customerId: string) {
    try {
      const res = await fetch(`/api/stripe?action=get-subscription&customerId=${encodeURIComponent(customerId)}`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getSubscription(customerId: string) {
    try {
      const res = await fetch(`/api/stripe?action=get-subscription&customerId=${encodeURIComponent(customerId)}`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error: any) {
      return super.handleError(error);
    }
  }

  static async getBillingHistory(customerId: string) {
    try {
      const res = await fetch(`/api/stripe?action=list-invoices&customerId=${encodeURIComponent(customerId)}`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`/api/stripe?action=cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async createCheckoutSession(
    userId: string,
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      const res = await fetch(`/api/stripe?action=create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, customerId, priceId, successUrl, cancelUrl }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const res = await fetch(`/api/stripe?action=portal-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, returnUrl }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async getPaymentMethods(customerId: string) {
    try {
      const res = await fetch(`/api/stripe?action=list-payment-methods&customerId=${encodeURIComponent(customerId)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      return super.handleError(error);
    }
  }
}
