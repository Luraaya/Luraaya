import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cron from 'node-cron';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

// Load environment variables
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
);

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize SendGrid
const hasSendGrid = !!process.env.SENDGRID_API_KEY;
if (hasSendGrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized');
} else {
  console.log('⚠️ SendGrid API key not found, email delivery will be logged only');
}

// Initialize Twilio (optional)
// Support either classic Auth Token auth or API Key (SK...) auth
const hasTwilioByAuthToken = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN;
const hasTwilioByApiKey = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_API_KEY_SID && !!process.env.TWILIO_API_KEY_SECRET;
const hasTwilio = hasTwilioByAuthToken || hasTwilioByApiKey;
const twilioClient = hasTwilio
  ? (hasTwilioByApiKey
      ? twilio(
          process.env.TWILIO_API_KEY_SID,
          process.env.TWILIO_API_KEY_SECRET,
          { accountSid: process.env.TWILIO_ACCOUNT_SID }
        )
      : twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN))
  : null;

if (hasTwilio) {
  console.log('✅ Twilio initialized');
} else {
  console.log('⚠️ Twilio credentials not found, SMS/WhatsApp delivery disabled');
}

console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.VITE_SUPABASE_ANON_KEY);

// Helpers
function calculateIsDue(lastSentAt, type) {
  if (!lastSentAt) return true;
  const now = Date.now();
  const last = new Date(lastSentAt).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  if (type === 'daily') return now - last >= dayMs;
  if (type === 'weekly') return now - last >= 7 * dayMs;
  if (type === 'monthly') return now - last >= 30 * dayMs;
  return false;
}

function mapSubscriptionTypeToMessageType(subscriptionType) {
  switch (subscriptionType?.toLowerCase()) {
    case 'daily':
      return 'daily_horoscope';
    case 'weekly':
      return 'weekly_forecast';
    case 'monthly':
      return 'monthly_reading';
    default:
      return 'daily_horoscope'; // Default to daily horoscope instead of unknown
  }
}

