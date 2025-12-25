// Using loose types for compatibility on Vercel without adding @vercel/node types
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
};

if (!ENV.SUPABASE_URL) {
  console.error('Trigger function config error: SUPABASE_URL is missing');
}
/**
 * Checks if a message is due based on the last sent time and subscription type.
 * Uses flexible time windows (e.g., 23 hours instead of 24) to account for
 * cron job timing and small processing delays, preventing users from being skipped.
 */
function calculateIsDue(lastSentAt: string | null, type: string | null) {
  if (!type) type = 'daily';
  if (!lastSentAt) return true; // Send immediately if never sent

  const now = Date.now();
  const last = new Date(lastSentAt).getTime();

  // --- START OF FIX ---
  // We use slightly *less* than the full duration to ensure the
  // daily cron job reliably triggers the send.

  if (type === 'daily') {
    // Check for 23 hours instead of 24
    const twentyThreeHoursMs = 23 * 60 * 60 * 1000;
    return now - last >= twentyThreeHoursMs;
  }
  if (type === 'weekly') {
    // Check for 6.5 days instead of 7
    const sixPointFiveDaysMs = 6.5 * 24 * 60 * 60 * 1000;
    return now - last >= sixPointFiveDaysMs;
  }
  if (type === 'monthly') {
    // Check for 29 days instead of 30
    const twentyNineDaysMs = 29 * 24 * 60 * 60 * 1000;
    return now - last >= twentyNineDaysMs;
  }
  // --- END OF FIX ---

  return false;
}


const supabase = createClient(
  ENV.SUPABASE_URL as string,
  (ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY) as string,
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const hasSendGrid = !!process.env.SENDGRID_API_KEY;
if (hasSendGrid) sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
// Twilio: support Auth Token or API Key (SK...) auth
const hasTwilioByAuthToken = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN;
const hasTwilioByApiKey = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_API_KEY_SID && !!process.env.TWILIO_API_KEY_SECRET;
const hasTwilio = hasTwilioByAuthToken || hasTwilioByApiKey;
const twilioClient = hasTwilio
  ? (hasTwilioByApiKey
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

function mapSubscriptionTypeToMessageType(subscriptionType?: string | null) {
  switch ((subscriptionType || '').toLowerCase()) {
    case 'weekly': return 'weekly_forecast';
    case 'monthly': return 'monthly_reading';
    default: return 'daily_horoscope';
  }
}

function buildPrompt(user: any) {
  const name = (user?.fullname?.split(' ')[0] || 'Celestial Voyager') as string;
  const currentDate = new Date().toISOString().split('T')[0];
  let prompt = `Du bist ein feinfühliger, poetischer astrologischer Textgenerator.\n\nName: {{Vorname}}\nGeschlecht: {{Geschlecht}}\nGeburtsdatum: {{Geburtsdatum}}\nGeburtszeit: {{Geburtszeit}}\nGeburtsort: {{Geburtsort}}\nFrequenz: {{Frequenz}}\nSprache: {{Sprache}}\n\nHinweis: Verwende das aktuelle Datum {{Datum}} als Referenzzeit.`;
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
  for (const [k, v] of Object.entries(placeholders)) prompt = prompt.replace(new RegExp(k, 'g'), v);
  return prompt;
}

async function generateContent(user: any) {
  const langCode = String(user?.language || 'en').toLowerCase();
  const languageName = langCode === 'de' ? 'German' : langCode === 'fr' ? 'French' : 'English';
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `You are Luraaya. Respond strictly in ${languageName}.` },
      { role: 'user', content: buildPrompt(user) },
    ],
    temperature: 0.9,
    max_tokens: 800,
  });
  return response.choices?.[0]?.message?.content?.trim() || '';
}

async function saveMessage(userId: string, content: string, messageType: string) {
  const now = new Date();
  const since = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

  const { data: existing, error: checkErr } = await supabase
    .from('horoscope')
    .select('id, sentat')
    .eq('user_id', userId)
    .eq('messagetype', messageType)
    .gte('sentat', since)
    .order('sentat', { ascending: false })
    .limit(1);
  if (!checkErr && existing && existing.length > 0) {
    console.log('Dedup (trigger): recent horoscope exists, skip', { userId, messageType, last: existing[0]?.sentat });
    return null;
  }

  const { data, error } = await supabase
    .from('horoscope')
    .insert({ user_id: userId, content, messagetype: messageType, read: false, sentat: now.toISOString() })
    .select();
  if (error) throw error;
  return data?.[0] || null;
}

