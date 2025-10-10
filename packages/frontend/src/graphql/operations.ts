import { gql } from '@apollo/client';

// ============================================================================
// Queries
// ============================================================================

export const GET_MY_ARMIES = gql`
  query GetMyArmies {
    myArmies {
      id
      name
      factionId
      glory
      renown
      createdAt
      updatedAt
      player {
        id
        name
        email
      }
    }
  }
`;

export const GET_ARMY = gql`
  query GetArmy($id: ID!) {
    army(id: $id) {
      id
      campaignId
      name
      factionId
      glory
      renown
      createdAt
      updatedAt
      player {
        id
        name
        email
      }
      units {
        id
        unitTypeId
        name
        size
        wounds
        rank
        renown
        reinforced
        veteranAbilities
        injuries
        enhancements
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_FACTIONS = gql`
  query GetFactions {
    factions {
      id
      name
      grandAlliance
      startingGlory
      startingRenown
      description
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      googleId
      createdAt
    }
  }
`;

export const GET_MY_CAMPAIGNS = gql`
  query GetMyCampaigns {
    myCampaigns {
      id
      name
      ownerId
      createdAt
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      name
      ownerId
      createdAt
    }
  }
`;

export const CREATE_ARMY = gql`
  mutation CreateArmy($input: CreateArmyInput!) {
    createArmy(input: $input) {
      id
      campaignId
      name
      factionId
      glory
      renown
      createdAt
      updatedAt
      player {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_ARMY = gql`
  mutation UpdateArmy($id: ID!, $input: UpdateArmyInput!) {
    updateArmy(id: $id, input: $input) {
      id
      name
      glory
      renown
      updatedAt
    }
  }
`;

export const ADD_UNIT = gql`
  mutation AddUnit($armyId: ID!, $input: AddUnitInput!) {
    addUnit(armyId: $armyId, input: $input) {
      id
      armyId
      unitTypeId
      name
      size
      wounds
      rank
      renown
      reinforced
      veteranAbilities
      injuries
      enhancements
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_UNIT = gql`
  mutation UpdateUnit($id: ID!, $input: UpdateUnitInput!) {
    updateUnit(id: $id, input: $input) {
      id
      name
      size
      wounds
      rank
      renown
      reinforced
      veteranAbilities
      injuries
      enhancements
      updatedAt
    }
  }
`;

export const REMOVE_UNIT = gql`
  mutation RemoveUnit($id: ID!) {
    removeUnit(id: $id)
  }
`;

export const ADD_VETERAN_ABILITY = gql`
  mutation AddVeteranAbility($unitId: ID!, $ability: String!) {
    addVeteranAbility(unitId: $unitId, ability: $ability) {
      id
      rank
      renown
      reinforced
      veteranAbilities
      updatedAt
    }
  }
`;
