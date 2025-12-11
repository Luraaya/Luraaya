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
      "nav.howItWorks": "How It Works",
      "nav.pricing": "Pricing",
      "nav.reviews": "Reviews",
      "nav.contact": "Contact",
      "nav.getStarted": "Get Started",
      "nav.dashboard": "Dashboard",
      "nav.login": "Log in",
      "nav.signup": "Sign up",

      // Footer ganz unten
      "footer.content":
        "Personal guidance from cosmic connections.",
      "footer.howItWorks": "How It Works",
      "footer.pricing": "Pricing",
      "footer.dashboard": "Dashboard",
      // zweiter Footer wäre hier möglich:
      "footer.resources": " ",
      "footer.astrologyGuide": " ",
      "footer.birthChartBasics": " ",
      "footer.helpCenter": " ",
      "footer.company": "Company",
      "footer.aboutUs": "About Us",
      "footer.careers": "Careers",
      "footer.contact": "Contact",

      // Hero Section Startseite
      "hero.badge": "A Message for You",
      "hero.title": "Your Personal",
      "hero.titleHighlight": "Horoscope",
      "hero.description":
      "Insights to guide your life path.",
      "hero.cta": "Receive your personal insights now",
      "hero.learnMore": "How It Works",
      "hero.rating": "",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "New message",
      "hero.dailyReading": "",
      "hero.personalizedFor": "Personalized for Laura",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Your Daily Horoscope",
      "hero.sampleMessage.content":
        "(...) The waxing Moon forms a trine with Pluto today, bringing your deeper inner currents more clearly to the surface. This constellation supports you in releasing what no longer serves you and making room for a decision that has already matured within you. (...)",
      "hero.sampleMessage.footer": "SMS • Daily • Premium",

      // Features Section
      "features.title": "Personal guidance from \ncosmic connections",
      "features.description":
        "Our groundbreaking analysis connects:",
      "features.description2":
        "(1) your date of birth, place of birth, and time of birth with \n(2) the celestial bodies, their phases, and their constellations.",
      "features.description3":
        "This results in personal, guiding insights that support your decisions and strengthen your development.",

      // Kacheln Wie es funktioniert
      "features.personalizedChart.title":
        "1. Enter your birth details",
      "features.personalizedChart.description":
        "Enter your birth date, time and place. These details form the foundation for the astrological calculation of your personal profile.",
      "features.dailyUpdates.title": "2. Cosmic analysis",
      "features.dailyUpdates.description":
        "We connect your information with the current planetary configurations. This creates deep astrological patterns analysed for you, revealing the forces that shape, inspire or challenge you at this moment.",
      "features.multiChannel.title": "3. Receive your personal message",
      "features.multiChannel.description":
        "Based on the analysis, you receive current and perfectly tailored guidance for your life path. These insights support your decisions and strengthen your personal growth. Delivered by e-mail or SMS, in the rhythm you choose: daily, weekly or monthly.",
      /*"features.lunarTracking.title": "Lunar Cycle Tracking",
      "features.lunarTracking.description":
        "Stay aligned with lunar phases and their influence on your zodiac sign for optimal timing.",
      "features.compatibility.title": "Compatibility Insights",
      "features.compatibility.description":
        "Understand your relationships better with personalized compatibility readings and advice.",
      "features.secure.title": "Secure & Private",
      "features.secure.description":
        "Your birth data and personal information are encrypted and never shared with third parties.",
      */
      /*
      "features.howItWorks": "How Luraaya Works",
      "features.step1.title": "Share Your Birth Details",
      "features.step1.description":
        "Provide your birth date, time, and location for accurate astrological calculations",
      "features.step2.title": "Choose Your Preferences",
      "features.step2.description":
        "Select your delivery frequency and preferred communication channel",
      "features.step3.title": "Receive Cosmic Insights",
      "features.step3.description":
        "Get personalized astrological messages delivered on your schedule",
      "features.deliveryChannels":
        "Choose your preferred way to receive cosmic insights",
        */

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

      // Signup Form
      "signup.title": "Begin Your Cosmic Journey",
      "signup.description":
        " ",
      "signup.freeTrialNote":
        "All plans include 7-day free trial. No credit card required to start.",
      "signup.guarantees": "✓ Cancel anytime",
      "signup.securePayments": "✓ Secure payments",
      "signup.support": "✓ 24/7 support",
      "signup.planFeatures.basic.perfect": "Perfect for getting started",
      "signup.planFeatures.premium.complete":
        "Complete astrological experience",
      "signup.planFeatures.basic.horoscopes": "Personalized horoscopes",
      "signup.planFeatures.basic.birthChart": "Birth chart analysis",
      "signup.planFeatures.basic.lunar": "Lunar phase notifications",
      "signup.planFeatures.basic.compatibility": "Basic compatibility insights",
      "signup.planFeatures.basic.support": "Email support",
      "signup.planFeatures.premium.everything": "Everything in Basic",
      "signup.planFeatures.premium.advanced": "Advanced birth chart analysis",
      "signup.planFeatures.premium.transit": "Planetary transit alerts",
      "signup.planFeatures.premium.detailed": "Detailed compatibility readings",
      "signup.planFeatures.premium.consultation":
        "Monthly astrologer consultation",
      "signup.planFeatures.premium.priority": "Priority support",
      "signup.planFeatures.premium.timing": "Custom timing recommendations",
      "signup.step1.title": "How would you like to receive your horoscope?",
      /*"signup.step1.description":
        "How would you like to receive your cosmic insights?",
      "signup.step2.title": "Personal Information",*/
      "signup.step2.description": "Tell us about yourself",
      "signup.step3.title": "Birth Information",
      "signup.step3.description":
        "This data is essential for accurate astrological readings",
      "signup.step4.title": "Choose Your Plan",
      "signup.step4.description":
        "Select the perfect plan for your cosmic journey",
      "signup.birthTime.note": "Exact time is crucial for accurate readings",
      "signup.birthPlace.note":
        "Include city and country for precise calculations",
      "signup.selected": "Selected",
      "signup.communicationChannel": "Preferred Communication Channel",
      "signup.messageFrequency": "Message Frequency",
      "signup.fullName": "Full Name",
      "signup.email": "Email Address",
      "signup.sms": "SMS Number",
      "signup.whatsapp": "WhatsApp Number",
      "signup.sex": "Sex",
      "signup.dateOfBirth": "Date of Birth",
      "signup.timeOfBirth": "Time of Birth",
      "signup.placeOfBirth": "Place of Birth",
      "signup.yourSelection": "Your Selection",
      "signup.messages": "Messages",
      "signup.via": "via",
      "signup.zodiacSign": "Zodiac Sign",
      "signup.monthly": "Monthly",
      "signup.yearly": "Yearly",
      "signup.save": "Save",
      "signup.basicPlan": "Basic Plan",
      "signup.premiumPlan": "Premium Plan",
      "signup.mostPopular": "Most Popular",
      "signup.previous": "Previous",
      "signup.nextStep": "Next Step",
      "signup.startJourney": "Start My Cosmic Journey",
      "signup.privacyNotice":
        "🔒 Your birth data is encrypted and secure. We never share your personal information. By signing up, you agree to our Terms of Service and Privacy Policy.",

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
      "common.email": "Email",
      "common.sms": "SMS",
      "common.whatsapp": "WhatsApp",
      "common.daily": "Daily",
      "common.weekly": "Weekly",
      "common.monthly": "Monthly",
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
      "nav.howItWorks": "Wie es funktioniert",
      "nav.pricing": "Preise",
      "nav.reviews": "Bewertungen",
      "nav.getStarted": "Loslegen",
      "nav.contact": "Kontakt",
      "nav.dashboard": "Dashboard",
      "nav.login": "Anmelden",
      "nav.signup": "Registrieren",

      // Footer ganz unten
      "footer.content":
        "Persönliche Hinweise aus kosmischen Zusammenhängen.",
      "footer.howItWorks": "Wie es funktioniert",
      "footer.pricing": "Preise",
      "footer.dashboard": "Dashboard",
      // zweiter Footer wäre hier möglich:
      "footer.resources": " ",
      "footer.astrologyGuide": " ",
      "footer.birthChartBasics": " ",
      "footer.helpCenter": " ",
      "footer.company": "Unternehmen",
      "footer.aboutUs": "Über uns",
      "footer.careers": "Karriere",
      "footer.contact": "Kontakt",

      // Hero Section Startseite
      "hero.badge": "Eine Botschaft für dich",
      "hero.title": "Dein persönliches",
      "hero.titleHighlight": "Horoskop",
      "hero.description":
      "Hinweise für deinen Lebensweg.",
      "hero.cta": "Jetzt persönliche Botschaft erhalten",
      "hero.learnMore": "Wie es funktioniert",
      "hero.rating": " ",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "Neue Botschaft",
      "hero.dailyReading": " ",
      "hero.personalizedFor": "Personalisiert für Laura",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Dein Tageshoroskop",
      "hero.sampleMessage.content":
        "(...) Die zunehmende Mondphase steht heute in einem Trigon zu Pluto und lässt tiefere innere Bewegungen deutlicher werden. Diese Konstellation unterstützt dich, Altes gehen zu lassen und Platz für eine Entscheidung freizumachen, die bereits in dir gereift ist. (...)",
      "hero.sampleMessage.footer": "SMS • Täglich • Premium",

      // Features Section
      "features.title": "Persönliche Hinweise aus \nkosmischen Zusammenhängen",
      "features.description":
        "Unsere bahnbrechende Analyse verbindet:",
      "features.description2":
        "(1) dein Geburtsdatum, deinen Geburtsort, deine Geburtszeit mit \n(2) den Himmelskörpern, ihren Phasen und Konstellationen.",
      "features.description3":
        "Daraus entstehen persönliche, richtungsweisende Hinweise, die deine Entscheidungen unterstützen und deine Entwicklung stärken.",

      // Kacheln Wie es funktioniert
      "features.personalizedChart.title":
        "1. Geburtsdaten erfassen",
      "features.personalizedChart.description":
        "Gib dein Geburtsdatum, die genaue Zeit und den Geburtsort ein. Diese Angaben bilden die Grundlage für die astrologische Berechnung deines persönlichen Profils.",
      "features.dailyUpdates.title": "2. Kosmische Analyse",
      "features.dailyUpdates.description":
        "Wir verbinden deine Angaben mit den aktuellen planetaren Konstellationen. So entstehen tiefgehende astrologische Muster, die für dich ausgewertet werden. Sie zeigen Dir, welche Kräfte dich im Moment formen, inspirieren oder herausfordern.",
      "features.multiChannel.title": "3. Deine persönliche Botschaft erhalten",
      "features.multiChannel.description":
        "Auf Basis der Analyse ergeben sich aktuelle und perfekt auf dich abgestimmte Hinweise für deinen Lebensweg. Sie werden deine Entscheidungen unterstützen und deine Entwicklung stärken. Per Mail oder SMS und in Deinem Rhytmus: Täglich, Wöchentlich oder Monatlich.",
      /*"features.lunarTracking.title": "Mondphasen-Verfolgung",
      "features.lunarTracking.description":
        "Bleibe mit den Mondphasen und Dem Einfluss auf Dein Sternzeichen für optimales Timing ausgerichtet.",
      "features.compatibility.title": "Kompatibilitäts-Einblicke",
      "features.compatibility.description":
        "Verstehe deine Beziehungen besser mit personalisierten Kompatibilitäts-Lesungen und Ratschlägen.",
      "features.secure.title": "Sicher & Privat",
      "features.secure.description":
        "Deine Geburtsdaten und persönlichen Informationen sind verschlüsselt und werden niemals mit Dritten geteilt.",*/
      /*
      "features.howItWorks": "Wie Luraaya funktioniert",
      "features.step1.title": "Teile Deine Geburtsdaten",
      "features.step1.description":
        "Gebe Dein Geburtsdatum, die Zeit und den Ort für genaue astrologische Berechnungen an",
      "features.step2.title": "Wählen Dein Präferenzen",
      "features.step2.description":
        "Wähle Deine Kommunikationsfrequenz und den bevorzugten Kommunikationskanal",
      "features.step3.title": "Erhalte kosmische Einblicke",
      "features.step3.description":
        "Erhalten  personalisierte astrologische Nachrichten nach Deinem Zeitplan",
      "features.deliveryChannels":
        "Wähle Deine bevorzugte Art, kosmische Einblicke zu erhalten",
        */

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

      // Signup Form
      "signup.title": "Beginne Deine kosmische Reise",
      "signup.description":
        " ",
      "signup.freeTrialNote":
        " ",
      "signup.guarantees": "✓ Jederzeit kündbar",
      "signup.securePayments": "✓ Sichere Zahlungen",
      "signup.support": "✓ Vertrauensvoller Support",
      "signup.planFeatures.basic.perfect": "Perfekt für den Einstieg",
      "signup.planFeatures.premium.complete":
        "Vollständige astrologische Erfahrung",
      "signup.planFeatures.basic.horoscopes": "Personalisierte Horoskope",
      "signup.planFeatures.basic.birthChart": "Geburtshoroskop-Analyse",
      "signup.planFeatures.basic.lunar": "Mondphasen-Benachrichtigungen",
      "signup.planFeatures.basic.compatibility":
        "Grundlegende Kompatibilitäts-Einblicke",
      "signup.planFeatures.basic.support": "E-Mail-Support",
      "signup.planFeatures.premium.everything": "Alles aus Basic",
      "signup.planFeatures.premium.advanced":
        "Erweiterte Geburtshoroskop-Analyse",
      "signup.planFeatures.premium.transit": "Planetarische Transit-Warnungen",
      "signup.planFeatures.premium.detailed":
        "Detaillierte Kompatibilitäts-Lesungen",
      "signup.planFeatures.premium.consultation":
        "Monatliche Astrologen-Beratung",
      "signup.planFeatures.premium.priority": "Prioritäts-Support",
      "signup.planFeatures.premium.timing":
        "Benutzerdefinierte Timing-Empfehlungen",
      "signup.step1.title": "Wie möchtest du dein Horoskop erhalten?",
      /*"signup.step1.description":
        "Wie möchtest du dein Horoskop erhalten?",*/
      "signup.step2.title": "Persönliche Informationen",
      "signup.step2.description": "Erzähle uns von Dir",
      "signup.step3.title": "Geburtsinformationen",
      "signup.step3.description":
        "Diese Daten sind für genaue astrologische Lesungen unerlässlich",
      "signup.step4.title": "Wähle Deinen Plan",
      "signup.step4.description":
        "Wähle den perfekten Plan für Deine kosmische Reise",
      "signup.birthTime.note":
        "Genaue Zeit ist entscheidend für genaue Lesungen",
      "signup.birthPlace.note":
        "Stadt und Land für präzise Berechnungen angeben",
      "signup.selected": "Ausgewählt",
      "signup.communicationChannel": "Kommunikationskanal",
      "signup.messageFrequency": "Nachrichtenhäufigkeit",
      "signup.fullName": "Vollständiger Name",
      "signup.email": "E-Mail-Adresse",
      "signup.sms": "SMS-Nummer",
      "signup.whatsapp": "WhatsApp-Nummer",
      "signup.sex": "Geschlecht",
      "signup.dateOfBirth": "Geburtsdatum",
      "signup.timeOfBirth": "Geburtszeit",
      "signup.placeOfBirth": "Geburtsort",
      "signup.yourSelection": "Deine Auswahl",
      "signup.messages": "Nachrichten",
      "signup.via": "über",
      "signup.zodiacSign": "Sternzeichen",
      "signup.monthly": "Monatlich",
      "signup.yearly": "Jährlich",
      "signup.save": "Speichern",
      "signup.basicPlan": "Basis-Einblicke",
      "signup.premiumPlan": "Premium-Plan",
      "signup.mostPopular": "Am beliebtesten",
      "signup.previous": "Zurück",
      "signup.nextStep": "Nächster Schritt",
      "signup.startJourney": "Meine kosmische Reise beginnen",
      "signup.privacyNotice":
        "🔒 Deine Geburtsdaten sind verschlüsselt und sicher. Wir teilen niemals Deine persönlichen Informationen. Mit der Anmeldung stimmst Du unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.",

      // Dashboard
      "dashboard.myHoroscopes": "Meine Horoskope",
      "dashboard.profile": "Profil",
      "dashboard.settings": "Einstellungen",
      "dashboard.logout": "Abmelden",
      "dashboard.total": "Gesamt",
      "dashboard.unread": "Ungelesen",
      "dashboard.horoscopesDescription":
        "Deine personalisierten astrologischen Botschaften und kosmischen Einblicke.",
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
      "dashboard.deleteAccountDescription":
        "Lösche Dein Konto und alle zugehörigen Daten dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.",
      "dashboard.deleteAccountButton": "Konto löschen",
      "dashboard.emailUpdated": "E-Mail erfolgreich aktualisiert!",
      "dashboard.passwordMismatch": "Neue Passwörter stimmen nicht überein!",
      "dashboard.passwordUpdated": "Passwort erfolgreich aktualisiert!",
      "dashboard.cancelSubscriptionConfirm":
        "Bist Du sicher, dass Du dein Abonnement kündigen möchtenst? Du verlieren den Zugang zu Premium-Funktionen.",
      "dashboard.cancelSubscriptionError":
        "Fehler bei der Kündigung des Abonnements. Bitte versuche es später erneut.",
      "dashboard.subscriptionCancelled":
        "Abonnement gekündigt. Du behälst den Zugang bis zu Deinem nächsten Abrechnungsdatum.",
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
        "Erhalte Push-Benachrichtigungen in Deinem Browser",
      "dashboard.notifications.weeklyDigest": "Wöchentliche Zusammenfassung",
      "dashboard.notifications.weeklyDigestDescription":
        "Erhalte eine wöchentliche Zusammenfassung Deiner kosmischen Einblicke",

      // Common
      "common.email": "E-Mail",
      "common.sms": "SMS",
      "common.whatsapp": "WhatsApp",
      "common.daily": "Täglich",
      "common.weekly": "Wöchentlich",
      "common.monthly": "Monatlich",
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
      "nav.howItWorks": "Comment ça marche",
      "nav.pricing": "Prix",
      "nav.reviews": "Èvaluations",
      "nav.getStarted": "Commencer",
      "nav.contact": "Contact",
      "nav.dashboard": "Tableau de bord",
      "nav.login": "Se connecter",
      "nav.signup": "S'inscrire",

      // Footer ganz unten
      "footer.content":
        "Indications personnelles issues des liens cosmiques.",
      "footer.howItWorks": "Comment ça marche",
      "footer.pricing": "Prix",
      "footer.dashboard": "Tableau de bord",
      // zweiter Footer wäre hier möglich:
      "footer.resources": " ",
      "footer.astrologyGuide": " ",
      "footer.birthChartBasics": " ",
      "footer.helpCenter": " ",
      "footer.company": "Entreprise",
      "footer.aboutUs": "À propos de nous",
      "footer.careers": "Carrières",
      "footer.contact": "Contact",

      // Hero Section Startseite
      "hero.badge": "Un message pour toi",
      "hero.title": "Ton",
      "hero.titleHighlight": "horoscope personnel",
      "hero.description":
        "Des éclairages pour ton chemin de vie.",
      "hero.cta": "Reçois maintenant tes indications personnelles",
      "hero.learnMore": "Comment ça marche",
      "hero.rating": " ",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "Nouveau message",
      "hero.dailyReading": " ",
      "hero.personalizedFor": "Personnalisé pour Laura",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Ton horoscope du jour",
      "hero.sampleMessage.content":
        "(...) La phase lunaire croissante forme aujourd’hui un trigone avec Pluton et fait ressortir plus clairement tes mouvements intérieurs les plus profonds. Cette constellation t’accompagne dans le processus de laisser partir l’ancien et de créer l’espace nécessaire pour une décision qui a déjà mûri en toi. (...)",
      "hero.sampleMessage.footer": "SMS • Quotidien • Premium",

      // Features Section
      "features.title": "Indications personnelles issues \ndes liens cosmiques",
      "features.description":
        "Notre analyse révolutionnaire relie :",
      "features.description2":
        "(1) ta date, ton lieu et ton heure de naissance avec \n(2) les corps célestes, leurs phases et leurs constellations.",
      "features.description3":
        "Il en résulte des indications personnelles et déterminantes qui soutiennent tes décisions et renforcent ton développement.",
        
      // Kacheln Wie es funktioniert
      "features.personalizedChart.title":
      "1. Saisir les données de naissance",
      "features.personalizedChart.description":
      "Indique ta date, ton heure et ton lieu de naissance. Ces informations constituent la base du calcul astrologique de ton profil personnel.",
      "features.dailyUpdates.title": "2. Analyse cosmique",
      "features.dailyUpdates.description":
      "Nous relions tes informations aux configurations planétaires actuelles. Il en résulte des schémas astrologiques profonds analysés pour toi. Ils révèlent les forces qui, en ce moment, te façonnent, t’inspirent ou te mettent au défi.",
      "features.multiChannel.title": "3. Recevoir ton message personnel",
      "features.multiChannel.description":
      "À partir de l’analyse, nous créons des indications actuelles et parfaitement adaptées à ton chemin de vie. Elles soutiennent tes décisions et renforcent ton développement. Par e-mail ou SMS et selon ton rythme : quotidien, hebdomadaire ou mensuel.",
      /*"features.lunarTracking.title": "Suivi du cycle lunaire",
      "features.lunarTracking.description":
        "Restez aligné avec les phases lunaires et leur influence sur votre signe du zodiaque pour un timing optimal.",
      "features.compatibility.title": "Aperçus de compatibilité",
      "features.compatibility.description":
        "Comprenez mieux vos relations avec des lectures de compatibilité personnalisées et des conseils.",
      "features.secure.title": "Sécurisé et privé",
      "features.secure.description":
        "Vos données de naissance et informations personnelles sont cryptées et jamais partagées avec des tiers.",
        */
      /*
      "features.howItWorks": "Comment fonctionne Luraaya",
      "features.step1.title": "Partagez vos détails de naissance",
      "features.step1.description":
        "Fournissez votre date, heure et lieu de naissance pour des calculs astrologiques précis",
      "features.step2.title": "Choisissez vos préférences",
      "features.step2.description":
        "Sélectionnez votre fréquence de livraison et votre canal de communication préféré",
      "features.step3.title": "Recevez des aperçus cosmiques",
      "features.step3.description":
        "Obtenez des messages astrologiques personnalisés livrés selon votre horaire",
      "features.deliveryChannels":
        "Choisissez votre façon préférée de recevoir des aperçus cosmiques",
        */

      // Testimonials
      "testimonials.title": "Aimé par les chercheurs cosmiques",
      "testimonials.description":
        "Découvrez ce que nos utilisateurs de tous les signes du zodiaque disent sur la façon dont les aperçus astrologiques personnalisés ont transformé leur vie quotidienne.",

      // Individual Testimonial Content
      "testimonials.luna.content":
        "Les aperçus quotidiens ont été incroyablement précis et utiles. En tant que Poissons, j'apprécie comment les messages résonnent avec ma nature intuitive et guident mes projets créatifs.",
      "testimonials.david.content":
        "En tant que Lion, j'adore comment le service capture ma nature ambitieuse. Les prévisions hebdomadaires m'ont aidé à chronométrer parfaitement les décisions commerciales importantes.",
      "testimonials.aria.content":
        "La précision et le détail dans l'analyse du thème natal ont impressionné mon esprit analytique de Vierge. Les aperçus sont pratiques et exploitables, pas seulement des prédictions vagues.",

      "testimonials.activeUsers": "Utilisateurs actifs",
      "testimonials.averageRating": "Note moyenne",
      "testimonials.messagesDelivered": "Messages livrés",

      // Signup Form
      "signup.title": "Commencez votre voyage cosmique",
      "signup.description":
        " ",
      "signup.freeTrialNote":
        "Tous les plans incluent un essai gratuit de 7 jours. Aucune carte de crédit requise pour commencer.",
      "signup.guarantees": "✓ Annulez à tout moment",
      "signup.securePayments": "✓ Paiements sécurisés",
      "signup.support": "✓ Support 24/7",
      "signup.planFeatures.basic.perfect": "Parfait pour commencer",
      "signup.planFeatures.premium.complete":
        "Expérience astrologique complète",
      "signup.planFeatures.basic.horoscopes": "Horoscopes personnalisés",
      "signup.planFeatures.basic.birthChart": "Analyse du thème natal",
      "signup.planFeatures.basic.lunar": "Notifications des phases lunaires",
      "signup.planFeatures.basic.compatibility":
        "Aperçus de compatibilité de base",
      "signup.planFeatures.basic.support": "Support par e-mail",
      "signup.planFeatures.premium.everything": "Tout dans Basic",
      "signup.planFeatures.premium.advanced": "Analyse avancée du thème natal",
      "signup.planFeatures.premium.transit": "Alertes de transit planétaire",
      "signup.planFeatures.premium.detailed":
        "Lectures de compatibilité détaillées",
      "signup.planFeatures.premium.consultation":
        "Consultation mensuelle avec un astrologue",
      "signup.planFeatures.premium.priority": "Support prioritaire",
      "signup.planFeatures.premium.timing":
        "Recommandations de timing personnalisées",
      "signup.step1.title": "Comment souhaites-tu recevoir ton horoscope ?",
      /*"signup.step1.description":
        "dd",*/
      "signup.step2.title": "Informations personnelles",
      "signup.step2.description": "Parlez-nous de vous",
      "signup.step3.title": "Informations de naissance",
      "signup.step3.description":
        "Ces données sont essentielles pour des lectures astrologiques précises",
      "signup.step4.title": "Choisissez votre plan",
      "signup.step4.description":
        "Sélectionnez le plan parfait pour votre voyage cosmique",
      "signup.birthTime.note":
        "L'heure exacte est cruciale pour des lectures précises",
      "signup.birthPlace.note":
        "Incluez la ville et le pays pour des calculs précis",
      "signup.selected": "Sélectionné",
      "signup.communicationChannel": "Canal de communication préféré",
      "signup.messageFrequency": "Fréquence des messages",
      "signup.fullName": "Nom complet",
      "signup.email": "Adresse e-mail",
      "signup.sms": "Numéro SMS",
      "signup.whatsapp": "Numéro WhatsApp",
      "signup.sex": "Sexe",
      "signup.dateOfBirth": "Date de naissance",
      "signup.timeOfBirth": "Heure de naissance",
      "signup.placeOfBirth": "Lieu de naissance",
      "signup.yourSelection": "Votre sélection",
      "signup.messages": "Messages",
      "signup.via": "via",
      "signup.zodiacSign": "Signe du zodiaque",
      "signup.monthly": "Mensuel",
      "signup.yearly": "Annuel",
      "signup.save": "Enregistrer",
      "signup.basicPlan": "Plan de base",
      "signup.premiumPlan": "Plan premium",
      "signup.mostPopular": "Le plus populaire",
      "signup.previous": "Précédent",
      "signup.nextStep": "Étape suivante",
      "signup.startJourney": "Commencer mon voyage cosmique",
      "signup.privacyNotice":
        "🔒 Vos données de naissance sont cryptées et sécurisées. Nous ne partageons jamais vos informations personnelles. En vous inscrivant, vous acceptez nos conditions de service et notre politique de confidentialité.",

      // Dashboard
      "dashboard.myHoroscopes": "Mes horoscopes",
      "dashboard.profile": "Profil",
      "dashboard.settings": "Paramètres",
      "dashboard.logout": "Se déconnecter",
      "dashboard.total": "Total",
      "dashboard.unread": "Non lu",
      "dashboard.horoscopesDescription":
        "Vos lectures astrologiques personnalisées et aperçus cosmiques.",
      "dashboard.search": "Recherchez vos horoscopes...",
      "dashboard.status": "Statut",
      "dashboard.allHoroscopes": "Tous les horoscopes",
      "dashboard.unreadOnly": "Non lus seulement",
      "dashboard.readOnly": "Lus seulement",
      "dashboard.noHoroscopes": "Aucun horoscope trouvé",
      "dashboard.noHoroscopesDescription":
        "Aucun message cosmique ne correspond à vos critères de recherche.",
      "dashboard.adjustSearch":
        "Essayez d'ajuster vos paramètres de recherche ou de filtre.",
      "dashboard.new": "Nouveau",
      "dashboard.shareReading": "Partager la lecture",
      "dashboard.markAsRead": "Marquer comme lu",

      // Dashboard Profile
      "dashboard.profileDescription":
        "Gérez vos informations personnelles et détails astrologiques.",
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
      "dashboard.settingsDescription":
        "Gérez vos paramètres de compte, abonnement et préférences.",
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
      "dashboard.deleteAccountDescription":
        "Supprimez définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.",
      "dashboard.deleteAccountButton": "Supprimer le compte",
      "dashboard.emailUpdated": "E-mail mis à jour avec succès !",
      "dashboard.passwordMismatch":
        "Les nouveaux mots de passe ne correspondent pas !",
      "dashboard.passwordUpdated": "Mot de passe mis à jour avec succès !",
      "dashboard.cancelSubscriptionConfirm":
        "Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l'accès aux fonctionnalités premium.",
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
      "common.email": "E-mail",
      "common.sms": "SMS",
      "common.whatsapp": "WhatsApp",
      "common.daily": "Quotidien",
      "common.weekly": "Hebdomadaire",
      "common.monthly": "Mensuel",
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
