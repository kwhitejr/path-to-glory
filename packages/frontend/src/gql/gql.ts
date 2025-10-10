/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetMyArmies {\n    myArmies {\n      id\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n": typeof types.GetMyArmiesDocument,
    "\n  query GetArmy($id: ID!) {\n    army(id: $id) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n      units {\n        id\n        unitTypeId\n        name\n        size\n        wounds\n        rank\n        renown\n        reinforced\n        veteranAbilities\n        injuries\n        enhancements\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetArmyDocument,
    "\n  query GetFactions {\n    factions {\n      id\n      name\n      grandAlliance\n      startingGlory\n      startingRenown\n      description\n    }\n  }\n": typeof types.GetFactionsDocument,
    "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      picture\n      googleId\n      createdAt\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetMyCampaigns {\n    myCampaigns {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n": typeof types.GetMyCampaignsDocument,
    "\n  mutation CreateCampaign($input: CreateCampaignInput!) {\n    createCampaign(input: $input) {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n": typeof types.CreateCampaignDocument,
    "\n  mutation CreateArmy($input: CreateArmyInput!) {\n    createArmy(input: $input) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n": typeof types.CreateArmyDocument,
    "\n  mutation UpdateArmy($id: ID!, $input: UpdateArmyInput!) {\n    updateArmy(id: $id, input: $input) {\n      id\n      name\n      glory\n      renown\n      updatedAt\n    }\n  }\n": typeof types.UpdateArmyDocument,
    "\n  mutation AddUnit($armyId: ID!, $input: AddUnitInput!) {\n    addUnit(armyId: $armyId, input: $input) {\n      id\n      armyId\n      unitTypeId\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.AddUnitDocument,
    "\n  mutation UpdateUnit($id: ID!, $input: UpdateUnitInput!) {\n    updateUnit(id: $id, input: $input) {\n      id\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      updatedAt\n    }\n  }\n": typeof types.UpdateUnitDocument,
    "\n  mutation RemoveUnit($id: ID!) {\n    removeUnit(id: $id)\n  }\n": typeof types.RemoveUnitDocument,
    "\n  mutation AddVeteranAbility($unitId: ID!, $ability: String!) {\n    addVeteranAbility(unitId: $unitId, ability: $ability) {\n      id\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      updatedAt\n    }\n  }\n": typeof types.AddVeteranAbilityDocument,
};
const documents: Documents = {
    "\n  query GetMyArmies {\n    myArmies {\n      id\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n": types.GetMyArmiesDocument,
    "\n  query GetArmy($id: ID!) {\n    army(id: $id) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n      units {\n        id\n        unitTypeId\n        name\n        size\n        wounds\n        rank\n        renown\n        reinforced\n        veteranAbilities\n        injuries\n        enhancements\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.GetArmyDocument,
    "\n  query GetFactions {\n    factions {\n      id\n      name\n      grandAlliance\n      startingGlory\n      startingRenown\n      description\n    }\n  }\n": types.GetFactionsDocument,
    "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      picture\n      googleId\n      createdAt\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetMyCampaigns {\n    myCampaigns {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n": types.GetMyCampaignsDocument,
    "\n  mutation CreateCampaign($input: CreateCampaignInput!) {\n    createCampaign(input: $input) {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n": types.CreateCampaignDocument,
    "\n  mutation CreateArmy($input: CreateArmyInput!) {\n    createArmy(input: $input) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n": types.CreateArmyDocument,
    "\n  mutation UpdateArmy($id: ID!, $input: UpdateArmyInput!) {\n    updateArmy(id: $id, input: $input) {\n      id\n      name\n      glory\n      renown\n      updatedAt\n    }\n  }\n": types.UpdateArmyDocument,
    "\n  mutation AddUnit($armyId: ID!, $input: AddUnitInput!) {\n    addUnit(armyId: $armyId, input: $input) {\n      id\n      armyId\n      unitTypeId\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      createdAt\n      updatedAt\n    }\n  }\n": types.AddUnitDocument,
    "\n  mutation UpdateUnit($id: ID!, $input: UpdateUnitInput!) {\n    updateUnit(id: $id, input: $input) {\n      id\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      updatedAt\n    }\n  }\n": types.UpdateUnitDocument,
    "\n  mutation RemoveUnit($id: ID!) {\n    removeUnit(id: $id)\n  }\n": types.RemoveUnitDocument,
    "\n  mutation AddVeteranAbility($unitId: ID!, $ability: String!) {\n    addVeteranAbility(unitId: $unitId, ability: $ability) {\n      id\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      updatedAt\n    }\n  }\n": types.AddVeteranAbilityDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyArmies {\n    myArmies {\n      id\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyArmies {\n    myArmies {\n      id\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArmy($id: ID!) {\n    army(id: $id) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n      units {\n        id\n        unitTypeId\n        name\n        size\n        wounds\n        rank\n        renown\n        reinforced\n        veteranAbilities\n        injuries\n        enhancements\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetArmy($id: ID!) {\n    army(id: $id) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n      units {\n        id\n        unitTypeId\n        name\n        size\n        wounds\n        rank\n        renown\n        reinforced\n        veteranAbilities\n        injuries\n        enhancements\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFactions {\n    factions {\n      id\n      name\n      grandAlliance\n      startingGlory\n      startingRenown\n      description\n    }\n  }\n"): (typeof documents)["\n  query GetFactions {\n    factions {\n      id\n      name\n      grandAlliance\n      startingGlory\n      startingRenown\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      picture\n      googleId\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      email\n      name\n      picture\n      googleId\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyCampaigns {\n    myCampaigns {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetMyCampaigns {\n    myCampaigns {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCampaign($input: CreateCampaignInput!) {\n    createCampaign(input: $input) {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCampaign($input: CreateCampaignInput!) {\n    createCampaign(input: $input) {\n      id\n      name\n      ownerId\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateArmy($input: CreateArmyInput!) {\n    createArmy(input: $input) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArmy($input: CreateArmyInput!) {\n    createArmy(input: $input) {\n      id\n      campaignId\n      name\n      factionId\n      glory\n      renown\n      createdAt\n      updatedAt\n      player {\n        id\n        name\n        email\n        picture\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateArmy($id: ID!, $input: UpdateArmyInput!) {\n    updateArmy(id: $id, input: $input) {\n      id\n      name\n      glory\n      renown\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArmy($id: ID!, $input: UpdateArmyInput!) {\n    updateArmy(id: $id, input: $input) {\n      id\n      name\n      glory\n      renown\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddUnit($armyId: ID!, $input: AddUnitInput!) {\n    addUnit(armyId: $armyId, input: $input) {\n      id\n      armyId\n      unitTypeId\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation AddUnit($armyId: ID!, $input: AddUnitInput!) {\n    addUnit(armyId: $armyId, input: $input) {\n      id\n      armyId\n      unitTypeId\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUnit($id: ID!, $input: UpdateUnitInput!) {\n    updateUnit(id: $id, input: $input) {\n      id\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUnit($id: ID!, $input: UpdateUnitInput!) {\n    updateUnit(id: $id, input: $input) {\n      id\n      name\n      size\n      wounds\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      injuries\n      enhancements\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveUnit($id: ID!) {\n    removeUnit(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveUnit($id: ID!) {\n    removeUnit(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddVeteranAbility($unitId: ID!, $ability: String!) {\n    addVeteranAbility(unitId: $unitId, ability: $ability) {\n      id\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation AddVeteranAbility($unitId: ID!, $ability: String!) {\n    addVeteranAbility(unitId: $unitId, ability: $ability) {\n      id\n      rank\n      renown\n      reinforced\n      veteranAbilities\n      updatedAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;