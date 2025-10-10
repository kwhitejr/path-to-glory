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
