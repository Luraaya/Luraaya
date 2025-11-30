// Using loose types for compatibility on Vercel without adding @vercel/node types
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// Resolve env with fallbacks for Vercel where VITE_ may have been used
const ENV = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || process.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  PRICE_IDS: {
    BASIC_DAILY_MONTHLY: process.env.STRIPE_PRICE_BASIC_DAILY_MONTHLY || process.env.VITE_STRIPE_PRICE_BASIC_DAILY_MONTHLY,
    BASIC_DAILY_YEARLY: process.env.STRIPE_PRICE_BASIC_DAILY_YEARLY || process.env.VITE_STRIPE_PRICE_BASIC_DAILY_YEARLY,
    BASIC_WEEKLY_MONTHLY: process.env.STRIPE_PRICE_BASIC_WEEKLY_MONTHLY || process.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_MONTHLY,
    BASIC_WEEKLY_YEARLY: process.env.STRIPE_PRICE_BASIC_WEEKLY_YEARLY || process.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_YEARLY,
    BASIC_MONTHLY_MONTHLY: process.env.STRIPE_PRICE_BASIC_MONTHLY_MONTHLY || process.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_MONTHLY,
    BASIC_MONTHLY_YEARLY: process.env.STRIPE_PRICE_BASIC_MONTHLY_YEARLY || process.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_YEARLY,
    PREMIUM_DAILY_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_DAILY_MONTHLY || process.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_MONTHLY,
    PREMIUM_DAILY_YEARLY: process.env.STRIPE_PRICE_PREMIUM_DAILY_YEARLY || process.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_YEARLY,
    PREMIUM_WEEKLY_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_WEEKLY_MONTHLY || process.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_MONTHLY,
    PREMIUM_WEEKLY_YEARLY: process.env.STRIPE_PRICE_PREMIUM_WEEKLY_YEARLY || process.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_YEARLY,
    PREMIUM_MONTHLY_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_MONTHLY || process.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_MONTHLY,
    PREMIUM_MONTHLY_YEARLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_YEARLY || process.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_YEARLY,
  },
};

// Stripe client
const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

