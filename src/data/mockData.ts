/**
 * Mock data for the astrology messaging service
 * Contains sample users, messages, testimonials, and other data for development
 */

import {
  User,
  Message,
  Testimonial,
  PricingPlan,
  Feature,
  SubscriptionType,
  CommunicationChannel,
  ZodiacSign,
  Sex,
  MessageType,
} from "../types";
import {
  MessageSquare,
  Zap,
  Shield,
  LineChart,
  Clock,
  Target,
  BookOpen,
  Users,
  Star,
  Moon,
  Sun,
} from "lucide-react";

// Mock users with astrological data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    sex: Sex.FEMALE,
    dateOfBirth: new Date("1990-07-15"),
    timeOfBirth: "14:30",
    placeOfBirth: "San Francisco, CA",
    zodiacSign: ZodiacSign.CANCER,
    subscriptionType: SubscriptionType.WEEKLY,
    communicationChannel: CommunicationChannel.EMAIL,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    sex: Sex.MALE,
    dateOfBirth: new Date("1985-11-22"),
    timeOfBirth: "09:15",
    placeOfBirth: "New York, NY",
    zodiacSign: ZodiacSign.SAGITTARIUS,
    subscriptionType: SubscriptionType.DAILY,
    communicationChannel: CommunicationChannel.SMS,
    createdAt: new Date("2023-02-21"),
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    sex: Sex.FEMALE,
    dateOfBirth: new Date("1992-03-28"),
    timeOfBirth: "18:45",
    placeOfBirth: "Los Angeles, CA",
    zodiacSign: ZodiacSign.ARIES,
    subscriptionType: SubscriptionType.WEEKLY,
    communicationChannel: CommunicationChannel.WHATSAPP,
    createdAt: new Date("2023-03-10"),
  },
];

// Mock astrological messages
export const mockMessages: Message[] = [
  {
    id: "1",
    userId: "1",
    content:
      "Cancer, the Moon's gentle influence today brings emotional clarity to your relationships. Your intuitive nature is heightened, making it an ideal time for heart-to-heart conversations. Trust your instincts when making decisions about your home and family life.",
    messageType: MessageType.DAILY_HOROSCOPE,
    sentAt: new Date("2023-06-01"),
    read: true,
  },
  {
    id: "2",
    userId: "1",
    content:
      "This week, Venus enters your career sector, Cancer. Expect recognition for your nurturing leadership style. Your ability to create harmony in the workplace will be particularly valued. Consider proposing that collaborative project you've been thinking about.",
    messageType: MessageType.WEEKLY_FORECAST,
    sentAt: new Date("2023-06-08"),
    read: true,
  },
  {
    id: "3",
    userId: "2",
    content:
      "Sagittarius, Jupiter's expansive energy is activating your adventure sector! Your natural wanderlust is calling - whether it's planning a trip or exploring new philosophical ideas. Your optimism is contagious today, inspiring others around you.",
    messageType: MessageType.DAILY_HOROSCOPE,
    sentAt: new Date("2023-06-15"),
    read: false,
  },
  {
    id: "4",
    userId: "2",
    content:
      "The New Moon in your communication zone brings fresh opportunities for learning, Sagittarius. Your thirst for knowledge and truth-seeking nature will lead you to fascinating discoveries. Consider enrolling in that course you've been eyeing.",
    messageType: MessageType.PERSONALIZED_INSIGHT,
    sentAt: new Date("2023-06-02"),
    read: true,
  },
  {
    id: "5",
    userId: "3",
    content:
      "Aries, Mars energizes your financial sector this week! Your pioneering spirit in money matters pays off. Take calculated risks in investments, but avoid impulsive purchases. Your leadership skills could open new income streams.",
    messageType: MessageType.WEEKLY_FORECAST,
    sentAt: new Date("2023-06-09"),
    read: false,
  },
];

// Features of the astrology service
export const features: Feature[] = [
  {
    id: "1",
    title: "Personalized Birth Chart Analysis",
    description:
      "Get detailed insights based on your exact birth time, date, and location for precise astrological readings.",
    icon: "Star",
  },
  {
    id: "2",
    title: "Daily Cosmic Updates",
    description:
      "Receive daily horoscopes and planetary transit notifications tailored to your unique astrological profile.",
    icon: "Sun",
  },
  {
    id: "3",
    title: "Multi-Channel Delivery",
    description:
      "Choose how you want to receive your cosmic insights - via email, SMS, or WhatsApp.",
    icon: "MessageSquare",
  },
  {
    id: "4",
    title: "Lunar Cycle Tracking",
    description:
      "Stay aligned with lunar phases and their influence on your zodiac sign for optimal timing.",
    icon: "Moon",
  },
  {
    id: "5",
    title: "Compatibility Insights",
    description:
      "Understand your relationships better with personalized compatibility readings and advice.",
    icon: "Users",
  },
  {
    id: "6",
    title: "Secure & Private",
    description:
      "Your birth data and personal information are encrypted and never shared with third parties.",
    icon: "Shield",
  },
];

// Customer testimonials
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Luna Martinez",
    zodiacSign: ZodiacSign.PISCES,
    content:
      "The daily insights have been incredibly accurate and helpful. As a Pisces, I appreciate how the messages resonate with my intuitive nature and guide my creative projects.",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150",
    rating: 5,
  },
  {
    id: "2",
    name: "David Thompson",
    zodiacSign: ZodiacSign.LEO,
    content:
      "As a Leo, I love how the service captures my ambitious nature. The weekly forecasts have helped me time important business decisions perfectly.",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150",
    rating: 5,
  },
  {
    id: "3",
    name: "Aria Patel",
    zodiacSign: ZodiacSign.VIRGO,
    content:
      "The precision and detail in the birth chart analysis impressed my analytical Virgo mind. The insights are practical and actionable, not just vague predictions.",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150",
    rating: 5,
  },
];

