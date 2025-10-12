/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddUnitInput = {
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isWarlord: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  pathAbilities?: InputMaybe<Array<Scalars['String']['input']>>;
  rank: Scalars['String']['input'];
  reinforced: Scalars['Boolean']['input'];
  renown: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  unitTypeId: Scalars['String']['input'];
  warscroll: Scalars['String']['input'];
  wounds: Scalars['Int']['input'];
};

/** An army/warband belonging to a player in a campaign */
export type Army = {
  __typename?: 'Army';
  background?: Maybe<Scalars['String']['output']>;
  battleFormation?: Maybe<Scalars['String']['output']>;
  campaign: Campaign;
  campaignId: Scalars['ID']['output'];
  completedQuests: Array<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currentQuest?: Maybe<Scalars['String']['output']>;
  faction: Faction;
  factionId: Scalars['ID']['output'];
  glory: Scalars['Int']['output'];
  heraldry?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  manifestationLore: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notableEvents?: Maybe<Scalars['String']['output']>;
  player: User;
  playerId: Scalars['ID']['output'];
  prayerLore: Array<Scalars['String']['output']>;
  questPoints: Scalars['Int']['output'];
  realmOfOrigin?: Maybe<RealmOfOrigin>;
  renown: Scalars['Int']['output'];
  spellLore: Array<Scalars['String']['output']>;
  units: Array<Unit>;
  updatedAt: Scalars['String']['output'];
  warlord?: Maybe<Unit>;
};

/** A battle record between armies */
export type Battle = {
  __typename?: 'Battle';
  armies: Array<Scalars['ID']['output']>;
  campaign: Campaign;
  campaignId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  gloryAwarded: Array<GloryAward>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  outcome: BattleOutcome;
  playedAt: Scalars['String']['output'];
};

/** Battle outcome types */
export enum BattleOutcome {
  Defeat = 'DEFEAT',
  Draw = 'DRAW',
  Victory = 'VICTORY'
}

/** Battle profile (points, unit size, base size) */
export type BattleProfile = {
  __typename?: 'BattleProfile';
  baseSize?: Maybe<Scalars['String']['output']>;
  isFactionTerrain?: Maybe<Scalars['Boolean']['output']>;
  isManifestation?: Maybe<Scalars['Boolean']['output']>;
  points: Scalars['Int']['output'];
  unitSize: Scalars['String']['output'];
};

export type BattleProfileInput = {
  baseSize?: InputMaybe<Scalars['String']['input']>;
  isFactionTerrain?: InputMaybe<Scalars['Boolean']['input']>;
  isManifestation?: InputMaybe<Scalars['Boolean']['input']>;
  points: Scalars['Int']['input'];
  unitSize: Scalars['String']['input'];
};

/** A Path to Glory campaign containing multiple armies */
export type Campaign = {
  __typename?: 'Campaign';
  armies: Array<Army>;
  battles: Array<Battle>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: User;
  ownerId: Scalars['ID']['output'];
};

