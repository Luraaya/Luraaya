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
      "footer.legal.termsOfService": "Terms and Conditions",
      "footer.legal.cookies": "Cookies",
      "footer.columns.contact.title": "Contact",

      // Policy Datenschutz
      "privacy.title": "Privacy Policy",
      "privacy.section1.title": "1. General Information",
      "privacy.section1.1.title": "1.1 Data Controller",
      "privacy.section1.1.body": "The controller responsible for the processing of personal data within the meaning of the Swiss Federal Act on Data Protection (FADP) is: Luraaya, Hilfikerstrasse 4, 3014 Bern, Switzerland, email: luraaya@outlook.com. Hereinafter, Luraaya is referred to as “we”, “us”, or “our service”. This privacy policy explains how we process personal data in connection with our website, our application, and our digital services.",
      "privacy.section1.2.title": "1.2 Applicable Law",
      "privacy.section1.2.body": "Our data processing is subject to the Swiss Federal Act on Data Protection (FADP, revised FADP). Where applicable in individual cases, we also take into account the General Data Protection Regulation of the European Union (GDPR).",
      "privacy.section2.title": "2. Nature and Purpose of Data Processing",
      "privacy.section2.1.title": "2.1 Scope of the Service",
      "privacy.section2.1.body": "Luraaya provides a fully digital, subscription-based, and largely automated application. The service is personalized and based on individual input provided by users. Without the collection of certain personal data, the service cannot be provided. The generated content is intended exclusively for informational and entertainment purposes. It does not constitute medical, psychological, therapeutic, or legal advice and does not claim to be objectively or scientifically accurate.",
      "privacy.section3.title": "3. Personal Data Collected",
      "privacy.section3.1.title": "3.1 Categories of Personal Data",
      "privacy.section3.1.body": "We process in particular the following personal data: first and last name, date of birth, time of birth, place of birth, gender, email address, telephone number, preferred language, payment and billing information (via payment service providers) for contract performance, as well as technical data such as IP address, device, and browser information. No particularly sensitive personal data such as health data, religious beliefs, or political or ideological views are collected.",
      "privacy.section3.2.title": "3.2 Profiling",
      "privacy.section3.2.body": "Based on the data you provide, individual astrological profiles are created. This constitutes automated data processing aimed at personalizing content. No automated decision-making producing legal effects or similarly significant effects within the meaning of data protection law takes place.",
      "privacy.section4.title": "4. Legal Bases for Processing",
      "privacy.section4.body": "We process personal data for the following purposes on the basis of the applicable legal grounds: performance of a contract and pre-contractual measures for the provision of the application, the creation of personalized content, the processing of subscriptions, and customer support; consent for optional features such as marketing communications, analytics, and tracking technologies or comparable processing activities, where required by law, whereby any consent given may be withdrawn at any time; legitimate interests to ensure the security, stability, and further development of our service, for the prevention of misuse and fraud, and for internal analysis and optimization; as well as legal obligations to which we are subject in connection with the processing of personal data.",
      "privacy.section5.title": "5. Use of Our Website and Application",
      "privacy.section5.1.title": "5.1 Server Log Files",
      "privacy.section5.1.body": "When accessing our website or application, technical data is automatically collected and temporarily stored, in particular the IP address, date and time of access, accessed content, referrer URL, as well as browser and system information. This data is used exclusively to ensure technical security, stability, and optimization of the service.",
      "privacy.section6.title": "6. Cookies and Tracking",
      "privacy.section6.1.title": "6.1 Cookies",
      "privacy.section6.1.body": "We use cookies to ensure the functionality, security, and user-friendliness of our website. Technically necessary cookies are used automatically. All other cookies are set only after prior consent. Consent can be withdrawn or adjusted at any time via the cookie settings.",
      "privacy.section6.2.title": "6.2 Analytics and Marketing Technologies",
      "privacy.section6.2.body": "Where analytics, marketing, or optimization technologies are used, this is done exclusively on the basis of your consent, insofar as required by law. In this context, data may also be transmitted to third-party service providers in Switzerland or abroad.",
      "privacy.section6.3.title": "6.3 Data Security",
      "privacy.section6.3.body": "We implement appropriate technical and organizational measures to protect personal data against unauthorized access, loss, misuse, or unlawful processing. These measures include, in particular, access restrictions, role-based authorization concepts, encryption, and regular security reviews. The measures are continuously adapted to the state of the art.",
      "privacy.section7.title": "7. Third-Party Providers and Data Processing Agreements",
      "privacy.section7.1.title": "7.1 Service Providers Used",
      "privacy.section7.1.body": "We use in particular the following service providers: hosting and deployment (Vercel, Hostpoint), version control (GitHub), database and backend (Supabase), payment processing (Stripe), communication and messaging (Twilio), and AI-based processing (GPT API). These providers process personal data exclusively within the scope of their respective function. Independent use for their own purposes does not take place. Data processing agreements are concluded or prepared where required.",
      "privacy.section7.2.title": "7.2 Data Transfers Abroad",
      "privacy.section7.2.body": "Some of the service providers used have their registered office or server locations outside Switzerland or the European Union. In such cases, we ensure that personal data is transferred only if an adequate level of data protection is guaranteed, in particular through the conclusion of recognized standard contractual clauses or comparable appropriate safeguards.",
      "privacy.section8.title": "8. Retention and Deletion",
      "privacy.section8.body": "Personal data is retained only for as long as necessary for the provision of the services, for contract performance, for the protection of legitimate interests, or due to statutory retention obligations. After the respective purpose ceases to apply or upon a justified request, the data is deleted or anonymized in accordance with the applicable legal requirements.",
      "privacy.section9.title": "9. Communication",
      "privacy.section9.body": "When you contact us via a contact form or by email, the information transmitted is stored in order to process your request. Unencrypted emails are considered insecure. We recommend not transmitting particularly confidential information by email.",
      "privacy.section10.title": "10. Rights of Data Subjects",
      "privacy.section10.body": "Within the scope of the applicable data protection law, you have in particular the right to obtain information about your processed personal data, to request the correction of inaccurate data, to request the deletion or restriction of processing, to object to certain processing activities, and to receive or transfer your data, where applicable. Requests should be addressed to the contact details provided in section 1.1.",
      "privacy.section11.title": "11. Liability and Advisory Disclaimer",
      "privacy.section11.body": "The content provided by Luraaya does not replace professional advice. It is not suitable as a basis for medical, psychological, therapeutic, legal, or other decisions of significant importance.",
      "privacy.section12.title": "12. Changes to This Privacy Policy",
      "privacy.section12.body": "We reserve the right to amend this privacy policy at any time. The version published on our website at the relevant time shall apply. The German version of this privacy policy is legally binding. Translations into other languages are provided for convenience only. In the event of discrepancies or issues of interpretation, the German version shall prevail.",
      "privacy.section13.title": "13. Contact",
      "privacy.section13.body": "If you have any questions regarding data protection, please contact: luraaya@outlook.com",
      "privacy.navigation.back": "Back",
      "privacy.navigation.home": "Home",

      // Allgemeine Geschäftsbedingungen (AGB)
      "terms.title": "Terms and Conditions",
      "terms.section1.title": "1. Scope",
      "terms.section1.1.title": "1.1 Scope of application",
      "terms.section1.1.body": "These Terms and Conditions govern the legal relationship between Luraaya, Bern, Switzerland (hereinafter the “Provider”), and the users of the website and Luraaya’s digital services.",
      "terms.section1.2.title": "1.2 Acceptance",
      "terms.section1.2.body": "Acceptance of these Terms and Conditions becomes binding upon the conclusion of a paid subscription. Mere access to freely available content does not constitute a contractual relationship.",
      "terms.section2.title": "2. Description of services",
      "terms.section2.1.title": "2.1 Nature of the service",
      "terms.section2.1.body": "Luraaya provides a fully digital, subscription-based and personalised astrology service. The services include the creation and electronic delivery of astrological content based on information provided by the user as well as astrological calculation models. All services are provided exclusively online.",
      "terms.section2.2.title": "2.2 No guaranteed outcome",
      "terms.section2.2.body": "No specific outcome, effect, objective accuracy, or subjective benefit is owed. The content is of an interpretative and orientational nature and does not claim scientific validity.",
      "terms.section3.title": "3. Nature of the content",
      "terms.section3.1.title": "3.1 No advice",
      "terms.section3.1.body": "The content provided by Luraaya is intended solely for general orientation, inspiration, and personal reflection. It does not constitute medical, psychological, therapeutic, legal, financial, or other professional advice and does not replace such advice.",
      "terms.section3.2.title": "3.2 Personal responsibility",
      "terms.section3.2.body": "Any decisions made on the basis of the content are taken solely at the user’s own responsibility.",
      "terms.section4.title": "4. Conclusion of contract",
      "terms.section4.1.title": "4.1 Formation",
      "terms.section4.1.body": "The contract is concluded once the user selects a paid subscription and successfully completes the payment process.",
      "terms.section4.2.title": "4.2 Requirements",
      "terms.section4.2.body": "By completing the order process, the user confirms the accuracy of the information provided and their legal capacity to enter into a contract.",
      "terms.section5.title": "5. Prices and payment",
      "terms.section5.1.title": "5.1 Prices",
      "terms.section5.1.body": "All prices are stated in Swiss francs (CHF) unless explicitly indicated otherwise.",
      "terms.section5.2.title": "5.2 Payment processing",
      "terms.section5.2.body": "Payment is processed in advance via external payment service providers, in particular Stripe. The terms and conditions of the respective payment provider shall also apply.",
      "terms.section5.3.title": "5.3 Liability regarding payment services",
      "terms.section5.3.body": "The Provider assumes no liability for disruptions, delays, or errors in connection with external payment services.",
      "terms.section6.title": "6. Subscriptions, term and termination",
      "terms.section6.1.title": "6.1 Term",
      "terms.section6.1.body": "Subscriptions are concluded with either a monthly or annual term, depending on the selection, and are automatically renewed for the respective term unless terminated before the end of the current billing period.",
      "terms.section6.2.title": "6.2 Termination",
      "terms.section6.2.body": "Termination is possible at any time and becomes effective at the end of the current billing period. Termination does not give rise to any entitlement to a refund, reduction, or other compensation of subscription fees already paid, regardless of the time of termination or the extent of prior use.",
      "terms.section7.title": "7. Delivery and availability",
      "terms.section7.1.title": "7.1 Electronic delivery",
      "terms.section7.1.body": "The delivery of content is carried out exclusively via electronic communication channels such as email or SMS.",
      "terms.section7.2.title": "7.2 Technical availability and disruptions",
      "terms.section7.2.body": "The Provider endeavours to ensure the most uninterrupted availability of the digital services possible. However, uninterrupted and complete availability cannot be guaranteed at all times. In the event of technical disruptions, system failures, maintenance work, or events beyond the Provider’s control, the delivery of content may be temporarily suspended or delayed. If such disruptions result in a significant and more than negligible limitation of service provision, the term of the affected subscription shall be extended by the duration of the actual limitation. There shall be no entitlement to a refund of fees already paid.",
      "terms.section8.title": "8. User obligations",
      "terms.section8.1.title": "8.1 Information",
      "terms.section8.1.body": "Users undertake to provide accurate and complete information.",
      "terms.section8.2.title": "8.2 Use",
      "terms.section8.2.body": "The service must not be used improperly or unlawfully. In the event of violations, the Provider reserves the right to restrict or terminate access.",
      "terms.section9.title": "9. Liability",
      "terms.section9.body": "The Provider’s liability is excluded to the extent permitted by law. In particular, the Provider shall not be liable for damages or disadvantages arising from temporary technical disruptions, delays in delivery, or temporary unavailability of the digital services. Liability in cases of intent or gross negligence remains unaffected.",
      "terms.section10.title": "10. Intellectual property",
      "terms.section10.body": "All content, texts, concepts, and representations of Luraaya are protected by copyright law.",
      "terms.section11.title": "11. Data protection",
      "terms.section11.body": "The processing of personal data is carried out in accordance with Luraaya’s Privacy Policy.",
      "terms.section12.title": "12. Amendments to the Terms and Conditions",
      "terms.section12.body": "The Provider reserves the right to amend these Terms and Conditions at any time. Material changes will be communicated to users in an appropriate manner. Continued use of the service after the amendments take effect shall be deemed acceptance of the amended version. The version published on the website shall apply. Only the German version of this Terms and Conditions is legally binding. Translations into other languages are provided for convenience only. In the event of discrepancies or questions of interpretation, the German version shall prevail.",
      "terms.navigation.back": "Back",
      "terms.navigation.home": "Home",

      // Cookies
      "cookies.title": "Cookies",
      "cookies.intro": "This Cookies Information explains the use of cookies and similar technologies on the website and within Luraaya’s digital services. It supplements the Privacy Policy and provides information on the type, purpose, and scope of the technologies used.",
      "cookies.section1.title": "1. General Information",
      "cookies.section1.body": "This Cookies Information describes how and for which purposes cookies and similar technologies are used on the website and within Luraaya’s digital services. It supplements the Privacy Policy. The current version of the Privacy Policy shall always prevail.",
      "cookies.section2.title": "2. Types of Cookies",
      "cookies.section2.body": "Luraaya uses cookies and similar technologies to ensure the basic functionality, security, and stability of the website. In addition, subject to appropriate consent, cookies may be used to analyse website usage as well as for marketing and optimisation purposes. The individual categories are explained in more detail below.",
      "cookies.section2.1.title": "2.1 Strictly Necessary Cookies",
      "cookies.section2.1.body": "Strictly necessary cookies are required for the website and digital services to function correctly and securely. They enable essential features such as website navigation, storage of session information, security and protection mechanisms, and technical stability. These cookies are essential for operation and cannot be disabled.",
      "cookies.section2.2.title": "2.2 Functional Cookies",
      "cookies.section2.2.body": "Functional cookies allow certain user settings and preferences to be stored in order to improve user convenience. This includes, for example, saving the preferred language or other individual settings. Functional cookies are used only if the user has given their consent.",
      "cookies.section2.3.title": "2.3 Analytics and Statistics Cookies",
      "cookies.section2.3.body": "Analytics and statistics cookies are used to better understand how the website is used and to continuously improve the offering. They enable the collection of aggregated information about user behaviour, such as which content is accessed most frequently. These cookies are used exclusively on the basis of voluntary consent.",
      "cookies.section2.4.title": "2.4 Marketing and Targeting Cookies",
      "cookies.section2.4.body": "Marketing and targeting cookies may be used to tailor content, offers, and marketing measures more closely to users’ interests and to measure the effectiveness of marketing campaigns. These cookies may also be used to evaluate interactions across multiple sessions. They are used only after prior consent has been given by the user.",
      "cookies.section3.title": "3. Third-Party Cookies",
      "cookies.section3.body": "Third-party providers may be involved in the provision of the website and digital services, for example for hosting, payment processing, communication, analytics, or marketing. These providers may use cookies or similar technologies as part of their services. Personal data is processed exclusively within the agreed purposes and on the basis of a legal basis or corresponding consent.",
      "cookies.section4.title": "4. Consent and Cookie Settings",
      "cookies.section4.body": "When visiting the website for the first time, users are informed about the use of cookies and may grant or refuse consent for individual categories. Strictly necessary cookies are used regardless of consent, as they are required for the operation of the website. Cookie settings can be adjusted at any time.",
      "cookies.section5.title": "5. Legal Basis",
      "cookies.section5.body": "The processing of personal data in connection with cookies is based on the Swiss Federal Act on Data Protection (revDSG). Where applicable, the provisions of the European Union’s General Data Protection Regulation (GDPR) are also taken into account.",
      "cookies.section6.title": "6. Changes to the Cookies Information",
      "cookies.section6.body": "Luraaya reserves the right to amend this Cookies Information at any time, in particular in the event of technical, legal, or operational changes. The version published on the website shall apply. Only the German version of this Cookies Information is legally binding. Translations into other languages are provided for convenience only. In the event of discrepancies or questions of interpretation, the German version shall prevail.",
      "cookies.section7.title": "7. Contact",
      "cookies.section7.body": "If you have any questions regarding the use of cookies or data protection, please contact: luraaya@outlook.com.",
      "cookies.navigation.back": "Back",
      "cookies.navigation.home": "Home",

      // Cookie Banner
      "common.close": "Close",
      "cookies.banner.title": "Your privacy matters to us.",
      "cookies.banner.text": "We use cookies to improve your experience on our website. You can adjust your preferences at any time in the cookie settings. Further details can be found in our",
      "cookies.banner.privacyLink": "Privacy Policy",
      "cookies.banner.and": "and in the",
      "cookies.banner.cookieLink": "Cookie Policy",
      "cookies.banner.settings": "Cookie Settings",
      "cookies.banner.rejectAll": "Reject all",
      "cookies.banner.acceptAll": "Accept all",
      "cookies.settings.title": "Cookie Settings",
      "cookies.settings.subtitle": "Choose which categories you would like to allow.",
      "cookies.settings.rejectAll": "Reject all",
      "cookies.settings.acceptAll": "Accept all",
      "cookies.settings.save": "Save",
      "cookies.categories.alwaysOn": "Always active",
      "cookies.categories.necessary.title": "Necessary cookies",
      "cookies.categories.necessary.desc": "These cookies are required for the website to function and cannot be disabled.",
      "cookies.categories.functional.title": "Functional cookies",
      "cookies.categories.functional.desc": "Store your preferences and support additional features.",
      "cookies.categories.performance.title": "Performance cookies",
      "cookies.categories.performance.desc": "Help us understand how the website is used so we can improve it.",
      "cookies.categories.targeting.title": "Targeting cookies",
      "cookies.categories.targeting.desc": "Enable more relevant content and marketing to be displayed.",

      // Hero Section Startseite
      "hero.badge": " ",
      "hero.title": " ",
      "hero.titleHighlight": "Astrological",
      "hero.title2": " Insights for You",
      "hero.description": "Understand yourself and the world around you",
      "hero.cta": "Receive your insights",
      "hero.learnMore": "How It Works",
      "hero.rating": " ",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "New message",
      "hero.dailyReading": "",
      "hero.personalizedFor": "Personalized for Laura R.",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Your Daily Horoscope",
      "hero.sampleMessage.content": "(...) This current lunar movement connects harmoniously with your personal horoscope structure. As a result, a particular area of life is activated in which inner clarity and a sense of confident decision-making can develop naturally. Themes that have matured internally can now be clearly acknowledged and brought to a conscious inner conclusion. (...)",
      "hero.sampleMessage.footer": "SMS • Daily • Premium",

      // Features Section
      "features.title": "Personal Guidance from \nCosmic Connections",
      "features.description": "Carefully calculated, clearly interpreted, personally delivered",
      "features.description2": " ",
      "features.description3": " ",

      // Kacheln Wie es funktioniert
      "features.personalizedChart.title": "Your Birth Configuration",
      "features.personalizedChart.description": "Your birth data form the personal starting point for every interpretation. From them, an individual astrological structure is derived, providing the basis for the cosmic context.",
      "features.dailyUpdates.title": "Cosmic Context",
      "features.dailyUpdates.description": "The astrological elements (see the next section) are calculated and analysed in relation to your initial situation. The resulting interpretation shows which themes are currently intensifying and which cycles are operating over the longer term.",
      "features.multiChannel.title": "Your Personal Message",
      "features.multiChannel.description": "From this context emerge personal insights for your everyday life. The underlying connections are clearly articulated and summarised into concise, precise, and personal impulses.",
      
      // Astro Info Section
      "astroInfo.title": "Astrological Core Elements",
      "astroInfo.description": "Each of these eight elements serves a distinct function. Together, they allow for nuanced and individually tailored astrological insights.",

      "astroInfo.cards.birthChart.title": "1. Birth Chart",
      "astroInfo.cards.birthChart.title2": "Your personal foundational structure",
      "astroInfo.cards.birthChart.content": "The birth chart forms the astrological foundation of an individual. It is calculated using date of birth, time of birth, and place of birth, and shows the unique configuration of the Sun, Moon, planets, Ascendant, and houses at the moment of birth. This structure describes fundamental personality patterns, strengths, needs, and recurring life themes. The birth chart does not change; it serves as a reference framework for meaningfully interpreting current developments.\nYou gain a clear understanding of your personal blueprint and why certain themes and behavioural patterns accompany you throughout your life.",

      "astroInfo.cards.planets.title": "2. Planets",
      "astroInfo.cards.planets.title2": "Inner drives and principles of development",
      "astroInfo.cards.planets.content": "In astrology, planets represent core psychological functions and inner drives. The Sun, Moon, Mercury, Venus, and Mars describe fundamental needs, emotions, thinking patterns, relationship dynamics, and action energy. Slower-moving planets such as Jupiter, Saturn, Uranus, Neptune, and Pluto point to longer-term developmental phases and deeper processes of transformation. Each planet expresses itself differently depending on sign, house, and aspects.\nYou recognise which inner forces motivate you, where challenges arise, and how personal development unfolds over time.",

      "astroInfo.cards.zodiacSigns.title": "3. Zodiac Signs",
      "astroInfo.cards.zodiacSigns.title2": "How energy is expressed",
      "astroInfo.cards.zodiacSigns.content": "The twelve zodiac signs describe how astrological energy is expressed. They give planets a specific quality, attitude, and mode of expression—such as initiating, emotional, analytical, or visionary. Each sign has its own strengths, learning themes, and typical response patterns. Key signs in a personal chart include the Sun sign, Moon sign, and Ascendant.\nYou understand how your inner impulses are expressed outwardly and why you experience and shape situations in a particular way.",

      "astroInfo.cards.houses.title": "4. Houses",
      "astroInfo.cards.houses.title2": "Life areas and fields of experience",
      "astroInfo.cards.houses.content": "The twelve astrological houses show where inner potentials and current influences manifest concretely in life. These include, among others, self-expression and identity (1st house), values and security (2nd house), home and inner stability (4th house), relationships (7th house), and career and life direction (10th house). Planets and transits within a house activate these specific areas of life.\nYou gain clarity about which life areas are currently evolving and where attention, decisions, or change can be particularly effective.",

      "astroInfo.cards.aspects.title": "5. Aspects",
      "astroInfo.cards.aspects.title2": "How astrological forces interact",
      "astroInfo.cards.aspects.content": "Aspects describe the angular relationships between planets and show how different inner forces cooperate or come into tension. Common aspects include conjunction, trine, sextile, square, and opposition. Harmonious aspects support expression and development, while challenging aspects foster friction and growth. Aspects operate both in the birth chart and in current transits.\nYou gain a deeper understanding of inner dynamics and recognise where potential can unfold or conscious engagement is required.",

      "astroInfo.cards.transits.title": "6. Transits",
      "astroInfo.cards.transits.title2": "Current influences and timing",
      "astroInfo.cards.transits.content": "Transits describe the ongoing movement of planets in the sky and their relationship to your personal birth chart. They indicate which themes are currently activated and how the prevailing time quality affects you individually. Fast-moving planets shape daily experiences, while slower planets mark longer developmental phases. Transits are temporary and recur in cycles.\nYou gain orientation in the present moment and can consciously interpret and make use of current developments.",

      "astroInfo.cards.moonCycles.title": "7. Moon Phases and Rhythms",
      "astroInfo.cards.moonCycles.title2": "Emotional cycles in everyday life",
      "astroInfo.cards.moonCycles.content": "The Moon moves quickly and reflects emotional moods, needs, and inner reactions. The lunar phases—new moon, waxing moon, full moon, and waning moon—describe recurring cycles of beginnings, growth, culmination, and release. In connection with your chart, they show how these rhythms are personally experienced.\nYou learn to better understand emotional fluctuations and align your daily life more consciously with natural cycles.",

      "astroInfo.cards.forecastMethods.title": "8. Forecasting Methods",
      "astroInfo.cards.forecastMethods.title2": "Annual focus and inner development",
      "astroInfo.cards.forecastMethods.content": "Forecasting methods provide a deeper perspective on temporal developments and personal growth phases. These include, among others, the Solar Return chart, which outlines annual themes around your birthday, as well as selected progressions that make inner maturation processes visible. These methods complement transits with a longer-term perspective.\nYou gain orientation regarding overarching developmental phases and can consciously shape important periods of time.",

      "common.next": "Next",
      "common.extend": "More",
      
     
       // Pricing Info
      "pricing.title": "Prices and Subscriptions",
      "pricing.subtitle": "Transparent, flexible, and cancel anytime.",
      "pricing.priceLine": "From CHF 16 per month",
      "pricing.priceLine2": "From CHF 30 per month",
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
      "signup.language": "Language",
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
 
      // Registration
      "auth.login.title": "Sign in to your account",
      "auth.login.noAccount": "Or",
      "auth.login.createAccount": "create a new account",
      "auth.fields.email.label": "Email address",
      "auth.fields.password.label": "Password",
      "auth.login.forgotPassword": "Forgot your password?",
      "auth.login.signIn": "Sign in",
      "auth.login.signingIn": "Signing in...",
      "auth.login.unexpectedError": "An unexpected error occurred. Please try again.",
  
      // Passwort Vergessen
      "auth.forgot.title": "Reset your password",
      "auth.forgot.remember": "Remember your password?",
      "auth.forgot.signIn": "Sign in",
      "auth.forgot.invalidEmail": "Please enter a valid email address.",
      "auth.forgot.success": "Please check your email for the password reset link.",
      "auth.forgot.unexpectedError": "An unexpected error occurred. Please try again.",
      "auth.forgot.sendLink": "Send reset link",
      "auth.forgot.sending": "Sending...",
 

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
      "dashboard.deleteAccountDescription": "Permanently delete your account and all associated data. This action cannot be undone.",
      "dashboard.deleteAccountButton": "Delete Account",
      "dashboard.emailUpdated": "Email updated successfully!",
      "dashboard.passwordMismatch": "New passwords do not match!",
      "dashboard.passwordUpdated": "Password updated successfully!",
      "dashboard.cancelSubscriptionConfirm": "Are you sure you want to cancel your subscription? You will lose access to premium features.",
      "dashboard.cancelSubscriptionError": "Error cancelling subscription. Please try again later.",
      "dashboard.subscriptionCancelled": "Subscription cancelled. You will retain access until your next billing date.",
      "dashboard.deleteAccountConfirm": 'Type "DELETE" to confirm account deletion:',
      "dashboard.accountDeletionRequested": "Account deletion request submitted. You will receive a confirmation email.",
      "dashboard.invalidCurrentPassword": "Invalid current password. Please try again.",
      "dashboard.passwordUpdateError": "Error updating password. Please try again later.",

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
      "dashboard.notifications.emailNotificationsDescription": "Receive horoscopes and updates via email",
      "dashboard.notifications.smsNotifications": "SMS Notifications",
      "dashboard.notifications.smsNotificationsDescription": "Receive horoscopes and alerts via SMS",
      "dashboard.notifications.pushNotifications": "Push Notifications",
      "dashboard.notifications.pushNotificationsDescription": "Receive push notifications in your browser",
      "dashboard.notifications.weeklyDigest": "Weekly Digest",
      "dashboard.notifications.weeklyDigestDescription": "Get a weekly summary of your cosmic insights",

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
      "privacy.section3.1.body": "Wir bearbeiten insbesondere folgende Personendaten: Vor- und Nachname, Geburtsdatum, Geburtszeit, Geburtsort, Geschlecht, E-Mail-Adresse, Telefonnummer, bevorzugte Sprache, Zahlungs- und Abrechnungsinformationen (über Zahlungsanbieter) zur Vertragserfüllung sowie technische Daten wie IP-Adresse, Geräte- und Browserinformationen. Es werden keine besonders schützenswerte Daten wie Gesundheitsdaten, keine religiösen Überzeugungen und keine politischen oder weltanschaulichen Angaben erhoben.",
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
      "terms.section12.body": "Die Anbieterin behält sich vor, diese Allgemeinen Geschäftsbedingungen jederzeit anzupassen. Wesentliche Änderungen werden den Nutzern in geeigneter Form mitgeteilt. Die fortgesetzte Nutzung des Angebots nach Inkrafttreten der Änderungen gilt als Zustimmung zur geänderten Fassung. Massgeblich ist ausschliesslich die deutsche Fassung dieser allgemeinen Geschäftsbedingungen. Übersetzungen in andere Sprachen dienen lediglich der besseren Verständlichkeit. Im Falle von Abweichungen oder Auslegungsfragen geht die deutsche Version vor.",
      "terms.navigation.back": "Zurück",
      "terms.navigation.home": "Startseite",

      // Cookies
      "cookies.title": "Cookies",
      "cookies.intro": "Diese Cookies-Information erläutert den Einsatz von Cookies und vergleichbaren Technologien auf der Website sowie in den digitalen Dienstleistungen von Luraaya. Sie ergänzt die Datenschutzerklärung und informiert über Art, Zweck und Umfang der eingesetzten Technologien.",
      "cookies.section1.title": "1. Allgemeine Hinweise",
      "cookies.section1.body": "Diese Cookies-Information beschreibt, wie und zu welchen Zwecken Cookies und vergleichbare Technologien auf der Website sowie in den digitalen Dienstleistungen von Luraaya eingesetzt werden. Sie ergänzt die Datenschutzerklärung. Massgeblich ist jeweils die aktuelle Fassung der Datenschutzerklärung.",
      "cookies.section2.title": "2. Arten von Cookies",
      "cookies.section2.body": "Luraaya setzt Cookies und vergleichbare Technologien ein, um die grundlegende Funktionalität, Sicherheit und Stabilität der Website sicherzustellen. Darüber hinaus können – vorbehaltlich einer entsprechenden Einwilligung – Cookies zur Analyse der Nutzung der Website sowie zu Marketing- und Optimierungszwecken eingesetzt werden. Die einzelnen Kategorien werden nachfolgend näher erläutert.",
      "cookies.section2.1.title": "2.1 Technisch notwendige Cookies",
      "cookies.section2.1.body": "Technisch notwendige Cookies sind erforderlich, damit die Website und die digitalen Dienstleistungen korrekt und sicher funktionieren. Sie ermöglichen insbesondere grundlegende Funktionen wie die Navigation auf der Website, die Speicherung von Sitzungsinformationen, Sicherheits- und Schutzmechanismen sowie die technische Stabilität. Diese Cookies sind für den Betrieb zwingend erforderlich und können nicht deaktiviert werden.",
      "cookies.section2.2.title": "2.2 Funktionale Cookies",
      "cookies.section2.2.body": "Funktionale Cookies ermöglichen es, bestimmte nutzerseitige Einstellungen und Präferenzen zu speichern, um den Nutzungskomfort zu erhöhen. Dazu gehören beispielsweise die Speicherung der bevorzugten Sprache oder andere individuelle Einstellungen. Der Einsatz funktionaler Cookies erfolgt nur, sofern der Nutzer hierzu seine Einwilligung erteilt hat.",
      "cookies.section2.3.title": "2.3 Analyse- und Statistik-Cookies",
      "cookies.section2.3.body": "Analyse- und Statistik-Cookies dienen dazu, die Nutzung der Website besser zu verstehen und das Angebot kontinuierlich zu verbessern. Sie ermöglichen es, aggregierte Informationen über das Nutzerverhalten zu erfassen, etwa welche Inhalte besonders häufig genutzt werden. Der Einsatz solcher Cookies erfolgt ausschliesslich auf Grundlage einer freiwilligen Einwilligung.",
      "cookies.section2.4.title": "2.4 Marketing- und Targeting-Cookies",
      "cookies.section2.4.body": "Marketing- und Targeting-Cookies können eingesetzt werden, um Inhalte, Angebote und Marketingmassnahmen besser auf die Interessen der Nutzer abzustimmen sowie die Wirksamkeit von Marketingkampagnen zu messen. Diese Cookies können auch dazu dienen, Interaktionen über verschiedene Sitzungen hinweg auszuwerten. Der Einsatz erfolgt nur nach vorheriger Einwilligung des Nutzers.",
      "cookies.section3.title": "3. Cookies von Drittanbietern",
      "cookies.section3.body": "Zur Bereitstellung der Website und der digitalen Dienstleistungen können Drittanbieter eingebunden sein, etwa für Hosting, Zahlungsabwicklung, Kommunikation, Analyse oder Marketing. Diese Anbieter können im Rahmen ihrer Leistungen Cookies oder vergleichbare Technologien einsetzen. Eine Bearbeitung personenbezogener Daten erfolgt ausschliesslich im Rahmen der vereinbarten Zwecke sowie auf Grundlage einer gesetzlichen Grundlage oder einer entsprechenden Einwilligung.",
      "cookies.section4.title": "4. Einwilligung und Cookie-Einstellungen",
      "cookies.section4.body": "Beim erstmaligen Besuch der Website werden Nutzer über den Einsatz von Cookies informiert und können ihre Einwilligung zu den einzelnen Kategorien erteilen oder verweigern. Technisch notwendige Cookies werden unabhängig davon eingesetzt, da sie für den Betrieb der Website erforderlich sind. Die Cookie-Einstellungen können jederzeit angepasst werden.",
      "cookies.section5.title": "5. Rechtsgrundlagen",
      "cookies.section5.body": "Die Bearbeitung personenbezogener Daten im Zusammenhang mit Cookies erfolgt gestützt auf das Schweizer Bundesgesetz über den Datenschutz (revDSG). Soweit anwendbar, werden auch die Bestimmungen der Datenschutz-Grundverordnung der Europäischen Union (DSGVO) berücksichtigt.",
      "cookies.section6.title": "6. Änderungen der Cookies-Information",
      "cookies.section6.body": "Luraaya behält sich vor, diese Cookies-Information jederzeit anzupassen, insbesondere bei technischen, rechtlichen oder betrieblichen Änderungen. Es gilt jeweils die auf der Website veröffentlichte aktuelle Version. Massgeblich ist ausschliesslich die deutsche Fassung dieser Cookies-Information. Übersetzungen in andere Sprachen dienen lediglich der besseren Verständlichkeit. Im Falle von Abweichungen oder Auslegungsfragen geht die deutsche Version vor.",
      "cookies.section7.title": "7. Kontakt",
      "cookies.section7.body": "Bei Fragen zum Einsatz von Cookies oder zum Datenschutz können sich Nutzer an folgende Kontaktstelle wenden: luraaya@outlook.com.",
      "cookies.navigation.back": "Zurück",
      "cookies.navigation.home": "Startseite",

      // Cookie Banner
      "common.close": "Schliessen",
      "cookies.banner.title": "Ihre Privatsphäre ist uns wichtig.",
      "cookies.banner.text": "Wir verwenden Cookies, um die Nutzung der Website zu verbessern. Sie können Ihre Auswahl jederzeit in den Cookie-Einstellungen anpassen. Details finden Sie in unserer",
      "cookies.banner.privacyLink": "Datenschutzerklärung",
      "cookies.banner.and": "und in der",
      "cookies.banner.cookieLink": "Cookie-Richtlinie",
      "cookies.banner.settings": "Cookie-Einstellungen",
      "cookies.banner.rejectAll": "Alle ablehnen",
      "cookies.banner.acceptAll": "Alle akzeptieren",
      "cookies.settings.title": "Cookie-Einstellungen",
      "cookies.settings.subtitle": "Wählen Sie aus, welche Kategorien Sie zulassen möchten.",
      "cookies.settings.rejectAll": "Alle ablehnen",
      "cookies.settings.acceptAll": "Alle akzeptieren",
      "cookies.settings.save": "Speichern",
      "cookies.categories.alwaysOn": "Immer aktiv",
      "cookies.categories.necessary.title": "Notwendige Cookies",
      "cookies.categories.necessary.desc": "Diese Cookies sind erforderlich, damit die Website funktioniert, und können nicht deaktiviert werden.",
      "cookies.categories.functional.title": "Funktionale Cookies",
      "cookies.categories.functional.desc": "Speichern Ihre Präferenzen und unterstützen Zusatzfunktionen.",
      "cookies.categories.performance.title": "Performance Cookies",
      "cookies.categories.performance.desc": "Helfen uns zu verstehen, wie die Website genutzt wird, um sie zu verbessern.",
      "cookies.categories.targeting.title": "Targeting Cookies",
      "cookies.categories.targeting.desc": "Ermöglichen es, Inhalte und Marketing relevanter auszuspielen.",

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
      "hero.sampleMessage.content": "(...) Diese aktuelle Mondbewegung verbindet sich harmonisch mit deiner persönlichen Horoskopstruktur. Dadurch wird ein Lebensbereich aktiviert, in dem sich innere Klarheit und Entscheidungssicherheit auf natürliche Weise entwickeln können. Themen, die innerlich gereift sind, können jetzt klar benannt und innerlich abgeschlossen werden. (...)",
      "hero.sampleMessage.footer": "SMS • Täglich • Premium",

      // Features Section
      "features.title": "Persönliche Hinweise aus \nkosmischen Zusammenhängen",
      "features.description": "Sorgfältig berechnet, verständlich interpretiert, persönlich übermittelt.",
      "features.description2": " ",
      "features.description3": " ",

      // Kacheln Wie es funktioniert
      "features.personalizedChart.title": "Deine Geburtskonstellation",
      "features.personalizedChart.description": "Deine Geburtsdaten bilden den persönlichen Ausgangspunkt jeder Einordnung. Aus ihnen entsteht eine individuelle astrologische Struktur und somit die Ausgangslage für die kosmische Einordnung.",
      "features.dailyUpdates.title": "Kosmische Einordnung",
      "features.dailyUpdates.description": "Die astrologischen Elemente (siehe nächsten Abschnitt) werden in Bezug auf deine Ausgangslage berechnet und analysiert. Die entstandene Einordnung zeigt, welche Themen sich aktuell verdichten und welche Zyklen längerfristig wirken.",
      "features.multiChannel.title": "Dein persönlicher Hinweis",
      "features.multiChannel.description": "Aus der Einordnung entstehen persönliche Hinweise für deinen Alltag. Die zugrunde liegenden Zusammenhänge werden verständlich aufbereitet und zu klaren Impulsen für dich zusammengefasst - präzise und persönlich.",
     
      // Astro Info Seciton
      "astroInfo.title": "Astrologische Grundelemente",
      "astroInfo.description": "Jedes dieser 8 Elemente erfüllt eine eigene Funktion. In ihrer Gesamtheit ermöglichen sie differenzierte und individuell abgestimmte astrologische Hinweise.",

      "astroInfo.cards.birthChart.title": "1. Geburtshoroskop",
      "astroInfo.cards.birthChart.title2": "Deine persönliche Grundstruktur",
      "astroInfo.cards.birthChart.content": "Das Geburtshoroskop bildet die astrologische Ausgangsbasis eines Menschen. Es wird aus Geburtsdatum, Geburtszeit und Geburtsort berechnet und zeigt die individuelle Konstellation von Sonne, Mond, Planeten, Aszendent und Häusern zum Zeitpunkt der Geburt. Diese Struktur beschreibt grundlegende Persönlichkeitsmuster, Stärken, Bedürfnisse und wiederkehrende Lebensthemen. Das Geburtshoroskop verändert sich nicht – es dient als Referenzrahmen, um aktuelle Entwicklungen sinnvoll einzuordnen.\nDu erhältst ein klares Bild deiner persönlichen Grundanlage und verstehst, warum bestimmte Themen und Verhaltensweisen dich ein Leben lang begleiten.",

      "astroInfo.cards.planets.title": "2. Planeten",
      "astroInfo.cards.planets.title2": "Innere Antriebe und Entwicklungsprinzipien",
      "astroInfo.cards.planets.content": "Planeten stehen in der Astrologie für zentrale psychologische Funktionen und innere Antriebe. Sonne, Mond, Merkur, Venus und Mars beschreiben grundlegende Bedürfnisse, Emotionen, Denken, Beziehungsmuster und Handlungsenergie. Die langsameren Planeten wie Jupiter, Saturn, Uranus, Neptun und Pluto weisen auf langfristige Entwicklungsphasen und tiefere Wandlungsprozesse hin. Jeder Planet wirkt unterschiedlich, je nach Zeichen, Haus und Aspekten.\nDu erkennst, welche inneren Kräfte dich motivieren, wo Herausforderungen liegen und wie sich persönliche Entwicklung über die Zeit entfaltet.",

      "astroInfo.cards.zodiacSigns.title": "3. Tierkreiszeichen",
      "astroInfo.cards.zodiacSigns.title2": "Wie sich Energie ausdrückt",
      "astroInfo.cards.zodiacSigns.content": "Die zwölf Tierkreiszeichen beschreiben die Art und Weise, wie astrologische Energie ausgedrückt wird. Sie geben Planeten eine bestimmte Qualität, Haltung und Ausdrucksform – zum Beispiel initiativ, emotional, analytisch oder visionär. Jedes Zeichen hat eigene Stärken, Lernfelder und typische Reaktionsmuster. Wichtige Zeichen im persönlichen Horoskop sind unter anderem das Sonnenzeichen, das Mondzeichen und der Aszendent.\nDu verstehst, wie deine inneren Impulse nach aussen wirken und warum du Situationen auf eine bestimmte Art erlebst und gestaltest.",

      "astroInfo.cards.houses.title": "4. Häuser",
      "astroInfo.cards.houses.title2": "Lebensbereiche und Erfahrungsfelder",
      "astroInfo.cards.houses.content": "Die zwölf astrologischen Häuser zeigen, in welchen Lebensbereichen sich innere Anlagen und aktuelle Einflüsse konkret entfalten. Dazu gehören unter anderem Auftreten und Selbstbild (1. Haus), Werte und Sicherheit (2. Haus), Zuhause und innere Stabilität (4. Haus), Beziehungen (7. Haus) sowie Beruf und Lebensrichtung (10. Haus). Planeten und Transite in einem Haus aktivieren genau diese Themenfelder.\nDu erkennst, in welchem Lebensbereich sich Entwicklungen aktuell zeigen und wo Aufmerksamkeit, Entscheidungen oder Veränderungen besonders wirksam sind.",

      "astroInfo.cards.aspects.title": "5. Aspekte",
      "astroInfo.cards.aspects.title2": "Wie astrologische Kräfte zusammenwirken",
      "astroInfo.cards.aspects.content": "Aspekte beschreiben die Winkelbeziehungen zwischen Planeten und zeigen, wie unterschiedliche innere Kräfte miteinander kooperieren oder in Spannung stehen. Häufige Aspekte sind Konjunktion, Trigon, Sextil, Quadrat und Opposition. Harmonische Aspekte erleichtern Ausdruck und Entwicklung, herausfordernde Aspekte fördern Reibung und Wachstum. Aspekte wirken sowohl im Geburtshoroskop als auch in aktuellen Transiten.\nDu verstehst innere Dynamiken besser und erkennst, wo sich Potenziale entfalten oder bewusste Auseinandersetzung gefragt ist.",

      "astroInfo.cards.transits.title": "6. Transite",
      "astroInfo.cards.transits.title2": "Aktuelle Einflüsse und Zeitqualität",
      "astroInfo.cards.transits.content": "Transite beschreiben die laufenden Bewegungen der Planeten am Himmel und deren Bezug zu deinem persönlichen Geburtshoroskop. Sie zeigen, welche Themen aktuell aktiviert werden und wie sich die gegenwärtige Zeitqualität individuell auswirkt. Schnelle Planeten prägen den Alltag, langsame Planeten markieren längere Entwicklungsphasen. Transite sind zeitlich begrenzt und wiederholen sich in Zyklen.\nDu erhältst Orientierung im Hier und Jetzt und kannst aktuelle Entwicklungen bewusster einordnen und nutzen.",

      "astroInfo.cards.moonCycles.title": "7. Mondphasen und Rhythmen",
      "astroInfo.cards.moonCycles.title2": "Emotionale Zyklen im Alltag",
      "astroInfo.cards.moonCycles.content": "Der Mond bewegt sich schnell und spiegelt emotionale Stimmungen, Bedürfnisse und innere Reaktionen. Die Mondphasen – Neumond, zunehmender Mond, Vollmond und abnehmender Mond – beschreiben wiederkehrende Zyklen von Beginn, Aufbau, Höhepunkt und Loslassen. In Verbindung mit deinem Horoskop zeigen sie, wie diese Rhythmen persönlich erlebt werden.\nDu lernst, emotionale Schwankungen besser zu verstehen und deinen Alltag im Einklang mit natürlichen Zyklen zu gestalten.",

      "astroInfo.cards.forecastMethods.title": "8. Prognosemethoden",
      "astroInfo.cards.forecastMethods.title2": "Jahresfokus und innere Entwicklung",
      "astroInfo.cards.forecastMethods.content": "Prognosemethoden ermöglichen einen vertieften Blick auf zeitliche Entwicklungen und persönliche Wachstumsphasen. Dazu gehören unter anderem das Solarhoroskop, das die Jahresthemen rund um den Geburtstag beschreibt, sowie ausgewählte Progressionen, die innere Reifungsprozesse sichtbar machen. Diese Methoden ergänzen Transite um eine längerfristige Perspektive.\nDu erhältst Orientierung über übergeordnete Entwicklungsphasen und kannst wichtige Zeitabschnitte bewusst gestalten.",

      "common.next": "Nächstes",
      "common.extend": "Mehr",
      
      // Pricing Info
      "pricing.title": "Preise und Abonnemente",
      "pricing.subtitle": "Transparent, flexibel und jederzeit kündbar.",
      "pricing.priceLine": "Basis ab CHF 16.– pro Monat",
      "pricing.priceLine2": "Premium ab CHF 30.– pro Monat",
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
      "pricing.perYear": " /Jahr",
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


      // Registration
      "auth.login.title": "Anmeldung zu deinem Konto",
      "auth.login.noAccount": "Oder",
      "auth.login.createAccount": "neues Konto erstellen",
      "auth.fields.email.label": "E-Mail-Adresse",
      "auth.fields.password.label": "Passwort",
      "auth.login.forgotPassword": "Passwort vergessen?",
      "auth.login.signIn": "Anmelden",
      "auth.login.signingIn": "Anmeldung läuft...",
      "auth.login.unexpectedError": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",

      // Passwort vergessen
      "auth.forgot.title": "Passwort zurücksetzen",
      "auth.forgot.remember": "Du erinnerst dich an dein Passwort?",
      "auth.forgot.signIn": "Anmelden",
      "auth.forgot.invalidEmail": "Bitte gib eine gültige E-Mail-Adresse ein.",
      "auth.forgot.success": "Bitte prüfe deine E-Mails für den Link zum Zurücksetzen des Passworts.",
      "auth.forgot.unexpectedError": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",
      "auth.forgot.sendLink": "Link zum Zurücksetzen senden",
      "auth.forgot.sending": "Wird gesendet...",

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
      "dashboard.yourZodiacSign": "Dein Sternzeichen",
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
        "Bist du sicher, dass du dein Abonnement kündigen möchtest? Du verlierst den Zugang zu Premium-Funktionen.",
      "dashboard.cancelSubscriptionError":
        "Fehler bei der Kündigung des Abonnements. Bitte versuche es später erneut.",
      "dashboard.subscriptionCancelled":
        "Abonnement gekündigt. Du behältst den Zugang bis zu deinem nächsten Abrechnungsdatum.",
      "dashboard.deleteAccountConfirm":
        'Gebe "DELETE" ein, um die Kontolöschung zu bestätigen:',
      "dashboard.accountDeletionRequested":
        "Antrag auf Kontolöschung eingereicht. Du erhältst eine Bestätigungs-E-Mail.",
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
      "footer.legal.termsOfService": "Conditions générales",
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

      // Allgemeine Geschäftsbedingungen (AGB)
      "terms.title": "Conditions générales",
      "terms.section1.title": "1. Champ d’application",
      "terms.section1.1.title": "1.1 Champ d’application",
      "terms.section1.1.body": "Les présentes conditions générales régissent la relation juridique entre Luraaya, Berne, Suisse (ci-après le « Fournisseur »), et les utilisateurs du site web ainsi que des services numériques de Luraaya.",
      "terms.section1.2.title": "1.2 Acceptation",
      "terms.section1.2.body": "L’acceptation des présentes conditions générales devient contraignante lors de la conclusion d’un abonnement payant. Le simple accès à des contenus librement accessibles ne constitue pas une relation contractuelle.",
      "terms.section2.title": "2. Description des prestations",
      "terms.section2.1.title": "2.1 Nature de l’offre",
      "terms.section2.1.body": "Luraaya propose une offre entièrement numérique, personnalisée et basée sur un abonnement dans le domaine de l’astrologie. Les prestations comprennent la création et la transmission électronique de contenus astrologiques sur la base des informations fournies par l’utilisateur ainsi que de modèles de calcul astrologiques. Les prestations sont fournies exclusivement en ligne.",
      "terms.section2.2.title": "2.2 Absence de résultat garanti",
      "terms.section2.2.body": "Aucun résultat déterminé, effet spécifique, exactitude objective ou bénéfice subjectif n’est garanti. Les contenus sont de nature interprétative et indicative et ne revendiquent aucune valeur scientifique.",
      "terms.section3.title": "3. Nature des contenus",
      "terms.section3.1.title": "3.1 Absence de conseil",
      "terms.section3.1.body": "Les contenus fournis par Luraaya ont pour seul objectif l’orientation générale, l’inspiration et la réflexion personnelle. Ils ne constituent pas un conseil médical, psychologique, thérapeutique, juridique, financier ou autre conseil professionnel et ne remplacent pas un tel conseil.",
      "terms.section3.2.title": "3.2 Responsabilité personnelle",
      "terms.section3.2.body": "Toute décision prise sur la base des contenus relève exclusivement de la responsabilité de l’utilisateur.",
      "terms.section4.title": "4. Conclusion du contrat",
      "terms.section4.1.title": "4.1 Formation du contrat",
      "terms.section4.1.body": "Le contrat est conclu dès que l’utilisateur sélectionne un abonnement payant et termine avec succès le processus de paiement.",
      "terms.section4.2.title": "4.2 Conditions",
      "terms.section4.2.body": "En finalisant la commande, l’utilisateur confirme l’exactitude des informations fournies ainsi que sa capacité juridique.",
      "terms.section5.title": "5. Prix et paiement",
      "terms.section5.1.title": "5.1 Prix",
      "terms.section5.1.body": "Tous les prix sont indiqués en francs suisses (CHF), sauf indication expresse contraire.",
      "terms.section5.2.title": "5.2 Traitement des paiements",
      "terms.section5.2.body": "Le paiement est effectué à l’avance via des prestataires de services de paiement externes, notamment Stripe. Les conditions du prestataire de paiement concerné s’appliquent également.",
      "terms.section5.3.title": "5.3 Responsabilité relative aux services de paiement",
      "terms.section5.3.body": "Le Fournisseur décline toute responsabilité en cas de perturbations, retards ou erreurs liés à des services de paiement externes.",
      "terms.section6.title": "6. Abonnements, durée et résiliation",
      "terms.section6.1.title": "6.1 Durée",
      "terms.section6.1.body": "Les abonnements sont conclus pour une durée mensuelle ou annuelle selon le choix effectué et sont automatiquement renouvelés pour la durée correspondante, sauf résiliation avant la fin de la période de facturation en cours.",
      "terms.section6.2.title": "6.2 Résiliation",
      "terms.section6.2.body": "La résiliation est possible à tout moment et prend effet à la fin de la période de facturation en cours. La résiliation ne donne droit à aucun remboursement, réduction ou autre indemnisation des frais d’abonnement déjà payés, indépendamment du moment de la résiliation ou de l’étendue de l’utilisation antérieure.",
      "terms.section7.title": "7. Transmission et disponibilité",
      "terms.section7.1.title": "7.1 Transmission électronique",
      "terms.section7.1.body": "La transmission des contenus s’effectue exclusivement par des canaux de communication électroniques tels que le courrier électronique ou les SMS.",
      "terms.section7.2.title": "7.2 Disponibilité technique et perturbations",
      "terms.section7.2.body": "Le Fournisseur s’efforce d’assurer une disponibilité aussi ininterrompue que possible des services numériques. Toutefois, une disponibilité permanente et complète ne peut être garantie. En cas de perturbations techniques, de pannes de système, de travaux de maintenance ou d’événements indépendants de la volonté du Fournisseur, la transmission des contenus peut être temporairement suspendue ou retardée. Si de telles perturbations entraînent une limitation significative et non négligeable de la prestation, la durée de l’abonnement concerné est prolongée de la durée de la limitation effective. Aucun droit à remboursement des montants déjà payés n’existe.",
      "terms.section8.title": "8. Obligations des utilisateurs",
      "terms.section8.1.title": "8.1 Informations",
      "terms.section8.1.body": "Les utilisateurs s’engagent à fournir des informations exactes et complètes.",
      "terms.section8.2.title": "8.2 Utilisation",
      "terms.section8.2.body": "L’offre ne doit pas être utilisée de manière abusive ou illégale. En cas de violation, le Fournisseur se réserve le droit de restreindre ou de mettre fin à l’accès.",
      "terms.section9.title": "9. Responsabilité",
      "terms.section9.body": "La responsabilité du Fournisseur est exclue dans les limites autorisées par la loi. En particulier, le Fournisseur n’est pas responsable des dommages ou désavantages résultant de perturbations techniques temporaires, de retards dans la transmission ou d’une indisponibilité temporaire des services numériques. La responsabilité en cas de faute intentionnelle ou de négligence grave demeure réservée.",
      "terms.section10.title": "10. Propriété intellectuelle",
      "terms.section10.body": "L’ensemble des contenus, textes, concepts et représentations de Luraaya sont protégés par le droit d’auteur.",
      "terms.section11.title": "11. Protection des données",
      "terms.section11.body": "Le traitement des données personnelles est effectué conformément à la politique de confidentialité de Luraaya.",
      "terms.section12.title": "12. Modifications des conditions générales",
      "terms.section12.body": "Le Fournisseur se réserve le droit de modifier les présentes conditions générales à tout moment. Les modifications substantielles seront communiquées aux utilisateurs de manière appropriée. L’utilisation continue de l’offre après l’entrée en vigueur des modifications vaut acceptation de la version modifiée. Seule la version allemande des conditions générales est juridiquement contraignante. Les traductions dans d’autres langues sont fournies uniquement à titre informatif. En cas de divergences ou de questions d’interprétation, la version allemande prévaut.",
      "terms.navigation.back": "Retour",
      "terms.navigation.home": "Page d’accueil",

      // Cookies
      "cookies.title": "Cookies",
      "cookies.intro": "La présente information relative aux cookies explique l’utilisation de cookies et de technologies similaires sur le site web ainsi que dans les services numériques de Luraaya. Elle complète la politique de confidentialité et informe sur la nature, la finalité et l’étendue des technologies utilisées.",
      "cookies.section1.title": "1. Informations générales",
      "cookies.section1.body": "La présente information relative aux cookies décrit comment et à quelles fins des cookies et des technologies similaires sont utilisés sur le site web ainsi que dans les services numériques de Luraaya. Elle complète la politique de confidentialité. La version actuelle de la politique de confidentialité fait foi.",
      "cookies.section2.title": "2. Types de cookies",
      "cookies.section2.body": "Luraaya utilise des cookies et des technologies similaires afin de garantir la fonctionnalité de base, la sécurité et la stabilité du site web. En outre, sous réserve du consentement approprié, des cookies peuvent être utilisés à des fins d’analyse de l’utilisation du site web ainsi qu’à des fins de marketing et d’optimisation. Les différentes catégories sont expliquées plus en détail ci-dessous.",
      "cookies.section2.1.title": "2.1 Cookies strictement nécessaires",
      "cookies.section2.1.body": "Les cookies strictement nécessaires sont indispensables au bon fonctionnement et à la sécurité du site web et des services numériques. Ils permettent notamment des fonctions essentielles telles que la navigation sur le site web, la conservation des informations de session, les mécanismes de sécurité et de protection, ainsi que la stabilité technique. Ces cookies sont indispensables et ne peuvent pas être désactivés.",
      "cookies.section2.2.title": "2.2 Cookies fonctionnels",
      "cookies.section2.2.body": "Les cookies fonctionnels permettent d’enregistrer certaines préférences et paramètres de l’utilisateur afin d’améliorer le confort d’utilisation. Il s’agit par exemple de la mémorisation de la langue préférée ou d’autres paramètres individuels. Les cookies fonctionnels ne sont utilisés que si l’utilisateur a donné son consentement.",
      "cookies.section2.3.title": "2.3 Cookies d’analyse et de statistiques",
      "cookies.section2.3.body": "Les cookies d’analyse et de statistiques servent à mieux comprendre l’utilisation du site web et à améliorer continuellement l’offre. Ils permettent de collecter des informations agrégées sur le comportement des utilisateurs, par exemple les contenus les plus consultés. Ces cookies sont utilisés exclusivement sur la base d’un consentement volontaire.",
      "cookies.section2.4.title": "2.4 Cookies de marketing et de ciblage",
      "cookies.section2.4.body": "Les cookies de marketing et de ciblage peuvent être utilisés afin d’adapter plus précisément les contenus, les offres et les actions de marketing aux intérêts des utilisateurs, ainsi que pour mesurer l’efficacité des campagnes de marketing. Ces cookies peuvent également servir à analyser des interactions sur plusieurs sessions. Ils ne sont utilisés qu’après le consentement préalable de l’utilisateur.",
      "cookies.section3.title": "3. Cookies de tiers",
      "cookies.section3.body": "Des prestataires tiers peuvent être impliqués dans la mise à disposition du site web et des services numériques, notamment pour l’hébergement, le traitement des paiements, la communication, l’analyse ou le marketing. Ces prestataires peuvent utiliser des cookies ou des technologies similaires dans le cadre de leurs services. Le traitement des données personnelles s’effectue exclusivement dans le cadre des finalités convenues et sur la base d’une base légale ou d’un consentement correspondant.",
      "cookies.section4.title": "4. Consentement et paramètres des cookies",
      "cookies.section4.body": "Lors de la première visite du site web, les utilisateurs sont informés de l’utilisation des cookies et peuvent accorder ou refuser leur consentement pour les différentes catégories. Les cookies strictement nécessaires sont utilisés indépendamment du consentement, car ils sont indispensables au fonctionnement du site web. Les paramètres des cookies peuvent être modifiés à tout moment.",
      "cookies.section5.title": "5. Bases légales",
      "cookies.section5.body": "Le traitement des données personnelles en lien avec les cookies est fondé sur la loi fédérale suisse sur la protection des données (LPD révisée). Le cas échéant, les dispositions du Règlement général sur la protection des données de l’Union européenne (RGPD) sont également prises en compte.",
      "cookies.section6.title": "6. Modifications de l’information relative aux cookies",
      "cookies.section6.body": "Luraaya se réserve le droit de modifier à tout moment la présente information relative aux cookies, notamment en cas de changements techniques, juridiques ou opérationnels. La version publiée sur le site web fait foi. Seule la version allemande de l'information relative aux cookies est juridiquement contraignante. Les traductions dans d'autres langues sont fournies uniquement à titre informatif. En cas de divergences ou de questions d'interprétation, la version allemande prévaut.",
      "cookies.section7.title": "7. Contact",
      "cookies.section7.body": "Pour toute question concernant l’utilisation des cookies ou la protection des données, veuillez contacter: luraaya@outlook.com.",
      "cookies.navigation.back": "Retour",
      "cookies.navigation.home": "Page d’accueil",

      // Cookie Banner
      "common.close": "Fermer",
      "cookies.banner.title": "Votre vie privée est importante pour nous.",
      "cookies.banner.text": "Nous utilisons des cookies afin d’améliorer l’utilisation du site web. Vous pouvez adapter votre sélection à tout moment dans les paramètres des cookies. Vous trouverez plus de détails dans notre",
      "cookies.banner.privacyLink": "politique de confidentialité",
      "cookies.banner.and": "et dans la",
      "cookies.banner.cookieLink": "politique relative aux cookies",
      "cookies.banner.settings": "Paramètres des cookies",
      "cookies.banner.rejectAll": "Tout refuser",
      "cookies.banner.acceptAll": "Tout accepter",
      "cookies.settings.title": "Paramètres des cookies",
      "cookies.settings.subtitle": "Veuillez sélectionner les catégories que vous souhaitez autoriser.",
      "cookies.settings.rejectAll": "Tout refuser",
      "cookies.settings.acceptAll": "Tout accepter",
      "cookies.settings.save": "Enregistrer",
      "cookies.categories.alwaysOn": "Toujours actif",
      "cookies.categories.necessary.title": "Cookies nécessaires",
      "cookies.categories.necessary.desc": "Ces cookies sont nécessaires au bon fonctionnement du site web et ne peuvent pas être désactivés.",
      "cookies.categories.functional.title": "Cookies fonctionnels",
      "cookies.categories.functional.desc": "Enregistrent vos préférences et prennent en charge des fonctionnalités supplémentaires.",
      "cookies.categories.performance.title": "Cookies de performance",
      "cookies.categories.performance.desc": "Nous aident à comprendre comment le site web est utilisé afin de l’améliorer.",
      "cookies.categories.targeting.title": "Cookies de ciblage",
      "cookies.categories.targeting.desc": "Permettent d’afficher des contenus et des actions de marketing plus pertinents.",

      // Hero Section Startseite
      "hero.badge": " ",
      "hero.title": "Indications ",
      "hero.titleHighlight": "astrologiques",
      "hero.title2": "pour vous",
      "hero.description": "Comprenez-vous, et le monde qui vous entoure.",
      "hero.cta": "Recevoir vos indications",
      "hero.learnMore": "Comment ça marche",
      "hero.rating": " ",
      "hero.users": " ",
      "hero.insights": " ",
      "hero.newReading": "Nouvelle indication",
      "hero.dailyReading": " ",
      "hero.personalizedFor": "Personnalisé pour Laura R.",

      // Hero Sample Message Content
      "hero.sampleMessage.title": "Votre horoscope du jour",
      "hero.sampleMessage.content": "(...) Ce mouvement lunaire actuel se relie de manière harmonieuse à la structure de votre horoscope personnel. Il active ainsi un domaine de vie dans lequel la clarté intérieure et la sécurité dans les décisions peuvent se développer naturellement. Les thèmes qui ont mûri intérieurement peuvent désormais être clairement identifiés et amenés à une conclusion intérieure consciente. (...)",
      "hero.sampleMessage.footer": "SMS • Quotidien • Premium",

      // Features Section
      "features.title": "Indications personnelles issues \ndes liens cosmiques",
      "features.description": "Soigneusement calculé, Interprété avec justesse, transmis personnellement",
      "features.description2": " ",
      "features.description3": " ",
        
      // Kacheln Wie es funktioniert
      "features.personalizedChart.title": "Votre configuration de naissance",
      "features.personalizedChart.description": "Vos données de naissance constituent le point de départ personnel de toute analyse. Elles permettent d’établir une structure astrologique individuelle, qui sert de base à la mise en perspective cosmique.",
      "features.dailyUpdates.title": "Mise en perspective cosmique",
      "features.dailyUpdates.description": "Les éléments astrologiques (voir la section suivante) sont calculés et analysés en fonction de votre situation de départ. L’interprétation qui en résulte montre quels thèmes se renforcent actuellement et quels cycles agissent sur le plus long terme.",
      "features.multiChannel.title": "Vos indications personnelles",
      "features.multiChannel.description": "De cette mise en perspective résultent des indications personnelles pour votre quotidien. Les liens sous-jacents sont présentés de manière claire et synthétisés en impulsions précises et personnelles.",
      
      // Astro section
      "astroInfo.title": "Fondements astrologiques",
      "astroInfo.description": "Chacun de ces huit éléments remplit une fonction spécifique. Ensemble, ils permettent des indications astrologiques nuancées et adaptées à votre individualité.",

      "astroInfo.cards.birthChart.title": "1. Thème natal",
      "astroInfo.cards.birthChart.title2": "Votre structure fondamentale personnelle",
      "astroInfo.cards.birthChart.content": "Le thème natal constitue la base astrologique d’une personne. Il est calculé à partir de la date de naissance, de l’heure de naissance et du lieu de naissance, et montre la configuration individuelle du Soleil, de la Lune, des planètes, de l’Ascendant et des maisons au moment de la naissance. Cette structure décrit les grands schémas de personnalité, les forces, les besoins et les thèmes de vie récurrents. Le thème natal ne change pas ; il sert de cadre de référence pour interpréter les évolutions actuelles de manière pertinente.\nVous obtenez une vision claire de votre structure de base personnelle et comprenez pourquoi certains thèmes et comportements vous accompagnent tout au long de votre vie.",

      "astroInfo.cards.planets.title": "2. Planètes",
      "astroInfo.cards.planets.title2": "Dynamiques intérieures et principes d’évolution",
      "astroInfo.cards.planets.content": "En astrologie, les planètes représentent des fonctions psychologiques centrales et des dynamiques intérieures. Le Soleil, la Lune, Mercure, Vénus et Mars décrivent les besoins fondamentaux, les émotions, la pensée, les schémas relationnels et l’énergie d’action. Les planètes plus lentes comme Jupiter, Saturne, Uranus, Neptune et Pluton indiquent des phases de développement à long terme et des processus de transformation plus profonds. Chaque planète agit différemment selon le signe, la maison et les aspects.\nVous identifiez les forces intérieures qui vous motivent, les zones de défi et la manière dont votre développement personnel se déploie dans le temps.",

      "astroInfo.cards.zodiacSigns.title": "3. Signes du zodiaque",
      "astroInfo.cards.zodiacSigns.title2": "La manière dont l’énergie s’exprime",
      "astroInfo.cards.zodiacSigns.content": "Les douze signes du zodiaque décrivent la façon dont l’énergie astrologique s’exprime. Ils confèrent aux planètes une qualité, une attitude et une forme d’expression spécifiques — par exemple initiatrice, émotionnelle, analytique ou visionnaire. Chaque signe possède ses forces, ses axes d’apprentissage et ses modes de réaction typiques. Les signes clés dans un thème personnel incluent notamment le signe solaire, le signe lunaire et l’Ascendant.\nVous comprenez comment vos impulsions intérieures se manifestent vers l’extérieur et pourquoi vous vivez et façonnez les situations d’une certaine manière.",

      "astroInfo.cards.houses.title": "4. Maisons",
      "astroInfo.cards.houses.title2": "Domaines de vie et champs d’expérience",
      "astroInfo.cards.houses.content": "Les douze maisons astrologiques montrent dans quels domaines de la vie les dispositions intérieures et les influences actuelles se manifestent concrètement. Elles incluent notamment l’expression de soi et l’identité (1re maison), les valeurs et la sécurité (2e maison), le foyer et la stabilité intérieure (4e maison), les relations (7e maison) ainsi que la carrière et l’orientation de vie (10e maison). Les planètes et les transits dans une maison activent précisément ces thématiques.\nVous identifiez les domaines de vie actuellement concernés par des évolutions et là où l’attention, les décisions ou les changements peuvent être particulièrement efficaces.",

      "astroInfo.cards.aspects.title": "5. Aspects",
      "astroInfo.cards.aspects.title2": "L’interaction des forces astrologiques",
      "astroInfo.cards.aspects.content": "Les aspects décrivent les relations angulaires entre les planètes et montrent comment différentes forces intérieures coopèrent ou entrent en tension. Les aspects courants incluent la conjonction, le trigone, le sextile, le carré et l’opposition. Les aspects harmonieux facilitent l’expression et le développement, tandis que les aspects dynamiques favorisent la confrontation et la croissance. Les aspects agissent à la fois dans le thème natal et dans les transits actuels.\nVous comprenez mieux les dynamiques intérieures et identifiez les potentiels à développer ou les zones nécessitant une prise de conscience.",

      "astroInfo.cards.transits.title": "6. Transits",
      "astroInfo.cards.transits.title2": "Influences actuelles et climat temporel",
      "astroInfo.cards.transits.content": "Les transits décrivent le mouvement actuel des planètes dans le ciel et leur relation avec votre thème natal. Ils indiquent quelles thématiques sont activées et comment la qualité du temps présent se manifeste de manière individuelle. Les planètes rapides influencent le quotidien, tandis que les planètes lentes marquent des phases de développement plus longues. Les transits sont limités dans le temps et s’inscrivent dans des cycles récurrents.\nVous obtenez des repères pour le présent et pouvez interpréter et utiliser les évolutions actuelles de manière plus consciente.",

      "astroInfo.cards.moonCycles.title": "7. Phases et rythmes lunaires",
      "astroInfo.cards.moonCycles.title2": "Cycles émotionnels au quotidien",
      "astroInfo.cards.moonCycles.content": "La Lune se déplace rapidement et reflète les humeurs émotionnelles, les besoins et les réactions intérieures. Les phases lunaires — nouvelle lune, lune croissante, pleine lune et lune décroissante — décrivent des cycles récurrents de commencement, de croissance, d’apogée et de lâcher-prise. En lien avec votre thème, elles montrent comment ces rythmes sont vécus personnellement.\nVous apprenez à mieux comprendre les fluctuations émotionnelles et à organiser votre quotidien en accord avec les rythmes naturels.",

      "astroInfo.cards.forecastMethods.title": "8. Méthodes de prévision",
      "astroInfo.cards.forecastMethods.title2": "Orientation annuelle et développement intérieur",
      "astroInfo.cards.forecastMethods.content": "Les méthodes de prévision permettent une analyse approfondie des évolutions temporelles et des phases de croissance personnelle. Elles incluent notamment le thème solaire, qui décrit les thématiques de l’année autour de votre anniversaire, ainsi que certaines progressions qui rendent visibles les processus de maturation intérieure. Ces méthodes complètent les transits par une perspective à plus long terme.\nVous obtenez une vision claire des grandes phases de développement et pouvez aborder consciemment les périodes importantes.",

      "common.next": "Suivant",
      "common.extend": "Plus",

      // Pricing Info
      "pricing.title": "Prix et abonnements",
      "pricing.subtitle": "Transparent, flexible et résiliable à tout moment.",
      "pricing.priceLine": "Dès CHF 16.– par mois",
      "pricing.priceLine2": "Dès CHF 30.– par mois",
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
        "pricing.orSaveYearly": "Ou économisez avec l’abonnement annuel :",
        "pricing.savePercent": "Avantage de {{percent}} %",
        "pricing.saveAmount": "Avantage de {{amount}} ({{percent}} %)",
        "pricing.percentOff": "{{percent}} % de réduction",


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
      "signup.language": "Langue",
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
      "errors.genericCheckout": "Le paiement n’a pas pu être démarré. Veuillez réessayer.",

      // Registration
      "auth.login.title": "Connexion à votre compte",
      "auth.login.noAccount": "Ou",
      "auth.login.createAccount": "créer un nouveau compte",
      "auth.fields.email.label": "Adresse e-mail",
      "auth.fields.password.label": "Mot de passe",
      "auth.login.forgotPassword": "Mot de passe oublié?",
      "auth.login.signIn": "Se connecter",
      "auth.login.signingIn": "Connexion en cours...",
      "auth.login.unexpectedError": "Une erreur inattendue est survenue. Veuillez réessayer.",

      // Passwort vergessen
      "auth.forgot.title": "Réinitialiser votre mot de passe",
      "auth.forgot.remember": "Vous vous souvenez de votre mot de passe?",
      "auth.forgot.signIn": "Se connecter",
      "auth.forgot.invalidEmail": "Veuillez saisir une adresse e-mail valide.",
      "auth.forgot.success": "Veuillez consulter vos e-mails pour obtenir le lien de réinitialisation du mot de passe.",
      "auth.forgot.unexpectedError": "Une erreur inattendue est survenue. Veuillez réessayer.",
      "auth.forgot.sendLink": "Envoyer le lien de réinitialisation",
      "auth.forgot.sending": "Envoi en cours...",

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