async function deliver(user: any, content: string, msgType: string) {
    if (process.env.DELIVERY_DISABLED === "true") {
    console.log("DELIVERY_DISABLED=true: skip deliver", {
      userId: user?.id,
      channel: user?.communicationChannel,
      send_to: user?.send_to,
      msgType,
    });
    return;
  }
  const subjectMap: Record<string, string> = {
    daily_horoscope: 'Your daily horoscope ✨',
    weekly_forecast: 'Your weekly forecast ✨',
    monthly_reading: 'Your monthly reading ✨',
  };
  const subject = subjectMap[msgType] || 'Your horoscope ✨';
  const channel = String(user.communicationChannel || 'email').toLowerCase();
  const destination = user.send_to;
  if (!destination) throw new Error('Missing send_to destination');
  if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)) {
    throw new Error('Invalid email in send_to');
  }
  if ((channel === 'sms' || channel === 'whatsapp') && !/^\+?[1-9]\d{7,14}$/.test(destination)) {
    throw new Error('Invalid phone (E.164) in send_to');
  }
  if (channel === 'email') {
    if (!hasSendGrid) { console.log('Would send email to', destination); return; }
    await sgMail.send({ to: destination, from: process.env.SENDGRID_FROM_EMAIL || 'luraaya@outlook.com', subject, html: `<div>${content.replace(/\n/g, '<br/>')}</div>` } as any);
  } else if (channel === 'sms' || channel === 'whatsapp') {
    if (!twilioClient) throw new Error('Twilio not configured');
    const text = content.length > 1500 ? content.slice(0, 1497) + '...' : content;
    if (channel === 'sms') {
      await twilioClient.messages.create({ from: process.env.TWILIO_FROM_SMS, to: destination, body: text });
    } else {
      const fromWhats = (process.env.TWILIO_FROM_WHATSAPP || '').startsWith('whatsapp:') ? process.env.TWILIO_FROM_WHATSAPP as string : `whatsapp:${process.env.TWILIO_FROM_WHATSAPP}`;
      const toWhats = destination.startsWith('whatsapp:') ? destination : `whatsapp:${destination}`;
      await twilioClient.messages.create({ from: fromWhats, to: toWhats, body: text });
    }
  }
}

export default async function handler(req: any, res: any) {
    // --- ADD THIS SECURITY CHECK ---
  const userId = (req.query?.userId as string) || (req.body && (req.body as any).userId);

  // If there is no userId, it's the batch cron job.
  // We MUST check for the cron secret.
  if (!userId) {
      const cronSecret = process.env.CRON_SECRET;
      const key = (req.query?.key as string) || (req.body && (req.body as any).key);
   
      
    // --- (IMPROVEMENT) ---
    // First, check if the secret is even configured on the server.
    if (!cronSecret) {
      console.error('CRON_SECRET is not set in environment variables.');
      // Fail securely if the secret isn't set.
      return res.status(500).json({ success: false, error: 'Internal server configuration error' });
    }
    // --- (END IMPROVEMENT) ---

    if (!key || key !== cronSecret) {
      // If secrets don't match, reject the request.
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
  }
  // --- END OF SECURITY CHECK ---

  try {
    if (userId) {
      const { data: user, error: userErr } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
      if (userErr) throw userErr;
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const msgType = mapSubscriptionTypeToMessageType(user.subscriptionType || 'daily');
      const content = await generateContent(user);
      const inserted = await saveMessage(user.id, content, msgType);
      if (inserted) {
        await deliver(user, content, msgType);
      }
      return res.json({ success: true, processed: 1 });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, subscription_status, subscriptionType, communicationChannel, send_to, email')
      .in('subscription_status', ['basic', 'premium']);
    if (error) throw error;

    let processed = 0;
    for (const u of users || []) {
      try {
        const msgType = mapSubscriptionTypeToMessageType(u.subscriptionType || 'daily');
        const { data: last, error: lastErr } = await supabase
          .from('horoscope')
          .select('sentat')
          .eq('user_id', u.id)
          .eq('messagetype', msgType)
          .order('sentat', { ascending: false })
          .limit(1);
        if (lastErr) { console.warn('Fetch last message error for', u.id, lastErr); continue; }
        const lastSentAt = last?.[0]?.sentat || null;
        if (!calculateIsDue(lastSentAt, u.subscriptionType || 'daily')) continue;

        const { data: fullUser, error: userErr } = await supabase.from('users').select('*').eq('id', u.id).maybeSingle();
        if (userErr || !fullUser) { console.warn('Load full user failed for', u.id, userErr); continue; }
        const content = await generateContent(fullUser);
        const inserted = await saveMessage(fullUser.id, content, msgType);
        if (inserted) {
          await deliver(fullUser, content, msgType);
        }
        processed += 1;
      } catch (runErr: any) {
        console.error('Batch user error', u?.id, runErr?.message || runErr);
      }
    }

    return res.json({ success: true, processed });
  } catch (e: any) {
    console.error('trigger-horoscope error:', e?.message || e);
    return res.status(500).json({ success: false, error: e?.message || 'Failed' });
  }
}