// Supabase client (service role if available for server-side updates)
let supabase: ReturnType<typeof createClient> | null = null;
if (!ENV.SUPABASE_URL) {
  console.error('Config error: SUPABASE_URL is missing (set SUPABASE_URL or VITE_SUPABASE_URL)');
} else if (!(ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY)) {
  console.error('Config error: SUPABASE key missing (set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)');
} else {
  supabase = createClient(
    ENV.SUPABASE_URL as string,
    (ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY) as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SendGrid
const hasSendGrid = !!process.env.SENDGRID_API_KEY;
if (hasSendGrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
}

// Twilio (optional)
// Support either classic Auth Token auth or API Key (SK...) auth
const hasTwilioByAuthToken = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN;
const hasTwilioByApiKey = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_API_KEY_SID && !!process.env.TWILIO_API_KEY_SECRET;
const hasTwilio = hasTwilioByAuthToken || hasTwilioByApiKey;
const twilioClient = hasTwilio
  ? (hasTwilioByApiKey
      // When using API Keys, pass the AC... Account SID via options
      ? twilio(
          process.env.TWILIO_API_KEY_SID as string,
          process.env.TWILIO_API_KEY_SECRET as string,
          { accountSid: process.env.TWILIO_ACCOUNT_SID as string }
        )
      : twilio(
          process.env.TWILIO_ACCOUNT_SID as string,
          process.env.TWILIO_AUTH_TOKEN as string
        ))
  : null;

function mapSubscriptionStatus(stripeStatus?: string, priceId?: string | null) {
  if (stripeStatus === 'active' || stripeStatus === 'trialing') {
    const basicPriceIds = [
      ENV.PRICE_IDS.BASIC_DAILY_MONTHLY,
      ENV.PRICE_IDS.BASIC_DAILY_YEARLY,
      ENV.PRICE_IDS.BASIC_WEEKLY_MONTHLY,
      ENV.PRICE_IDS.BASIC_WEEKLY_YEARLY,
      ENV.PRICE_IDS.BASIC_MONTHLY_MONTHLY,
      ENV.PRICE_IDS.BASIC_MONTHLY_YEARLY,
    ].filter(Boolean) as string[];

    const premiumPriceIds = [
      ENV.PRICE_IDS.PREMIUM_DAILY_MONTHLY,
      ENV.PRICE_IDS.PREMIUM_DAILY_YEARLY,
      ENV.PRICE_IDS.PREMIUM_WEEKLY_MONTHLY,
      ENV.PRICE_IDS.PREMIUM_WEEKLY_YEARLY,
      ENV.PRICE_IDS.PREMIUM_MONTHLY_MONTHLY,
      ENV.PRICE_IDS.PREMIUM_MONTHLY_YEARLY,
    ].filter(Boolean) as string[];

    if (priceId && basicPriceIds.includes(priceId)) return 'basic';
    if (priceId && premiumPriceIds.includes(priceId)) return 'premium';
  }
  return stripeStatus || 'incomplete';
}

function mapPriceIdToSubscriptionType(priceId?: string | null): string {
  if (!priceId) return 'daily';
  
  const dailyPriceIds = [
    ENV.PRICE_IDS.BASIC_DAILY_MONTHLY,
    ENV.PRICE_IDS.BASIC_DAILY_YEARLY,
    ENV.PRICE_IDS.PREMIUM_DAILY_MONTHLY,
    ENV.PRICE_IDS.PREMIUM_DAILY_YEARLY,
  ].filter(Boolean) as string[];

  const weeklyPriceIds = [
    ENV.PRICE_IDS.BASIC_WEEKLY_MONTHLY,
    ENV.PRICE_IDS.BASIC_WEEKLY_YEARLY,
    ENV.PRICE_IDS.PREMIUM_WEEKLY_MONTHLY,
    ENV.PRICE_IDS.PREMIUM_WEEKLY_YEARLY,
  ].filter(Boolean) as string[];

  const monthlyPriceIds = [
    ENV.PRICE_IDS.BASIC_MONTHLY_MONTHLY,
    ENV.PRICE_IDS.BASIC_MONTHLY_YEARLY,
    ENV.PRICE_IDS.PREMIUM_MONTHLY_MONTHLY,
    ENV.PRICE_IDS.PREMIUM_MONTHLY_YEARLY,
  ].filter(Boolean) as string[];

  if (dailyPriceIds.includes(priceId)) return 'daily';
  if (weeklyPriceIds.includes(priceId)) return 'weekly';
  if (monthlyPriceIds.includes(priceId)) return 'monthly';
  
  return 'daily'; // default fallback
}

function mapSubscriptionTypeToMessageType(subscriptionType?: string | null) {
  switch ((subscriptionType || '').toLowerCase()) {
    case 'weekly':
      return 'weekly_forecast';
    case 'monthly':
      return 'monthly_reading';
    default:
      return 'daily_horoscope';
  }
}

function buildHoroscopePrompt(user: any) {
  const name = (user?.fullname?.split(' ')[0] || 'Celestial Voyager') as string;
  const currentDate = new Date().toISOString().split('T')[0];
  const placeholders: Record<string, string> = {
    '{{Vorname}}': name,
    '{{Geschlecht}}': user?.sex || 'not specified',
    '{{Geburtsdatum}}': user?.dateOfBirth || 'not specified',
    '{{Geburtszeit}}': user?.timeOfBirth || 'not specified',
    '{{Geburtsort}}': user?.placeOfBirth || 'not specified',
    '{{Frequenz}}': user?.subscriptionType || 'daily',
    '{{Sprache}}': user?.language || 'en',
    '{{Datum}}': currentDate,
  };

  const isPremium = user?.subscription_status === 'premium';
  const template = isPremium
    ? `Du bist ein feinfühliger, poetischer astrologischer Textgenerator.

Erstelle ein individuelles Horoskop für folgende Person anhand ihrer astrologischen Grunddaten:
Name: {{Vorname}}
Geschlecht: {{Geschlecht}}
Geburtsdatum: {{Geburtsdatum}}
Geburtszeit: {{Geburtszeit}} (falls nicht vorhanden, schätze den Aszendenten grob oder ignoriere Häuser)
Geburtsort: {{Geburtsort}}
Frequenz: {{Frequenz}} (daily, weekly, monthly)
Sprache: {{Sprache}}, Verfasse das Horoskop ausschließlich in der angegebenen Sprache.
Nutze diese Informationen, um das Geburtshoroskop zu analysieren und es mit den aktuellen astrologischen Transiten in Verbindung zu setzen.

Länge nach Frequenz:
daily: 4–5 Sätze, weekly: 6–8, monthly: 10–12.

Hinweis: Verwende das aktuelle Datum {{Datum}} als Referenzzeit.`
    : `Du bist ein feinfühliger, poetischer astrologischer Textgenerator.

Erstelle ein individuelles Horoskop für folgende Person:
Name: {{Vorname}}
Geschlecht: {{Geschlecht}}
Geburtsdatum: {{Geburtsdatum}}
Geburtszeit: {{Geburtszeit}}
Geburtsort: {{Geburtsort}}
Frequenz: {{Frequenz}}
Sprache: {{Sprache}}

Länge nach Frequenz:
daily: 3–4 Sätze, weekly: 5–7, monthly: 9–11.

Hinweis: Verwende das aktuelle Datum {{Datum}} als Referenzzeit.`;

  let prompt = template;
  for (const [k, v] of Object.entries(placeholders)) {
    prompt = prompt.replace(new RegExp(k, 'g'), v);
  }
  return prompt;
}

async function generateHoroscopeContent(user: any) {
  const prompt = buildHoroscopePrompt(user);
  const langCode = String(user?.language || 'en').toLowerCase();
  const languageName = langCode === 'de' ? 'German' : langCode === 'fr' ? 'French' : 'English';
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are Luraaya, a poetic master astrologer. Respond strictly in ${languageName}.`,
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.9,
    max_tokens: 800,
  });
  return response.choices?.[0]?.message?.content?.trim() || '';
}

async function saveHoroscopeMessage(userId: string, content: string, messageType: string) {
  // Idempotency window to prevent duplicate inserts from closely spaced events
  const now = new Date();
  const since = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

  const { data: existing, error: checkErr } = await supabase!
    .from('horoscope')
    .select('id, sentat')
    .eq('user_id', userId)
    .eq('messagetype', messageType)
    .gte('sentat', since)
    .order('sentat', { ascending: false })
    .limit(1);
  if (!checkErr && existing && existing.length > 0) {
    console.log('Dedup: recent horoscope already exists, skipping insert', { userId, messageType, last: existing[0]?.sentat });
    return null;
  }

  const { data, error } = await supabase!
    .from('horoscope')
    .insert({ user_id: userId, content, messagetype: messageType, read: false, sentat: now.toISOString() })
    .select();
  if (error) throw error;
  return data?.[0] || null;
}

async function deliverViaEmail(to: string, subject: string, html: string) {
  if (!hasSendGrid) {
    console.log('SendGrid not configured. Would send email to', to, 'subject:', subject);
    return;
  }
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'luraaya@outlook.com',
    subject,
    html,
  };
  await sgMail.send(msg as any);
}

function truncateMessageForSMS(message: string, maxLength = 1500) {
  if (message.length <= maxLength) return message;
  const truncated = message.substring(0, maxLength - 3);
  const lastEnd = Math.max(truncated.lastIndexOf('.'), truncated.lastIndexOf('!'), truncated.lastIndexOf('?'));
  return (lastEnd > maxLength * 0.8 ? truncated.substring(0, lastEnd + 1) : truncated) + '..';
}

async function deliverViaTwilio(channel: 'sms' | 'whatsapp', to: string, body: string) {
  if (!hasTwilio || !twilioClient) {
    console.log(`Twilio not configured. Would send ${channel} to`, to);
    return;
  }
  const text = truncateMessageForSMS(body);
  if (channel === 'sms') {
    if (!process.env.TWILIO_FROM_SMS) throw new Error('TWILIO_FROM_SMS not set');
    await twilioClient.messages.create({ from: process.env.TWILIO_FROM_SMS as string, to, body: text });
  } else {
    const fromWhats = (process.env.TWILIO_FROM_WHATSAPP || '').startsWith('whatsapp:')
      ? (process.env.TWILIO_FROM_WHATSAPP as string)
      : `whatsapp:${process.env.TWILIO_FROM_WHATSAPP as string}`;
    const toWhats = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    await twilioClient.messages.create({ from: fromWhats, to: toWhats, body: text });
  }
}

async function generateAndDeliverHoroscope(userId: string) {
  let user: any = null;
  let userErr: any = null;

  // Add retry logic to handle replication lag
  for (let i = 0; i < 3; i++) {
    const { data: userRaw, error } = await supabase!
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userRaw) {
      user = userRaw;
      break; // Found! Exit the loop.
    }

    userErr = error; // Store the last error
    if (i < 2) { // Don't wait on the final attempt
      console.warn(`User ${userId} not found on attempt ${i + 1}. Retrying in 1.5s...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds
    }
  }

  // If there was a DB error (not just 'not found'), throw it
  if (userErr) throw userErr; 
  
  // If still not found after 3 attempts, throw the final error
  if (!user) {
    throw new Error(`User not found after 3 attempts for userId: ${userId}`);
  }

  // --- Original function logic continues below ---
  
  if (!(user.subscription_status === 'basic' || user.subscription_status === 'premium')) {
    console.log(`Skipping horoscope for user ${userId}: status is ${user.subscription_status}`);
    return;
  }

  const msgType = mapSubscriptionTypeToMessageType(String(user.subscriptionType || 'daily'));
  const content = await generateHoroscopeContent(user);
  const userIdStr = String(user.id || userId);
  await saveHoroscopeMessage(userIdStr, content, msgType);

  const subjectMap: Record<string, string> = {
    daily_horoscope: 'Your daily horoscope ✨',
    weekly_forecast: 'Your weekly forecast ✨',
    monthly_reading: 'Your monthly reading ✨',
  };
  const subject = subjectMap[msgType] || 'Your horoscope ✨';
  const channel = String(user.communicationChannel || 'email').toLowerCase();
  const destination = String(user.send_to || user.email || '');
  if (channel === 'email') {
    await deliverViaEmail(destination, subject, `<div>${content.replace(/\n/g, '<br/>')}</div>`);
  } else if (channel === 'sms' || channel === 'whatsapp') {
    await deliverViaTwilio(channel as any, String(destination), content);
  } else {
    // Default fallback to email
    await deliverViaEmail(String(user.email || ''), subject, `<div>${content.replace(/\n/g, '<br/>')}</div>`);
  }
}

