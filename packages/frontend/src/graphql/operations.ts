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
      imageUrl
      glory
      renown
      createdAt
      updatedAt
      player {
        id
        name
        email
        picture
      }
      units {
        id
        unitTypeId
        name
        rank
        renown
        reinforced
        isWarlord
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
      imageUrl
      heraldry
      realmOfOrigin
      battleFormation
      glory
      renown
      background
      notableEvents
      currentQuest
      questPoints
      completedQuests
      spellLore
      prayerLore
      manifestationLore
      createdAt
      updatedAt
      player {
        id
        name
        email
        picture
      }
      units {
        id
        unitTypeId
        name
        warscroll
        imageUrl
        size
        wounds
        rank
        renown
        reinforced
        isWarlord
        veteranAbilities
        injuries
        enhancements
        pathAbilities
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
      picture
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
        picture
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

export const DELETE_ARMY = gql`
  mutation DeleteArmy($id: ID!) {
    deleteArmy(id: $id)
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

// ============================================================================
// Custom Warscrolls
// ============================================================================

export const GET_CUSTOM_WARSCROLLS = gql`
   query GetCustomWarscrolls {
     customWarscrolls {
       id
       name
       subtitle
       factionId
       creatorId
       creator {
         id
         name
         picture
       }
       characteristics {
         move
         health
         save
         control
         banishment
       }
       rangedWeapons {
         name
         range
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       meleeWeapons {
         name
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       abilities {
         name
         timing
         description
         declare
         effect
         keywords
       }
       keywords {
         unit
         faction
       }
       battleProfile {
         unitSize
         points
         baseSize
         isManifestation
         isFactionTerrain
       }
       createdAt
       updatedAt
     }
   }
 `;

 export const GET_MY_CUSTOM_WARSCROLLS = gql`
   query GetMyCustomWarscrolls {
     myCustomWarscrolls {
       id
       name
       subtitle
       factionId
       creatorId
       creator {
         id
         name
         picture
       }
       characteristics {
         move
         health
         save
         control
         banishment
       }
       rangedWeapons {
         name
         range
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       meleeWeapons {
         name
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       abilities {
         name
         timing
         description
         declare
         effect
         keywords
       }
       keywords {
         unit
         faction
       }
       battleProfile {
         unitSize
         points
         baseSize
         isManifestation
         isFactionTerrain
       }
       createdAt
       updatedAt
     }
   }
 `;

 export const GET_CUSTOM_WARSCROLL = gql`
   query GetCustomWarscroll($id: ID!) {
     customWarscroll(id: $id) {
       id
       name
       subtitle
       factionId
       creatorId
       creator {
         id
         name
         picture
       }
       characteristics {
         move
         health
         save
         control
         banishment
       }
       rangedWeapons {
         name
         range
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       meleeWeapons {
         name
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       abilities {
         name
         timing
         description
         declare
         effect
         keywords
       }
       keywords {
         unit
         faction
       }
       battleProfile {
         unitSize
         points
         baseSize
         isManifestation
         isFactionTerrain
       }
       createdAt
       updatedAt
     }
   }
 `;

 export const CREATE_CUSTOM_WARSCROLL = gql`
   mutation CreateCustomWarscroll($input: CreateCustomWarscrollInput!) {
     createCustomWarscroll(input: $input) {
       id
       name
       subtitle
       factionId
       creatorId
       creator {
         id
         name
         picture
       }
       characteristics {
         move
         health
         save
         control
         banishment
       }
       rangedWeapons {
         name
         range
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       meleeWeapons {
         name
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       abilities {
         name
         timing
         description
         declare
         effect
         keywords
       }
       keywords {
         unit
         faction
       }
       battleProfile {
         unitSize
         points
         baseSize
         isManifestation
         isFactionTerrain
       }
       createdAt
       updatedAt
     }
   }
 `;

 export const UPDATE_CUSTOM_WARSCROLL = gql`
   mutation UpdateCustomWarscroll($id: ID!, $input: UpdateCustomWarscrollInput!) {
     updateCustomWarscroll(id: $id, input: $input) {
       id
       name
       subtitle
       factionId
       characteristics {
         move
         health
         save
         control
         banishment
       }
       rangedWeapons {
         name
         range
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       meleeWeapons {
         name
         attacks
         hit
         wound
         rend
         damage
         ability
       }
       abilities {
         name
         timing
         description
         declare
         effect
         keywords
       }
       keywords {
         unit
         faction
       }
       battleProfile {
         unitSize
         points
         baseSize
         isManifestation
         isFactionTerrain
       }
       updatedAt
     }
   }
 `;

 export const DELETE_CUSTOM_WARSCROLL = gql`
   mutation DeleteCustomWarscroll($id: ID!) {
     deleteCustomWarscroll(id: $id)
   }
 `;