function buildHoroscopePrompt(user) {
  const {
    fullname,
    sex,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    subscriptionType, // daily, weekly, monthly
    language = 'en',
    subscription_status, // basic, premium
  } = user;

  const name = fullname?.split(' ')[0] || 'Celestial Voyager';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const placeholders = {
    '{{Vorname}}': name,
    '{{Geschlecht}}': sex || 'not specified',
    '{{Geburtsdatum}}': dateOfBirth || 'not specified',
    '{{Geburtszeit}}': timeOfBirth || 'not specified',
    '{{Geburtsort}}': placeOfBirth || 'not specified',
    '{{Frequenz}}': subscriptionType || 'daily',
    '{{Sprache}}': language,
    '{{Datum}}': currentDate,
  };

  let promptTemplate = '';

  if (subscription_status === 'premium') {
    promptTemplate = `
Du bist ein feinfühliger, poetischer astrologischer Textgenerator.

Erstelle ein individuelles Horoskop für folgende Person anhand ihrer astrologischen Grunddaten:
Name: {{Vorname}}
Geschlecht: {{Geschlecht}}
Geburtsdatum: {{Geburtsdatum}}
Geburtszeit: {{Geburtszeit}} (falls nicht vorhanden, schätze den Aszendenten grob oder ignoriere Häuser)
Geburtsort: {{Geburtsort}}
Frequenz: {{Frequenz}} (daily, weekly, monthly)
Sprache: {{Sprache}}, Verfasse das Horoskop ausschließlich in der angegebenen Sprache.
Nutze diese Informationen, um das Geburtshoroskop zu analysieren und es mit den aktuellen astrologischen Transiten in Verbindung zu setzen.

Verwende folgende astrologische Elemente:
Das Grundlegende Sternzeichen als Konstante (siehe Geburtsdatum)
Planeten und ihre Bedeutungen: Sonne = Identität, Mond = Gefühle, Merkur = Denken, Venus = Beziehungen, Mars = Wille, Jupiter = Chancen, Saturn = Grenzen, Uranus = Wandel, Neptun = Träume, Pluto = Transformation
Tierkreiszeichen: Feuer, Wasser, Luft, Erde; Kardinal, Fix, Veränderlich
Transite: aktuelle Planetenstände im Bezug zum Geburtshoroskop (z.B. Transit-Mars auf Geburt-Sonne)
Astrologische Häuser: geben an, in welchem Lebensbereich sich eine Planetenkonstellation zeigt z.B. 2. Haus = Finanzen, 7. Haus = Beziehungen, 10. Haus = Beruf.
Wenn Häuser berechnet werden können (mit Geburtszeit), integriere sie sanft und verständlich (z.B. „dein Beziehungsfeld (7. Haus) wird aktiviert“) Nutze Häuser nur dann explizit, wenn die Geburtszeit bekannt ist – oder verpacke sie elegant, ohne zu betonen, dass geschätzt wurde.
Mondphasen: Neumond = Neuanfang, innere Ausrichtung. Vollmond = Höhepunkt, Erkenntnisse, emotionale Spannung, Loslassen. Zunehmender Mond = Energieaufbau, Umsetzung. Abnehmender Mond = Rückzug, Klärung, Integration.

Verwende Fachbegriffe, aber:
erkläre sie in verständlicher Sprache, möglichst elegant (z.B. in Klammern, Umschreibungen, Metaphern)
keine Charts, keine Tabellen, keine trockene Erklärung

Tonalität & Stil:
persönlich ({{Vorname}} direkt ansprechen), stimmungsvoll, ruhig
Der Name steht immer allein in der ersten Zeile. Danach folgt ein Zeilenumbruch.
geschlechtsneutral formulieren, außer Geschlecht ist relevant für Formulierung
poetisch, emotional, inspirierend – keine technischen Listen
Metaphern aus Licht, Natur, Wandel, Tiefe, Rhythmus verwenden
keine Einleitung oder Abschluss – direkt mit der Botschaft beginnen
verpacke die Botschaften elegant, ohne zu betonen, dass geschätzt wurde, schaffe Vertrauen.

Länge nach Frequenz:
daily: 4–5 Sätze, tagesbezogen
weekly: 6–8 Sätze, wochenbezogen
monthly: 10–12 Sätze, langfristige Entwicklungen, Pluto, Saturn, Uranus etc.

Falls Daten wie Geburtszeit oder -ort fehlen:
erwähne es nicht, sondern arbeite mit den vorhandenen Infos (z.B. nur Sternzeichen und Planetenstellungen ohne Häuser)
Ziel: Erzeuge ein stimmiges Horoskop, das astrologisch fundiert ist, aber ohne astrologisches Vorwissen verstanden werden kann. Es soll {{Vorname}} berühren, führen und stärken – nicht analysieren.

Hinweis: Das Horoskop muss stets auf das aktuelle Datum bzw. den angegebenen Zeitraum abgestimmt sein. Besonders bei daily-Horoskopen ist es essenziell, dass die exakten planetarischen Stellungen und Transite des jeweiligen Tages berücksichtigt werden. Falsche oder veraltete Konstellationen dürfen keinesfalls verwendet werden. Verwende das aktuelle Datum {{Datum}} als Referenzzeit.
`;
  } else { // Default to Basic
    promptTemplate = `
Du bist ein feinfühliger, poetischer astrologischer Textgenerator.

Erstelle ein individuelles Horoskop für folgende Person anhand ihrer astrologischen Grunddaten:
Name: {{Vorname}}
Geschlecht: {{Geschlecht}}
Geburtsdatum: {{Geburtsdatum}}
Geburtszeit: {{Geburtszeit}} (falls nicht vorhanden, schätze den Aszendenten grob oder ignoriere Häuser)
Geburtsort: {{Geburtsort}}
Frequenz: {{Frequenz}} (daily, weekly, monthly)
Sprache: {{Sprache}}, Verfasse das Horoskop ausschließlich in der angegebenen Sprache.
Nutze diese Informationen, um das Geburtshoroskop zu analysieren und es mit den aktuellen astrologischen Transiten in Verbindung zu setzen.

Verwende folgende astrologische Elemente:
Das Grundlegende Sternzeichen als Konstante (siehe Geburtsdatum)
Planeten und ihre Bedeutungen: Sonne = Identität, Mond = Gefühle, Merkur = Denken, Venus = Beziehungen, Mars = Wille, Jupiter = Chancen, Saturn = Grenzen, Uranus = Wandel, Neptun = Träume, Pluto = Transformation
Tierkreiszeichen: Feuer, Wasser, Luft, Erde; Kardinal, Fix, Veränderlich
Transite: aktuelle Planetenstände im Bezug zum Geburtshoroskop (z.B. Transit-Mars auf Geburt-Sonne)
Verwende nicht die astrologischen Elemente Mondphasen und Häuser.

Verwende Fachbegriffe, aber:
erkläre sie in verständlicher Sprache, möglichst elegant (z.B. in Klammern, Umschreibungen, Metaphern)
keine Charts, keine Tabellen, keine trockene Erklärung

Tonalität & Stil:
persönlich ({{Vorname}} direkt ansprechen), stimmungsvoll, ruhig
Der Name steht immer allein in der ersten Zeile. Danach folgt ein Zeilenumbruch.
geschlechtsneutral formulieren, außer Geschlecht ist relevant für Formulierung
poetisch, emotional, inspirierend – keine technischen Listen
Metaphern aus Licht, Natur, Wandel, Tiefe, Rhythmus verwenden
keine Einleitung oder Abschluss – direkt mit der Botschaft beginnen
verpacke die Botschaften elegant, ohne zu betonen, dass geschätzt wurde, schaffe Vertrauen.

Länge nach Frequenz:
daily: 3–4 Sätze, tagesbezogen,
weekly: 5–7 Sätze, wochenbezogen
monthly: 9–11 Sätze, langfristige Entwicklungen, Pluto, Saturn, Uranus etc.

Falls Daten wie Geburtszeit oder -ort fehlen:
erwähne es nicht, sondern arbeite mit den vorhandenen Infos (z.B. nur Sternzeichen und Planetenstellungen ohne Häuser)

Ziel: Erzeuge ein stimmiges Horoskop, das astrologisch fundiert ist, aber ohne astrologisches Vorwissen verstanden werden kann. Es soll {{Vorname}} berühren, führen und stärken – nicht analysieren.

Hinweis: Das Horoskop muss stets auf das aktuelle Datum bzw. den angegebenen Zeitraum abgestimmt sein. Besonders bei daily-Horoskopen ist es essenziell, dass die exakten planetarischen Stellungen und Transite des jeweiligen Tages berücksichtigt werden. Falsche oder veraltete Konstellationen dürfen keinesfalls verwendet werden. Verwende das aktuelle Datum {{Datum}} als Referenzzeit.
`;
  }

  let finalPrompt = promptTemplate;
  for (const [key, value] of Object.entries(placeholders)) {
    finalPrompt = finalPrompt.replace(new RegExp(key, 'g'), value);
  }

  return finalPrompt;
}

