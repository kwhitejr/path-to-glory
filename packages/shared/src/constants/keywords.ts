/**
 * Common unit keywords found across Age of Sigmar warscrolls
 * Used for warscroll creation forms to provide consistent keyword selection
 */

// Grand Alliance display names (mixed case for UI)
export const GRAND_ALLIANCE_DISPLAY_NAMES = {
  ORDER: 'Order',
  CHAOS: 'Chaos',
  DEATH: 'Death',
  DESTRUCTION: 'Destruction',
} as const;

/**
 * Common unit keywords that appear across multiple factions
 * This is not exhaustive - users can still add custom keywords
 */
export const COMMON_UNIT_KEYWORDS = [
  // Unit types
  'Hero',
  'Infantry',
  'Cavalry',
  'Monster',
  'Beast',
  'War Machine',

  // Special types
  'Manifestation',
  'Endless Spell',
  'Terrain',
  'Unique',

  // Abilities/Traits
  'Wizard',
  'Priest',
  'Totem',
  'Champion',
  'Musician',
  'Standard Bearer',
  'Fly',
  'Ward',

  // Specific traits (examples - can be extended)
  'Ward (4+)',
  'Ward (5+)',
  'Ward (6+)',
] as const;

export type CommonUnitKeyword = typeof COMMON_UNIT_KEYWORDS[number];