export type CreateArmyInput = {
  background?: InputMaybe<Scalars['String']['input']>;
  battleFormation?: InputMaybe<Scalars['String']['input']>;
  campaignId: Scalars['ID']['input'];
  factionId: Scalars['ID']['input'];
  heraldry?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  manifestationLore?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  prayerLore?: InputMaybe<Array<Scalars['String']['input']>>;
  realmOfOrigin?: InputMaybe<RealmOfOrigin>;
  spellLore?: InputMaybe<Array<Scalars['String']['input']>>;
  warlordUnitId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCampaignInput = {
  name: Scalars['String']['input'];
};

export type CreateCustomWarscrollInput = {
  abilities: Array<WarscrollAbilityInput>;
  battleProfile?: InputMaybe<BattleProfileInput>;
  characteristics: UnitCharacteristicsInput;
  factionId: Scalars['String']['input'];
  keywords: UnitKeywordsInput;
  meleeWeapons?: InputMaybe<Array<WeaponInput>>;
  name: Scalars['String']['input'];
  rangedWeapons?: InputMaybe<Array<WeaponInput>>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
};

/** A custom user-created warscroll */
export type CustomWarscroll = {
  __typename?: 'CustomWarscroll';
  abilities: Array<WarscrollAbility>;
  battleProfile?: Maybe<BattleProfile>;
  characteristics: UnitCharacteristics;
  createdAt: Scalars['String']['output'];
  creator: User;
  creatorId: Scalars['ID']['output'];
  factionId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  keywords: UnitKeywords;
  meleeWeapons?: Maybe<Array<Weapon>>;
  name: Scalars['String']['output'];
  rangedWeapons?: Maybe<Array<Weapon>>;
  subtitle?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

/** A faction in Age of Sigmar */
export type Faction = {
  __typename?: 'Faction';
  description?: Maybe<Scalars['String']['output']>;
  grandAlliance: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  startingGlory: Scalars['Int']['output'];
  startingRenown: Scalars['Int']['output'];
};

/** Glory points awarded to an army from a battle */
export type GloryAward = {
  __typename?: 'GloryAward';
  amount: Scalars['Int']['output'];
  armyId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
};

export type GloryAwardInput = {
  amount: Scalars['Int']['input'];
  armyId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a unit to an army */
  addUnit: Unit;
  /** Add a veteran ability to a unit */
  addVeteranAbility: Unit;
  /** Create a new army in a campaign */
  createArmy: Army;
  /** Create a new campaign */
  createCampaign: Campaign;
  /** Create a custom warscroll */
  createCustomWarscroll: CustomWarscroll;
  /** Delete an army and all its units */
  deleteArmy: Scalars['Boolean']['output'];
  /** Delete a custom warscroll (creator only) */
  deleteCustomWarscroll: Scalars['Boolean']['output'];
  /** Record a battle */
  recordBattle: Battle;
  /** Remove a unit from an army */
  removeUnit: Scalars['Boolean']['output'];
  /** Update army details */
  updateArmy: Army;
  /** Update a custom warscroll (creator only) */
  updateCustomWarscroll: CustomWarscroll;
  /** Update a unit */
  updateUnit: Unit;
};


export type MutationAddUnitArgs = {
  armyId: Scalars['ID']['input'];
  input: AddUnitInput;
};


export type MutationAddVeteranAbilityArgs = {
  ability: Scalars['String']['input'];
  unitId: Scalars['ID']['input'];
};


export type MutationCreateArmyArgs = {
  input: CreateArmyInput;
};


export type MutationCreateCampaignArgs = {
  input: CreateCampaignInput;
};


export type MutationCreateCustomWarscrollArgs = {
  input: CreateCustomWarscrollInput;
};


export type MutationDeleteArmyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomWarscrollArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRecordBattleArgs = {
  input: RecordBattleInput;
};


export type MutationRemoveUnitArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateArmyArgs = {
  id: Scalars['ID']['input'];
  input: UpdateArmyInput;
};


export type MutationUpdateCustomWarscrollArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomWarscrollInput;
};


export type MutationUpdateUnitArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUnitInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get all armies (read-only access, no authentication required) */
  armies: Array<Army>;
  /** Get a specific army */
  army?: Maybe<Army>;
  /** Get a specific campaign */
  campaign?: Maybe<Campaign>;
  /** Get a specific custom warscroll */
  customWarscroll?: Maybe<CustomWarscroll>;
  /** Get all custom warscrolls (from all users) */
  customWarscrolls: Array<CustomWarscroll>;
  /** Get a specific faction */
  faction?: Maybe<Faction>;
  /** Get all available factions */
  factions: Array<Faction>;
  /** Get current authenticated user */
  me?: Maybe<User>;
  /** Get all armies for the current user across all campaigns */
  myArmies: Array<Army>;
  /** Get all campaigns for the current user */
  myCampaigns: Array<Campaign>;
  /** Get custom warscrolls created by the current user */
  myCustomWarscrolls: Array<CustomWarscroll>;
};


