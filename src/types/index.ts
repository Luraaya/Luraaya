/**
 * Type definitions for the astrology messaging service
 * Contains all interfaces and enums used throughout the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  sex: Sex;
  dateOfBirth: Date;
  timeOfBirth: string; // Format: "HH:MM"
  placeOfBirth: string;
  zodiacSign: ZodiacSign;
  subscriptionType: SubscriptionType;
  communicationChannel: CommunicationChannel;
  createdAt: Date;
}

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum ZodiacSign {
  ARIES = 'aries',
  TAURUS = 'taurus',
  GEMINI = 'gemini',
  CANCER = 'cancer',
  LEO = 'leo',
  VIRGO = 'virgo',
  LIBRA = 'libra',
  SCORPIO = 'scorpio',
  SAGITTARIUS = 'sagittarius',
  CAPRICORN = 'capricorn',
  AQUARIUS = 'aquarius',
  PISCES = 'pisces'
}

export enum SubscriptionType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp'
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  messageType: MessageType;
  sentAt: Date;
  read: boolean;
}

export enum MessageType {
  DAILY_HOROSCOPE = 'daily_horoscope',
  WEEKLY_FORECAST = 'weekly_forecast',
  MONTHLY_READING = 'monthly_reading',
  PLANETARY_TRANSIT = 'planetary_transit',
  PERSONALIZED_INSIGHT = 'personalized_insight'
}

export interface Testimonial {
  id: string;
  name: string;
  zodiacSign: ZodiacSign;
  content: string;
  avatar: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  frequency: string;
  features: string[];
  popular?: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AstrologyData {
  sunSign: ZodiacSign;
  moonSign?: ZodiacSign;
  risingSign?: ZodiacSign;
  planetaryPositions?: PlanetaryPosition[];
}

export interface PlanetaryPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
}

export enum Planet {
  SUN = 'sun',
  MOON = 'moon',
  MERCURY = 'mercury',
  VENUS = 'venus',
  MARS = 'mars',
  JUPITER = 'jupiter',
  SATURN = 'saturn',
  URANUS = 'uranus',
  NEPTUNE = 'neptune',
  PLUTO = 'pluto'
}