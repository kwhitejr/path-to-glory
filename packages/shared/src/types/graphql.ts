import { GraphQLResolveInfo } from 'graphql';
import { UserModel, CampaignModel, ArmyModel, UnitModel, BattleModel, FactionModel } from './models.js';
import { GraphQLContext } from './context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddUnitInput = {
  name: Scalars['String']['input'];
  rank: Scalars['String']['input'];
  reinforced: Scalars['Boolean']['input'];
  renown: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  unitTypeId: Scalars['String']['input'];
  wounds: Scalars['Int']['input'];
};

/** An army/warband belonging to a player in a campaign */
export type Army = {
  __typename?: 'Army';
  campaign: Campaign;
  campaignId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  faction: Faction;
  factionId: Scalars['ID']['output'];
  glory: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  player: User;
  playerId: Scalars['ID']['output'];
  renown: Scalars['Int']['output'];
  units: Array<Unit>;
  updatedAt: Scalars['String']['output'];
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
  campaignId: Scalars['ID']['input'];
  factionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
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

export type RecordBattleInput = {
  armies: Array<Scalars['ID']['input']>;
  campaignId: Scalars['ID']['input'];
  gloryAwarded: Array<GloryAwardInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  outcome: BattleOutcome;
  playedAt: Scalars['String']['input'];
};

/** A unit within an army */
export type Unit = {
  __typename?: 'Unit';
  army: Army;
  armyId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  enhancements: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  injuries: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  reinforced: Scalars['Boolean']['output'];
  renown: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  unitTypeId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  veteranAbilities: Array<Scalars['String']['output']>;
  wounds: Scalars['Int']['output'];
};

export type UpdateArmyInput = {
  glory?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  renown?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUnitInput = {
  enhancements?: InputMaybe<Array<Scalars['String']['input']>>;
  injuries?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  rank?: InputMaybe<Scalars['String']['input']>;
  reinforced?: InputMaybe<Scalars['Boolean']['input']>;
  renown?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  veteranAbilities?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddUnitInput: AddUnitInput;
  Army: ResolverTypeWrapper<ArmyModel>;
  Battle: ResolverTypeWrapper<BattleModel>;
  BattleOutcome: BattleOutcome;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Campaign: ResolverTypeWrapper<CampaignModel>;
  CreateArmyInput: CreateArmyInput;
  CreateCampaignInput: CreateCampaignInput;
  Faction: ResolverTypeWrapper<FactionModel>;
  GloryAward: ResolverTypeWrapper<GloryAward>;
  GloryAwardInput: GloryAwardInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RecordBattleInput: RecordBattleInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Unit: ResolverTypeWrapper<UnitModel>;
  UpdateArmyInput: UpdateArmyInput;
  UpdateUnitInput: UpdateUnitInput;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddUnitInput: AddUnitInput;
  Army: ArmyModel;
  Battle: BattleModel;
  Boolean: Scalars['Boolean']['output'];
  Campaign: CampaignModel;
  CreateArmyInput: CreateArmyInput;
  CreateCampaignInput: CreateCampaignInput;
  Faction: FactionModel;
  GloryAward: GloryAward;
  GloryAwardInput: GloryAwardInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  RecordBattleInput: RecordBattleInput;
  String: Scalars['String']['output'];
  Unit: UnitModel;
  UpdateArmyInput: UpdateArmyInput;
  UpdateUnitInput: UpdateUnitInput;
  User: UserModel;
}>;

export type ArmyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Army'] = ResolversParentTypes['Army']> = ResolversObject<{
  campaign?: Resolver<ResolversTypes['Campaign'], ParentType, ContextType>;
  campaignId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  faction?: Resolver<ResolversTypes['Faction'], ParentType, ContextType>;
  factionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  glory?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  playerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  renown?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  units?: Resolver<Array<ResolversTypes['Unit']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type BattleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Battle'] = ResolversParentTypes['Battle']> = ResolversObject<{
  armies?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  campaign?: Resolver<ResolversTypes['Campaign'], ParentType, ContextType>;
  campaignId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gloryAwarded?: Resolver<Array<ResolversTypes['GloryAward']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  outcome?: Resolver<ResolversTypes['BattleOutcome'], ParentType, ContextType>;
  playedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CampaignResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Campaign'] = ResolversParentTypes['Campaign']> = ResolversObject<{
  armies?: Resolver<Array<ResolversTypes['Army']>, ParentType, ContextType>;
  battles?: Resolver<Array<ResolversTypes['Battle']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type FactionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Faction'] = ResolversParentTypes['Faction']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  grandAlliance?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startingGlory?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startingRenown?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GloryAwardResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GloryAward'] = ResolversParentTypes['GloryAward']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  armyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationAddUnitArgs, 'armyId' | 'input'>>;
  addVeteranAbility?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationAddVeteranAbilityArgs, 'ability' | 'unitId'>>;
  createArmy?: Resolver<ResolversTypes['Army'], ParentType, ContextType, RequireFields<MutationCreateArmyArgs, 'input'>>;
  createCampaign?: Resolver<ResolversTypes['Campaign'], ParentType, ContextType, RequireFields<MutationCreateCampaignArgs, 'input'>>;
  recordBattle?: Resolver<ResolversTypes['Battle'], ParentType, ContextType, RequireFields<MutationRecordBattleArgs, 'input'>>;
  removeUnit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveUnitArgs, 'id'>>;
  updateArmy?: Resolver<ResolversTypes['Army'], ParentType, ContextType, RequireFields<MutationUpdateArmyArgs, 'id' | 'input'>>;
  updateUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationUpdateUnitArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  army?: Resolver<Maybe<ResolversTypes['Army']>, ParentType, ContextType, RequireFields<QueryArmyArgs, 'id'>>;
  campaign?: Resolver<Maybe<ResolversTypes['Campaign']>, ParentType, ContextType, RequireFields<QueryCampaignArgs, 'id'>>;
  faction?: Resolver<Maybe<ResolversTypes['Faction']>, ParentType, ContextType, RequireFields<QueryFactionArgs, 'id'>>;
  factions?: Resolver<Array<ResolversTypes['Faction']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myArmies?: Resolver<Array<ResolversTypes['Army']>, ParentType, ContextType>;
  myCampaigns?: Resolver<Array<ResolversTypes['Campaign']>, ParentType, ContextType>;
}>;

export type UnitResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Unit'] = ResolversParentTypes['Unit']> = ResolversObject<{
  army?: Resolver<ResolversTypes['Army'], ParentType, ContextType>;
  armyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enhancements?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  injuries?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reinforced?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  renown?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitTypeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  veteranAbilities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  wounds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  armies?: Resolver<Array<ResolversTypes['Army']>, ParentType, ContextType>;
  campaigns?: Resolver<Array<ResolversTypes['Campaign']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  googleId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Army?: ArmyResolvers<ContextType>;
  Battle?: BattleResolvers<ContextType>;
  Campaign?: CampaignResolvers<ContextType>;
  Faction?: FactionResolvers<ContextType>;
  GloryAward?: GloryAwardResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Unit?: UnitResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