export type QueryArmyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomWarscrollArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFactionArgs = {
  id: Scalars['ID']['input'];
};

/** The eight Mortal Realms of Age of Sigmar */
export enum RealmOfOrigin {
  Aqshy = 'AQSHY',
  Azyr = 'AZYR',
  Chamon = 'CHAMON',
  Ghur = 'GHUR',
  Ghyran = 'GHYRAN',
  Hysh = 'HYSH',
  Shyish = 'SHYISH',
  Ulgu = 'ULGU'
}

export type RecordBattleInput = {
  armies: Array<Scalars['ID']['input']>;
  campaignId: Scalars['ID']['input'];
  gloryAwarded: Array<GloryAwardInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  outcome: BattleOutcome;
  playedAt: Scalars['String']['input'];
};

/** A unit within an army (includes both Warlord and regular units) */
export type Unit = {
  __typename?: 'Unit';
  army: Army;
  armyId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  enhancements: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  injuries: Array<Scalars['String']['output']>;
  isWarlord: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pathAbilities: Array<Scalars['String']['output']>;
  rank: Scalars['String']['output'];
  reinforced: Scalars['Boolean']['output'];
  renown: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  unitTypeId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  veteranAbilities: Array<Scalars['String']['output']>;
  warscroll: Scalars['String']['output'];
  wounds: Scalars['Int']['output'];
};

/** Unit characteristics (move, health, save, control) */
export type UnitCharacteristics = {
  __typename?: 'UnitCharacteristics';
  banishment?: Maybe<Scalars['String']['output']>;
  control?: Maybe<Scalars['Int']['output']>;
  health: Scalars['Int']['output'];
  move?: Maybe<Scalars['String']['output']>;
  save?: Maybe<Scalars['String']['output']>;
};

export type UnitCharacteristicsInput = {
  banishment?: InputMaybe<Scalars['String']['input']>;
  control?: InputMaybe<Scalars['Int']['input']>;
  health: Scalars['Int']['input'];
  move?: InputMaybe<Scalars['String']['input']>;
  save?: InputMaybe<Scalars['String']['input']>;
};

/** Unit keywords (unit and faction) */
export type UnitKeywords = {
  __typename?: 'UnitKeywords';
  faction: Array<Scalars['String']['output']>;
  unit: Array<Scalars['String']['output']>;
};

export type UnitKeywordsInput = {
  faction: Array<Scalars['String']['input']>;
  unit: Array<Scalars['String']['input']>;
};

