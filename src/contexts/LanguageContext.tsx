/**
 * Language Context for managing internationalization across the application
 * Provides language state and translation functions to all components
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

// Supported languages
export type Language = "en" | "de" | "fr";

// Language context interface
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Language provider props
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Language Provider component that wraps the entire application
 * Manages language state and provides translation functionality
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("de");

  // Set language and persist to localStorage
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("preferred-language", language);
  };

  // Translation function - gets text for current language
  const t = (key: string): string => {
    return getTranslation(key, currentLanguage);
  };

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "preferred-language"
    ) as Language;
    if (savedLanguage && ["en", "de", "fr"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Set default to German if no saved preference
      setCurrentLanguage("de");
    }
  }, []);

  const value = {
    currentLanguage,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use the language context
 * Throws error if used outside of LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

/**
 * Get translation for a specific key and language
 * Falls back to English if translation not found
 */
const getTranslation = (key: string, language: Language): string => {
  const translations = getTranslations();

  // Try to get translation for current language
  const translation = translations[language]?.[key];
  if (translation) {
    return translation;
  }

  // Fallback to English
  const englishTranslation = translations.en?.[key];
  if (englishTranslation) {
    return englishTranslation;
  }

  // Return key if no translation found
  return key;
};

/**
 * Get all translations object
 * In a real app, this would likely come from an API or translation files
 */