async function generateHoroscopeContent(user) {
  const prompt = buildHoroscopePrompt(user);
  const langCode = String(user?.language || 'en').toLowerCase();
  const languageName = langCode === 'de' ? 'German' : (langCode === 'fr' ? 'French' : 'English');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { 
        role: 'system', 
        content: `You are Luraaya, a master astrologer with deep understanding of celestial energies. 
        Your readings are known for their poetic beauty, profound wisdom, and ability to weave cosmic metaphors 
        with personal insights. You never use generic advice or bullet points - instead, you paint pictures 
        with words that help people see their connection to the cosmic dance.
        
        IMPORTANT: The required output language is ${languageName}. Respond STRICTLY and EXCLUSIVELY in ${languageName}. 
        Do not include any words in any other language, even if the prompt is shown in another language. Maintain the same 
        poetic and mystical style regardless of the language.`
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.9,
    max_tokens: 1000,
    presence_penalty: 0.6,
    frequency_penalty: 0.8
  });
  return response.choices?.[0]?.message?.content?.trim() || '';
}

async function saveHoroscopeMessage(userId, content, messageType) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to save horoscope message (attempt ${attempt}/${maxRetries})`);
      
      const { data, error } = await supabase
        .from('horoscope')
        .insert({
          user_id: userId,
          content,
          messagetype: messageType,
          read: false,
          sentat: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error(`Database error on attempt ${attempt}:`, error);
        lastError = error;
        
        if (attempt < maxRetries) {
          console.log(`Retrying in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        }
        throw error;
      }

      console.log('✅ Horoscope message saved successfully');
      return data?.[0];
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${attempt * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      } else {
        console.error('❌ All retry attempts failed');
        throw lastError;
      }
    }
  }
}