export type UpdateArmyInput = {
  background?: InputMaybe<Scalars['String']['input']>;
  battleFormation?: InputMaybe<Scalars['String']['input']>;
  completedQuests?: InputMaybe<Array<Scalars['String']['input']>>;
  currentQuest?: InputMaybe<Scalars['String']['input']>;
  glory?: InputMaybe<Scalars['Int']['input']>;
  heraldry?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  manifestationLore?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  notableEvents?: InputMaybe<Scalars['String']['input']>;
  prayerLore?: InputMaybe<Array<Scalars['String']['input']>>;
  questPoints?: InputMaybe<Scalars['Int']['input']>;
  realmOfOrigin?: InputMaybe<RealmOfOrigin>;
  renown?: InputMaybe<Scalars['Int']['input']>;
  spellLore?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateCustomWarscrollInput = {
  abilities?: InputMaybe<Array<WarscrollAbilityInput>>;
  battleProfile?: InputMaybe<BattleProfileInput>;
  characteristics?: InputMaybe<UnitCharacteristicsInput>;
  factionId?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<UnitKeywordsInput>;
  meleeWeapons?: InputMaybe<Array<WeaponInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  rangedWeapons?: InputMaybe<Array<WeaponInput>>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUnitInput = {
  enhancements?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  injuries?: InputMaybe<Array<Scalars['String']['input']>>;
  isWarlord?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pathAbilities?: InputMaybe<Array<Scalars['String']['input']>>;
  rank?: InputMaybe<Scalars['String']['input']>;
  reinforced?: InputMaybe<Scalars['Boolean']['input']>;
  renown?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  veteranAbilities?: InputMaybe<Array<Scalars['String']['input']>>;
  warscroll?: InputMaybe<Scalars['String']['input']>;
  wounds?: InputMaybe<Scalars['Int']['input']>;
};

/** A user of the application (authenticated via Google OAuth) */
export type User = {
  __typename?: 'User';
  armies: Array<Army>;
  campaigns: Array<Campaign>;
  createdAt: Scalars['String']['output'];
  customWarscrolls: Array<CustomWarscroll>;
  email: Scalars['String']['output'];
  googleId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
};

/** Ability on a warscroll */
export type WarscrollAbility = {
  __typename?: 'WarscrollAbility';
  declare?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effect: Scalars['String']['output'];
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  timing: Scalars['String']['output'];
};

export type WarscrollAbilityInput = {
  declare?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effect: Scalars['String']['input'];
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  timing: Scalars['String']['input'];
};

/** Weapon profile for a warscroll */
export type Weapon = {
  __typename?: 'Weapon';
  ability?: Maybe<Scalars['String']['output']>;
  attacks: Scalars['String']['output'];
  damage: Scalars['String']['output'];
  hit: Scalars['String']['output'];
  name: Scalars['String']['output'];
  range?: Maybe<Scalars['String']['output']>;
  rend: Scalars['String']['output'];
  wound: Scalars['String']['output'];
};

export type WeaponInput = {
  ability?: InputMaybe<Scalars['String']['input']>;
  attacks: Scalars['String']['input'];
  damage: Scalars['String']['input'];
  hit: Scalars['String']['input'];
  name: Scalars['String']['input'];
  range?: InputMaybe<Scalars['String']['input']>;
  rend: Scalars['String']['input'];
  wound: Scalars['String']['input'];
};

export type GetMyArmiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyArmiesQuery = { __typename?: 'Query', myArmies: Array<{ __typename?: 'Army', id: string, name: string, factionId: string, imageUrl?: string | null, glory: number, renown: number, createdAt: string, updatedAt: string, player: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null }, units: Array<{ __typename?: 'Unit', id: string, unitTypeId: string, name: string, rank: string, renown: number, reinforced: boolean, isWarlord: boolean }> }> };

export type GetAllArmiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllArmiesQuery = { __typename?: 'Query', armies: Array<{ __typename?: 'Army', id: string, name: string, factionId: string, imageUrl?: string | null, glory: number, renown: number, createdAt: string, updatedAt: string, player: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null }, units: Array<{ __typename?: 'Unit', id: string, unitTypeId: string, name: string, rank: string, renown: number, reinforced: boolean, isWarlord: boolean }> }> };

export type GetArmyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetArmyQuery = { __typename?: 'Query', army?: { __typename?: 'Army', id: string, campaignId: string, name: string, factionId: string, imageUrl?: string | null, heraldry?: string | null, realmOfOrigin?: RealmOfOrigin | null, battleFormation?: string | null, glory: number, renown: number, background?: string | null, notableEvents?: string | null, currentQuest?: string | null, questPoints: number, completedQuests: Array<string>, spellLore: Array<string>, prayerLore: Array<string>, manifestationLore: Array<string>, createdAt: string, updatedAt: string, player: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null }, units: Array<{ __typename?: 'Unit', id: string, unitTypeId: string, name: string, warscroll: string, imageUrl?: string | null, size: number, wounds: number, rank: string, renown: number, reinforced: boolean, isWarlord: boolean, veteranAbilities: Array<string>, injuries: Array<string>, enhancements: Array<string>, pathAbilities: Array<string>, createdAt: string, updatedAt: string }> } | null };