const getTranslations = () => {
  return {
    en: {
      // Navigationsleiste
      "nav.howItWorks": "Experience",
      "nav.pricing": "Membership",
      "nav.reviews": "Reviews",
      "nav.contact": "Contact",
      "nav.getStarted": " ",
      "nav.pricing": "Prices",
      "nav.dashboard": "Dashboard",
      "nav.login": "Log in",
      "nav.signup": "Sign up",
      "language.selectTitle": "Select language",

      // Footer ganz unten
      "footer.content":
        "Personal guidance from cosmic connections.",
      "footer.howItWorks": " ",
      "footer.pricing": " ",
      "footer.dashboard": " ",
      // zweiter Footer wäre hier möglich:
      "footer.resources": " ",
      "footer.astrologyGuide": " ",
      "footer.birthChartBasics": " ",
      "footer.helpCenter": " ",
      "footer.company": "Company",
      "footer.aboutUs": "About Us",
      "footer.careers": "Careers",
      "footer.contact": "Contact",
      // Legal
      "footer.columns.legal.title": "Information",
      "footer.legal.privacyPolicy": "Privacy Policy",
      "footer.legal.termsOfService": "Terms of Service",
      "footer.legal.cookies": "Cookies",
      "footer.columns.contact.title": "Contact",

      // Policy Datenschutz
      "privacy.title": "Privacy Policy",
      "privacy.section1.title": "1. General Information",
      "privacy.section1.1.title": "1.1 Data Controller",
      "privacy.section1.1.body": "The controller responsible for the processing of personal data within the meaning of the Swiss Federal Act on Data Protection (FADP) is: Luraaya, Hilfikerstrasse 4, 3014 Bern, Switzerland, email: luraaya@outlook.com. Hereinafter, Luraaya is referred to as “we”, “us” or “our service”. This privacy policy explains how we process personal data in connection with our website, our application and our digital services.",
      "privacy.section1.2.title": "1.2 Applicable Law",
      "privacy.section1.2.body": "Our data processing is subject to the Swiss Federal Act on Data Protection (FADP, revised FADP). Where applicable in individual cases, we also take into account the General Data Protection Regulation of the European Union (GDPR).",
      "privacy.section2.title": "2. Nature and Purpose of Data Processing",
      "privacy.section2.1.title": "2.1 Scope of the Service",
      "privacy.section2.1.body": "Luraaya provides a fully digital, subscription-based and largely automated application. The service is personalized and based on individual input provided by users. Without the collection of certain personal data, the service cannot be provided. The generated content is intended exclusively for informational and entertainment purposes. It does not constitute medical, psychological, therapeutic or legal advice and does not claim to be objectively or scientifically accurate.",
      "privacy.section3.title": "3. Personal Data Collected",
      "privacy.section3.1.title": "3.1 Categories of Personal Data",
      "privacy.section3.1.body": "We process in particular the following personal data: first and last name, date of birth, time of birth, place of birth, gender, email address, telephone number, preferred language, payment and billing information (via payment service providers) for contract performance, as well as technical data such as IP address, device and browser information. No particularly sensitive personal data such as health data, religious beliefs, or political or ideological views are collected.",
      "privacy.section3.2.title": "3.2 Profiling",
      "privacy.section3.2.body": "Sur la base des données que vous fournissez, des profils astrologiques individuels sont créés. Il s’agit d’un traitement automatisé des données visant à personnaliser les contenus. Aucune prise de décision automatisée produisant des effets juridiques ou des effets significatifs similaires au sens du droit de la protection des données n’a lieu.",
      "privacy.section4.title": "4. Legal Bases for Processing",
      "privacy.section4.body": "We process personal data for the following purposes on the basis of the applicable legal grounds: performance of a contract and pre-contractual measures for the provision of the application, the creation of personalized content, the processing of subscriptions and customer support; consent for optional features such as marketing communications, analytics and tracking technologies or comparable processing activities, where required by law, whereby any consent given may be withdrawn at any time; legitimate interests to ensure the security, stability and further development of our service, for the prevention of misuse and fraud, and for internal analysis and optimization; as well as legal obligations to which we are subject in connection with the processing of personal data.",
      "privacy.section5.title": "5. Use of Our Website and Application",
      "privacy.section5.1.title": "5.1 Server Log Files",
      "privacy.section5.1.body": "When accessing our website or application, technical data is automatically collected and temporarily stored, in particular the IP address, date and time of access, content accessed, referrer URL, as well as browser and system information. This data is used exclusively to ensure technical security, stability and optimization of the service.",
      "privacy.section6.title": "6. Cookies and Tracking",
      "privacy.section6.1.title": "6.1 Cookies",
      "privacy.section6.1.body": "We use cookies to ensure the functionality, security and user-friendliness of our website. Technically necessary cookies are used automatically. All other cookies are only set after prior consent. Consent can be withdrawn or adjusted at any time via the cookie settings.",
      "privacy.section6.2.title": "6.2 Analytics and Marketing Technologies",
      "privacy.section6.2.body": "Lorsque des technologies d’analyse, de marketing ou d’optimisation sont utilisées, cela se fait exclusivement sur la base de votre consentement, dans la mesure où la loi l’exige. Dans ce cadre, des données peuvent également être transmises à des prestataires tiers en Suisse ou à l’étranger.",
      "privacy.section6.3.title": "6.3 Data Security",
      "privacy.section6.3.body": "We implement appropriate technical and organizational measures to protect personal data against unauthorized access, loss, misuse or unlawful processing. These measures include, in particular, access restrictions, role-based authorization concepts, encryption and regular security reviews. The measures are continuously adapted to the state of the art.",
      "privacy.section7.title": "7. Third-Party Providers and Data Processing Agreements",
      "privacy.section7.1.title": "7.1 Service Providers Used",
      "privacy.section7.1.body": "We use in particular the following service providers: hosting and deployment (Vercel, Hostpoint), version control (GitHub), database and backend (Supabase), payment processing (Stripe), communication and messaging (Twilio), and AI-based processing (GPT API). These providers process personal data exclusively within the scope of their respective function. Independent use for their own purposes does not take place. Data processing agreements are concluded or prepared where required.",
      "privacy.section7.2.title": "7.2 Data Transfers Abroad",
      "privacy.section7.2.body": "Some of the service providers used have their registered office or server locations outside Switzerland or the European Union. In such cases, we ensure that personal data is only transferred if an adequate level of data protection is guaranteed, in particular through the conclusion of recognized standard contractual clauses or comparable appropriate safeguards.",
      "privacy.section8.title": "8. Retention and Deletion",
      "privacy.section8.body": "Personal data is retained only for as long as necessary for the provision of the services, for contract performance, for the protection of legitimate interests, or due to statutory retention obligations. After the respective purpose ceases to apply or upon a justified request, the data is deleted or anonymized in accordance with the applicable legal requirements.",
      "privacy.section9.title": "9. Communication",
      "privacy.section9.body": "Lorsque vous nous contactez via un formulaire de contact ou par e-mail, les informations transmises sont enregistrées afin de traiter votre demande. Les e-mails non chiffrés sont considérés comme non sécurisés. Nous recommandons de ne pas transmettre d’informations particulièrement confidentielles par e-mail.",
      "privacy.section10.title": "10. Rights of Data Subjects",
      "privacy.section10.body": "Within the scope of the applicable data protection law, you have in particular the right to obtain information about your processed personal data, to request the correction of inaccurate data, to request the deletion or restriction of processing, to object to certain processing activities, and to receive or transfer your data, where applicable. Requests should be addressed to the contact details provided in section 1.1.",
      "privacy.section11.title": "11. Liability and Advisory Disclaimer",
      "privacy.section11.body": "The content provided by Luraaya does not replace professional advice. It is not suitable as a basis for medical, psychological, therapeutic, legal or other decisions of significant importance.",
      "privacy.section12.title": "12. Changes to This Privacy Policy",
      "privacy.section12.body": "We reserve the right to amend this privacy policy at any time. The version published on our website at the time shall apply. The German version of this privacy policy shall be the legally binding version. Translations into other languages are provided for convenience only. In the event of discrepancies or interpretation issues, the German version shall prevail.",
      "privacy.section13.title": "13. Contact",
      "privacy.section13.body": "If you have any questions regarding data protection, please contact: luraaya@outlook.com",
      "privacy.navigation.back": "Back",
      "privacy.navigation.home": "Home",


      // Hero Section Startseite
      "hero.badge": " ",
      "hero.title": " ",
      "hero.titleHighlight": "Astrological",
      "hero.title2": " Insights for You",
      "hero.description": "Understand yourself and the world around you",
      "hero.cta": "Receive your insights",
      "hero.learnMore": "How It Works",
      "hero.rating": "",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "New message",
      "hero.dailyReading": "",
      "hero.personalizedFor": "Personalized for Laura R.",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Your Daily Horoscope",
      "hero.sampleMessage.content":
        "(...) The waxing Moon forms a trine with Pluto today, bringing your deeper inner currents more clearly to the surface. This constellation supports you in releasing what no longer serves you and making room for a decision that has already matured within you. (...)",
      "hero.sampleMessage.footer": "SMS • Daily • Premium",

      // Features Section
      "features.title": "Personal Guidance from \nCosmic Connections",
      "features.description": "Carefully calculated, clearly interpreted, personally delivered",
      "features.description2": " ",
      "features.description3": " ",

      // Kacheln Wie es funktioniert
      "features.personalizedChart.title": "1. Your birth configuration",
      "features.personalizedChart.description": "Your birth data form the personal starting point for every interpretation. From them, an individual astrological structure is derived, providing the basis for the cosmic context.",
      "features.dailyUpdates.title": "2. Cosmic context",
      "features.dailyUpdates.description": "Ongoing planetary movements are analysed in relation to your personal starting point. This contextualisation highlights which themes are currently intensifying and which cycles are unfolding over a longer period. The calculations are based on astronomical data and established astrological methods.",
      "features.multiChannel.title": "3. Your personal message",
      "features.multiChannel.description": "From this context emerge personal insights for your everyday life. The underlying connections are clearly articulated and summarised into concise, precise, and personal impulses.",
      
      // Astro Info Section
      "astroInfo.title": "Astrological Core Elements",
      "astroInfo.description": "Each of these eight elements serves a distinct function. Together, they allow for nuanced and individually tailored astrological insights.",

      "astroInfo.cards.birthChart.title": "Birth Chart",
      "astroInfo.cards.birthChart.title2": "Your personal foundational structure",
      "astroInfo.cards.birthChart.content": "The birth chart forms the astrological foundation of an individual. It is calculated using date of birth, time of birth, and place of birth, and shows the unique configuration of the Sun, Moon, planets, Ascendant, and houses at the moment of birth. This structure describes fundamental personality patterns, strengths, needs, and recurring life themes. The birth chart does not change; it serves as a reference framework for meaningfully interpreting current developments.\nYou gain a clear understanding of your personal blueprint and why certain themes and behavioural patterns accompany you throughout your life.",

      "astroInfo.cards.planets.title": "Planets",
      "astroInfo.cards.planets.title2": "Inner drives and principles of development",
      "astroInfo.cards.planets.content": "In astrology, planets represent core psychological functions and inner drives. The Sun, Moon, Mercury, Venus, and Mars describe fundamental needs, emotions, thinking patterns, relationship dynamics, and action energy. Slower-moving planets such as Jupiter, Saturn, Uranus, Neptune, and Pluto point to longer-term developmental phases and deeper processes of transformation. Each planet expresses itself differently depending on sign, house, and aspects.\nYou recognise which inner forces motivate you, where challenges arise, and how personal development unfolds over time.",

      "astroInfo.cards.zodiacSigns.title": "Zodiac Signs",
      "astroInfo.cards.zodiacSigns.title2": "How energy is expressed",
      "astroInfo.cards.zodiacSigns.content": "The twelve zodiac signs describe how astrological energy is expressed. They give planets a specific quality, attitude, and mode of expression—such as initiating, emotional, analytical, or visionary. Each sign has its own strengths, learning themes, and typical response patterns. Key signs in a personal chart include the Sun sign, Moon sign, and Ascendant.\nYou understand how your inner impulses are expressed outwardly and why you experience and shape situations in a particular way.",

      "astroInfo.cards.houses.title": "Houses",
      "astroInfo.cards.houses.title2": "Life areas and fields of experience",
      "astroInfo.cards.houses.content": "The twelve astrological houses show where inner potentials and current influences manifest concretely in life. These include, among others, self-expression and identity (1st house), values and security (2nd house), home and inner stability (4th house), relationships (7th house), and career and life direction (10th house). Planets and transits within a house activate these specific areas of life.\nYou gain clarity about which life areas are currently evolving and where attention, decisions, or change can be particularly effective.",

      "astroInfo.cards.aspects.title": "Aspects",
      "astroInfo.cards.aspects.title2": "How astrological forces interact",
      "astroInfo.cards.aspects.content": "Aspects describe the angular relationships between planets and show how different inner forces cooperate or come into tension. Common aspects include conjunction, trine, sextile, square, and opposition. Harmonious aspects support expression and development, while challenging aspects foster friction and growth. Aspects operate both in the birth chart and in current transits.\nYou gain a deeper understanding of inner dynamics and recognise where potential can unfold or conscious engagement is required.",

      "astroInfo.cards.transits.title": "Transits",
      "astroInfo.cards.transits.title2": "Current influences and timing",
      "astroInfo.cards.transits.content": "Transits describe the ongoing movement of planets in the sky and their relationship to your personal birth chart. They indicate which themes are currently activated and how the prevailing time quality affects you individually. Fast-moving planets shape daily experiences, while slower planets mark longer developmental phases. Transits are temporary and recur in cycles.\nYou gain orientation in the present moment and can consciously interpret and make use of current developments.",

      "astroInfo.cards.moonCycles.title": "Moon Phases and Rhythms",
      "astroInfo.cards.moonCycles.title2": "Emotional cycles in everyday life",
      "astroInfo.cards.moonCycles.content": "The Moon moves quickly and reflects emotional moods, needs, and inner reactions. The lunar phases—new moon, waxing moon, full moon, and waning moon—describe recurring cycles of beginnings, growth, culmination, and release. In connection with your chart, they show how these rhythms are personally experienced.\nYou learn to better understand emotional fluctuations and align your daily life more consciously with natural cycles.",

      "astroInfo.cards.forecastMethods.title": "Forecasting Methods",
      "astroInfo.cards.forecastMethods.title2": "Annual focus and inner development",
      "astroInfo.cards.forecastMethods.content": "Forecasting methods provide a deeper perspective on temporal developments and personal growth phases. These include, among others, the Solar Return chart, which outlines annual themes around your birthday, as well as selected progressions that make inner maturation processes visible. These methods complement transits with a longer-term perspective.\nYou gain orientation regarding overarching developmental phases and can consciously shape important periods of time.",

      "common.close": "Close",
      "common.next": "Next",
      "common.extend": "More",
      
      "astroInfo.footerText": "The premium model extends the basic model with forecasting methods and significantly deepens all elements. It examines connections over longer periods with a focus on development and dynamics.",
      "astroInfo.cta": "Receive your insights",

       // Pricing Info
      "pricing.title": "Prices and Subscriptions",
      "pricing.subtitle": "Transparent, flexible, and cancel anytime.",
      "pricing.priceLine": "From CHF 16 per month",
      "pricing.description": "Personal astrology insights, individually aligned with your birth configuration.",
      "pricing.bullets.customizable": "Individually customizable",
      "pricing.bullets.swissProvider": "Swiss provider",
      "pricing.bullets.cancelAnytime": "Cancel anytime",
      "pricing.cta": "Start your personal journey", 
      
        /*
      // Testimonials
      "testimonials.title": "Loved by Cosmic Seekers",
      "testimonials.description":
        "See what our users from all zodiac signs have to say about how personalized astrological insights have transformed their daily lives.",

      // Individual Testimonial Content
      "testimonials.luna.content":
        "The daily insights have been incredibly accurate and helpful. As a Pisces, I appreciate how the messages resonate with my intuitive nature and guide my creative projects.",
      "testimonials.david.content":
        "As a Leo, I love how the service captures my ambitious nature. The weekly forecasts have helped me time important business decisions perfectly.",
      "testimonials.aria.content":
        "The precision and detail in the birth chart analysis impressed my analytical Virgo mind. The insights are practical and actionable, not just vague predictions.",

      "testimonials.activeUsers": "Active Users",
      "testimonials.averageRating": "Average Rating",
      "testimonials.messagesDelivered": "Messages Delivered",
      */

      // Signup Form
      "signup.title": " ",
      "signup.description": " ",
      "signup.freeTrialNote": " ",

      "subscription.daily": "Daily",
      "subscription.weekly": "Weekly",
      "subscription.monthly": "Monthly",
      "common.recommended": "Recommended",

      "signup.guarantees": "Cancel anytime",
      "signup.securePayments": "Secure payments",
      "signup.support": "Swiss company",

      "signup.planFeatures.basic.perfect": " ",
      "signup.planFeatures.premium.complete":
        " ",

      "signup.planFeatures.basic.horoscopes": "Personal horoscope",
      "signup.planFeatures.basic.birthChart": "Interpretation of your zodiac sign",
      "signup.planFeatures.basic.lunar": "Planets and current transits",
      "signup.planFeatures.basic.compatibility": "Astrological birth configuration",
      "signup.planFeatures.basic.support": "Key astrological insights",

      "signup.planFeatures.premium.everything": "In-depth, personal horoscope",
      "signup.planFeatures.premium.advanced": "Interpretation of your zodiac sign",
      "signup.planFeatures.premium.transit": "Planets and current transits",
      "signup.planFeatures.premium.detailed": "Astrological birth configuration",
      "signup.planFeatures.premium.consultation": "Life areas based on astrological houses",
      "signup.planFeatures.premium.priority": "Moon phases and emotional cycles",
      "signup.planFeatures.premium.timing": "Advanced insights and guidance",

      "pricing.perMonth": "/month",
      "pricing.perYear": "/year",
      "pricing.orSaveYearly": "Or save with yearly billing:",
      "pricing.savePercent": "Save {{percent}}%",
      "pricing.saveAmount": "Save {{amount}} ({{percent}}%)",
      "pricing.percentOff": "{{percent}}% off",


      "signup.step1.title": "How would you like to receive your horoscope?",
      /*"signup.step1.description": "How would you like to receive your cosmic insights?",
      "signup.step2.title": "Personal Information",*/
      "signup.step2.description": " ",
      "signup.step3.title": "Birth Information",
      "signup.step3.description": "This data is essential for accurate astrological readings",
      "signup.step4.title": " ",
      "signup.step4.description": "Select the perfect plan for your cosmic journey",
      "signup.birthPlace.note": " ",
      "signup.communicationChannel": "Delivery method",
      "signup.messageFrequency": "Message Frequency",
      "signup.fullName": "Full Name",
      "signup.email": "Email Address",
      "signup.sms": "SMS Number",
      "signup.whatsapp": "WhatsApp Number",
      "signup.language.note": "Preferred language for your horoscope",
      "language.english": "English",
      "language.german": "German",
      "language.french": "French",
      "signup.sex": "Sex",
      "sex.female": "Female",
      "sex.male": "Male",
      "sex.other": "Other",
      "signup.dateOfBirth": "Date of Birth",
      "signup.timeOfBirth": "Time of Birth (If known)",
      "errors.timeOfBirthRequiredPremium": "Required for Premium plans",
      "signup.placeOfBirth": "Place of Birth",
      "signup.placeOfBirthPlaceholder": "City, Country",
      "signup.yourSelection": "Your Selection",
      "signup.messages": "Messages",
      "signup.via": "via",
      "signup.zodiacSign": "Zodiac Sign",
      "signup.monthly": "Monthly Subscription",
      "signup.yearly": "Yearly Subscription",
      "signup.save": "Save",
      "signup.basicPlan": "Basic",
      "signup.premiumPlan": "Premium",
      "signup.mostPopular": "Most Popular",
      "signup.previous": "Previous",
      "signup.nextStep": "Continue to step 2",
      "signup.nextStep2": "Continue to step 3",
      "signup.startJourney": "Start My Cosmic Journey",
      "signup.terms.acceptAgbPrefix": "I accept the",
      "signup.terms.agb": "Terms and Conditions",
      "signup.terms.acceptPrivacyPrefix": "I accept the",
      "signup.terms.privacy": "Privacy Policy",
      "signup.terms.acceptPrivacySuffix": " ",
      "errors.acceptTermsAndPrivacy": "Please confirm the Terms and Conditions and the Privacy Policy.",

      // Payment
      "payment.success.title": "Payment successful",
      "payment.success.body": "Your subscription is active. You will be redirected to your dashboard shortly.",
      "payment.success.cta": "Go to dashboard",
      "payment.canceled.title": "Payment canceled",
      "payment.canceled.body": "The payment was canceled. You can try again below at any time.",
      "errors.genericCheckout": "Payment could not be started. Please try again.",
 
      // Dashboard
      "dashboard.myHoroscopes": "My Horoscopes",
      "dashboard.profile": "Profile",
      "dashboard.settings": "Settings",
      "dashboard.logout": "Logout",
      "dashboard.total": "Total",
      "dashboard.unread": "Unread",
      "dashboard.horoscopesDescription":
        "Your personalized astrological readings and cosmic insights.",
      "dashboard.search": "Search your horoscopes...",
      "dashboard.status": "Status",
      "dashboard.allHoroscopes": "All Horoscopes",
      "dashboard.unreadOnly": "Unread Only",
      "dashboard.readOnly": "Read Only",
      "dashboard.noHoroscopes": "No horoscopes found",
      "dashboard.noHoroscopesDescription":
        "No cosmic messages match your search criteria.",
      "dashboard.adjustSearch": "Try adjusting your search or filter settings.",
      "dashboard.new": "New",
      "dashboard.shareReading": "Share Reading",
      "dashboard.markAsRead": "Mark as read",

      // Dashboard Profile
      "dashboard.profileDescription":
        "Manage your personal information and astrological details.",
      "dashboard.editProfile": "Edit Profile",
      "dashboard.born": "Born",
      "dashboard.time": "Time",
      "dashboard.place": "Place",
      "dashboard.editProfileInfo": "Edit Profile Information",
      "dashboard.profileInfo": "Profile Information",
      "dashboard.personalInfo": "Personal Information",
      "dashboard.birthInfo": "Birth Information",
      "dashboard.yourZodiacSign": "Your zodiac sign",
      "dashboard.birthPlacePlaceholder": "City, State/Province, Country",
      "dashboard.subscriptionPrefs": "Subscription Preferences",
      "dashboard.preferredChannel": "Preferred Channel",
      "dashboard.messageFrequency": "Message Frequency",
      "dashboard.saveChanges": "Save Changes",
      "dashboard.profileUpdated": "Profile updated successfully!",

      // Dashboard Settings
      "dashboard.settingsDescription":
        "Manage your account settings, subscription, and preferences.",
      "dashboard.accountSecurity": "Account Security",
      "dashboard.updateEmail": "Update Email Address",
      "dashboard.currentEmail": "Current Email",
      "dashboard.newEmail": "New Email Address",
      "dashboard.newEmailPlaceholder": "Enter new email address",
      "dashboard.updateEmailButton": "Update Email",
      "dashboard.changePassword": "Change Password",
      "dashboard.currentPassword": "Current Password",
      "dashboard.newPassword": "New Password",
      "dashboard.confirmPassword": "Confirm New Password",
      "dashboard.currentPasswordPlaceholder": "Enter current password",
      "dashboard.newPasswordPlaceholder": "Enter new password",
      "dashboard.confirmPasswordPlaceholder": "Confirm new password",
      "dashboard.updatePasswordButton": "Update Password",
      "dashboard.subscriptionManagement": "Subscription Management",
      "dashboard.currentPlan": "Current Plan",
      "dashboard.plan": "Plan",
      "dashboard.active": "Active",
      "dashboard.expired": "Expired",
      "dashboard.nextBilling": "Next Billing",
      "dashboard.amount": "Amount",
      "dashboard.month": "month",
      "dashboard.paymentMethod": "Payment Method",
      "dashboard.card": "Card",
      "dashboard.updatePaymentMethod": "Update Payment Method",
      "dashboard.changePlan": "Change Plan",
      "dashboard.cancelSubscription": "Cancel Subscription",
      "dashboard.noSubscription": "No subscription",
      "dashboard.notificationPreferences": "Notification Preferences",
      "dashboard.toggle": "Toggle",
      "dashboard.dangerZone": "Danger Zone",
      "dashboard.deleteAccount": "Delete Account",
      "dashboard.deleteAccountDescription":
        "Permanently delete your account and all associated data. This action cannot be undone.",
      "dashboard.deleteAccountButton": "Delete Account",
      "dashboard.emailUpdated": "Email updated successfully!",
      "dashboard.passwordMismatch": "New passwords do not match!",
      "dashboard.passwordUpdated": "Password updated successfully!",
      "dashboard.cancelSubscriptionConfirm":
        "Are you sure you want to cancel your subscription? You will lose access to premium features.",
      "dashboard.cancelSubscriptionError":
        "Error cancelling subscription. Please try again later.",
      "dashboard.subscriptionCancelled":
        "Subscription cancelled. You will retain access until your next billing date.",
      "dashboard.deleteAccountConfirm":
        'Type "DELETE" to confirm account deletion:',
      "dashboard.accountDeletionRequested":
        "Account deletion request submitted. You will receive a confirmation email.",
      "dashboard.invalidCurrentPassword":
        "Invalid current password. Please try again.",
      "dashboard.passwordUpdateError":
        "Error updating password. Please try again later.",

      // Dashboard Navigation
      "dashboard.account": "Account",
      "dashboard.userAvatar": "User Avatar",
      "dashboard.closeMenu": "Close menu",
      "dashboard.openMenu": "Open menu",

      // Message Types
      "dashboard.messageTypes.daily_horoscope": "Daily Horoscope",
      "dashboard.messageTypes.weekly_forecast": "Weekly Forecast",
      "dashboard.messageTypes.monthly_reading": "Monthly Reading",
      "dashboard.messageTypes.planetary_transit": "Planetary Transit",
      "dashboard.messageTypes.personalized_insight": "Personal Insight",

      // Sex Options
      "dashboard.sex.female": "Female",
      "dashboard.sex.male": "Male",
      "dashboard.sex.other": "Other",

      // Notification Settings
      "dashboard.notifications.emailNotifications": "Email Notifications",
      "dashboard.notifications.emailNotificationsDescription":
        "Receive horoscopes and updates via email",
      "dashboard.notifications.smsNotifications": "SMS Notifications",
      "dashboard.notifications.smsNotificationsDescription":
        "Receive horoscopes and alerts via SMS",
      "dashboard.notifications.pushNotifications": "Push Notifications",
      "dashboard.notifications.pushNotificationsDescription":
        "Receive push notifications in your browser",
      "dashboard.notifications.weeklyDigest": "Weekly Digest",
      "dashboard.notifications.weeklyDigestDescription":
        "Get a weekly summary of your cosmic insights",

      // Common
      "common.email": "By email",
      "common.sms": "By SMS",
      "common.whatsapp": "WhatsApp",
      "common.daily": " ",
      "common.weekly": " ",
      "common.monthly": " ",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
    },
    de: {
      // Navigationsleiste
      "nav.howItWorks": "Ablauf",
      "nav.pricing": "Abo",
      "nav.reviews": " ",
      "nav.getStarted": " ",
      "nav.pricing": "Preise",
      "nav.contact": "Kontakt",
      "nav.dashboard": " ",
      "nav.login": "Anmelden",
      "nav.signup": "Registrieren",
      "language.selectTitle": "Sprache auswählen",


      // Footer ganz unten
      "footer.content":
        "Persönliche Hinweise aus kosmischen Zusammenhängen.",
      "footer.howItWorks": " ",
      "footer.pricing": " ",
      "footer.dashboard": " ",
      // zweiter Footer wäre hier möglich:
      "footer.resources": " ",
      "footer.astrologyGuide": " ",
      "footer.birthChartBasics": " ",
      "footer.helpCenter": " ",
      "footer.company": "Unternehmen",
      "footer.aboutUs": "Über uns",
      "footer.careers": "Karriere",
      "footer.contact": "Kontakt",
      // Legal
      "footer.columns.legal.title": "Informationen",
      "footer.legal.privacyPolicy": "Datenschutzerklärung",
      "footer.legal.termsOfService": "Allgemeine Geschäftsbedingungen",
      "footer.legal.cookies": "Cookies",
      "footer.columns.contact.title": "Kontakt",

      // // Policy Datenschutz
      "privacy.title": "Datenschutzerklärung",
      "privacy.section1.title": "1. Allgemeine Hinweise",
      "privacy.section1.1.title": "1.1 Verantwortliche Stelle",
      "privacy.section1.1.body": "Verantwortlich für die Bearbeitung von Personendaten im Sinne des Schweizerischen Datenschutzgesetzes (DSG) ist: Luraaya, Hilfikerstrasse 4, 3014 Bern, Schweiz, E-Mail: luraaya@outlook.com. Nachfolgend wird Luraaya als „wir“, „uns“ oder „unser Angebot“ bezeichnet. Diese Datenschutzerklärung erläutert, wie wir Personendaten im Zusammenhang mit unserer Website und unseren digitalen Dienstleistungen bearbeiten.",
      "privacy.section1.2.title": "1.2 Anwendbares Recht",
      "privacy.section1.2.body": "Unsere Datenbearbeitung untersteht dem Schweizerischen Bundesgesetz über den Datenschutz (DSG, revDSG). Soweit im Einzelfall anwendbar, berücksichtigen wir ergänzend die Datenschutz-Grundverordnung der Europäischen Union (DSGVO).",
      "privacy.section2.title": "2. Art und Zweck der Datenbearbeitung",
      "privacy.section2.1.title": "2.1 Gegenstand der Dienstleistung",
      "privacy.section2.1.body": "Luraaya bietet einen vollständig digitalen, abonnementbasierten Webservice an. Die Leistung ist personalisiert und basiert auf individuellen Eingaben der Nutzerinnen und Nutzer. Ohne die Erhebung bestimmter Personendaten kann der Dienst nicht erbracht werden. Die erstellten Inhalte dienen ausschliesslich Informations- und Unterhaltungszwecken. Sie stellen keine medizinische, psychologische, therapeutische oder rechtliche Beratung dar und beanspruchen keine objektive oder wissenschaftliche Richtigkeit.",
      "privacy.section3.title": "3. Erhobene Personendaten",
      "privacy.section3.1.title": "3.1 Kategorien von Personendaten",
      "privacy.section3.1.body": "Wir bearbeiten insbesondere folgende Personendaten: Vor- und Nachname, Geburtsdatum, Geburtszeit, Geburtsort, Geschlecht, E-Mail-Adresse, Telefonnummer, bevorzugte Sprache, Zahlungs- und Abrechnungsinformationen (über Zahlungsanbieter) zur Vertragserfüllung sowie technische Daten wie IP-Adresse, Geräte- und Browserinformationen. Es werden keine besonders Schützenswerte Daten wie Gesundheitsdaten, keine religiösen Überzeugungen und keine politischen oder weltanschaulichen Angaben erhoben.",
      "privacy.section3.2.title": "3.2 Profiling",
      "privacy.section3.2.body": "Auf Basis der von Ihnen angegebenen Daten werden individuelle astrologische Profile erstellt. Dabei handelt es sich um eine Datenbearbeitung zur Personalisierung der Inhalte. Es erfolgt keine Entscheidungsfindung mit rechtlicher Wirkung oder vergleichbar erheblicher Auswirkung im Sinne des Datenschutzrechts.",
      "privacy.section4.title": "4. Rechtsgrundlagen der Bearbeitung",
      "privacy.section4.body": "Wir bearbeiten Personendaten zu den folgenden Zwecken gestützt auf die jeweils anwendbaren Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Massnahmen zur Bereitstellung der Dienste, zur Erstellung personalisierter Inhalte, zur Abwicklung von Abonnements sowie zur Kundenbetreuung; Einwilligung für optionale Funktionen wie Marketingkommunikation, Analyse- und Trackingtechnologien sowie vergleichbare Bearbeitungen, soweit gesetzlich erforderlich, wobei eine erteilte Einwilligung jederzeit widerrufen werden kann; berechtigtes Interesse zur Gewährleistung der Sicherheit, Stabilität und Weiterentwicklung unseres Angebots, zur Missbrauchs- und Betrugsprävention sowie zur internen Analyse und Optimierung; sowie gesetzliche Verpflichtungen, soweit wir zur Bearbeitung von Personendaten rechtlich verpflichtet sind.",
      "privacy.section5.title": "5. Nutzung unserer Website",
      "privacy.section5.1.title": "5.1 Server-Logfiles",
      "privacy.section5.1.body": "Beim Zugriff auf unsere Website werden automatisch technische Daten erfasst und temporär gespeichert, insbesondere die IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Inhalte, Referrer-URL sowie Browser- und Systeminformationen. Diese Daten dienen ausschliesslich der technischen Sicherheit, Stabilität und Optimierung des Angebots.",
      "privacy.section6.title": "6. Cookies, Tracking",
      "privacy.section6.1.title": "6.1 Cookies",
      "privacy.section6.1.body": "Wir verwenden Cookies, um die Funktionalität, Sicherheit und Benutzerfreundlichkeit unserer Website sicherzustellen. Technisch notwendige Cookies werden automatisch eingesetzt. Alle weiteren Cookies werden nur nach vorgängiger Einwilligung gesetzt. Die Einwilligung kann jederzeit über die Cookie-Einstellungen widerrufen oder angepasst werden.",
      "privacy.section6.2.title": "6.2 Analyse- und Marketing-Technologien",
      "privacy.section6.2.body": "Sofern Analyse-, Marketing- oder Optimierungstechnologien eingesetzt werden, erfolgt dies ausschliesslich auf Grundlage Ihrer Einwilligung, soweit gesetzlich erforderlich. Dabei können Daten auch an Drittanbieter im In- oder Ausland übermittelt werden.",
      "privacy.section6.3.title": "6.3 Datensicherheit",
      "privacy.section6.3.body": "Wir treffen angemessene technische und organisatorische Massnahmen, um Personendaten vor unbefugtem Zugriff, Verlust, Missbrauch oder unrechtmässiger Bearbeitung zu schützen. Dazu gehören insbesondere Zugriffsbeschränkungen, rollenbasierte Berechtigungskonzepte, Verschlüsselung sowie regelmässige Sicherheitsüberprüfungen. Die Massnahmen werden laufend an den Stand der Technik angepasst.",
      "privacy.section7.title": "7. Drittanbieter und Auftragsbearbeitung",
      "privacy.section7.1.title": "7.1 Eingesetzte Dienstleister",
      "privacy.section7.1.body": "Wir nutzen insbesondere folgende Dienstleister: Hosting und Deployment (Vercel, Hostpoint), Versionsverwaltung (GitHub), Datenbank und Backend (Supabase), Zahlungsabwicklung (Stripe), Kommunikation und Messaging (Twilio) sowie KI-basierte Verarbeitung (GPT-API). Diese Anbieter bearbeiten Personendaten ausschliesslich im Rahmen ihrer jeweiligen Funktion. Eine eigenständige Nutzung zu eigenen Zwecken erfolgt nicht. Auftragsbearbeitungsverträge werden, soweit erforderlich, abgeschlossen oder vorbereitet.",
      "privacy.section7.2.title": "7.2 Datenübermittlung ins Ausland",
      "privacy.section7.2.body": "Einzelne der eingesetzten Dienstleister haben ihren Sitz oder ihre Serverstandorte ausserhalb der Schweiz oder der Europäischen Union. In solchen Fällen stellen wir sicher, dass Personendaten nur übermittelt werden, wenn ein angemessenes Datenschutzniveau gewährleistet ist, insbesondere durch den Abschluss anerkannter Standarddatenschutzklauseln oder vergleichbarer geeigneter Garantien.",
      "privacy.section8.title": "8. Aufbewahrung und Löschung",
      "privacy.section8.body": "Personendaten werden nur so lange aufbewahrt, wie dies für die Erbringung der Dienstleistungen, zur Vertragserfüllung, zur Wahrung berechtigter Interessen oder aufgrund gesetzlicher Aufbewahrungspflichten erforderlich ist. Nach Wegfall des jeweiligen Zwecks oder auf berechtigte Anfrage hin werden die Daten im Rahmen der gesetzlichen Vorgaben gelöscht oder anonymisiert.",
      "privacy.section9.title": "9. Kommunikation",
      "privacy.section9.body": "Bei Kontaktaufnahme per Kontaktformular oder E-Mail werden die übermittelten Angaben zur Bearbeitung der Anfrage gespeichert. Unverschlüsselte E-Mails gelten als unsicher. Für besonders vertrauliche Informationen empfehlen wir keine Übermittlung per E-Mail.",
      "privacy.section10.title": "10. Rechte der betroffenen Personen",
      "privacy.section10.body": "Sie haben im Rahmen des anwendbaren Datenschutzrechts insbesondere das Recht auf Auskunft über Ihre bearbeiteten Personendaten, Berichtigung unrichtiger Daten, Löschung oder Einschränkung der Bearbeitung, Widerspruch gegen bestimmte Bearbeitungen sowie Herausgabe oder Übertragung Ihrer Daten, soweit anwendbar. Anfragen richten Sie bitte an die unter Ziffer 1.1 genannte Kontaktadresse.",
      "privacy.section11.title": "11. Haftungs- und Beratungsdisclaimer",
      "privacy.section11.body": "Die von Luraaya bereitgestellten Inhalte ersetzen keine fachliche Beratung. Sie sind nicht geeignet als Grundlage für medizinische, psychologische, therapeutische, rechtliche oder sonstige Entscheidungen mit erheblicher Tragweite.",
      "privacy.section12.title": "12. Änderungen dieser Datenschutzerklärung",
      "privacy.section12.body": "Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Es gilt die jeweils aktuelle, auf unserer Website veröffentlichte Version. Massgeblich ist ausschliesslich die deutsche Fassung dieser Datenschutzerklärung. Übersetzungen in andere Sprachen dienen lediglich der besseren Verständlichkeit. Im Falle von Abweichungen oder Auslegungsfragen geht die deutsche Version vor.",
      "privacy.section13.title": "13. Kontakt",
      "privacy.section13.body": "Bei Fragen zum Datenschutz wenden Sie sich bitte an: luraaya@outlook.com",
      "privacy.navigation.back": "Zurück",
      "privacy.navigation.home": "Startseite",      

      // Allgemeine Geschäftsbedingungen (AGB)
      "terms.title": "Allgemeine Geschäftsbedingungen",
      "terms.section1.title": "1. Geltungsbereich",
      "terms.section1.1.title": "1.1 Anwendungsbereich",
      "terms.section1.1.body": "Diese Allgemeinen Geschäftsbedingungen regeln die Rechtsbeziehung zwischen Luraaya, Bern, Schweiz (nachfolgend „Anbieterin“) und den Nutzerinnen und Nutzern der Website sowie der digitalen Dienstleistungen von Luraaya.",
      "terms.section1.2.title": "1.2 Zustimmung",
      "terms.section1.2.body": "Die Zustimmung zu diesen Allgemeinen Geschäftsbedingungen erfolgt verbindlich mit dem Abschluss eines kostenpflichtigen Abonnements. Der blosse Zugriff auf frei zugängliche Inhalte begründet kein Vertragsverhältnis.",
      "terms.section2.title": "2. Leistungsbeschreibung",
      "terms.section2.1.title": "2.1 Art des Angebots",
      "terms.section2.1.body": "Luraaya bietet ein vollständig digitales, abonnementbasiertes und personalisiertes Angebot im Bereich der Astrologie an. Die Leistungen umfassen die Erstellung und elektronische Zustellung astrologischer Inhalte auf Basis der vom Nutzer bereitgestellten Angaben sowie astrologischer Berechnungsmodelle. Die Leistungserbringung erfolgt ausschliesslich online.",
      "terms.section2.2.title": "2.2 Kein Leistungserfolg geschuldet",
      "terms.section2.2.body": "Es wird kein bestimmter Erfolg, keine konkrete Wirkung, keine inhaltliche Richtigkeit im objektiven Sinne und kein subjektiver Nutzen geschuldet. Die Inhalte sind interpretativer und orientierender Natur und erheben keinen wissenschaftlichen Anspruch.",
      "terms.section3.title": "3. Charakter der Inhalte",
      "terms.section3.1.title": "3.1 Keine Beratung",
      "terms.section3.1.body": "Die von Luraaya bereitgestellten Inhalte dienen ausschliesslich der allgemeinen Orientierung, Inspiration und persönlichen Reflexion. Sie stellen keine medizinische, psychologische, therapeutische, rechtliche, finanzielle oder sonstige fachliche Beratung dar und ersetzen eine solche nicht.",
      "terms.section3.2.title": "3.2 Eigenverantwortung",
      "terms.section3.2.body": "Entscheidungen, die auf Grundlage der Inhalte getroffen werden, erfolgen ausschliesslich auf eigene Verantwortung der Nutzer.",
      "terms.section4.title": "4. Vertragsschluss",
      "terms.section4.1.title": "4.1 Zustandekommen",
      "terms.section4.1.body": "Der Vertrag kommt zustande, sobald der Nutzer ein kostenpflichtiges Abonnement auswählt und den Zahlungsvorgang erfolgreich abschliesst.",
      "terms.section4.2.title": "4.2 Voraussetzungen",
      "terms.section4.2.body": "Mit Abschluss des Bestellvorgangs bestätigt der Nutzer die Richtigkeit der gemachten Angaben sowie seine rechtliche Handlungsfähigkeit.",
      "terms.section5.title": "5. Preise und Zahlung",
      "terms.section5.1.title": "5.1 Preise",
      "terms.section5.1.body": "Alle Preise sind in Schweizer Franken (CHF) angegeben, sofern nicht ausdrücklich anders ausgewiesen.",
      "terms.section5.2.title": "5.2 Zahlungsabwicklung",
      "terms.section5.2.body": "Die Zahlungsabwicklung erfolgt im Voraus über externe Zahlungsdienstleister, insbesondere Stripe. Ergänzend gelten die Bedingungen des jeweiligen Zahlungsanbieters.",
      "terms.section5.3.title": "5.3 Haftung bei Zahlungsdiensten",
      "terms.section5.3.body": "Die Anbieterin übernimmt keine Haftung für Störungen, Verzögerungen oder Fehler im Zusammenhang mit externen Zahlungsdiensten.",
      "terms.section6.title": "6. Abonnements, Laufzeit und Kündigung",
      "terms.section6.1.title": "6.1 Laufzeit",
      "terms.section6.1.body": "Abonnements werden je nach Auswahl mit monatlicher oder jährlicher Laufzeit abgeschlossen und verlängern sich automatisch um die jeweilige Laufzeit, sofern sie nicht vor Ablauf der aktuellen Abrechnungsperiode gekündigt werden.",
      "terms.section6.2.title": "6.2 Kündigung",
      "terms.section6.2.body": "Die Kündigung ist jederzeit möglich und wird auf das Ende der laufenden Abrechnungsperiode wirksam. Eine Kündigung begründet keinen Anspruch auf Rückerstattung, Minderung oder sonstige Vergütung bereits bezahlter Abonnementgebühren, unabhängig vom Zeitpunkt der Kündigung oder dem Umfang der bisherigen Nutzung.",
      "terms.section7.title": "7. Zustellung und Verfügbarkeit",
      "terms.section7.1.title": "7.1 Elektronische Zustellung",
      "terms.section7.1.body": "Die Zustellung der Inhalte erfolgt ausschliesslich über elektronische Kommunikationskanäle wie E-Mail oder SMS.",
      "terms.section7.2.title": "7.2 Technische Verfügbarkeit und Störungen",
      "terms.section7.2.body": "Die Anbieterin ist bemüht, eine möglichst unterbrechungsfreie Verfügbarkeit der digitalen Dienstleistungen sicherzustellen. Eine jederzeitige und vollständige Verfügbarkeit kann jedoch nicht garantiert werden. Bei technischen Störungen, Systemausfällen, Wartungsarbeiten oder Ereignissen ausserhalb des Einflussbereichs der Anbieterin kann die Zustellung der Inhalte vorübergehend ausgesetzt oder verzögert werden. Sofern es infolge solcher Störungen zu einer erheblichen und nicht nur geringfügigen Einschränkung der Leistungserbringung kommt, wird die Laufzeit des betroffenen Abonnements um die Dauer der tatsächlichen Einschränkung verlängert. Ein Anspruch auf Rückerstattung bereits geleisteter Entgelte besteht in keinem Fall.",
      "terms.section8.title": "8. Pflichten der Nutzer",
      "terms.section8.1.title": "8.1 Angaben",
      "terms.section8.1.body": "Die Nutzer verpflichten sich, korrekte und vollständige Angaben zu machen.",
      "terms.section8.2.title": "8.2 Nutzung",
      "terms.section8.2.body": "Das Angebot darf nicht missbräuchlich oder rechtswidrig genutzt werden. Bei Verstössen behält sich die Anbieterin das Recht vor, den Zugang einzuschränken oder zu beenden.",
      "terms.section9.title": "9. Haftung",
      "terms.section9.body": "Die Haftung der Anbieterin wird im gesetzlich zulässigen Umfang ausgeschlossen. Insbesondere haftet die Anbieterin nicht für Schäden oder Nachteile, die aus vorübergehenden technischen Störungen, Verzögerungen bei der Zustellung oder einer zeitweisen Nichtverfügbarkeit der digitalen Dienstleistungen entstehen. Vorbehalten bleibt die Haftung bei Vorsatz oder grober Fahrlässigkeit.",
      "terms.section10.title": "10. Geistiges Eigentum",
      "terms.section10.body": "Sämtliche Inhalte, Texte, Konzepte und Darstellungen von Luraaya sind urheberrechtlich geschützt.",
      "terms.section11.title": "11. Datenschutz",
      "terms.section11.body": "Die Bearbeitung personenbezogener Daten erfolgt gemäss der Datenschutzerklärung von Luraaya.",
      "terms.section12.title": "12. Änderungen der AGB",
      "terms.section12.body": "Die Anbieterin behält sich vor, diese Allgemeinen Geschäftsbedingungen jederzeit anzupassen. Wesentliche Änderungen werden den Nutzern in geeigneter Form mitgeteilt. Die fortgesetzte Nutzung des Angebots nach Inkrafttreten der Änderungen gilt als Zustimmung zur geänderten Fassung.",
      "terms.navigation.back": "Zurück",
      "terms.navigation.home": "Startseite",
      // Cookies
      "cookies.title": "Cookies",
      "cookies.intro": "Diese Cookies-Information erläutert den Einsatz von Cookies und vergleichbaren Technologien auf der Website sowie in den digitalen Dienstleistungen von Luraaya und ergänzt die Datenschutzerklärung.",
      "cookies.section1.title": "1. Allgemeine Hinweise",
      "cookies.section1.body": "Diese Cookies-Information erläutert, wie und zu welchem Zweck auf der Website sowie in den digitalen Dienstleistungen von Luraaya Cookies und vergleichbare Technologien eingesetzt werden. Sie ergänzt die Datenschutzerklärung. Massgeblich bleibt die Datenschutzerklärung in ihrer jeweils gültigen Fassung.",
      "cookies.section2.title": "2. Arten von Cookies",
      "cookies.section2.body": "Luraaya verwendet ausschliesslich Cookies, die für den Betrieb, die Sicherheit und die Funktionalität der Website erforderlich oder zweckmässig sind. Es werden keine Cookies eingesetzt, um Nutzerprofile zu erstellen, das Nutzungsverhalten über mehrere Websites hinweg zu verfolgen oder personenbezogene Werbung anzuzeigen.",
      "cookies.section2.1.title": "2.1 Technisch notwendige Cookies",
      "cookies.section2.1.body": "Technisch notwendige Cookies sind erforderlich, damit die Website und die digitalen Dienstleistungen korrekt funktionieren. Ohne diese Cookies können zentrale Funktionen nicht bereitgestellt werden. Dazu gehören insbesondere die Aufrechterhaltung von Login- und Sitzungsfunktionen, die Sprachwahl und grundlegende Navigation, Sicherheits- und Schutzmechanismen sowie die technische Stabilität und Performance der Website. Diese Cookies sind für den Betrieb zwingend erforderlich und können nicht deaktiviert werden.",
      "cookies.section2.2.title": "2.2 Funktionale Cookies",
      "cookies.section2.2.body": "Funktionale Cookies ermöglichen es, nutzerseitige Einstellungen zu speichern, um den Nutzungskomfort zu erhöhen. Dazu zählen insbesondere die Speicherung der bevorzugten Sprache oder ausgewählter Darstellungsoptionen. Der Einsatz funktionaler Cookies erfolgt ausschliesslich, sofern diese für die jeweilige Funktion notwendig sind.",
      "cookies.section2.3.title": "2.3 Analyse- und Statistik-Cookies",
      "cookies.section2.3.body": "Derzeit setzt Luraaya keine Analyse- oder Statistik-Cookies ein, welche das Nutzungsverhalten einzelnen Personen zuordnen oder eine Nachverfolgung ermöglichen. Sollte sich dies künftig ändern, werden die Nutzer vorgängig transparent informiert und, soweit rechtlich erforderlich, um ihre Einwilligung gebeten.",
      "cookies.section3.title": "3. Cookies von Drittanbietern",
      "cookies.section3.body": "Zur technischen Bereitstellung der Website und der digitalen Dienstleistungen können externe Dienstleister eingebunden sein, insbesondere für Hosting, Zahlungsabwicklung oder Kommunikationsfunktionen. Diese Dienstleister können technisch bedingt Cookies setzen, die ausschliesslich der sicheren, stabilen und vertragsgemässen Leistungserbringung dienen. Eine Bearbeitung erfolgt im Rahmen der vereinbarten Zwecke und unter Beachtung der anwendbaren Datenschutzbestimmungen.",
      "cookies.section4.title": "4. Einwilligung und Cookie-Einstellungen",
      "cookies.section4.body": "Beim erstmaligen Besuch der Website werden die Nutzer über den Einsatz von Cookies informiert. Technisch notwendige Cookies werden auf Grundlage berechtigter Interessen eingesetzt und bedürfen keiner gesonderten Einwilligung. Nutzer können Cookies jederzeit über die Einstellungen ihres Browsers einschränken oder löschen. Die Deaktivierung bestimmter Cookies kann jedoch die Funktionalität der Website beeinträchtigen.",
      "cookies.section5.title": "5. Rechtsgrundlagen",
      "cookies.section5.body": "Die Bearbeitung von Daten im Zusammenhang mit Cookies erfolgt gestützt auf das Schweizer Bundesgesetz über den Datenschutz (revDSG). Soweit anwendbar, werden auch die Bestimmungen der Datenschutz-Grundverordnung der Europäischen Union (DSGVO berücksichtigt.",
      "cookies.section6.title": "6. Änderungen der Cookies-Information",
      "cookies.section6.body": "Luraaya behält sich vor, diese Cookies-Information jederzeit anzupassen, insbesondere bei technischen, rechtlichen oder betrieblichen Änderungen. Es gilt jeweils die auf der Website veröffentlichte aktuelle Version.",
      "cookies.section7.title": "7. Kontakt",
      "cookies.section7.body": "Bei Fragen zum Einsatz von Cookies oder zum Datenschutz können sich die Nutzer an folgende Kontaktstelle wenden: Luraaya, Bern, Schweiz, E-Mail: luraaya@outlook.com.",
      "cookies.navigation.back": "Zurück",
      "cookies.navigation.home": "Startseite",


      // Hero Section Startseite
      "hero.badge": " ",
      "hero.title": " ",
      "hero.titleHighlight": "Astrologische ",
      "hero.title2": "Hinweise für dich",
      "hero.description": "Verstehe dich und die Welt um dich herum",
      "hero.cta": "Deine Hinweise erhalten",
      "hero.learnMore": "Wie es funktioniert",
      "hero.rating": " ",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "Neuer Hinweis",
      "hero.dailyReading": " ",
      "hero.personalizedFor": "Personalisiert für Laura R.",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Dein Tageshoroskop",
      "hero.sampleMessage.content":
        "(...) Die zunehmende Mondphase steht heute in einem Trigon zu Pluto und lässt tiefere innere Bewegungen deutlicher werden. Diese Konstellation unterstützt dich, Altes gehen zu lassen und Platz für eine Entscheidung freizumachen, die bereits in dir gereift ist. (...)",
      "hero.sampleMessage.footer": "SMS • Täglich • Premium",

      // Features Section
      "features.title": "Persönliche Hinweise aus \nkosmischen Zusammenhängen",
      "features.description": "Sorgfältig berechnet, verständlich interpretiert, persönlich übermittelt.",
      "features.description2": " ",
      "features.description3": " ",

      // Kacheln Wie es funktioniert
      "features.personalizedChart.title": "1. Deine Geburtskonstellation",
      "features.personalizedChart.description": "Deine Geburtsdaten bilden den persönlichen Ausgangspunkt jeder Einordnung. Aus ihnen entsteht eine individuelle astrologische Struktur und somit die Ausgangslage für die kosmische Einordnung.",
      "features.dailyUpdates.title": "2. Kosmische Einordnung",
      "features.dailyUpdates.description": "Die laufenden planetarischen Bewegungen werden in Bezug auf deine Ausgangslage analysiert. Die entstandene Einordnung zeigt, welche Themen sich aktuell verdichten und welche Zyklen längerfristig wirken. Die Berechnungen basieren auf astronomischen Daten und anerkannten astrologischen Verfahren.",
      "features.multiChannel.title": "3. Deine persönlicher Hinweis",
      "features.multiChannel.description": "Aus der Einordnung entstehen persönliche Hinweise für deinen Alltag. Die zugrunde liegenden Zusammenhänge werden verständlich aufbereitet und zu klaren Impulsen für dich zusammengefasst - präzise und persönlich.",
     
      // Astro Info Seciton
      "astroInfo.title": "Astrologische Grundelemente",
      "astroInfo.description": "Jedes dieser 8 Elemente erfüllt eine eigene Funktion. In ihrer Gesamtheit ermöglichen sie differenzierte und individuell abgestimmte astrologische Hinweise.",

      "astroInfo.cards.birthChart.title": "Geburtshoroskop",
      "astroInfo.cards.birthChart.title2": "Deine persönliche Grundstruktur",
      "astroInfo.cards.birthChart.content": "Das Geburtshoroskop bildet die astrologische Ausgangsbasis eines Menschen. Es wird aus Geburtsdatum, Geburtszeit und Geburtsort berechnet und zeigt die individuelle Konstellation von Sonne, Mond, Planeten, Aszendent und Häusern zum Zeitpunkt der Geburt. Diese Struktur beschreibt grundlegende Persönlichkeitsmuster, Stärken, Bedürfnisse und wiederkehrende Lebensthemen. Das Geburtshoroskop verändert sich nicht – es dient als Referenzrahmen, um aktuelle Entwicklungen sinnvoll einzuordnen.\nDu erhältst ein klares Bild deiner persönlichen Grundanlage und verstehst, warum bestimmte Themen und Verhaltensweisen dich ein Leben lang begleiten.",

      "astroInfo.cards.planets.title": "Planeten",
      "astroInfo.cards.planets.title2": "Innere Antriebe und Entwicklungsprinzipien",
      "astroInfo.cards.planets.content": "Planeten stehen in der Astrologie für zentrale psychologische Funktionen und innere Antriebe. Sonne, Mond, Merkur, Venus und Mars beschreiben grundlegende Bedürfnisse, Emotionen, Denken, Beziehungsmuster und Handlungsenergie. Die langsameren Planeten wie Jupiter, Saturn, Uranus, Neptun und Pluto weisen auf langfristige Entwicklungsphasen und tiefere Wandlungsprozesse hin. Jeder Planet wirkt unterschiedlich, je nach Zeichen, Haus und Aspekten.\nDu erkennst, welche inneren Kräfte dich motivieren, wo Herausforderungen liegen und wie sich persönliche Entwicklung über die Zeit entfaltet.",

      "astroInfo.cards.zodiacSigns.title": "Tierkreiszeichen",
      "astroInfo.cards.zodiacSigns.title2": "Wie sich Energie ausdrückt",
      "astroInfo.cards.zodiacSigns.content": "Die zwölf Tierkreiszeichen beschreiben die Art und Weise, wie astrologische Energie ausgedrückt wird. Sie geben Planeten eine bestimmte Qualität, Haltung und Ausdrucksform – zum Beispiel initiativ, emotional, analytisch oder visionär. Jedes Zeichen hat eigene Stärken, Lernfelder und typische Reaktionsmuster. Wichtige Zeichen im persönlichen Horoskop sind unter anderem das Sonnenzeichen, das Mondzeichen und der Aszendent.\nDu verstehst, wie deine inneren Impulse nach aussen wirken und warum du Situationen auf eine bestimmte Art erlebst und gestaltest.",

      "astroInfo.cards.houses.title": "Häuser",
      "astroInfo.cards.houses.title2": "Lebensbereiche und Erfahrungsfelder",
      "astroInfo.cards.houses.content": "Die zwölf astrologischen Häuser zeigen, in welchen Lebensbereichen sich innere Anlagen und aktuelle Einflüsse konkret entfalten. Dazu gehören unter anderem Auftreten und Selbstbild (1. Haus), Werte und Sicherheit (2. Haus), Zuhause und innere Stabilität (4. Haus), Beziehungen (7. Haus) sowie Beruf und Lebensrichtung (10. Haus). Planeten und Transite in einem Haus aktivieren genau diese Themenfelder.\nDu erkennst, in welchem Lebensbereich sich Entwicklungen aktuell zeigen und wo Aufmerksamkeit, Entscheidungen oder Veränderungen besonders wirksam sind.",

      "astroInfo.cards.aspects.title": "Aspekte",
      "astroInfo.cards.aspects.title2": "Wie astrologische Kräfte zusammenwirken",
      "astroInfo.cards.aspects.content": "Aspekte beschreiben die Winkelbeziehungen zwischen Planeten und zeigen, wie unterschiedliche innere Kräfte miteinander kooperieren oder in Spannung stehen. Häufige Aspekte sind Konjunktion, Trigon, Sextil, Quadrat und Opposition. Harmonische Aspekte erleichtern Ausdruck und Entwicklung, herausfordernde Aspekte fördern Reibung und Wachstum. Aspekte wirken sowohl im Geburtshoroskop als auch in aktuellen Transiten.\nDu verstehst innere Dynamiken besser und erkennst, wo sich Potenziale entfalten oder bewusste Auseinandersetzung gefragt ist.",

      "astroInfo.cards.transits.title": "Transite",
      "astroInfo.cards.transits.title2": "Aktuelle Einflüsse und Zeitqualität",
      "astroInfo.cards.transits.content": "Transite beschreiben die laufenden Bewegungen der Planeten am Himmel und deren Bezug zu deinem persönlichen Geburtshoroskop. Sie zeigen, welche Themen aktuell aktiviert werden und wie sich die gegenwärtige Zeitqualität individuell auswirkt. Schnelle Planeten prägen den Alltag, langsame Planeten markieren längere Entwicklungsphasen. Transite sind zeitlich begrenzt und wiederholen sich in Zyklen.\nDu erhältst Orientierung im Hier und Jetzt und kannst aktuelle Entwicklungen bewusster einordnen und nutzen.",

      "astroInfo.cards.moonCycles.title": "Mondphasen und Rhythmen",
      "astroInfo.cards.moonCycles.title2": "Emotionale Zyklen im Alltag",
      "astroInfo.cards.moonCycles.content": "Der Mond bewegt sich schnell und spiegelt emotionale Stimmungen, Bedürfnisse und innere Reaktionen. Die Mondphasen – Neumond, zunehmender Mond, Vollmond und abnehmender Mond – beschreiben wiederkehrende Zyklen von Beginn, Aufbau, Höhepunkt und Loslassen. In Verbindung mit deinem Horoskop zeigen sie, wie diese Rhythmen persönlich erlebt werden.\nDu lernst, emotionale Schwankungen besser zu verstehen und deinen Alltag im Einklang mit natürlichen Zyklen zu gestalten.",

      "astroInfo.cards.forecastMethods.title": "Prognosemethoden",
      "astroInfo.cards.forecastMethods.title2": "Jahresfokus und innere Entwicklung",
      "astroInfo.cards.forecastMethods.content": "Prognosemethoden ermöglichen einen vertieften Blick auf zeitliche Entwicklungen und persönliche Wachstumsphasen. Dazu gehören unter anderem das Solarhoroskop, das die Jahresthemen rund um den Geburtstag beschreibt, sowie ausgewählte Progressionen, die innere Reifungsprozesse sichtbar machen. Diese Methoden ergänzen Transite um eine längerfristige Perspektive.\nDu erhältst Orientierung über übergeordnete Entwicklungsphasen und kannst wichtige Zeitabschnitte bewusst gestalten.",

      "common.close": "Schliessen",
      "common.next": "Nächste",
      "common.extend": "Mehr",

      "astroInfo.footerText": "Das Premiummodell erweitert das Basismodell um Prognosemethoden und vertieft alle Elemente deutlich. Es werden Zusammenhänge über längere Zeiträume betrachtet mit einem Fokus auf Entwicklung und Dynamik.",
      "astroInfo.cta": "Deine Hinweise erhalten",
      
      // Pricing Info
      "pricing.title": "Preise und Abonnemente",
      "pricing.subtitle": "Transparent, flexibel und jederzeit kündbar.",
      "pricing.priceLine": "Ab CHF 16.– pro Monat",
      "pricing.description": "Persönliche astrologische Hinweise, individuell auf deine Geburtskonstellation abgestimmt.",
      "pricing.bullets.customizable": "Individuell anpassbar",
      "pricing.bullets.swissProvider": "Schweizer Anbieter",
      "pricing.bullets.cancelAnytime": "Jederzeit kündbar",
      "pricing.cta": "Zum persönlichen Einstieg",

        /*
      // Testimonials
      "testimonials.title": "Geliebt von kosmischen Suchenden",
      "testimonials.description":
        "Schau, wie personalisierte astrologische Einblicke das tägliche Leben von vielen vor Dir verändert haben.",

      // Individual Testimonial Content
      "testimonials.luna.content":
        "Die täglichen Einblicke waren unglaublich genau und hilfreich. Als Fische schätze ich, wie die Nachrichten mit meiner intuitiven Natur in Resonanz stehen und meine kreativen Projekte leiten.",
      "testimonials.david.content":
        "Als Löwe liebe ich, wie der Service meine ehrgeizige Natur erfasst. Die wöchentlichen Prognosen haben mir geholfen, wichtige Geschäftsentscheidungen perfekt zu timen.",
      "testimonials.aria.content":
        "Die Präzision und das Detail in der Geburtshoroskop-Analyse beeindruckten meinen analytischen Jungfrau-Verstand. Die Einblicke sind praktisch und umsetzbar, nicht nur vage Vorhersagen.",

      "testimonials.activeUsers": "Aktive Nutzer",
      "testimonials.averageRating": "Durchschnittsbewertung",
      "testimonials.messagesDelivered": "Nachrichten geliefert",
      */

      // Signup Form
      "signup.title": " ",
      "signup.description":   " ",
      "signup.freeTrialNote":  " ",

      "subscription.daily": "Täglich",
      "subscription.weekly": "Wöchentlich",
      "subscription.monthly": "Monatlich",
      "common.recommended": "Empfohlen",


      "signup.guarantees": "Jederzeit kündbar",
      "signup.securePayments": "Sichere Zahlungen",
      "signup.support": "Schweizer Unternehmen",
      
      "signup.planFeatures.basic.perfect": " ",
      "signup.planFeatures.premium.complete":
        " ",
      "signup.planFeatures.basic.horoscopes": "Persönliches Horoskop auf Basis deiner Geburtsdaten",
      "signup.planFeatures.basic.birthChart": "Deutung deines Sternzeichens",
      "signup.planFeatures.basic.lunar": "Planeten und aktuelle Transite",
      "signup.planFeatures.basic.compatibility":
        "Astrologische Geburtskonstellation",
      "signup.planFeatures.basic.support": "Zentrale astrologische Hinweise",

      "signup.planFeatures.premium.everything": "Tiefgehendes, persönliches Horoskop",
      "signup.planFeatures.premium.advanced":
        "Deutung deines Sternzeichens",
      "signup.planFeatures.premium.transit": "Planeten und aktuelle Transite",
      "signup.planFeatures.premium.detailed":
        "Astrologische Geburtskonstellation",
      "signup.planFeatures.premium.consultation":
        "Lebensbereiche nach astrologischen Häusern",
      "signup.planFeatures.premium.priority": "Mondphasen und emotionale Zyklen",
      "signup.planFeatures.premium.timing":
        "Vertiefte Hinweise und Orientierung",

      "pricing.perMonth": "/Monat",
      "pricing.perYear": " ",
      "pricing.orSaveYearly": " ",
      "pricing.savePercent": "Spare {{percent}}%",
      "pricing.saveAmount": "Spare {{amount}} ({{percent}}%)",
      "pricing.percentOff": " ",
      
      

      "signup.step1.title": "Wie möchtest du deine Hinweise erhalten?",
      "signup.step2.title": "Persönliche Informationen",
      "signup.step2.description": " ",
      "signup.step3.title": "Geburtsinformationen",
      "signup.step3.description": "Diese Daten sind für genaue astrologische Lesungen unerlässlich",
      "signup.step4.title": " ",
      "signup.step4.description": "Wähle den perfekten Plan für deine kosmische Reise",
      "signup.birthPlace.note": " ",
      "signup.communicationChannel": "Zustellungsart",
      "signup.messageFrequency": "Nachrichtenhäufigkeit",
      "signup.fullName": "Vorname Name",
      "signup.email": "E-Mail-Adresse",
      "signup.sms": "SMS-Nummer",
      "signup.whatsapp": "WhatsApp-Nummer",
      "signup.language": "Sprache",
      "signup.language.note": "Bevorzugte Sprache für dein Horoskop",
      "language.english": "Englisch",
      "language.german": "Deutsch",
      "language.french": "Französisch",
      "signup.sex": "Geschlecht",
      "sex.female": "Weiblich",
      "sex.male": "Männlich",
      "sex.other": "Divers",
      "signup.dateOfBirth": "Geburtsdatum",
      "signup.timeOfBirth": "Geburtszeit (Falls bekannt)",
      "errors.timeOfBirthRequiredPremium": "Für Premium erforderlich",
      "signup.placeOfBirth": "Geburtsort",
      "signup.placeOfBirthPlaceholder": "Ort, Land",
      "signup.yourSelection": "Deine Auswahl",
      "signup.messages": "Nachrichten",
      "signup.via": "über",
      "signup.zodiacSign": "Sternzeichen",
      "signup.monthly": "Monatsabo",
      "signup.yearly": "Jahresabo",
      "signup.save": "Speichern",

      "signup.basicPlan": "Basis",
      "signup.premiumPlan": "Premium",
      "signup.mostPopular": " ",
      "signup.previous": "Zurück",
      "signup.nextStep": "Weiter zu Schritt 2",
      "signup.nextStep2": "Weiter zu Schritt 3",
      "signup.startJourney": "Meine kosmische Reise beginnen",
      "signup.terms.acceptAgbPrefix": "Ich akzeptiere die",
      "signup.terms.agb": "AGB",
      "signup.terms.acceptPrivacyPrefix": "Ich akzeptiere die",
      "signup.terms.privacy": "Datenschutzrichtlinie",
      "signup.terms.acceptPrivacySuffix": " ",
      "errors.acceptTermsAndPrivacy": "Bitte bestätige die AGB und die Datenschutzrichtlinie.",

        // Zahlung
      "payment.success.title": "Zahlung erfolgreich",
      "payment.success.body": "Dein Abonnement ist aktiv. Du wirst in Kürze zum Dashboard weitergeleitet.",
      "payment.success.cta": "Zum Dashboard",
      "payment.canceled.title": "Zahlung abgebrochen",
      "payment.canceled.body": "Die Zahlung wurde abgebrochen. Du kannst den Vorgang unten jederzeit erneut starten.",
      "errors.genericCheckout": "Zahlung konnte nicht gestartet werden. Bitte versuche es erneut.",

      // Dashboard
      "dashboard.myHoroscopes": "Meine Horoskope",
      "dashboard.profile": "Profil",
      "dashboard.settings": "Einstellungen",
      "dashboard.logout": "Abmelden",
      "dashboard.total": "Gesamt",
      "dashboard.unread": "Ungelesen",
      "dashboard.horoscopesDescription": "Deine personalisierten astrologischen Hinweise und kosmischen Einblicke.",
      "dashboard.search": "Durchsuche Deine Horoskope...",
      "dashboard.status": "Status",
      "dashboard.allHoroscopes": "Alle Horoskope",
      "dashboard.unreadOnly": "Nur ungelesene",
      "dashboard.readOnly": "Nur gelesene",
      "dashboard.noHoroscopes": "Keine Horoskope gefunden",
      "dashboard.noHoroscopesDescription":
        "Keine kosmischen Nachrichten entsprechen Deiner Suchkriterien.",
      "dashboard.adjustSearch":
        "Versuche, Deine Such- oder Filtereinstellungen anzupassen.",
      "dashboard.new": "Neu",
      "dashboard.shareReading": "Lesung teilen",
      "dashboard.markAsRead": "Als gelesen markieren",

      // Dashboard Profile
      "dashboard.profileDescription":
        "Verwalte Deine persönlichen Informationen und astrologischen Details.",
      "dashboard.editProfile": "Profil bearbeiten",
      "dashboard.born": "Geboren",
      "dashboard.time": "Zeit",
      "dashboard.place": "Ort",
      "dashboard.editProfileInfo": "Profilinformationen bearbeiten",
      "dashboard.profileInfo": "Profilinformationen",
      "dashboard.personalInfo": "Persönliche Informationen",
      "dashboard.birthInfo": "Geburtsinformationen",
      "dashboard.yourZodiacSign": "Ihr Sternzeichen",
      "dashboard.birthPlacePlaceholder": "Stadt, Bundesland/Provinz, Land",
      "dashboard.subscriptionPrefs": "Abonnement-Einstellungen",
      "dashboard.preferredChannel": "Bevorzugter Kanal",
      "dashboard.messageFrequency": "Nachrichtenhäufigkeit",
      "dashboard.saveChanges": "Änderungen speichern",
      "dashboard.profileUpdated": "Profil erfolgreich aktualisiert!",

      // Dashboard Settings
      "dashboard.settingsDescription":
        "Verwalte Deine Kontoeinstellungen, Dein Abonnement und Deine Präferenzen.",
      "dashboard.accountSecurity": "Kontosicherheit",
      "dashboard.updateEmail": "E-Mail-Adresse aktualisieren",
      "dashboard.currentEmail": "Aktuelle E-Mail",
      "dashboard.newEmail": "Neue E-Mail-Adresse",
      "dashboard.newEmailPlaceholder": "Neue E-Mail-Adresse eingeben",
      "dashboard.updateEmailButton": "E-Mail aktualisieren",
      "dashboard.changePassword": "Passwort ändern",
      "dashboard.currentPassword": "Aktuelles Passwort",
      "dashboard.newPassword": "Neues Passwort",
      "dashboard.confirmPassword": "Neues Passwort bestätigen",
      "dashboard.currentPasswordPlaceholder": "Aktuelles Passwort eingeben",
      "dashboard.newPasswordPlaceholder": "Neues Passwort eingeben",
      "dashboard.confirmPasswordPlaceholder": "Neues Passwort bestätigen",
      "dashboard.updatePasswordButton": "Passwort aktualisieren",
      "dashboard.subscriptionManagement": "Abonnement-Verwaltung",
      "dashboard.currentPlan": "Aktueller Plan",
      "dashboard.plan": "Plan",
      "dashboard.active": "Aktiv",
      "dashboard.expired": "Abgelaufen",
      "dashboard.nextBilling": "Nächste Abrechnung",
      "dashboard.amount": "Betrag",
      "dashboard.month": "Monat",
      "dashboard.paymentMethod": "Zahlungsmethode",
      "dashboard.card": "Karte",
      "dashboard.updatePaymentMethod": "Zahlungsmethode aktualisieren",
      "dashboard.changePlan": "Plan ändern",
      "dashboard.cancelSubscription": "Abonnement kündigen",
      "dashboard.noSubscription": "Kein Abonnement",
      "dashboard.notificationPreferences": "Benachrichtigungseinstellungen",
      "dashboard.toggle": "Umschalten",
      "dashboard.dangerZone": "Gefahrenbereich",
      "dashboard.deleteAccount": "Konto löschen",
      "dashboard.deleteAccountDescription": "Lösche dein Konto und alle zugehörigen Daten dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.",
      "dashboard.deleteAccountButton": "Konto löschen",
      "dashboard.emailUpdated": "E-Mail erfolgreich aktualisiert!",
      "dashboard.passwordMismatch": "Neue Passwörter stimmen nicht überein!",
      "dashboard.passwordUpdated": "Passwort erfolgreich aktualisiert!",
      "dashboard.cancelSubscriptionConfirm":
        "Bist du sicher, dass du dein Abonnement kündigen möchtenst? Du verlieren den Zugang zu Premium-Funktionen.",
      "dashboard.cancelSubscriptionError":
        "Fehler bei der Kündigung des Abonnements. Bitte versuche es später erneut.",
      "dashboard.subscriptionCancelled":
        "Abonnement gekündigt. Du behälst den Zugang bis zu deinem nächsten Abrechnungsdatum.",
      "dashboard.deleteAccountConfirm":
        'Gebe "DELETE" ein, um die Kontolöschung zu bestätigen:',
      "dashboard.accountDeletionRequested":
        "Antrag auf Kontolöschung eingereicht. Du erhaltst eine Bestätigungs-E-Mail.",
      "dashboard.invalidCurrentPassword":
        "Ungültiges aktuelles Passwort. Bitte versuche es erneut.",
      "dashboard.passwordUpdateError":
        "Fehler beim Aktualisieren des Passworts. Bitte versuche es später erneut.",

      // Dashboard Navigation
      "dashboard.account": "Konto",
      "dashboard.userAvatar": "Benutzer-Avatar",
      "dashboard.closeMenu": "Menü schliessen",
      "dashboard.openMenu": "Menü öffnen",

      // Message Types
      "dashboard.messageTypes.daily_horoscope": "Tägliches Horoskop",
      "dashboard.messageTypes.weekly_forecast": "Wöchentliche Prognose",
      "dashboard.messageTypes.monthly_reading": "Monatliche Lesung",
      "dashboard.messageTypes.planetary_transit": "Planetarer Transit",
      "dashboard.messageTypes.personalized_insight": "Persönlicher Einblick",

      // Sex Options
      "dashboard.sex.female": "Weiblich",
      "dashboard.sex.male": "Männlich",
      "dashboard.sex.other": "Andere",

      // Notification Settings
      "dashboard.notifications.emailNotifications": "E-Mail-Benachrichtigungen",
      "dashboard.notifications.emailNotificationsDescription":
        "Erhalte Horoskope und Updates per E-Mail",
      "dashboard.notifications.smsNotifications": "SMS-Benachrichtigungen",
      "dashboard.notifications.smsNotificationsDescription":
        "Erhalte Horoskope und Warnungen per SMS",
      "dashboard.notifications.pushNotifications": "Push-Benachrichtigungen",
      "dashboard.notifications.pushNotificationsDescription":
        "Erhalte Push-Benachrichtigungen in deinem Browser",
      "dashboard.notifications.weeklyDigest": "Wöchentliche Zusammenfassung",
      "dashboard.notifications.weeklyDigestDescription":
        "Erhalte eine wöchentliche Zusammenfassung deiner kosmischen Einblicke",

      // Common
      "common.email": "Per E-Mail",
      "common.sms": "Per SMS",
      "common.whatsapp": "WhatsApp",
      "common.daily": " ",
      "common.weekly": " ",
      "common.monthly": " ",
      "common.save": "Speichern",
      "common.cancel": "Abbrechen",
      "common.edit": "Bearbeiten",
      "common.delete": "Löschen",
      "common.loading": "Laden...",
      "common.error": "Fehler",
      "common.success": "Erfolg",
    },
    fr: {
      // Navigationsleiste
      "nav.howItWorks": "Déroulement",
      "nav.pricing": "Abonnement",
      "nav.reviews": "Évaluations",
      "nav.getStarted": " ",
      "nav.pricing": "Prix",
      "nav.contact": "Contact",
      "nav.dashboard": "Tableau de bord",
      "nav.login": "Se connecter",
      "nav.signup": "S'inscrire",
      "language.selectTitle": "Choisir la langue",

      // Footer ganz unten
      "footer.content":
        "Indications personnelles issues des liens cosmiques.",
      "footer.howItWorks": " ",
      "footer.pricing": " ",
      "footer.dashboard": " ",
      // zweiter Footer wäre hier möglich:
      "footer.resources": " ",
      "footer.astrologyGuide": " ",
      "footer.birthChartBasics": " ",
      "footer.helpCenter": " ",
      "footer.company": "Entreprise",
      "footer.aboutUs": "À propos de nous",
      "footer.careers": "Carrières",
      "footer.contact": "Contact",
      // Legal
      "footer.columns.legal.title": "Informations",
      "footer.legal.privacyPolicy": "Politique de confidentialité",
      "footer.legal.termsOfService": "Conditions d’utilisation",
      "footer.legal.cookies": "Cookies",
      "footer.columns.contact.title": "Contact",
      
      // Policy Datenschutz
      "privacy.title": "Politique de confidentialité",
      "privacy.section1.title": "1. Informations générales",
      "privacy.section1.1.title": "1.1 Responsable du traitement",
      "privacy.section1.1.body": "Le responsable du traitement des données personnelles au sens de la loi fédérale suisse sur la protection des données (LPD) est : Luraaya, Hilfikerstrasse 4, 3014 Berne, Suisse, e-mail : luraaya@outlook.com. Ci-après, Luraaya est désignée par « nous », « notre » ou « notre service ». La présente politique de confidentialité explique comment nous traitons les données personnelles dans le cadre de notre site web, de notre application et de nos services numériques.",
      "privacy.section1.2.title": "1.2 Droit applicable",
      "privacy.section1.2.body": "Le traitement des données est régi par la loi fédérale suisse sur la protection des données (LPD, LPD révisée). Dans la mesure où cela est applicable au cas par cas, nous tenons également compte du règlement général sur la protection des données de l’Union européenne (RGPD).",
      "privacy.section2.title": "2. Nature et finalité du traitement des données",
      "privacy.section2.1.title": "2.1 Objet du service",
      "privacy.section2.1.body": "Luraaya propose une application entièrement numérique, basée sur un abonnement et largement automatisée. Le service est personnalisé et repose sur les informations fournies individuellement par les utilisatrices et utilisateurs. Sans la collecte de certaines données personnelles, le service ne peut pas être fourni. Les contenus générés sont destinés exclusivement à des fins d’information et de divertissement. Ils ne constituent ni un conseil médical, psychologique, thérapeutique ou juridique et ne prétendent pas à une exactitude objective ou scientifique.",
      "privacy.section3.title": "3. Données personnelles collectées",
      "privacy.section3.1.title": "3.1 Catégories de données personnelles",
      "privacy.section3.1.body": "Nous traitons notamment les données personnelles suivantes : prénom et nom, date de naissance, heure de naissance, lieu de naissance, sexe, adresse e-mail, numéro de téléphone, langue préférée, informations de paiement et de facturation (via des prestataires de paiement) pour l’exécution du contrat, ainsi que des données techniques telles que l’adresse IP, les informations sur l’appareil et le navigateur. Aucune donnée personnelle particulièrement sensible, telle que des données de santé, des convictions religieuses ou des opinions politiques ou philosophiques, n’est collectée.",
      "privacy.section3.2.title": "3.2 Profilage",
      "privacy.section3.2.body": "Sur la base des données que vous fournissez, des profils astrologiques individuels sont créés. Il s’agit d’un traitement automatisé des données visant à personnaliser les contenus. Aucune prise de décision automatisée produisant des effets juridiques ou des effets significatifs similaires au sens du droit de la protection des données n’a lieu.",
      "privacy.section4.title": "4. Bases légales du traitement",
      "privacy.section4.body": "Nous traitons les données personnelles aux fins suivantes sur la base des fondements juridiques applicables : exécution du contrat et mesures précontractuelles pour la mise à disposition de l’application, la création de contenus personnalisés, la gestion des abonnements et le service clientèle ; consentement pour des fonctionnalités optionnelles telles que les communications marketing, les technologies d’analyse et de suivi ou des traitements comparables, lorsque la loi l’exige, sachant que tout consentement donné peut être retiré à tout moment ; intérêt légitime visant à garantir la sécurité, la stabilité et le développement de notre service, à prévenir les abus et la fraude, ainsi qu’à des fins d’analyse et d’optimisation internes ; ainsi que les obligations légales auxquelles nous sommes soumis dans le cadre du traitement des données personnelles.",
      "privacy.section5.title": "5. Utilisation de notre site web et de notre application",
      "privacy.section5.1.title": "5.1 Fichiers journaux du serveur",
      "privacy.section5.1.body": "Lors de l’accès à notre site web ou à notre application, des données techniques sont automatiquement collectées et stockées temporairement, notamment l’adresse IP, la date et l’heure de l’accès, les contenus consultés, l’URL de référence ainsi que les informations relatives au navigateur et au système. Ces données servent exclusivement à garantir la sécurité technique, la stabilité et l’optimisation du service.",
      "privacy.section6.title": "6. Cookies et suivi",
      "privacy.section6.1.title": "6.1 Cookies",
      "privacy.section6.1.body": "Nous utilisons des cookies afin de garantir la fonctionnalité, la sécurité et la convivialité de notre site web. Les cookies strictement nécessaires sont utilisés automatiquement. Tous les autres cookies ne sont installés qu’après consentement préalable. Le consentement peut être retiré ou modifié à tout moment via les paramètres des cookies.",
      "privacy.section6.2.title": "6.2 Technologies d’analyse et de marketing",
      "privacy.section6.2.body": "Lorsque des technologies d’analyse, de marketing ou d’optimisation sont utilisées, cela se fait exclusivement sur la base de votre consentement, dans la mesure où la loi l’exige. Dans ce cadre, des données peuvent également être transmises à des prestataires tiers en Suisse ou à l’étranger.",
      "privacy.section6.3.title": "6.3 Sécurité des données",
      "privacy.section6.3.body": "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées afin de protéger les données personnelles contre tout accès non autorisé, perte, utilisation abusive ou traitement illicite. Ces mesures comprennent notamment des restrictions d’accès, des concepts d’autorisation basés sur les rôles, le chiffrement ainsi que des contrôles de sécurité réguliers. Les mesures sont adaptées en permanence à l’état de la technique.",
      "privacy.section7.title": "7. Prestataires tiers et traitement des données",
      "privacy.section7.1.title": "7.1 Prestataires utilisés",
      "privacy.section7.1.body": "Nous faisons notamment appel aux prestataires suivants : hébergement et déploiement (Vercel, Hostpoint), gestion des versions (GitHub), base de données et backend (Supabase), traitement des paiements (Stripe), communication et messagerie (Twilio), ainsi que traitement basé sur API GPT. Ces prestataires traitent les données personnelles exclusivement dans le cadre de leur fonction respective. Toute utilisation indépendante à leurs propres fins est exclue. Des accords de traitement des données sont conclus ou préparés lorsque cela est requis.",
      "privacy.section7.2.title": "7.2 Transfert de données à l’étranger",
      "privacy.section7.2.body": "Certains prestataires utilisés ont leur siège ou des emplacements de serveurs en dehors de la Suisse ou de l’Union européenne. Dans de tels cas, nous veillons à ce que les données personnelles ne soient transférées que si un niveau de protection des données adéquat est garanti, notamment par la conclusion de clauses contractuelles types reconnues ou de garanties appropriées comparables.",
      "privacy.section8.title": "8. Conservation et suppression",
      "privacy.section8.body": "Les données personnelles sont conservées uniquement aussi longtemps que nécessaire à la fourniture des services, à l’exécution du contrat, à la protection des intérêts légitimes ou en raison d’obligations légales de conservation. Une fois la finalité concernée atteinte ou sur demande justifiée, les données sont supprimées ou anonymisées conformément aux exigences légales applicables.",
      "privacy.section9.title": "9. Communication",
      "privacy.section9.body": "Lorsque vous nous contactez via un formulaire de contact ou par e-mail, les informations transmises sont enregistrées afin de traiter votre demande. Les e-mails non chiffrés sont considérés comme non sécurisés. Nous recommandons de ne pas transmettre d’informations particulièrement confidentielles par e-mail.",
      "privacy.section10.title": "10. Droits des personnes concernées",
      "privacy.section10.body": "Dans le cadre du droit applicable en matière de protection des données, vous disposez notamment du droit d’obtenir des informations sur les données personnelles vous concernant, de demander la rectification de données inexactes, la suppression ou la limitation du traitement, de vous opposer à certains traitements, ainsi que de recevoir ou de transférer vos données, le cas échéant. Les demandes doivent être adressées aux coordonnées mentionnées à la section 1.1.",
      "privacy.section11.title": "11. Clause de non-responsabilité et d’information",
      "privacy.section11.body": "Les contenus fournis par Luraaya ne remplacent pas un conseil professionnel. Ils ne sont pas adaptés pour servir de base à des décisions médicales, psychologiques, thérapeutiques, juridiques ou autres décisions importantes.",
      "privacy.section12.title": "12. Modifications de la présente politique de confidentialité",
      "privacy.section12.body": "Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. La version publiée sur notre site web au moment concerné fait foi. La version allemande de la présente politique de confidentialité fait foi juridiquement. Les traductions dans d’autres langues sont fournies uniquement à titre informatif. En cas de divergence ou de question d’interprétation, la version allemande prévaut.",
      "privacy.section13.title": "13. Contact",
      "privacy.section13.body": "Pour toute question relative à la protection des données, veuillez nous contacter à l’adresse suivante : luraaya@outlook.com",
      "privacy.navigation.back": "Retour",
      "privacy.navigation.home": "Accueil",


      // Hero Section Startseite
      "hero.badge": " ",
      "hero.title": "Indications ",
      "hero.titleHighlight": "astrologiques",
      "hero.title2": "pour vous",
      "hero.description": "Comprenez-vous, et le monde qui vous entoure.",
      "hero.cta": "Recevoir vos indication",
      "hero.learnMore": "Comment ça marche",
      "hero.rating": " ",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "Nouveau indication",
      "hero.dailyReading": " ",
      "hero.personalizedFor": "Personnalisé pour  R.",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Votre horoscope du jour",
      "hero.sampleMessage.content": "(...) La phase lunaire croissante forme aujourd’hui un trigone avec Pluton et fait ressortir plus clairement vos mouvements intérieurs les plus profonds. Cette constellation vous accompagne dans le processus de laisser partir l’ancien et de créer l’espace nécessaire pour une décision qui a déjà mûri en vous. (...)",
      "hero.sampleMessage.footer": "SMS • Quotidien • Premium",

      // Features Section
      "features.title": "Indications personnelles issues \ndes liens cosmiques",
      "features.description": "Soigneusement calculé, Interprété avec justesse, transmis personnellement",
      "features.description2": " ",
      "features.description3": " ",
        
      // Kacheln Wie es funktioniert
      "features.personalizedChart.title": "1. Votre configuration de naissance",
      "features.personalizedChart.description": "Vos données de naissance constituent le point de départ personnel de toute analyse. Elles permettent d’établir une structure astrologique individuelle, qui sert de base à la mise en perspective cosmique.",
      "features.dailyUpdates.title": "2. Mise en perspective cosmique",
      "features.dailyUpdates.description": "Les mouvements planétaires en cours sont analysés en lien avec votre situation de départ. Cette mise en perspective met en lumière les thèmes actuellement en jeu ainsi que les cycles qui s’inscrivent dans la durée. Les calculs reposent sur des données astronomiques et des méthodes astrologiques reconnues.",
      "features.multiChannel.title": "3. Vos indications personnelles",
      "features.multiChannel.description": "De cette mise en perspective résultent des indications personnelles pour votre quotidien. Les liens sous-jacents sont présentés de manière claire et synthétisés en impulsions précises et personnelles.",
      
      // Section d’information astrologique
      "astroInfo.title": "Fondements astrologiques",
      "astroInfo.description": "Chacun de ces huit éléments remplit une fonction spécifique. Ensemble, ils permettent des indications astrologiques nuancées et adaptées à votre individualité.",

      "astroInfo.cards.birthChart.title": "Thème natal",
      "astroInfo.cards.birthChart.title2": "Votre structure fondamentale personnelle",
      "astroInfo.cards.birthChart.content": "Le thème natal constitue la base astrologique d’une personne. Il est calculé à partir de la date de naissance, de l’heure de naissance et du lieu de naissance, et montre la configuration individuelle du Soleil, de la Lune, des planètes, de l’Ascendant et des maisons au moment de la naissance. Cette structure décrit les grands schémas de personnalité, les forces, les besoins et les thèmes de vie récurrents. Le thème natal ne change pas ; il sert de cadre de référence pour interpréter les évolutions actuelles de manière pertinente.\nVous obtenez une vision claire de votre structure de base personnelle et comprenez pourquoi certains thèmes et comportements vous accompagnent tout au long de votre vie.",

      "astroInfo.cards.planets.title": "Planètes",
      "astroInfo.cards.planets.title2": "Dynamiques intérieures et principes d’évolution",
      "astroInfo.cards.planets.content": "En astrologie, les planètes représentent des fonctions psychologiques centrales et des dynamiques intérieures. Le Soleil, la Lune, Mercure, Vénus et Mars décrivent les besoins fondamentaux, les émotions, la pensée, les schémas relationnels et l’énergie d’action. Les planètes plus lentes comme Jupiter, Saturne, Uranus, Neptune et Pluton indiquent des phases de développement à long terme et des processus de transformation plus profonds. Chaque planète agit différemment selon le signe, la maison et les aspects.\nVous identifiez les forces intérieures qui vous motivent, les zones de défi et la manière dont votre développement personnel se déploie dans le temps.",

      "astroInfo.cards.zodiacSigns.title": "Signes du zodiaque",
      "astroInfo.cards.zodiacSigns.title2": "La manière dont l’énergie s’exprime",
      "astroInfo.cards.zodiacSigns.content": "Les douze signes du zodiaque décrivent la façon dont l’énergie astrologique s’exprime. Ils confèrent aux planètes une qualité, une attitude et une forme d’expression spécifiques — par exemple initiatrice, émotionnelle, analytique ou visionnaire. Chaque signe possède ses forces, ses axes d’apprentissage et ses modes de réaction typiques. Les signes clés dans un thème personnel incluent notamment le signe solaire, le signe lunaire et l’Ascendant.\nVous comprenez comment vos impulsions intérieures se manifestent vers l’extérieur et pourquoi vous vivez et façonnez les situations d’une certaine manière.",

      "astroInfo.cards.houses.title": "Maisons",
      "astroInfo.cards.houses.title2": "Domaines de vie et champs d’expérience",
      "astroInfo.cards.houses.content": "Les douze maisons astrologiques montrent dans quels domaines de la vie les dispositions intérieures et les influences actuelles se manifestent concrètement. Elles incluent notamment l’expression de soi et l’identité (1re maison), les valeurs et la sécurité (2e maison), le foyer et la stabilité intérieure (4e maison), les relations (7e maison) ainsi que la carrière et l’orientation de vie (10e maison). Les planètes et les transits dans une maison activent précisément ces thématiques.\nVous identifiez les domaines de vie actuellement concernés par des évolutions et là où l’attention, les décisions ou les changements peuvent être particulièrement efficaces.",

      "astroInfo.cards.aspects.title": "Aspects",
      "astroInfo.cards.aspects.title2": "L’interaction des forces astrologiques",
      "astroInfo.cards.aspects.content": "Les aspects décrivent les relations angulaires entre les planètes et montrent comment différentes forces intérieures coopèrent ou entrent en tension. Les aspects courants incluent la conjonction, le trigone, le sextile, le carré et l’opposition. Les aspects harmonieux facilitent l’expression et le développement, tandis que les aspects dynamiques favorisent la confrontation et la croissance. Les aspects agissent à la fois dans le thème natal et dans les transits actuels.\nVous comprenez mieux les dynamiques intérieures et identifiez les potentiels à développer ou les zones nécessitant une prise de conscience.",

      "astroInfo.cards.transits.title": "Transits",
      "astroInfo.cards.transits.title2": "Influences actuelles et climat temporel",
      "astroInfo.cards.transits.content": "Les transits décrivent le mouvement actuel des planètes dans le ciel et leur relation avec votre thème natal. Ils indiquent quelles thématiques sont activées et comment la qualité du temps présent se manifeste de manière individuelle. Les planètes rapides influencent le quotidien, tandis que les planètes lentes marquent des phases de développement plus longues. Les transits sont limités dans le temps et s’inscrivent dans des cycles récurrents.\nVous obtenez des repères pour le présent et pouvez interpréter et utiliser les évolutions actuelles de manière plus consciente.",

      "astroInfo.cards.moonCycles.title": "Phases et rythmes lunaires",
      "astroInfo.cards.moonCycles.title2": "Cycles émotionnels au quotidien",
      "astroInfo.cards.moonCycles.content": "La Lune se déplace rapidement et reflète les humeurs émotionnelles, les besoins et les réactions intérieures. Les phases lunaires — nouvelle lune, lune croissante, pleine lune et lune décroissante — décrivent des cycles récurrents de commencement, de croissance, d’apogée et de lâcher-prise. En lien avec votre thème, elles montrent comment ces rythmes sont vécus personnellement.\nVous apprenez à mieux comprendre les fluctuations émotionnelles et à organiser votre quotidien en accord avec les rythmes naturels.",

      "astroInfo.cards.forecastMethods.title": "Méthodes de prévision",
      "astroInfo.cards.forecastMethods.title2": "Orientation annuelle et développement intérieur",
      "astroInfo.cards.forecastMethods.content": "Les méthodes de prévision permettent une analyse approfondie des évolutions temporelles et des phases de croissance personnelle. Elles incluent notamment le thème solaire, qui décrit les thématiques de l’année autour de votre anniversaire, ainsi que certaines progressions qui rendent visibles les processus de maturation intérieure. Ces méthodes complètent les transits par une perspective à plus long terme.\nVous obtenez une vision claire des grandes phases de développement et pouvez aborder consciemment les périodes importantes.",

      "common.close": "Fermer",
      "common.next": "Suivant",
      "common.extend": "Plus",

      "astroInfo.footerText": "Le modèle premium enrichit le modèle de base par des méthodes de prévision et approfondit nettement l’ensemble des éléments. Les liens sont analysés sur des périodes plus longues, avec un accent sur le développement et la dynamique.",
      "astroInfo.cta": "Recevoir vos indications",

      // Pricing Info
      "pricing.title": "Prix et abonnements",
      "pricing.subtitle": "Transparent, flexible et résiliable à tout moment.",
      "pricing.priceLine": "Dès CHF 16.– par mois",
      "pricing.description": "Des indications astrologiques personnelles, basées sur votre configuration de naissance.",
      "pricing.bullets.customizable": "Personnalisable individuellement",
      "pricing.bullets.swissProvider": "Prestataire suisse",
      "pricing.bullets.cancelAnytime": "Résiliable à tout moment",
      "pricing.cta": "Accéder à votre configuration personnelle",

      /*
      // Testimonials
      "testimonials.title": "Aimé par les chercheurs cosmiques",
      "testimonials.description": "Découvrez ce que nos utilisateurs de tous les signes du zodiaque disent sur la façon dont les aperçus astrologiques personnalisés ont transformé leur vie quotidienne.",

      // Individual Testimonial Content
      "testimonials.luna.content": "Les aperçus quotidiens ont été incroyablement précis et utiles. En tant que Poissons, j'apprécie comment les messages résonnent avec ma nature intuitive et guident mes projets créatifs.",
      "testimonials.david.content": "En tant que Lion, j'adore comment le service capture ma nature ambitieuse. Les prévisions hebdomadaires m'ont aidé à chronométrer parfaitement les décisions commerciales importantes.",
      "testimonials.aria.content": "La précision et le détail dans l'analyse du thème natal ont impressionné mon esprit analytique de Vierge. Les aperçus sont pratiques et exploitables, pas seulement des prédictions vagues.",

      "testimonials.activeUsers": "Utilisateurs actifs",
      "testimonials.averageRating": "Note moyenne",
      "testimonials.messagesDelivered": "Messages livrés",
      */

      // Signup Form
      "signup.title": " ",
      "signup.description": " ",
      "signup.freeTrialNote": " ",

      "subscription.daily": "Quotidien",
      "subscription.weekly": "Hebdomadaire",
      "subscription.monthly": "Mensuel",
      "common.recommended": "Recommandé",

      "signup.guarantees": "Résiliable à tout moment",
      "signup.securePayments": "Paiements sécurisés",
      "signup.support": "Entreprise suisse",
      "signup.planFeatures.basic.perfect": " ",
      "signup.planFeatures.premium.complete":
        " ",

      "signup.planFeatures.basic.horoscopes": "Horoscope personnel",
      "signup.planFeatures.basic.birthChart": "Interprétation de votre signe du zodiaque",
      "signup.planFeatures.basic.lunar": "Planètes et transits actuels",
      "signup.planFeatures.basic.compatibility":
        "Configuration astrologique de naissance",
      "signup.planFeatures.basic.support": "Indications astrologiques essentielles",

      "signup.planFeatures.premium.everything": "Horoscope personnel",
      "signup.planFeatures.premium.advanced": "Interprétation de votre signe du zodiaque",
      "signup.planFeatures.premium.transit": "Planètes et transits actuels",
      "signup.planFeatures.premium.detailed":
        "Configuration astrologique de naissance",
      "signup.planFeatures.premium.consultation":
        "Domaines de vie selon les maisons astrologiques",
      "signup.planFeatures.premium.priority": "Phases lunaires et cycles émotionnels",
      "signup.planFeatures.premium.timing":
        "Conseils et orientation approfondis",

        "pricing.perMonth": "/mois",
        "pricing.perYear": "/an",
        "pricing.orSaveYearly": "Ou economisez avec l’abonnement annuel :",
        "pricing.savePercent": "Avantage de {{percent}} %",
        "pricing.saveAmount": "Avantage de {{amount}} ({{percent}} %)",
        "pricing.percentOff": "{{percent}} % de reduction",


      "signup.step1.title": "Comment souhaitez-vous recevoir votre horoscope ?",
      /*"signup.step1.description":
        "dd",*/
      "signup.step2.title": "Informations personnelles",
      "signup.step2.description": " ",
      "signup.step3.title": "Informations de naissance",
      "signup.step3.description":
        "Ces données sont essentielles pour des lectures astrologiques précises",
      "signup.step4.title": " ",
      "signup.step4.description": "Sélectionnez le plan parfait pour votre voyage cosmique",
      "signup.birthPlace.note": " ",
      "signup.communicationChannel": "Mode de livraison",
      "signup.messageFrequency": "Fréquence des messages",
      "signup.fullName": "Nom complet",
      "signup.email": "Adresse e-mail",
      "signup.sms": "Numéro SMS",
      "signup.whatsapp": "Numéro WhatsApp",
      "signup.language.note": "Langue préférée pour votre horoscope",
      "language.english": "Anglais",
      "language.german": "Allemand",
      "language.french": "Français",
      "signup.sex": "Sexe",
      "sex.female": "Femme",
      "sex.male": "Homme",
      "sex.other": "Autre",
      "signup.dateOfBirth": "Date de naissance",
      "signup.timeOfBirth": "Heure de naissance (Si connue)",
      "errors.timeOfBirthRequiredPremium": "Requis pour Premium",
      "signup.placeOfBirth": "Lieu de naissance",
      "signup.placeOfBirthPlaceholder": "Ville, pays",
      "signup.yourSelection": "Votre sélection",
      "signup.messages": "Messages",
      "signup.via": "via",
      "signup.zodiacSign": "Signe du zodiaque",
      "signup.monthly": "Abonnement mensuel",
      "signup.yearly": "Abonnement annuel",
      "signup.save": "Enregistrer",
      "signup.basicPlan": "Base",
      "signup.premiumPlan": "Premium",
      "signup.mostPopular": "Le plus populaire",
      "signup.previous": "Précédent",
      "signup.nextStep": "Passer à l’étape 2",
      "signup.nextStep2": "Passer à l’étape 3",

      "signup.startJourney": "Commencer mon voyage cosmique",
      "signup.terms.acceptAgbPrefix": "J’accepte les",
      "signup.terms.agb": "conditions générales",
      "signup.terms.acceptPrivacyPrefix": "J’accepte la",
      "signup.terms.privacy": "politique de confidentialité",
      "signup.terms.acceptPrivacySuffix": " ",
      "errors.acceptTermsAndPrivacy": "Veuillez confirmer les conditions générales et la politique de confidentialité.",

      // Paiement
      "payment.success.title": "Paiement réussi",
      "payment.success.body": "Votre abonnement est actif. Vous serez redirigé vers votre tableau de bord dans quelques instants.",
      "payment.success.cta": "Aller au tableau de bord",
      "payment.canceled.title": "Paiement annulé",
      "payment.canceled.body": "Le paiement a été annulé. Vous pouvez réessayer à tout moment ci-dessous.",
      "errors.genericCheckout": "Le paiement n’a pas pu etre demarre. Veuillez reessayer.",

      // Dashboard
      "dashboard.myHoroscopes": "Mes horoscopes",
      "dashboard.profile": "Profil",
      "dashboard.settings": "Paramètres",
      "dashboard.logout": "Se déconnecter",
      "dashboard.total": "Total",
      "dashboard.unread": "Non lu",
      "dashboard.horoscopesDescription": "Vos lectures astrologiques personnalisées et aperçus cosmiques.",
      "dashboard.search": "Recherchez vos horoscopes...",
      "dashboard.status": "Statut",
      "dashboard.allHoroscopes": "Tous les horoscopes",
      "dashboard.unreadOnly": "Non lus seulement",
      "dashboard.readOnly": "Lus seulement",
      "dashboard.noHoroscopes": "Aucun horoscope trouvé",
      "dashboard.noHoroscopesDescription": "Aucun message cosmique ne correspond à vos critères de recherche.",
      "dashboard.adjustSearch": "Essayez d'ajuster vos paramètres de recherche ou de filtre.",
      "dashboard.new": "Nouveau",
      "dashboard.shareReading": "Partager la lecture",
      "dashboard.markAsRead": "Marquer comme lu",

      // Dashboard Profile
      "dashboard.profileDescription": "Gérez vos informations personnelles et détails astrologiques.",
      "dashboard.editProfile": "Modifier le profil",
      "dashboard.born": "Né",
      "dashboard.time": "Heure",
      "dashboard.place": "Lieu",
      "dashboard.editProfileInfo": "Modifier les informations du profil",
      "dashboard.profileInfo": "Informations du profil",
      "dashboard.personalInfo": "Informations personnelles",
      "dashboard.birthInfo": "Informations de naissance",
      "dashboard.yourZodiacSign": "Votre signe du zodiaque",
      "dashboard.birthPlacePlaceholder": "Ville, État/Province, Pays",
      "dashboard.subscriptionPrefs": "Préférences d'abonnement",
      "dashboard.preferredChannel": "Canal préféré",
      "dashboard.messageFrequency": "Fréquence des messages",
      "dashboard.saveChanges": "Enregistrer les modifications",
      "dashboard.profileUpdated": "Profil mis à jour avec succès !",

      // Dashboard Settings
      "dashboard.settingsDescription": "Gérez vos paramètres de compte, abonnement et préférences.",
      "dashboard.accountSecurity": "Sécurité du compte",
      "dashboard.updateEmail": "Mettre à jour l'adresse e-mail",
      "dashboard.currentEmail": "E-mail actuel",
      "dashboard.newEmail": "Nouvelle adresse e-mail",
      "dashboard.newEmailPlaceholder": "Entrez la nouvelle adresse e-mail",
      "dashboard.updateEmailButton": "Mettre à jour l'e-mail",
      "dashboard.changePassword": "Changer le mot de passe",
      "dashboard.currentPassword": "Mot de passe actuel",
      "dashboard.newPassword": "Nouveau mot de passe",
      "dashboard.confirmPassword": "Confirmer le nouveau mot de passe",
      "dashboard.currentPasswordPlaceholder": "Entrez le mot de passe actuel",
      "dashboard.newPasswordPlaceholder": "Entrez le nouveau mot de passe",
      "dashboard.confirmPasswordPlaceholder":
        "Confirmez le nouveau mot de passe",
      "dashboard.updatePasswordButton": "Mettre à jour le mot de passe",
      "dashboard.subscriptionManagement": "Gestion de l'abonnement",
      "dashboard.currentPlan": "Plan actuel",
      "dashboard.plan": "Plan",
      "dashboard.active": "Actif",
      "dashboard.expired": "Expiré",
      "dashboard.nextBilling": "Prochaine facturation",
      "dashboard.amount": "Montant",
      "dashboard.month": "mois",
      "dashboard.paymentMethod": "Méthode de paiement",
      "dashboard.card": "Carte",
      "dashboard.updatePaymentMethod": "Mettre à jour la méthode de paiement",
      "dashboard.changePlan": "Changer de plan",
      "dashboard.cancelSubscription": "Annuler l'abonnement",
      "dashboard.noSubscription": "Aucun abonnement",
      "dashboard.notificationPreferences": "Préférences de notification",
      "dashboard.toggle": "Basculer",
      "dashboard.dangerZone": "Zone de danger",
      "dashboard.deleteAccount": "Supprimer le compte",
      "dashboard.deleteAccountDescription": "Supprimez définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.",
      "dashboard.deleteAccountButton": "Supprimer le compte",
      "dashboard.emailUpdated": "E-mail mis à jour avec succès !",
      "dashboard.passwordMismatch": "Les nouveaux mots de passe ne correspondent pas !",
      "dashboard.passwordUpdated": "Mot de passe mis à jour avec succès !",
      "dashboard.cancelSubscriptionConfirm": "Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l'accès aux fonctionnalités premium.",
      "dashboard.cancelSubscriptionError":
        "Erreur lors de l'annulation de l'abonnement. Veuillez réessayer plus tard.",
      "dashboard.subscriptionCancelled":
        "Abonnement annulé. Vous conserverez l'accès jusqu'à votre prochaine date de facturation.",
      "dashboard.deleteAccountConfirm":
        'Tapez "DELETE" pour confirmer la suppression du compte :',
      "dashboard.accountDeletionRequested":
        "Demande de suppression de compte soumise. Vous recevrez un e-mail de confirmation.",
      "dashboard.invalidCurrentPassword":
        "Mot de passe actuel invalide. Veuillez réessayer.",
      "dashboard.passwordUpdateError":
        "Erreur lors de la mise à jour du mot de passe. Veuillez réessayer plus tard.",

      // Dashboard Navigation
      "dashboard.account": "Compte",
      "dashboard.userAvatar": "Avatar utilisateur",
      "dashboard.closeMenu": "Fermer le menu",
      "dashboard.openMenu": "Ouvrir le menu",

      // Message Types
      "dashboard.messageTypes.daily_horoscope": "Horoscope quotidien",
      "dashboard.messageTypes.weekly_forecast": "Prévision hebdomadaire",
      "dashboard.messageTypes.monthly_reading": "Lecture mensuelle",
      "dashboard.messageTypes.planetary_transit": "Transit planétaire",
      "dashboard.messageTypes.personalized_insight": "Aperçu personnalisé",

      // Sex Options
      "dashboard.sex.female": "Femme",
      "dashboard.sex.male": "Homme",
      "dashboard.sex.other": "Autre",

      // Notification Settings
      "dashboard.notifications.emailNotifications": "Notifications par e-mail",
      "dashboard.notifications.emailNotificationsDescription":
        "Recevez des horoscopes et des mises à jour par e-mail",
      "dashboard.notifications.smsNotifications": "Notifications SMS",
      "dashboard.notifications.smsNotificationsDescription":
        "Recevez des horoscopes et des alertes par SMS",
      "dashboard.notifications.pushNotifications": "Notifications push",
      "dashboard.notifications.pushNotificationsDescription":
        "Recevez des notifications push dans votre navigateur",
      "dashboard.notifications.weeklyDigest": "Résumé hebdomadaire",
      "dashboard.notifications.weeklyDigestDescription":
        "Obtenez un résumé hebdomadaire de vos aperçus cosmiques",

      // Common
      "common.email": "Par e-mail",
      "common.sms": "Par SMS",
      "common.whatsapp": "WhatsApp",
      "common.daily": " ",
      "common.weekly": " ",
      "common.monthly": " ",
      "common.save": "Enregistrer",
      "common.cancel": "Annuler",
      "common.edit": "Modifier",
      "common.delete": "Supprimer",
      "common.loading": "Chargement...",
      "common.error": "Erreur",
      "common.success": "Succès",
    },
  };
};