async function deliverViaEmail(to, subject, html, language = 'en') {
  if (!hasSendGrid) {
    // Fallback to logging if SendGrid is not configured
    console.log('📧 Email would be sent:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', html);
    console.log('---');
    return;
  }

  try {
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL || 'luraaya@outlook.com',
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .email-container {
              background: white;
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-style: italic;
            }
            .content {
              font-size: 16px;
              line-height: 1.8;
              margin-bottom: 30px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #f0f0f0;
              color: #666;
              font-size: 14px;
            }
            .cosmic-decoration {
              text-align: center;
              font-size: 24px;
              margin: 20px 0;
              color: #667eea;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">✨ Luraaya ✨</div>
              <div class="subtitle">${language === 'de' ? 'Ihr persönlicher astrologischer Führer' : language === 'fr' ? 'Votre guide astrologique personnel' : 'Your Personal Astrological Guide'}</div>
            </div>
            
            <div class="cosmic-decoration">🌟</div>
            
            <div class="content">
              ${html}
            </div>
            
            <div class="cosmic-decoration">✨</div>
            
            <div class="footer">
              <p>${language === 'de' ? 'Mit kosmischen Segnungen,' : language === 'fr' ? 'Avec des bénédictions cosmiques,' : 'With cosmic blessings,'}<br>Luraaya</p>
              <p><small>${language === 'de' ? 'Diese Nachricht wurde Ihnen als Teil Ihres personalisierten Astrologie-Abonnements gesendet.' : language === 'fr' ? 'Ce message vous a été envoyé dans le cadre de votre abonnement d\'astrologie personnalisé.' : 'This message was sent to you as part of your personalized astrology subscription.'}</small></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Email delivery failed:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
}

// Helper function to truncate message for SMS/WhatsApp
function truncateMessageForSMS(message, maxLength = 1500) {
  if (message.length <= maxLength) {
    return message;
  }
  
  // Try to truncate at a sentence boundary
  const truncated = message.substring(0, maxLength - 3);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.8) { // If we can find a good break point
    return truncated.substring(0, lastSentenceEnd + 1) + '..';
  }
  
  // Otherwise, just truncate and add ellipsis
  return truncated + '...';
}

async function deliverViaTwilio(channel, to, body) {
  if (!hasTwilio || !twilioClient) {
    console.log(`⚠️ Twilio not configured, ${channel} message would be sent to ${to}`);
    return;
  }

  try {
    // Truncate message if it's too long
    const truncatedBody = truncateMessageForSMS(body);
    if (truncatedBody !== body) {
      console.log(`⚠️ Message truncated from ${body.length} to ${truncatedBody.length} characters for ${channel}`);
    }
    
    if (channel === 'sms') {
      if (!process.env.TWILIO_FROM_SMS) {
        console.error('❌ TWILIO_FROM_SMS not set');
        return;
      }
      await twilioClient.messages.create({ 
        from: process.env.TWILIO_FROM_SMS, 
        to, 
        body: truncatedBody
      });
      console.log(`✅ SMS sent successfully to ${to}`);
    } else if (channel === 'whatsapp') {
      if (!process.env.TWILIO_FROM_WHATSAPP) {
        console.error('❌ TWILIO_FROM_WHATSAPP not set');
        return;
      }
      const toWhats = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      const fromWhats = process.env.TWILIO_FROM_WHATSAPP.startsWith('whatsapp:') 
        ? process.env.TWILIO_FROM_WHATSAPP 
        : `whatsapp:${process.env.TWILIO_FROM_WHATSAPP}`;
      await twilioClient.messages.create({ 
        from: fromWhats, 
        to: toWhats, 
        body: truncatedBody
      });
      console.log(`✅ WhatsApp message sent successfully to ${to}`);
    }
  } catch (error) {
    console.error(`❌ ${channel.toUpperCase()} delivery failed:`, error.message);
    if (error.code === 21211) {
      console.error('Invalid phone number format. Please ensure the number includes country code (e.g., +1234567890)');
    } else if (error.code === 21608) {
      console.error('WhatsApp sandbox not activated. Send "join sets-select" to +1 415 523 8886 from the recipient number.');
    } else if (error.code === 20003) {
      console.error('Twilio authentication failed (code 20003). Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN belong to the same project as TWILIO_FROM_WHATSAPP. For sandbox, use the parent project credentials and from number +1 415 523 8886.');
    }
    throw error;
  }
}

async function generateAndDeliverHoroscope(userId) {
  try {
    console.log(`Starting horoscope generation for user: ${userId}`);
    
    // Load user
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (userErr) {
      console.error('Error loading user:', userErr);
      throw userErr;
    }
    
    if (!user) {
      console.error('User not found:', userId);
      throw new Error('User not found');
    }
    
    if (!(user.subscription_status === 'basic' || user.subscription_status === 'premium')) {
      console.log('User not subscribed, skipping message generation');
      return;
    }

    console.log(`Generating horoscope for user: ${user.email} (${user.zodiacSign})`);
    
    const msgType = mapSubscriptionTypeToMessageType(user.subscriptionType || 'daily');
    const content = await generateHoroscopeContent(user);

    console.log('Horoscope content generated, saving to database...');

    // Save to DB so it appears in Dashboard
    await saveHoroscopeMessage(user.id, content, msgType);

    console.log('Horoscope saved, preparing delivery...');

    // Deliver via chosen channel
    const getSubject = (msgType, language) => {
      const messageTypeText = msgType.replace('_', ' ');
      switch (language) {
        case 'de':
          return `Ihr ${messageTypeText} ✨`;
        case 'fr':
          return `Votre ${messageTypeText} ✨`;
        default:
          return `Your ${messageTypeText} ✨`;
      }
    };
    
    const subject = getSubject(msgType, user.language || 'en');
    const channel = (user.communicationChannel || 'email').toLowerCase();
    const destination = user.send_to || user.email;

    console.log(`Delivering via ${channel} to: ${destination}`);

    try {
      if (channel === 'email') {
        await deliverViaEmail(destination, subject, `<div>${content.replace(/\n/g, '<br/>')}</div>`, user.language || 'en');
      } else if (channel === 'sms' || channel === 'whatsapp') {
        await deliverViaTwilio(channel, destination, content);
      } else {
        // Default to email
        await deliverViaEmail(user.email, subject, `<div>${content.replace(/\n/g, '<br/>')}</div>`, user.language || 'en');
      }
      console.log('✅ Horoscope delivery completed successfully');
    } catch (deliveryErr) {
      console.error('❌ Delivery failed:', deliveryErr);
      // Don't throw here - the horoscope was saved to DB, so partial success
    }
  } catch (error) {
    console.error('❌ Horoscope generation failed:', error);
    throw error;
  }
}

// Webhook endpoint
// Main Stripe webhook endpoint
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Missing webhook signature or secret');
    return res.status(400).send('Webhook signature or secret missing');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );

    console.log('Received webhook event:', event.type);

    // Handle the webhook event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    console.error('Full error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Alias route so both "/webhook" and "/api/webhook" work (helps local CLI and Vercel defaults)