async function readRawBody(req: any): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    (req as any).on('data', (chunk: Buffer) => chunks.push(chunk));
    (req as any).on('end', () => resolve(Buffer.concat(chunks)));
    (req as any).on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = ENV.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) return res.status(400).send('Webhook signature or secret missing');

  try {
    const raw = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any; // Stripe.Checkout.Session
        try {
          const customerId = session.customer as string | undefined;
          const subscriptionId = session.subscription as string | undefined;
          if (!customerId) {
            console.warn('checkout.session.completed without customer');
            break;
          }
          // Resolve userId
          let userId: string | undefined;
          try {
            const customer = await stripe.customers.retrieve(customerId as string);
            userId = (customer as any)?.metadata?.user_id as string | undefined;
          } catch {}
          if (!userId) {
            const { data: match } = await supabase!
              .from('users')
              .select('id')
              .eq('stripe_customer_id', customerId as string)
              .maybeSingle();
            userId = (match?.id as string | undefined);
          }
          if (!userId) {
            console.warn('checkout.session.completed: could not resolve userId for customer', customerId as string);
            break;
          }
          let mappedStatus: string | null = null;
          let priceId: string | null = null;
          let subscriptionPeriodEnd: string | null = null;
          let subscriptionType: string = 'daily';
          
          if (subscriptionId) {
            try {
              const sub = await stripe.subscriptions.retrieve(subscriptionId);
              priceId = sub.items?.data?.[0]?.price?.id || null;
              mappedStatus = mapSubscriptionStatus(sub.status, priceId);
              subscriptionType = mapPriceIdToSubscriptionType(priceId);
              const cpe = (sub as any)?.current_period_end as number | undefined;
              if (cpe) subscriptionPeriodEnd = new Date(cpe * 1000).toISOString();
            } catch (e: any) {
              console.warn('Failed to retrieve subscription for session:', e?.message || e);
            }
          } else {
            // Fallback: try to find active subscription by customer
            try {
              const list = await stripe.subscriptions.list({ customer: customerId as string, status: 'active', limit: 1 });
              const sub = list?.data?.[0];
              if (sub) {
                priceId = sub.items?.data?.[0]?.price?.id || null;
                mappedStatus = mapSubscriptionStatus(sub.status, priceId || undefined);
                subscriptionType = mapPriceIdToSubscriptionType(priceId || undefined);
                const cpe = (sub as any)?.current_period_end as number | undefined;
                if (cpe) subscriptionPeriodEnd = new Date(cpe * 1000).toISOString();
              }
            } catch (e: any) {
              console.warn('Fallback subscription list failed:', e?.message || e);
            }
          }
          
          console.log('Updating user subscription data:', {
            userId,
            customerId,
            subscriptionId,
            priceId,
            mappedStatus,
            subscriptionType,
            subscriptionPeriodEnd
          });
          
          const updatePayload: any = {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId || null,
            subscription_plan: priceId,
            subscription_status: mappedStatus || 'trialing',
            subscriptionType: subscriptionType,
          };
          if (subscriptionPeriodEnd) updatePayload.subscription_period_end = subscriptionPeriodEnd;

          await supabase!
            .from('users')
            .update(updatePayload)
            .eq('id', userId as string);

          // Do NOT generate horoscope here; rely on customer.subscription.created
        } catch (e: any) {
          console.error('checkout.session.completed handler error:', e);
        }
        break;
      }

