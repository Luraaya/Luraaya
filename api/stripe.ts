  import Stripe from 'stripe';
  import { supabase } from './_lib/supabase.js';

  // Support both env names
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY || '';
  const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2025-08-27.basil' });

  export default async function handler(req: any, res: any) {
    try {
      if (!STRIPE_KEY) {
        return res.status(500).json({ error: 'Stripe secret key missing. Set STRIPE_SECRET_KEY in your environment.' });
      }

      const { pathname } = new URL(req.url || '', 'http://localhost');
      // Note: with rewrite to /api/stripe, we can route on ?action= or subpath
      const action = (req.query?.action as string) || pathname?.split('/').pop();
      
      console.log(`Stripe API: ${req.method} ${action}`);

      const body = safeBody(req);

      switch (action) {
        case 'create-customer': {
          if (req.method !== 'POST') return method(res, 'POST');
          const { userId, email, paymentMethodId } = body as any;
          if (!userId || !email) return res.status(400).json({ error: 'userId and email are required' });
          
          let customerId: string | undefined = undefined;
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('stripe_customer_id')
              .eq('id', userId)
              .maybeSingle();
            if (!profileError) customerId = profile?.stripe_customer_id;
          } catch (dbErr) {
            console.warn('Supabase not available or misconfigured; proceeding without DB read');
          }

          if (customerId) {
            // Always ensure we persist user_id on the Stripe customer metadata
            const customer = await stripe.customers.update(customerId, { 
              email, 
              metadata: { user_id: userId },
              ...(paymentMethodId && { source: paymentMethodId }) 
            });
            return res.status(200).json(customer);
          }

          // Try to find an existing customer by email to avoid duplicates
          let customer = undefined as any;
          try {
            const search = await stripe.customers.search({ query: `email:'${email}'` });
            customer = search.data?.[0];
          } catch (e) {
            // Search might not be enabled; ignore
          }
          if (!customer) {
            customer = await stripe.customers.create({ email, metadata: { user_id: userId }, ...(paymentMethodId && { source: paymentMethodId }) });
          } else {
            // If found an existing customer by email, ensure metadata carries user_id
            if (!customer.metadata || !(customer.metadata as any).user_id) {
              customer = await stripe.customers.update(customer.id, { metadata: { user_id: userId } });
            }
          }

          // Best-effort DB update (optional)
          try {
            await supabase.from('users').update({ stripe_customer_id: customer.id }).eq('id', userId);
          } catch (e) {
            console.warn('Supabase update failed; continuing:', (e as any)?.message || e);
          }
          return res.status(200).json(customer);
        }
        case 'create-checkout-session': {
          if (req.method !== 'POST') return method(res, 'POST');
          const { userId, customerId, priceId, successUrl, cancelUrl } = body as any;
          if (!userId || !customerId || !priceId || !successUrl || !cancelUrl) return res.status(400).json({ error: 'Missing required fields' });
          console.log('Creating checkout session:', { userId, customerId, priceId });
          const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            subscription_data: {
              //trial_period_days: 7,
              metadata: { user_id: userId }
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { user_id: userId },
          });
          console.log('Checkout session created:', { sessionId: session.id });
          return res.status(200).json(session);
        }
        case 'create-subscription': {
          if (req.method !== 'POST') return method(res, 'POST');
    const { customerId, priceId, paymentMethodId } = body as any;
          if (!customerId || !priceId || !paymentMethodId) return res.status(400).json({ error: 'customerId, priceId, paymentMethodId required' });
          await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
          await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
          const subscription = await stripe.subscriptions.create({ customer: customerId, items: [{ price: priceId }], expand: ['latest_invoice.payment_intent'] });
          return res.status(200).json(subscription);
        }
        case 'update-subscription': {
          if (req.method !== 'POST') return method(res, 'POST');
    const { subscriptionId, priceId } = body as any;
          if (!subscriptionId || !priceId) return res.status(400).json({ error: 'subscriptionId and priceId are required' });
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const updated = await stripe.subscriptions.update(subscriptionId, { items: [{ id: subscription.items.data[0].id, price: priceId }] });
          return res.status(200).json(updated);
        }
        case 'get-subscription': {
          if (req.method !== 'GET') return method(res, 'GET');
          const customerId = req.query.customerId as string;
          if (!customerId) return res.status(400).json({ error: 'customerId is required' });
          try {
            const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'active', expand: ['data.plan'] });
            return res.status(200).json(subs.data[0] || null);
          } catch (e: any) {
            if (e.code === 'resource_missing') return res.status(200).json(null);
            throw e;
          }
        }
        case 'list-payment-methods': {
          if (req.method !== 'GET') return method(res, 'GET');
          const customerId = req.query.customerId as string;
          if (!customerId) return res.status(400).json({ error: 'customerId is required' });
          const methods = await stripe.paymentMethods.list({ customer: customerId, type: 'card' });
          return res.status(200).json(methods.data);
        }
        case 'list-prices': {
          if (req.method !== 'GET') return method(res, 'GET');
          const prices = await stripe.prices.list({ active: true, expand: ['data.product'] });
          return res.status(200).json(prices);
        }
        case 'list-invoices': {
          if (req.method !== 'GET') return method(res, 'GET');
          const customerId = req.query.customerId as string;
          if (!customerId) return res.status(400).json({ error: 'customerId is required' });
          const invoices = await stripe.invoices.list({ customer: customerId, limit: 12 });
          return res.status(200).json(invoices.data);
        }
        case 'cancel-subscription': {
          if (req.method !== 'POST') return method(res, 'POST');
    const { subscriptionId } = body as any;
          if (!subscriptionId) return res.status(400).json({ error: 'subscriptionId is required' });
          const canceled = await stripe.subscriptions.cancel(subscriptionId);
          return res.status(200).json(canceled);
        }
        case 'portal-session': {
          if (req.method !== 'POST') return method(res, 'POST');
    const { customerId, returnUrl } = body as any;
          if (!customerId || !returnUrl) return res.status(400).json({ error: 'customerId and returnUrl are required' });
          const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
          return res.status(200).json(session);
        }
        default:
          return res.status(404).json({ error: 'Unknown action', action });
      }
    } catch (e: any) {
      console.error('stripe api error:', e);
      console.error('Request details:', { method: req.method, url: req.url, body: safeBody(req), query: req.query });
      return res.status(500).json({ 
        error: e?.message || 'Internal error', 
        code: e?.code,
        type: e?.type 
      });
    }
  }

  function method(res: any, m: string) {
    res.setHeader('Allow', m);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  function safeBody(req: any) {
    if (!req || typeof req.body === 'undefined' || req.body === null) return {};
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { return {}; }
    }
    return req.body;
  }