// Pricing plans for the service
export const pricingPlans: PricingPlan[] = [
  {
    id: "1",
    name: "Cosmic Starter",
    price: 12.99,
    frequency: "monthly",
    features: [
      "Weekly personalized horoscopes",
      "Basic birth chart analysis",
      "Email delivery",
      "Lunar phase notifications",
    ],
  },
  {
    id: "2",
    name: "Stellar Insights",
    price: 24.99,
    frequency: "monthly",
    features: [
      "Daily personalized messages",
      "Detailed birth chart analysis",
      "Multi-channel delivery (Email, SMS, WhatsApp)",
      "Planetary transit alerts",
      "Compatibility readings",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "3",
    name: "Celestial Premium",
    price: 49.99,
    frequency: "monthly",
    features: [
      "All Stellar features",
      "Personalized yearly forecast",
      "Monthly live astrologer consultation",
      "Custom timing recommendations",
      "Advanced relationship insights",
      "Exclusive cosmic events access",
    ],
  },
];

// Icon components mapping for features
export const iconComponents = {
  MessageSquare,
  Zap,
  Shield,
  LineChart,
  Clock,
  Target,
  BookOpen,
  Users,
  Star,
  Moon,
  Sun,
};

export const countryCodes = [
  { code: "+1", label: "US" },
  { code: "+44", label: "GB" },
  { code: "+49", label: "DE" },
  { code: "+33", label: "FR" },
  { code: "+34", label: "ES" },
  { code: "+39", label: "IT" },
  { code: "+7", label: "RU" },
  { code: "+81", label: "JP" },
  { code: "+86", label: "CN" },
  { code: "+91", label: "IN" },
  { code: "+61", label: "AU" },
  { code: "+64", label: "NZ" },
  { code: "+55", label: "BR" },
  { code: "+52", label: "MX" },
  { code: "+27", label: "ZA" },
  { code: "+82", label: "KR" },
  { code: "+90", label: "TR" },
  { code: "+31", label: "NL" },
  { code: "+32", label: "BE" },
  { code: "+46", label: "SE" },
  { code: "+47", label: "NO" },
  { code: "+45", label: "DK" },
  { code: "+358", label: "FI" },
  { code: "+420", label: "CZ" },
  { code: "+421", label: "SK" },
  { code: "+48", label: "PL" },
  { code: "+43", label: "AT" },
  { code: "+36", label: "HU" },
  { code: "+40", label: "RO" },
  { code: "+30", label: "GR" },
  { code: "+351", label: "PT" },
  { code: "+353", label: "IE" },
  { code: "+41", label: "CH" },
  { code: "+380", label: "UA" },
  { code: "+420", label: "CZ" },
  { code: "+386", label: "SI" },
  { code: "+385", label: "HR" },
  { code: "+372", label: "EE" },
  { code: "+371", label: "LV" },
  { code: "+370", label: "LT" },
  { code: "+48", label: "PL" },
  { code: "+36", label: "HU" },
  { code: "+359", label: "BG" },
  { code: "+386", label: "SI" },
  { code: "+381", label: "RS" },
  { code: "+389", label: "MK" },
  { code: "+373", label: "MD" },
  { code: "+375", label: "BY" },
  { code: "+998", label: "UZ" },
  { code: "+996", label: "KG" },
  { code: "+992", label: "TJ" },
  { code: "+993", label: "TM" },
  { code: "+994", label: "AZ" },
  { code: "+995", label: "GE" },
  { code: "+972", label: "IL" },
  { code: "+20", label: "EG" },
  { code: "+212", label: "MA" },
  { code: "+213", label: "DZ" },
  { code: "+216", label: "TN" },
  { code: "+218", label: "LY" },
  { code: "+234", label: "NG" },
  { code: "+233", label: "GH" },
  { code: "+254", label: "KE" },
  { code: "+256", label: "UG" },
  { code: "+255", label: "TZ" },
  { code: "+263", label: "ZW" },
  { code: "+27", label: "ZA" },
  { code: "+62", label: "ID" },
  { code: "+63", label: "PH" },
  { code: "+60", label: "MY" },
  { code: "+65", label: "SG" },
  { code: "+66", label: "TH" },
  { code: "+84", label: "VN" },
  { code: "+880", label: "BD" },
  { code: "+92", label: "PK" },
  { code: "+98", label: "IR" },
  { code: "+964", label: "IQ" },
  { code: "+962", label: "JO" },
  { code: "+961", label: "LB" },
  { code: "+965", label: "KW" },
  { code: "+966", label: "SA" },
  { code: "+971", label: "AE" },
  { code: "+973", label: "BH" },
  { code: "+974", label: "QA" },
  { code: "+975", label: "BT" },
  { code: "+976", label: "MN" },
  { code: "+977", label: "NP" },
  { code: "+94", label: "LK" },
  { code: "+880", label: "BD" },
  { code: "+856", label: "LA" },
  { code: "+855", label: "KH" },
  { code: "+95", label: "MM" },
  { code: "+880", label: "BD" },
  { code: "+92", label: "PK" },
  { code: "+880", label: "BD" },
  { code: "+94", label: "LK" },
  { code: "+880", label: "BD" },
  { code: "+880", label: "BD" },
  // Add more as needed
];
