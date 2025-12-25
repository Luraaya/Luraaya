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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async updateSubscription(subscriptionId: string, priceId: string) {
    try {
      const res = await fetch(`/api/stripe?action=update-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, priceId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async listPrices() {
    try {
      const res = await fetch(`/api/stripe?action=list-prices`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      return data?.data ?? data?.prices ?? data;
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async getSubscription(customerId: string) {
    try {
      const res = await fetch(
        `/api/stripe?action=get-subscription&customerId=${encodeURIComponent(customerId)}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async getBillingHistory(customerId: string) {
    try {
      const res = await fetch(
        `/api/stripe?action=list-invoices&customerId=${encodeURIComponent(customerId)}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async cancelSubscription(subscriptionId: string) {
    try {
      const res = await fetch(`/api/stripe?action=cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log("Stripe checkout response:", data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const res = await fetch(`/api/stripe?action=portal-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, returnUrl }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (error) {
      return super.handleError(error);
    }
  }

  static async getPaymentMethods(customerId: string) {
    try {
      const res = await fetch(
        `/api/stripe?action=list-payment-methods&customerId=${encodeURIComponent(customerId)}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      return super.handleError(error);
    }
  }
}