app.post('/api/webhook', async (req, res) => {
  // Delegate to the same handler logic by calling the /webhook route implementation
  // Re-run the exact same code to keep signature verification identical
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Missing webhook signature or secret');
    return res.status(400).send('Webhook signature or secret missing');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error (alias):', err.message);
    console.error('Full error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const mapSubscriptionStatus = (stripeStatus, priceId) => {
  if (stripeStatus === 'active' || stripeStatus === 'trialing') {
    // These should correspond to your .env variables
    const basicPriceIds = [
      process.env.VITE_STRIPE_PRICE_BASIC_DAILY_MONTHLY,
      process.env.VITE_STRIPE_PRICE_BASIC_DAILY_YEARLY,
      process.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_MONTHLY,
      process.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_YEARLY,
      process.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_MONTHLY,
      process.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_YEARLY
    ].filter(Boolean); // Filter out undefined values

    const premiumPriceIds = [
      process.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_MONTHLY,
      process.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_YEARLY,
      process.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_MONTHLY,
      process.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_YEARLY,
      process.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_MONTHLY,
      process.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_YEARLY
    ].filter(Boolean);

    if (basicPriceIds.includes(priceId)) {
      return 'basic';
    }
    if (premiumPriceIds.includes(priceId)) {
      return 'premium';
    }
  }
  return stripeStatus; // fallback for 'canceled', 'incomplete', etc.
};

const mapPriceIdToSubscriptionType = (priceId) => {
  if (!priceId) return 'daily';
  
  const dailyPriceIds = [
    process.env.VITE_STRIPE_PRICE_BASIC_DAILY_MONTHLY,
    process.env.VITE_STRIPE_PRICE_BASIC_DAILY_YEARLY,
    process.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_MONTHLY,
    process.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_YEARLY,
  ].filter(Boolean);

  const weeklyPriceIds = [
    process.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_MONTHLY,
    process.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_YEARLY,
    process.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_MONTHLY,
    process.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_YEARLY,
  ].filter(Boolean);

  const monthlyPriceIds = [
    process.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_MONTHLY,
    process.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_YEARLY,
    process.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_MONTHLY,
    process.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_YEARLY,
  ].filter(Boolean);

  if (dailyPriceIds.includes(priceId)) return 'daily';
  if (weeklyPriceIds.includes(priceId)) return 'weekly';
  if (monthlyPriceIds.includes(priceId)) return 'monthly';
  
  return 'daily'; // default fallback
};


async function handleCheckoutSessionCompleted(session) {
  console.log('Handling checkout session completed:', session.id);
  
  try {
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    if (!customerId) {
      console.warn('checkout.session.completed without customer');
      return;
    }
    
    // Resolve userId
    let userId;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      userId = customer.metadata?.user_id;
    } catch (err) {
      console.error('Error retrieving customer:', err);
    }
    
    if (!userId) {
      const { data: match } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();
      userId = match?.id;
    }
    
    if (!userId) {
      console.warn('checkout.session.completed: could not resolve userId for customer', customerId);
      return;
    }
    
    let mappedStatus = null;
    let priceId = null;
    let subscriptionPeriodEnd = null;
    let subscriptionType = 'daily';
    
    if (subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        priceId = sub.items?.data?.[0]?.price?.id || null;
        mappedStatus = mapSubscriptionStatus(sub.status, priceId);
        subscriptionType = mapPriceIdToSubscriptionType(priceId);
        const cpe = sub.current_period_end;
        if (cpe) subscriptionPeriodEnd = new Date(cpe * 1000).toISOString();
      } catch (e) {
        console.warn('Failed to retrieve subscription for session:', e?.message || e);
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
    
    await supabase
      .from('users')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId || null,
        subscription_plan: priceId,
        subscription_status: mappedStatus || 'trialing',
        subscription_period_end: subscriptionPeriodEnd,
        subscriptionType: subscriptionType,
      })
      .eq('id', userId);

    try { 
      await generateAndDeliverHoroscope(userId); 
    } catch (e) { 
      console.error('Initial horoscope failed (checkout):', e); 
    }
  } catch (e) {
    console.error('checkout.session.completed handler error:', e);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Try to find the subscription associated with this payment
  if (paymentIntent.invoice) {
    try {
      const invoice = await stripe.invoices.retrieve(paymentIntent.invoice);
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        let userId = customer.metadata?.user_id;
        if (!userId) {
          const { data: match } = await supabase
            .from('users')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .maybeSingle();
          userId = match?.id;
        }
        
        if (userId) {
          console.log('Payment succeeded for user:', userId, 'triggering horoscope generation');
          try { 
            await generateAndDeliverHoroscope(userId); 
          } catch (e) { 
            console.error('Horoscope generation failed after payment:', e); 
          }
        }
      }
    } catch (e) {
      console.warn('Could not process payment_intent.succeeded:', e?.message || e);
    }
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Handling subscription created:', subscription.id);
  console.log('Subscription data:', JSON.stringify(subscription, null, 2));
  
  const customerId = subscription.customer;
  console.log('Customer ID:', customerId);
  
  try {
    const customer = await stripe.customers.retrieve(customerId);
    console.log('Customer data:', JSON.stringify(customer, null, 2));
    
    const userId = customer.metadata.user_id;
    console.log('User ID from metadata:', userId);

    if (!userId) {
      console.error('No user_id found in customer metadata');
      return;
    }

    // Safely handle the subscription period end
    let subscriptionPeriodEnd = null;
    if (subscription.current_period_end) {
      try {
        subscriptionPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        console.log('Subscription period end:', subscriptionPeriodEnd);
      } catch (dateError) {
        console.error('Error parsing subscription period end:', dateError);
        // Set a default date (7 days from now for trial)
        subscriptionPeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      }
    } else {
      // Set a default date (7 days from now for trial)
      subscriptionPeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }

    const priceId = subscription.items?.data?.[0]?.price?.id || null;
    const mappedStatus = mapSubscriptionStatus(subscription.status, priceId);
    const subscriptionType = mapPriceIdToSubscriptionType(priceId);

    // Update user's subscription status in database
    const updateData = {
      subscription_status: mappedStatus || 'trialing',
      subscription_period_end: subscriptionPeriodEnd,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      subscription_plan: priceId,
      subscriptionType: subscriptionType
    };
    
    console.log('Updating user with data:', updateData);
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user subscription:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Successfully updated user subscription for user:', userId);
      console.log('Updated data:', data);

      // Generate and deliver the first horoscope immediately
      try {
        await generateAndDeliverHoroscope(userId);
      } catch (genErr) {
        console.error('Initial horoscope generation failed:', genErr);
      }
    }
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Handling subscription updated:', subscription.id);
  
  const customerId = subscription.customer;
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.user_id;

  if (!userId) {
    console.error('No user_id found in customer metadata');
    return;
  }

  // Safely handle the subscription period end
  let subscriptionPeriodEnd = null;
  if (subscription.current_period_end) {
    try {
      subscriptionPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    } catch (dateError) {
      console.error('Error parsing subscription period end:', dateError);
      subscriptionPeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  const mappedStatus = mapSubscriptionStatus(subscription.status, priceId);
  const subscriptionType = mapPriceIdToSubscriptionType(priceId);

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: mappedStatus,
      subscription_period_end: subscriptionPeriodEnd,
      subscriptionType: subscriptionType,
      subscription_plan: priceId
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user subscription:', error);
  } else {
    console.log('Successfully updated user subscription for user:', userId);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Handling subscription deleted:', subscription.id);
  
  const customerId = subscription.customer;
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.user_id;

  if (!userId) {
    console.error('No user_id found in customer metadata');
    return;
  }

  // Safely handle the subscription period end
  let subscriptionPeriodEnd = null;
  if (subscription.current_period_end) {
    try {
      subscriptionPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    } catch (dateError) {
      console.error('Error parsing subscription period end:', dateError);
      subscriptionPeriodEnd = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      subscription_period_end: subscriptionPeriodEnd,
      subscriptionType: null
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user subscription:', error);
  } else {
    console.log('Successfully updated user subscription for user:', userId);
  }
}

// Scheduler: check due users every minute (can be disabled via SCHEDULER_ENABLED=false)
const schedulerEnabled = (process.env.SCHEDULER_ENABLED ?? 'true').toLowerCase() !== 'false';
if (schedulerEnabled) {
  cron.schedule('* * * * *', async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, subscription_status, subscriptionType, communicationChannel, send_to, email, zodiacSign')
        .in('subscription_status', ['basic', 'premium']);
      if (error) {
        console.error('Scheduler fetch users error:', error);
        return;
      }

      for (const u of users || []) {
        try {
          const messageType = mapSubscriptionTypeToMessageType(u.subscriptionType || 'daily');
          const { data: msgs, error: msgErr } = await supabase
            .from('horoscope')
            .select('sentat')
            .eq('user_id', u.id)
            .eq('messagetype', messageType)
            .order('sentat', { ascending: false })
            .limit(1);
          if (msgErr) {
            console.error('Fetch last message error:', msgErr);
            continue;
          }
          const lastSentAt = msgs?.[0]?.sentat || null;
          if (calculateIsDue(lastSentAt, u.subscriptionType || 'daily')) {
            console.log(`Sending ${messageType} to user ${u.id}`);
            await generateAndDeliverHoroscope(u.id);
          }
        } catch (innerErr) {
          // Avoid crashing the whole loop on a single user/network hiccup
          console.error('Scheduler per-user error:', innerErr?.message || innerErr);
        }
      }
    } catch (e) {
      // This "fetch failed" often indicates transient network/DNS issues; keep noise down
      const msg = e?.message || String(e);
      if (msg.includes('fetch failed')) {
        console.warn('Scheduler skipped this run due to temporary network issue.');
      } else {
        console.error('Scheduler error:', e);
      }
    }
  });
} else {
  console.log('Scheduler disabled via SCHEDULER_ENABLED=false');
}

// Manual trigger endpoint for testing
app.post('/trigger-horoscope/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Manual trigger requested for user: ${userId}`);
    
    await generateAndDeliverHoroscope(userId);
    
    res.json({ 
      success: true, 
      message: 'Horoscope generated and delivered successfully',
      userId: userId
    });
  } catch (error) {
    console.error('Manual trigger failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      userId: req.params.userId
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      sendgrid: hasSendGrid,
      twilio: hasTwilio,
      supabase: !!process.env.VITE_SUPABASE_URL,
      openai: !!process.env.OPENAI_API_KEY
    }
  });
});

