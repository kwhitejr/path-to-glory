/**
 * Shared enums used across the application
 */

/**
 * Grand Alliance types in Age of Sigmar
 */
export enum GrandAlliance {
  ORDER = 'ORDER',
  CHAOS = 'CHAOS',
  DEATH = 'DEATH',
  DESTRUCTION = 'DESTRUCTION',
}

/**
 * Battle outcome types
 */
export enum BattleOutcome {
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT',
  DRAW = 'DRAW',
}

/**
 * Unit rank in an army roster
 */
export enum UnitRank {
  WARLORD = 'Warlord',
  VETERAN = 'Veteran',
  TROOPER = 'Trooper',
}

/**
 * The eight Mortal Realms of Age of Sigmar
 */
export enum RealmOfOrigin {
  AQSHY = 'AQSHY', // Realm of Fire
  CHAMON = 'CHAMON', // Realm of Metal
  GHUR = 'GHUR', // Realm of Beasts
  GHYRAN = 'GHYRAN', // Realm of Life
  HYSH = 'HYSH', // Realm of Light
  SHYISH = 'SHYISH', // Realm of Death
  ULGU = 'ULGU', // Realm of Shadow
  AZYR = 'AZYR', // Realm of Heavens
}

/**
 * Human-readable labels for Realms of Origin
 */
export const RealmOfOriginLabels: Record<RealmOfOrigin, string> = {
  [RealmOfOrigin.AQSHY]: 'Aqshy (Fire)',
  [RealmOfOrigin.CHAMON]: 'Chamon (Metal)',
  [RealmOfOrigin.GHUR]: 'Ghur (Beasts)',
  [RealmOfOrigin.GHYRAN]: 'Ghyran (Life)',
  [RealmOfOrigin.HYSH]: 'Hysh (Light)',
  [RealmOfOrigin.SHYISH]: 'Shyish (Death)',
  [RealmOfOrigin.ULGU]: 'Ulgu (Shadow)',
  [RealmOfOrigin.AZYR]: 'Azyr (Heavens)',
}

/**
 * View mode for army list filtering
 */
export enum ViewMode {
  MINE = 'mine',
  ALL = 'all',
}

/**
 * Special filter value representing "all" options
 */
export enum FilterValue {
  ALL = 'all',
}

/**
 * DynamoDB table key prefixes for single-table design
 */
export enum DynamoDBKeyPrefix {
  USER = 'USER#',
  CAMPAIGN = 'CAMPAIGN#',
  ARMY = 'ARMY#',
  UNIT = 'UNIT#',
  BATTLE = 'BATTLE#',
  WARSCROLL = 'WARSCROLL#',
  METADATA = 'METADATA',
}

/**
 * Node environment types
 */
export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
