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
  /** Delete an army and all its units */
  deleteArmy: Scalars['Boolean']['output'];
  /** Record a battle */
  recordBattle: Battle;
  /** Remove a unit from an army */
  removeUnit: Scalars['Boolean']['output'];
  /** Update army details */
  updateArmy: Army;
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


export type MutationDeleteArmyArgs = {
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


export type MutationUpdateUnitArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUnitInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get a specific army */
  army?: Maybe<Army>;
  /** Get a specific campaign */
  campaign?: Maybe<Campaign>;
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
};


export type QueryArmyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCampaignArgs = {
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

export type UpdateArmyInput = {
  background?: InputMaybe<Scalars['String']['input']>;
  battleFormation?: InputMaybe<Scalars['String']['input']>;
  completedQuests?: InputMaybe<Array<Scalars['String']['input']>>;
  currentQuest?: InputMaybe<Scalars['String']['input']>;
  glory?: InputMaybe<Scalars['Int']['input']>;
  heraldry?: InputMaybe<Scalars['String']['input']>;
  manifestationLore?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  notableEvents?: InputMaybe<Scalars['String']['input']>;
  prayerLore?: InputMaybe<Array<Scalars['String']['input']>>;
  questPoints?: InputMaybe<Scalars['Int']['input']>;
  realmOfOrigin?: InputMaybe<RealmOfOrigin>;
  renown?: InputMaybe<Scalars['Int']['input']>;
  spellLore?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateUnitInput = {
  enhancements?: InputMaybe<Array<Scalars['String']['input']>>;
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
  email: Scalars['String']['output'];
  googleId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
};

export type GetMyArmiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyArmiesQuery = { __typename?: 'Query', myArmies: Array<{ __typename?: 'Army', id: string, name: string, factionId: string, glory: number, renown: number, createdAt: string, updatedAt: string, player: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null }, units: Array<{ __typename?: 'Unit', id: string, unitTypeId: string, name: string, rank: string, renown: number, reinforced: boolean, isWarlord: boolean }> }> };

export type GetArmyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetArmyQuery = { __typename?: 'Query', army?: { __typename?: 'Army', id: string, campaignId: string, name: string, factionId: string, heraldry?: string | null, realmOfOrigin?: RealmOfOrigin | null, battleFormation?: string | null, glory: number, renown: number, background?: string | null, notableEvents?: string | null, currentQuest?: string | null, questPoints: number, completedQuests: Array<string>, spellLore: Array<string>, prayerLore: Array<string>, manifestationLore: Array<string>, createdAt: string, updatedAt: string, player: { __typename?: 'User', id: string, name: string, email: string, picture?: string | null }, units: Array<{ __typename?: 'Unit', id: string, unitTypeId: string, name: string, warscroll: string, size: number, wounds: number, rank: string, renown: number, reinforced: boolean, isWarlord: boolean, veteranAbilities: Array<string>, injuries: Array<string>, enhancements: Array<string>, pathAbilities: Array<string>, createdAt: string, updatedAt: string }> } | null };

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


export type UpdateArmyMutation = { __typename?: 'Mutation', updateArmy: { __typename?: 'Army', id: string, name: string, glory: number, renown: number, updatedAt: string } };

export type AddUnitMutationVariables = Exact<{
  armyId: Scalars['ID']['input'];
  input: AddUnitInput;
}>;


export type AddUnitMutation = { __typename?: 'Mutation', addUnit: { __typename?: 'Unit', id: string, armyId: string, unitTypeId: string, name: string, size: number, wounds: number, rank: string, renown: number, reinforced: boolean, veteranAbilities: Array<string>, injuries: Array<string>, enhancements: Array<string>, createdAt: string, updatedAt: string } };

export type UpdateUnitMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUnitInput;
}>;


export type UpdateUnitMutation = { __typename?: 'Mutation', updateUnit: { __typename?: 'Unit', id: string, name: string, size: number, wounds: number, rank: string, renown: number, reinforced: boolean, veteranAbilities: Array<string>, injuries: Array<string>, enhancements: Array<string>, updatedAt: string } };

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


export const GetMyArmiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyArmies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myArmies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"isWarlord"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyArmiesQuery, GetMyArmiesQueryVariables>;
export const GetArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"army"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"}},{"kind":"Field","name":{"kind":"Name","value":"realmOfOrigin"}},{"kind":"Field","name":{"kind":"Name","value":"battleFormation"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"notableEvents"}},{"kind":"Field","name":{"kind":"Name","value":"currentQuest"}},{"kind":"Field","name":{"kind":"Name","value":"questPoints"}},{"kind":"Field","name":{"kind":"Name","value":"completedQuests"}},{"kind":"Field","name":{"kind":"Name","value":"spellLore"}},{"kind":"Field","name":{"kind":"Name","value":"prayerLore"}},{"kind":"Field","name":{"kind":"Name","value":"manifestationLore"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"warscroll"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"wounds"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"isWarlord"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"injuries"}},{"kind":"Field","name":{"kind":"Name","value":"enhancements"}},{"kind":"Field","name":{"kind":"Name","value":"pathAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetArmyQuery, GetArmyQueryVariables>;
export const GetFactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"grandAlliance"}},{"kind":"Field","name":{"kind":"Name","value":"startingGlory"}},{"kind":"Field","name":{"kind":"Name","value":"startingRenown"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetFactionsQuery, GetFactionsQueryVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"googleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetMyCampaignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>;
export const CreateCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCampaignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateCampaignMutation, CreateCampaignMutationVariables>;
export const CreateArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArmyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArmy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"factionId"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]}}]}}]} as unknown as DocumentNode<CreateArmyMutation, CreateArmyMutationVariables>;
export const UpdateArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateArmyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateArmy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"glory"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateArmyMutation, UpdateArmyMutationVariables>;
export const AddUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"armyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUnitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"armyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"armyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"armyId"}},{"kind":"Field","name":{"kind":"Name","value":"unitTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"wounds"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"injuries"}},{"kind":"Field","name":{"kind":"Name","value":"enhancements"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AddUnitMutation, AddUnitMutationVariables>;
export const UpdateUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUnitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"wounds"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"injuries"}},{"kind":"Field","name":{"kind":"Name","value":"enhancements"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateUnitMutation, UpdateUnitMutationVariables>;
export const DeleteArmyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteArmy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteArmy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteArmyMutation, DeleteArmyMutationVariables>;
export const RemoveUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveUnitMutation, RemoveUnitMutationVariables>;
export const AddVeteranAbilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddVeteranAbility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ability"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addVeteranAbility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"unitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unitId"}}},{"kind":"Argument","name":{"kind":"Name","value":"ability"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ability"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"renown"}},{"kind":"Field","name":{"kind":"Name","value":"reinforced"}},{"kind":"Field","name":{"kind":"Name","value":"veteranAbilities"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AddVeteranAbilityMutation, AddVeteranAbilityMutationVariables>;