/**
 * Utility functions for astrology calculations and data processing
 * Contains functions to determine zodiac signs, generate horoscopes, etc.
 */

import { ZodiacSign } from '../types';

/**
 * Determines zodiac sign based on birth date
 * @param date - Date of birth
 * @returns ZodiacSign enum value
 */
export function getZodiacSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return ZodiacSign.ARIES;
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return ZodiacSign.TAURUS;
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return ZodiacSign.GEMINI;
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return ZodiacSign.CANCER;
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return ZodiacSign.LEO;
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return ZodiacSign.VIRGO;
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return ZodiacSign.LIBRA;
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return ZodiacSign.SCORPIO;
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return ZodiacSign.SAGITTARIUS;
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return ZodiacSign.CAPRICORN;
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return ZodiacSign.AQUARIUS;
  } else {
    return ZodiacSign.PISCES;
  }
}

/**
 * Gets the display name for a zodiac sign
 * @param sign - ZodiacSign enum value
 * @returns Formatted display name
 */
export function getZodiacDisplayName(sign: ZodiacSign): string {
  const names: Record<ZodiacSign, string> = {
    [ZodiacSign.ARIES]: 'Aries ♈',
    [ZodiacSign.TAURUS]: 'Taurus ♉',
    [ZodiacSign.GEMINI]: 'Gemini ♊',
    [ZodiacSign.CANCER]: 'Cancer ♋',
    [ZodiacSign.LEO]: 'Leo ♌',
    [ZodiacSign.VIRGO]: 'Virgo ♍',
    [ZodiacSign.LIBRA]: 'Libra ♎',
    [ZodiacSign.SCORPIO]: 'Scorpio ♏',
    [ZodiacSign.SAGITTARIUS]: 'Sagittarius ♐',
    [ZodiacSign.CAPRICORN]: 'Capricorn ♑',
    [ZodiacSign.AQUARIUS]: 'Aquarius ♒',
    [ZodiacSign.PISCES]: 'Pisces ♓'
  };
  
  return names[sign];
}

/**
 * Gets zodiac sign traits and characteristics
 * @param sign - ZodiacSign enum value
 * @returns Object containing traits, element, and ruling planet
 */
export function getZodiacTraits(sign: ZodiacSign) {
  const traits: Record<ZodiacSign, { element: string; rulingPlanet: string; traits: string[] }> = {
    [ZodiacSign.ARIES]: {
      element: 'Fire',
      rulingPlanet: 'Mars',
      traits: ['Bold', 'Energetic', 'Leadership', 'Impulsive']
    },
    [ZodiacSign.TAURUS]: {
      element: 'Earth',
      rulingPlanet: 'Venus',
      traits: ['Reliable', 'Patient', 'Practical', 'Stubborn']
    },
    [ZodiacSign.GEMINI]: {
      element: 'Air',
      rulingPlanet: 'Mercury',
      traits: ['Curious', 'Adaptable', 'Communicative', 'Restless']
    },
    [ZodiacSign.CANCER]: {
      element: 'Water',
      rulingPlanet: 'Moon',
      traits: ['Nurturing', 'Intuitive', 'Emotional', 'Protective']
    },
    [ZodiacSign.LEO]: {
      element: 'Fire',
      rulingPlanet: 'Sun',
      traits: ['Confident', 'Creative', 'Generous', 'Dramatic']
    },
    [ZodiacSign.VIRGO]: {
      element: 'Earth',
      rulingPlanet: 'Mercury',
      traits: ['Analytical', 'Perfectionist', 'Helpful', 'Critical']
    },
    [ZodiacSign.LIBRA]: {
      element: 'Air',
      rulingPlanet: 'Venus',
      traits: ['Diplomatic', 'Balanced', 'Social', 'Indecisive']
    },
    [ZodiacSign.SCORPIO]: {
      element: 'Water',
      rulingPlanet: 'Pluto',
      traits: ['Intense', 'Mysterious', 'Passionate', 'Secretive']
    },
    [ZodiacSign.SAGITTARIUS]: {
      element: 'Fire',
      rulingPlanet: 'Jupiter',
      traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Blunt']
    },
    [ZodiacSign.CAPRICORN]: {
      element: 'Earth',
      rulingPlanet: 'Saturn',
      traits: ['Ambitious', 'Disciplined', 'Practical', 'Pessimistic']
    },
    [ZodiacSign.AQUARIUS]: {
      element: 'Air',
      rulingPlanet: 'Uranus',
      traits: ['Independent', 'Innovative', 'Humanitarian', 'Detached']
    },
    [ZodiacSign.PISCES]: {
      element: 'Water',
      rulingPlanet: 'Neptune',
      traits: ['Compassionate', 'Artistic', 'Intuitive', 'Escapist']
    }
  };
  
  return traits[sign];
}