export type GetFactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFactionsQuery = { __typename?: 'Query', factions: Array<{ __typename?: 'Faction', id: string, name: string, grandAlliance: string, startingGlory: number, startingRenown: number, description?: string | null }> };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, name: string, picture?: string | null, googleId: string, createdAt: string } | null };

export type GetMyCampaignsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCampaignsQuery = { __typename?: 'Query', myCampaigns: Array<{ __typename?: 'Campaign', id: string, name: string, ownerId: string, createdAt: string }> };

export type CreateCampaignMutationVariables = Exact<{
  input: CreateCampaignInput;
}>;


export type CreateCampaignMutation = { __typename?: 'Mutation', createCampaign: { __typename?: 'Campaign', id: string, name: string, ownerId: string, createdAt: string } };

export type CreateArmyMutationVariables = Exact<{
  input: CreateArmyInput;
}>;


export type CreateArmyMutation = { __typename?: 'Mutation', createArmy: { __typename?: 'Army', id: string, campaignId: string, name: string, factionId: string, glory: number, renown: number, createdAt: string, updatedAt: string, player: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null } } };

export type UpdateArmyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateArmyInput;
}>;


export type UpdateArmyMutation = { __typename?: 'Mutation', updateArmy: { __typename?: 'Army', id: string, name: string, imageUrl?: string | null, glory: number, renown: number, updatedAt: string } };

export type AddUnitMutationVariables = Exact<{
  armyId: Scalars['ID']['input'];
  input: AddUnitInput;
}>;


export type AddUnitMutation = { __typename?: 'Mutation', addUnit: { __typename?: 'Unit', id: string, armyId: string, unitTypeId: string, name: string, imageUrl?: string | null, size: number, wounds: number, rank: string, renown: number, reinforced: boolean, veteranAbilities: Array<string>, injuries: Array<string>, enhancements: Array<string>, createdAt: string, updatedAt: string } };

export type UpdateUnitMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUnitInput;
}>;


export type UpdateUnitMutation = { __typename?: 'Mutation', updateUnit: { __typename?: 'Unit', id: string, name: string, imageUrl?: string | null, size: number, wounds: number, rank: string, renown: number, reinforced: boolean, veteranAbilities: Array<string>, injuries: Array<string>, enhancements: Array<string>, updatedAt: string } };

export type DeleteArmyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteArmyMutation = { __typename?: 'Mutation', deleteArmy: boolean };

export type RemoveUnitMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveUnitMutation = { __typename?: 'Mutation', removeUnit: boolean };

export type AddVeteranAbilityMutationVariables = Exact<{
  unitId: Scalars['ID']['input'];
  ability: Scalars['String']['input'];
}>;


export type AddVeteranAbilityMutation = { __typename?: 'Mutation', addVeteranAbility: { __typename?: 'Unit', id: string, rank: string, renown: number, reinforced: boolean, veteranAbilities: Array<string>, updatedAt: string } };