// Test SMS endpoint
app.post('/test-sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    console.log(`Testing SMS to: ${phoneNumber}`);
    await deliverViaTwilio('sms', phoneNumber, message || 'Test message from Luraaya ✨');
    
    res.json({ success: true, message: 'SMS test sent successfully' });
  } catch (error) {
    console.error('SMS test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test WhatsApp endpoint
app.post('/test-whatsapp', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    console.log(`Testing WhatsApp to: ${phoneNumber}`);
    await deliverViaTwilio('whatsapp', phoneNumber, message || 'Test message from Luraaya ✨');
    
    res.json({ success: true, message: 'WhatsApp test sent successfully' });
  } catch (error) {
    console.error('WhatsApp test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user communication channel
app.post('/update-user-channel', async (req, res) => {
  try {
    const { userId, communicationChannel, send_to } = req.body;
    
    if (!userId || !communicationChannel) {
      return res.status(400).json({ error: 'User ID and communication channel required' });
    }

    const updateData = {
      communicationChannel: communicationChannel.toLowerCase(),
      send_to: send_to || null
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user channel:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Updated user ${userId} communication channel to: ${communicationChannel}`);
    res.json({ 
      success: true, 
      message: 'Communication channel updated successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('Update user channel failed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId, userId: bodyUserId, customerId: bodyCustomerId } = req.body || {};
    console.log('Received request to cancel subscription:', subscriptionId, 'userId:', bodyUserId, 'customerId:', bodyCustomerId);

    if (!subscriptionId && !bodyUserId && !bodyCustomerId) {
      return res.status(400).json({ success: false, message: 'subscriptionId or userId or customerId is required' });
    }

    let canceled = null;
    let subscription = null;

    // Try to retrieve (and cancel) the subscription directly if we have an ID
    if (subscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      } catch (retrieveErr) {
        console.warn('Retrieve by subscriptionId failed:', retrieveErr?.message);
      }

      if (subscription) {
        try {
          canceled = await stripe.subscriptions.cancel(subscriptionId);
          console.log('Stripe canceled subscription by id:', canceled?.id, 'status:', canceled?.status);
        } catch (cancelErr) {
          console.warn('Cancel by id failed:', cancelErr?.message);
        }
      }
    }

    // Fallback: determine customerId (from body, subscription, or Supabase via userId)
    let customerId = bodyCustomerId || (subscription && subscription.customer) || null;

    if (!canceled) {
      try {
        if (!customerId && bodyUserId) {
          const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('stripe_customer_id')
            .eq('id', bodyUserId)
            .maybeSingle();
          if (userErr) {
            console.warn('Supabase fetch user error:', userErr);
          }
          customerId = userRow?.stripe_customer_id || customerId;
        }

        if (customerId) {
          // List active/trialing subscriptions for this customer
          const list = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 5 });
          console.log('Found', list.data.length, 'subscriptions for customer', customerId);
          list.data.forEach((s, idx) => console.log(`#${idx} id=${s.id} status=${s.status} items=${s.items?.data?.map(i=>i.price?.id).join(',')}`));

          const activeOrTrialing = list.data.find(s => s.status === 'active' || s.status === 'trialing');
          if (activeOrTrialing) {
            console.log('Cancelling target subscription id:', activeOrTrialing.id, 'status:', activeOrTrialing.status);
            canceled = await stripe.subscriptions.cancel(activeOrTrialing.id);
            console.log('Stripe canceled subscription by customer fallback:', canceled?.id, 'status:', canceled?.status);
          } else if (list.data.length > 0) {
            // No active subscriptions; treat as already canceled and sync Supabase using the most recent subscription
            const mostRecent = list.data[0];
            console.log('No active/trialing subscriptions. Most recent status:', mostRecent.status, 'id:', mostRecent.id);
            canceled = mostRecent; // Use this to carry customer and period_end to Supabase sync
          } else {
            console.warn('No subscriptions found to cancel for customer:', customerId);
            // Create a minimal object to allow Supabase sync
            canceled = { customer: customerId, current_period_end: null, status: 'canceled' };
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback cancel attempt failed:', fallbackErr);
      }
    }

    if (!canceled) {
      return res.status(404).json({ success: false, message: 'No subscription could be canceled (not found)' });
    }

    // Best-effort: update Supabase immediately so the UI reflects cancellation without waiting for webhook
    try {
      const finalCustomerId = canceled.customer || customerId;
      let supabaseUserId = bodyUserId;

      if (!supabaseUserId && finalCustomerId) {
        try {
          const customer = await stripe.customers.retrieve(finalCustomerId);
          supabaseUserId = customer?.metadata?.user_id || supabaseUserId;
        } catch (e) {
          console.warn('Retrieve customer for metadata failed:', e?.message);
        }
      }

      let subscriptionPeriodEnd = null;
      if (canceled?.current_period_end) {
        try {
          subscriptionPeriodEnd = new Date(canceled.current_period_end * 1000).toISOString();
        } catch (e) {
          subscriptionPeriodEnd = new Date().toISOString();
        }
      }

      if (supabaseUserId) {
        const { error } = await supabase
          .from('users')
          .update({ 
            subscription_status: 'canceled', 
            subscription_period_end: subscriptionPeriodEnd,
            stripe_subscription_id: null,
            subscription_plan: null,
          })
          .eq('id', supabaseUserId);
        if (error) {
          console.error('Supabase update error during cancel:', error);
        } else {
          console.log('Supabase updated to canceled for user:', supabaseUserId);
        }
      } else if (finalCustomerId) {
        const { error } = await supabase
          .from('users')
          .update({ 
            subscription_status: 'canceled', 
            subscription_period_end: subscriptionPeriodEnd,
            stripe_subscription_id: null,
            subscription_plan: null,
          })
          .eq('stripe_customer_id', finalCustomerId);
        if (error) {
          console.error('Supabase update by customer_id failed:', error);
        } else {
          console.log('Supabase updated to canceled by customer_id:', finalCustomerId);
        }
      } else {
        console.warn('Could not determine user to update in Supabase');
      }
    } catch (syncErr) {
      console.error('Immediate Supabase sync after cancel failed:', syncErr);
    }

    // Note: Webhook (customer.subscription.deleted) will also arrive and reinforce the state
    return res.json({ success: true, subscription: canceled });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to cancel subscription' });
  }
});

app.listen(port, () => {
  console.log(`Webhook server listening at http://localhost:${port}`);
}); 