case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;

        // --- START NEW LOGIC ---
        // ALWAYS trust your database first.
        let userId: string | undefined;
        const { data: match } = await supabase!
          .from('users')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .maybeSingle();

        if (match?.id) {
          userId = match.id as string; // <-- FIX 1: Solves the TS build error
        } else {
          // Fallback: If not in DB, check Stripe metadata (for new customers)
          const customer = await stripe.customers.retrieve(sub.customer as string);
          userId = (customer as any)?.metadata?.user_id as string | undefined;
        }
        // --- END NEW LOGIC ---
        
        if (!userId) {
          console.warn('Webhook created: could not resolve userId for customer', sub.customer);
          break;
        }
        
        // --- FIX 2: This is the rest of the original logic, now running only once ---
        const priceId = sub.items?.data?.[0]?.price?.id || null;
        const mapped = mapSubscriptionStatus(sub.status, priceId);
        const subscriptionType = mapPriceIdToSubscriptionType(priceId);
        let subscriptionPeriodEnd: string | null = null;
        const cpe1 = (sub as any)?.current_period_end as number | undefined;
        if (cpe1) {
          try { subscriptionPeriodEnd = new Date(cpe1 * 1000).toISOString(); } catch {}
        }
        
        console.log('Subscription created - updating user:', {
          userId,
          priceId,
          mapped,
          subscriptionType,
          subscriptionPeriodEnd
        });
        
        await supabase!
          .from('users')
          .update({
            subscription_status: mapped || 'trialing',
            subscription_period_end: subscriptionPeriodEnd,
            stripe_subscription_id: sub.id,
            stripe_customer_id: sub.customer as string,
            subscription_plan: priceId,
            subscriptionType: subscriptionType,
          })
          .eq('id', userId as string);

        // Immediately generate the first horoscope
        try { await generateAndDeliverHoroscope(userId); } catch (e: any) { console.error('Initial horoscope failed:', e); }
        break;
      }      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(sub.customer as string);
        let userId = (customer as any)?.metadata?.user_id as string | undefined;
        if (!userId) {
          const { data: match } = await supabase!
            .from('users')
            .select('id')
            .eq('stripe_customer_id', sub.customer as string)
            .maybeSingle();
          userId = (match?.id as string | undefined);
        }
        if (!userId) {
          console.warn('Webhook updated: could not resolve userId for customer', sub.customer);
          break;
        }
        const priceId = sub.items?.data?.[0]?.price?.id || null;
        const mapped = mapSubscriptionStatus(sub.status, priceId);
        const subscriptionType = mapPriceIdToSubscriptionType(priceId);
        let subscriptionPeriodEnd: string | null = null;
        const cpe2 = (sub as any)?.current_period_end as number | undefined;
        if (cpe2) {
          try { subscriptionPeriodEnd = new Date(cpe2 * 1000).toISOString(); } catch {}
        }
        
        console.log('Subscription updated - updating user:', {
          userId,
          priceId,
          mapped,
          subscriptionType,
          subscriptionPeriodEnd
        });
        
        await supabase!
          .from('users')
          .update({ 
            subscription_status: mapped, 
            subscription_period_end: subscriptionPeriodEnd,
            subscriptionType: subscriptionType,
            subscription_plan: priceId
          })
          .eq('id', userId as string);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Find user by customer ID
        const { data: match } = await supabase!
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
        
        const userId = match?.id as string | undefined;

        if (!userId) {
          console.warn('Webhook deleted: could not resolve userId for customer', customerId);
          break;
        }

        // Use 'ended_at' for the most accurate cancellation timestamp
        let subscriptionPeriodEnd: string | null = null;
        const ended_at = (sub as any)?.ended_at as number | undefined;
        if (ended_at) {
          try { subscriptionPeriodEnd = new Date(ended_at * 1000).toISOString(); } catch {}
        }

        console.log('Subscription deleted - updating user status to canceled:', {
          userId,
          subscriptionId: sub.id,
          ended_at: subscriptionPeriodEnd
        });
        
        await supabase!
          .from('users')
          .update({ 
            subscription_status: 'canceled',
            subscription_period_end: subscriptionPeriodEnd,
            subscriptionType: null // Reset frequency preference
          })
          .eq('id', userId);
        break;
      }


      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string | undefined;
        
        // This event is the source of truth for the subscription period end date.
        if (subscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const customerId = sub.customer as string;

            // Try DB match first
            let userId: string | undefined;
            const { data: match } = await supabase!
              .from('users')
              .select('id')
              .eq('stripe_customer_id', customerId)
              .maybeSingle();

            if (match?.id) {
              userId = match.id as string;
            } else {
              // Fallback to Stripe metadata if DB doesn't have the customer yet
              try {
                const customer = await stripe.customers.retrieve(customerId);
                userId = (customer as any)?.metadata?.user_id as string | undefined;
              } catch {}
            }

           // ... inside case 'invoice.payment_succeeded'
        if (userId) {
          // Now, we get the real billing end date
          let subscriptionPeriodEnd: string | null = null;
          // --- THIS IS THE FIX ---
          const cpe = (invoice as any)?.period_end as number | undefined;
// ...
              if (cpe) {
                subscriptionPeriodEnd = new Date(cpe * 1000).toISOString();
              }

              const priceId = sub.items?.data?.[0]?.price?.id || null;
              const mappedStatus = mapSubscriptionStatus(sub.status, priceId);
              const subscriptionType = mapPriceIdToSubscriptionType(priceId);

              console.log('Invoice paid - Authoritative update for user subscription:', {
                userId,
                subscriptionId,
                newStatus: mappedStatus,
                newPeriodEnd: subscriptionPeriodEnd
              });

              // This update is crucial. It corrects any missing data from earlier events.
              await supabase!
                .from('users')
                .update({
                  subscription_status: mappedStatus,
                  subscription_period_end: subscriptionPeriodEnd, // The correct date
                  stripe_subscription_id: sub.id,
                  subscription_plan: priceId,
                  subscriptionType: subscriptionType,
                })
                .eq('id', userId);

              // Secondary safety update by subscription id (covers rare mapping gaps)
              await supabase!
                .from('users')
                .update({
                  subscription_status: mappedStatus,
                  subscription_period_end: subscriptionPeriodEnd,
                  subscription_plan: priceId,
                  subscriptionType: subscriptionType,
                })
                .eq('stripe_subscription_id', sub.id);
            } else {
              // Last-resort: update by subscription id if user mapping not found yet
              let subscriptionPeriodEnd: string | null = null;
              const cpe = (sub as any)?.current_period_end as number | undefined;
              if (cpe) {
                subscriptionPeriodEnd = new Date(cpe * 1000).toISOString();
              }

              const priceId = sub.items?.data?.[0]?.price?.id || null;
              const mappedStatus = mapSubscriptionStatus(sub.status, priceId);
              const subscriptionType = mapPriceIdToSubscriptionType(priceId);

              console.warn('invoice.payment_succeeded: updating by stripe_subscription_id fallback');
              await supabase!
                .from('users')
                .update({
                  subscription_status: mappedStatus,
                  subscription_period_end: subscriptionPeriodEnd,
                  subscription_plan: priceId,
                  subscriptionType: subscriptionType,
                })
                .eq('stripe_subscription_id', sub.id);
            }
          } catch (e: any) {
            console.error('Error in invoice.payment_succeeded handler:', e.message);
          }
        }
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        console.log('Payment intent succeeded:', paymentIntent.id);
        
        // No horoscope generation here to avoid duplicates with other events/cron
        break;
      }
      default:
        console.log('Unhandled event type:', event.type);
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err?.message || err);
    return res.status(400).send(`Webhook Error: ${err?.message || 'Unknown'}`);
  }
}

// Ensure Vercel keeps body as a stream for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