export type GetCustomWarscrollsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomWarscrollsQuery = { __typename?: 'Query', customWarscrolls: Array<{ __typename?: 'CustomWarscroll', id: string, name: string, subtitle?: string | null, factionId: string, creatorId: string, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, picture?: string | null }, characteristics: { __typename?: 'UnitCharacteristics', move?: string | null, health: number, save?: string | null, control?: number | null, banishment?: string | null }, rangedWeapons?: Array<{ __typename?: 'Weapon', name: string, range?: string | null, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, meleeWeapons?: Array<{ __typename?: 'Weapon', name: string, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, abilities: Array<{ __typename?: 'WarscrollAbility', name: string, timing: string, description?: string | null, declare?: string | null, effect: string, keywords?: Array<string> | null }>, keywords: { __typename?: 'UnitKeywords', unit: Array<string>, faction: Array<string> }, battleProfile?: { __typename?: 'BattleProfile', unitSize: string, points: number, baseSize?: string | null, isManifestation?: boolean | null, isFactionTerrain?: boolean | null } | null }> };

export type GetMyCustomWarscrollsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCustomWarscrollsQuery = { __typename?: 'Query', myCustomWarscrolls: Array<{ __typename?: 'CustomWarscroll', id: string, name: string, subtitle?: string | null, factionId: string, creatorId: string, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, picture?: string | null }, characteristics: { __typename?: 'UnitCharacteristics', move?: string | null, health: number, save?: string | null, control?: number | null, banishment?: string | null }, rangedWeapons?: Array<{ __typename?: 'Weapon', name: string, range?: string | null, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, meleeWeapons?: Array<{ __typename?: 'Weapon', name: string, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, abilities: Array<{ __typename?: 'WarscrollAbility', name: string, timing: string, description?: string | null, declare?: string | null, effect: string, keywords?: Array<string> | null }>, keywords: { __typename?: 'UnitKeywords', unit: Array<string>, faction: Array<string> }, battleProfile?: { __typename?: 'BattleProfile', unitSize: string, points: number, baseSize?: string | null, isManifestation?: boolean | null, isFactionTerrain?: boolean | null } | null }> };

export type GetCustomWarscrollQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCustomWarscrollQuery = { __typename?: 'Query', customWarscroll?: { __typename?: 'CustomWarscroll', id: string, name: string, subtitle?: string | null, factionId: string, creatorId: string, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, picture?: string | null }, characteristics: { __typename?: 'UnitCharacteristics', move?: string | null, health: number, save?: string | null, control?: number | null, banishment?: string | null }, rangedWeapons?: Array<{ __typename?: 'Weapon', name: string, range?: string | null, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, meleeWeapons?: Array<{ __typename?: 'Weapon', name: string, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, abilities: Array<{ __typename?: 'WarscrollAbility', name: string, timing: string, description?: string | null, declare?: string | null, effect: string, keywords?: Array<string> | null }>, keywords: { __typename?: 'UnitKeywords', unit: Array<string>, faction: Array<string> }, battleProfile?: { __typename?: 'BattleProfile', unitSize: string, points: number, baseSize?: string | null, isManifestation?: boolean | null, isFactionTerrain?: boolean | null } | null } | null };

export type CreateCustomWarscrollMutationVariables = Exact<{
  input: CreateCustomWarscrollInput;
}>;


export type CreateCustomWarscrollMutation = { __typename?: 'Mutation', createCustomWarscroll: { __typename?: 'CustomWarscroll', id: string, name: string, subtitle?: string | null, factionId: string, creatorId: string, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, picture?: string | null }, characteristics: { __typename?: 'UnitCharacteristics', move?: string | null, health: number, save?: string | null, control?: number | null, banishment?: string | null }, rangedWeapons?: Array<{ __typename?: 'Weapon', name: string, range?: string | null, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, meleeWeapons?: Array<{ __typename?: 'Weapon', name: string, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, abilities: Array<{ __typename?: 'WarscrollAbility', name: string, timing: string, description?: string | null, declare?: string | null, effect: string, keywords?: Array<string> | null }>, keywords: { __typename?: 'UnitKeywords', unit: Array<string>, faction: Array<string> }, battleProfile?: { __typename?: 'BattleProfile', unitSize: string, points: number, baseSize?: string | null, isManifestation?: boolean | null, isFactionTerrain?: boolean | null } | null } };

export type UpdateCustomWarscrollMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCustomWarscrollInput;
}>;


export type UpdateCustomWarscrollMutation = { __typename?: 'Mutation', updateCustomWarscroll: { __typename?: 'CustomWarscroll', id: string, name: string, subtitle?: string | null, factionId: string, updatedAt: string, characteristics: { __typename?: 'UnitCharacteristics', move?: string | null, health: number, save?: string | null, control?: number | null, banishment?: string | null }, rangedWeapons?: Array<{ __typename?: 'Weapon', name: string, range?: string | null, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, meleeWeapons?: Array<{ __typename?: 'Weapon', name: string, attacks: string, hit: string, wound: string, rend: string, damage: string, ability?: string | null }> | null, abilities: Array<{ __typename?: 'WarscrollAbility', name: string, timing: string, description?: string | null, declare?: string | null, effect: string, keywords?: Array<string> | null }>, keywords: { __typename?: 'UnitKeywords', unit: Array<string>, faction: Array<string> }, battleProfile?: { __typename?: 'BattleProfile', unitSize: string, points: number, baseSize?: string | null, isManifestation?: boolean | null, isFactionTerrain?: boolean | null } | null } };

export type DeleteCustomWarscrollMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomWarscrollMutation = { __typename?: 'Mutation', deleteCustomWarscroll: boolean };


export const GetMyArmiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyArmies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myArmies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"isWarlord"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyArmiesQuery, GetMyArmiesQueryVariables>;
export const GetAllArmiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllArmies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"armies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"isWarlord"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllArmiesQuery, GetAllArmiesQueryVariables>;
export const GetArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"army"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"}},{"kind":"Field","name":{"kind":"Name","value":"realmOfOrigin"}},{"kind":"Field","name":{"kind":"Name","value":"battleFormation"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"notableEvents"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuest"}},{"kind":"Field","name":{"kind":"Name","value":"questPoints"}},{"kind":"Field","name":{"kind":"Name","value":"completedQuests"}},{"kind":"Field","name":{"kind":"Name","value":"spellLore"}},{"kind":"Field","name":{"kind":"Name","value":"prayerLore"}},{"kind":"Field","name":{"kind":"Name","value":"manifestationLore"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"warscroll"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"wounds"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"isWarlord"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"injuries"}},{"kind":"Field","name":{"kind":"Name","value":"enhancements"}},{"kind":"Field","name":{"kind":"Name","value":"pathAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetArmyQuery, GetArmyQueryVariables>;
export const GetFactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"grandAlliance"}},{"kind":"Field","name":{"kind":"Name","value":"startingGlory"}},{"kind":"Field","name":{"kind":"Name","value":"startingRenown"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetFactionsQuery, GetFactionsQueryVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"googleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetMyCampaignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>;
export const CreateCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCampaignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateCampaignMutation, CreateCampaignMutationVariables>;
export const CreateArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArmyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArmy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]}}]}}]} as unknown as DocumentNode<CreateArmyMutation, CreateArmyMutationVariables>;
export const UpdateArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateArmyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateArmy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateArmyMutation, UpdateArmyMutationVariables>;
export const AddUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"armyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUnitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"armyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"armyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"armyId"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"wounds"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"injuries"}},{"kind":"Field","name":{"kind":"Name","value":"enhancements"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AddUnitMutation, AddUnitMutationVariables>;
export const UpdateUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUnitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"wounds"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"injuries"}},{"kind":"Field","name":{"kind":"Name","value":"enhancements"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateUnitMutation, UpdateUnitMutationVariables>;
export const DeleteArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteArmy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteArmyMutation, DeleteArmyMutationVariables>;
export const RemoveUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveUnitMutation, RemoveUnitMutationVariables>;
export const AddVeteranAbilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddVeteranAbility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ability"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addVeteranAbility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"unitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unitId"}}},{"kind":"Argument","name":{"kind":"Name","value":"ability"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ability"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AddVeteranAbilityMutation, AddVeteranAbilityMutationVariables>;
export const GetCustomWarscrollsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomWarscrolls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customWarscrolls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"characteristics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"move"}},{"kind":"Field","name":{"kind":"Name","value":"health"}},{"kind":"Field","name":{"kind":"Name","value":"save"}},{"kind":"Field","name":{"kind":"Name","value":"control"}},{"kind":"Field","name":{"kind":"Name","value":"banishment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rangedWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"range"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meleeWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"declare"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keywords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"faction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"baseSize"}},{"kind":"Field","name":{"kind":"Name","value":"isManifestation"}},{"kind":"Field","name":{"kind":"Name","value":"isFactionTerrain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetCustomWarscrollsQuery, GetCustomWarscrollsQueryVariables>;
export const GetMyCustomWarscrollsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCustomWarscrolls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCustomWarscrolls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"characteristics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"move"}},{"kind":"Field","name":{"kind":"Name","value":"health"}},{"kind":"Field","name":{"kind":"Name","value":"save"}},{"kind":"Field","name":{"kind":"Name","value":"control"}},{"kind":"Field","name":{"kind":"Name","value":"banishment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rangedWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"range"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meleeWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"declare"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keywords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"faction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"baseSize"}},{"kind":"Field","name":{"kind":"Name","value":"isManifestation"}},{"kind":"Field","name":{"kind":"Name","value":"isFactionTerrain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetMyCustomWarscrollsQuery, GetMyCustomWarscrollsQueryVariables>;
export const GetCustomWarscrollDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomWarscroll"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customWarscroll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"characteristics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"move"}},{"kind":"Field","name":{"kind":"Name","value":"health"}},{"kind":"Field","name":{"kind":"Name","value":"save"}},{"kind":"Field","name":{"kind":"Name","value":"control"}},{"kind":"Field","name":{"kind":"Name","value":"banishment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rangedWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"range"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meleeWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"declare"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keywords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"faction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"baseSize"}},{"kind":"Field","name":{"kind":"Name","value":"isManifestation"}},{"kind":"Field","name":{"kind":"Name","value":"isFactionTerrain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetCustomWarscrollQuery, GetCustomWarscrollQueryVariables>;
export const CreateCustomWarscrollDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomWarscroll"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomWarscrollInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomWarscroll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"characteristics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"move"}},{"kind":"Field","name":{"kind":"Name","value":"health"}},{"kind":"Field","name":{"kind":"Name","value":"save"}},{"kind":"Field","name":{"kind":"Name","value":"control"}},{"kind":"Field","name":{"kind":"Name","value":"banishment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rangedWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"range"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meleeWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"declare"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keywords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"faction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"baseSize"}},{"kind":"Field","name":{"kind":"Name","value":"isManifestation"}},{"kind":"Field","name":{"kind":"Name","value":"isFactionTerrain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateCustomWarscrollMutation, CreateCustomWarscrollMutationVariables>;
export const UpdateCustomWarscrollDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomWarscroll"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomWarscrollInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomWarscroll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"characteristics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"move"}},{"kind":"Field","name":{"kind":"Name","value":"health"}},{"kind":"Field","name":{"kind":"Name","value":"save"}},{"kind":"Field","name":{"kind":"Name","value":"control"}},{"kind":"Field","name":{"kind":"Name","value":"banishment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rangedWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"range"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meleeWeapons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attacks"}},{"kind":"Field","name":{"kind":"Name","value":"hit"}},{"kind":"Field","name":{"kind":"Name","value":"wound"}},{"kind":"Field","name":{"kind":"Name","value":"rend"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"ability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"declare"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keywords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"faction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"baseSize"}},{"kind":"Field","name":{"kind":"Name","value":"isManifestation"}},{"kind":"Field","name":{"kind":"Name","value":"isFactionTerrain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomWarscrollMutation, UpdateCustomWarscrollMutationVariables>;
export const DeleteCustomWarscrollDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomWarscroll"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomWarscroll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCustomWarscrollMutation, DeleteCustomWarscrollMutationVariables>;