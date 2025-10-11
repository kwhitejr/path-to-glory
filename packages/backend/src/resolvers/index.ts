import { GraphQLContext } from '../auth/context.js';
import { requireAuth, requireOwnership } from '../auth/guards.js';
import { ArmyRepository } from '../repositories/ArmyRepository.js';
import { CampaignRepository } from '../repositories/CampaignRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { UnitRepository } from '../repositories/UnitRepository.js';
import { getAllFactions, getFactionById } from '@path-to-glory/shared';

// Initialize repositories
const armyRepo = new ArmyRepository();
const campaignRepo = new CampaignRepository();
const userRepo = new UserRepository();
const unitRepo = new UnitRepository();

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        return null;
      }

      const user = await userRepo.findByCognitoId(context.user.cognitoId);
      if (!user) {
        return null;
      }

      return {
        id: user.cognitoId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        createdAt: user.createdAt,
      };
    },

    campaign: async (_: unknown, { id }: { id: string }) => {
      const campaign = await campaignRepo.findById(id);
      if (!campaign) {
        return null;
      }

      return {
        id: campaign.id,
        name: campaign.name,
        ownerId: campaign.ownerId,
        createdAt: campaign.createdAt,
      };
    },

    myCampaigns: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAuth(context);

      const campaigns = await campaignRepo.findByOwnerId(context.user.cognitoId);
      return campaigns.map(c => ({
        id: c.id,
        name: c.name,
        ownerId: c.ownerId,
        createdAt: c.createdAt,
      }));
    },

    army: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      // For now, we need to find the army across all campaigns
      // In a real system, you'd pass campaignId as well
      // For simplicity, we'll query the user's armies and find by ID
      requireAuth(context);

      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);
      const army = armies.find(a => a.id === id);

      if (!army) {
        return null;
      }

      return {
        id: army.id,
        campaignId: army.campaignId,
        playerId: army.playerId,
        factionId: army.factionId,
        name: army.name,
        heraldry: army.heraldry,
        realmOfOrigin: army.realmOfOrigin,
        battleFormation: army.battleFormation,
        glory: army.glory,
        renown: army.renown,
        background: army.background,
        notableEvents: army.notableEvents,
        currentQuest: army.currentQuest,
        questPoints: army.questPoints,
        completedQuests: army.completedQuests,
        spellLore: army.spellLore,
        prayerLore: army.prayerLore,
        manifestationLore: army.manifestationLore,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
      };
    },

    myArmies: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAuth(context);

      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);
      return armies.map(a => ({
        id: a.id,
        campaignId: a.campaignId,
        playerId: a.playerId,
        factionId: a.factionId,
        name: a.name,
        heraldry: a.heraldry,
        realmOfOrigin: a.realmOfOrigin,
        battleFormation: a.battleFormation,
        glory: a.glory,
        renown: a.renown,
        background: a.background,
        notableEvents: a.notableEvents,
        currentQuest: a.currentQuest,
        questPoints: a.questPoints,
        completedQuests: a.completedQuests,
        spellLore: a.spellLore,
        prayerLore: a.prayerLore,
        manifestationLore: a.manifestationLore,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
    },

    factions: () => {
      return getAllFactions();
    },

    faction: (_: unknown, { id }: { id: string }) => {
      return getFactionById(id);
    },
  },

  Mutation: {
    createCampaign: async (
      _: unknown,
      { input }: { input: { name: string } },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const campaign = await campaignRepo.create({
        name: input.name,
        ownerId: context.user.cognitoId,
      });

      return {
        id: campaign.id,
        name: campaign.name,
        ownerId: campaign.ownerId,
        createdAt: campaign.createdAt,
      };
    },

    createArmy: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          campaignId: string;
          factionId: string;
          name: string;
          heraldry?: string;
          realmOfOrigin?: string;
          battleFormation?: string;
          background?: string;
          spellLore?: string[];
          prayerLore?: string[];
          manifestationLore?: string[];
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Validate input
      if (!input.name || input.name.trim().length === 0) {
        throw new Error('Army name is required');
      }

      if (input.name.length > 100) {
        throw new Error('Army name must be 100 characters or less');
      }

      // Verify campaign exists and user has access
      const campaign = await campaignRepo.findById(input.campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get faction to initialize glory/renown
      const faction = getFactionById(input.factionId);
      if (!faction) {
        throw new Error('Faction not found');
      }

      const army = await armyRepo.create({
        campaignId: input.campaignId,
        playerId: context.user.cognitoId,
        factionId: input.factionId,
        name: input.name.trim(),
        heraldry: input.heraldry,
        realmOfOrigin: input.realmOfOrigin,
        battleFormation: input.battleFormation,
        background: input.background,
        glory: faction.startingGlory,
        renown: faction.startingRenown,
      });

      return {
        id: army.id,
        campaignId: army.campaignId,
        playerId: army.playerId,
        factionId: army.factionId,
        name: army.name,
        heraldry: army.heraldry,
        realmOfOrigin: army.realmOfOrigin,
        battleFormation: army.battleFormation,
        glory: army.glory,
        renown: army.renown,
        background: army.background,
        notableEvents: army.notableEvents,
        currentQuest: army.currentQuest,
        questPoints: army.questPoints,
        completedQuests: army.completedQuests,
        spellLore: army.spellLore,
        prayerLore: army.prayerLore,
        manifestationLore: army.manifestationLore,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
      };
    },

    updateArmy: async (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name?: string;
          heraldry?: string;
          realmOfOrigin?: string;
          battleFormation?: string;
          glory?: number;
          renown?: number;
          background?: string;
          notableEvents?: string;
          currentQuest?: string;
          questPoints?: number;
          completedQuests?: string[];
          spellLore?: string[];
          prayerLore?: string[];
          manifestationLore?: string[];
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Validate input
      if (input.name !== undefined && input.name.trim().length === 0) {
        throw new Error('Army name cannot be empty');
      }

      if (input.name !== undefined && input.name.length > 100) {
        throw new Error('Army name must be 100 characters or less');
      }

      // Find army to get campaignId and verify ownership
      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);
      const existingArmy = armies.find(a => a.id === id);

      if (!existingArmy) {
        throw new Error('Army not found');
      }

      requireOwnership(context, existingArmy.playerId);

      const army = await armyRepo.update(existingArmy.campaignId, id, input);

      return {
        id: army.id,
        campaignId: army.campaignId,
        playerId: army.playerId,
        factionId: army.factionId,
        name: army.name,
        heraldry: army.heraldry,
        realmOfOrigin: army.realmOfOrigin,
        battleFormation: army.battleFormation,
        glory: army.glory,
        renown: army.renown,
        background: army.background,
        notableEvents: army.notableEvents,
        currentQuest: army.currentQuest,
        questPoints: army.questPoints,
        completedQuests: army.completedQuests,
        spellLore: army.spellLore,
        prayerLore: army.prayerLore,
        manifestationLore: army.manifestationLore,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
      };
    },

    deleteArmy: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Find army to get campaignId and verify ownership
      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);
      const existingArmy = armies.find(a => a.id === id);

      if (!existingArmy) {
        throw new Error('Army not found');
      }

      requireOwnership(context, existingArmy.playerId);

      // Delete all units in the army first
      const units = await unitRepo.findByArmyId(existingArmy.campaignId, id);
      for (const unit of units) {
        await unitRepo.delete(existingArmy.campaignId, id, unit.id);
      }

      // Then delete the army
      await armyRepo.delete(existingArmy.campaignId, id);

      return true;
    },

    addUnit: async (
      _: unknown,
      {
        armyId,
        input,
      }: {
        armyId: string;
        input: {
          unitTypeId: string;
          name: string;
          warscroll: string;
          size: number;
          wounds: number;
          rank: string;
          renown: number;
          reinforced: boolean;
          isWarlord: boolean;
          pathAbilities?: string[];
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Find army to get campaignId and verify ownership
      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);
      const army = armies.find(a => a.id === armyId);

      if (!army) {
        throw new Error('Army not found');
      }

      requireOwnership(context, army.playerId);

      const unit = await unitRepo.create({
        campaignId: army.campaignId,
        armyId,
        unitTypeId: input.unitTypeId,
        name: input.name,
        warscroll: input.warscroll,
        size: input.size,
        wounds: input.wounds,
        rank: input.rank,
        renown: input.renown,
        reinforced: input.reinforced,
        isWarlord: input.isWarlord,
        pathAbilities: input.pathAbilities,
      });

      return {
        id: unit.id,
        campaignId: unit.campaignId,
        armyId: unit.armyId,
        unitTypeId: unit.unitTypeId,
        name: unit.name,
        warscroll: unit.warscroll,
        size: unit.size,
        wounds: unit.wounds,
        rank: unit.rank,
        renown: unit.renown,
        reinforced: unit.reinforced,
        isWarlord: unit.isWarlord,
        veteranAbilities: unit.veteranAbilities,
        injuries: unit.injuries,
        enhancements: unit.enhancements,
        pathAbilities: unit.pathAbilities,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
      };
    },

    updateUnit: async (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name?: string;
          size?: number;
          wounds?: number;
          rank?: string;
          renown?: number;
          reinforced?: boolean;
          veteranAbilities?: string[];
          injuries?: string[];
          enhancements?: string[];
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // We need to find the unit's army to verify ownership and get campaignId
      // This requires querying all user's armies and their units
      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);

      let unitArmy = null;
      for (const army of armies) {
        const units = await unitRepo.findByArmyId(army.campaignId, army.id);
        const foundUnit = units.find(u => u.id === id);
        if (foundUnit) {
          unitArmy = { army, unit: foundUnit };
          break;
        }
      }

      if (!unitArmy) {
        throw new Error('Unit not found');
      }

      requireOwnership(context, unitArmy.army.playerId);

      const unit = await unitRepo.update(
        unitArmy.army.campaignId,
        unitArmy.army.id,
        id,
        input
      );

      return {
        id: unit.id,
        campaignId: unit.campaignId,
        armyId: unit.armyId,
        unitTypeId: unit.unitTypeId,
        name: unit.name,
        warscroll: unit.warscroll,
        size: unit.size,
        wounds: unit.wounds,
        rank: unit.rank,
        renown: unit.renown,
        reinforced: unit.reinforced,
        isWarlord: unit.isWarlord,
        veteranAbilities: unit.veteranAbilities,
        injuries: unit.injuries,
        enhancements: unit.enhancements,
        pathAbilities: unit.pathAbilities,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
      };
    },

    removeUnit: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Find the unit's army to verify ownership and get IDs
      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);

      let unitArmy = null;
      for (const army of armies) {
        const units = await unitRepo.findByArmyId(army.campaignId, army.id);
        const foundUnit = units.find(u => u.id === id);
        if (foundUnit) {
          unitArmy = { army, unit: foundUnit };
          break;
        }
      }

      if (!unitArmy) {
        throw new Error('Unit not found');
      }

      requireOwnership(context, unitArmy.army.playerId);

      await unitRepo.delete(
        unitArmy.army.campaignId,
        unitArmy.army.id,
        id
      );

      return true;
    },

    addVeteranAbility: async (
      _: unknown,
      {
        unitId,
        ability,
      }: {
        unitId: string;
        ability: string;
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      // Find the unit's army to verify ownership and get IDs
      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);

      let unitArmy = null;
      for (const army of armies) {
        const units = await unitRepo.findByArmyId(army.campaignId, army.id);
        const foundUnit = units.find(u => u.id === unitId);
        if (foundUnit) {
          unitArmy = { army, unit: foundUnit };
          break;
        }
      }

      if (!unitArmy) {
        throw new Error('Unit not found');
      }

      requireOwnership(context, unitArmy.army.playerId);

      const unit = await unitRepo.addVeteranAbility(
        unitArmy.army.campaignId,
        unitArmy.army.id,
        unitId,
        ability
      );

      return {
        id: unit.id,
        campaignId: unit.campaignId,
        armyId: unit.armyId,
        unitTypeId: unit.unitTypeId,
        name: unit.name,
        warscroll: unit.warscroll,
        size: unit.size,
        wounds: unit.wounds,
        rank: unit.rank,
        renown: unit.renown,
        reinforced: unit.reinforced,
        isWarlord: unit.isWarlord,
        veteranAbilities: unit.veteranAbilities,
        injuries: unit.injuries,
        enhancements: unit.enhancements,
        pathAbilities: unit.pathAbilities,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
      };
    },
  },

  // Field resolvers
  User: {
    campaigns: async (parent: { id: string }) => {
      const campaigns = await campaignRepo.findByOwnerId(parent.id);
      return campaigns.map(c => ({
        id: c.id,
        name: c.name,
        ownerId: c.ownerId,
        createdAt: c.createdAt,
      }));
    },

    armies: async (parent: { id: string }) => {
      const armies = await armyRepo.findByPlayerId(parent.id);
      return armies.map(a => ({
        id: a.id,
        campaignId: a.campaignId,
        playerId: a.playerId,
        factionId: a.factionId,
        name: a.name,
        heraldry: a.heraldry,
        realmOfOrigin: a.realmOfOrigin,
        battleFormation: a.battleFormation,
        glory: a.glory,
        renown: a.renown,
        background: a.background,
        notableEvents: a.notableEvents,
        currentQuest: a.currentQuest,
        questPoints: a.questPoints,
        completedQuests: a.completedQuests,
        spellLore: a.spellLore,
        prayerLore: a.prayerLore,
        manifestationLore: a.manifestationLore,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
    },
  },

  Campaign: {
    owner: async (parent: { ownerId: string }) => {
      const user = await userRepo.findByCognitoId(parent.ownerId);
      if (!user) {
        return null;
      }
      return {
        id: user.cognitoId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        createdAt: user.createdAt,
      };
    },

    armies: async (parent: { id: string }) => {
      const armies = await armyRepo.findByCampaignId(parent.id);
      return armies.map(a => ({
        id: a.id,
        campaignId: a.campaignId,
        playerId: a.playerId,
        factionId: a.factionId,
        name: a.name,
        heraldry: a.heraldry,
        realmOfOrigin: a.realmOfOrigin,
        battleFormation: a.battleFormation,
        glory: a.glory,
        renown: a.renown,
        background: a.background,
        notableEvents: a.notableEvents,
        currentQuest: a.currentQuest,
        questPoints: a.questPoints,
        completedQuests: a.completedQuests,
        spellLore: a.spellLore,
        prayerLore: a.prayerLore,
        manifestationLore: a.manifestationLore,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
    },

    battles: () => {
      // TODO: Implement when Battle repository is ready
      return [];
    },
  },

  Army: {
    campaign: async (parent: { campaignId: string }) => {
      const campaign = await campaignRepo.findById(parent.campaignId);
      if (!campaign) {
        return null;
      }
      return {
        id: campaign.id,
        name: campaign.name,
        ownerId: campaign.ownerId,
        createdAt: campaign.createdAt,
      };
    },

    player: async (parent: { playerId: string }) => {
      const user = await userRepo.findByCognitoId(parent.playerId);
      if (!user) {
        return null;
      }
      return {
        id: user.cognitoId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        createdAt: user.createdAt,
      };
    },

    faction: (parent: { factionId: string }) => {
      return getFactionById(parent.factionId);
    },

    units: async (parent: { campaignId: string; id: string }) => {
      const units = await unitRepo.findByArmyId(parent.campaignId, parent.id);
      return units.map(u => ({
        id: u.id,
        campaignId: u.campaignId,
        armyId: u.armyId,
        unitTypeId: u.unitTypeId,
        name: u.name,
        warscroll: u.warscroll,
        size: u.size,
        wounds: u.wounds,
        rank: u.rank,
        renown: u.renown,
        reinforced: u.reinforced,
        isWarlord: u.isWarlord,
        veteranAbilities: u.veteranAbilities,
        injuries: u.injuries,
        enhancements: u.enhancements,
        pathAbilities: u.pathAbilities,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }));
    },
  },

  Unit: {
    army: async (parent: { campaignId: string; armyId: string }) => {
      const army = await armyRepo.findById(parent.campaignId, parent.armyId);
      if (!army) {
        return null;
      }
      return {
        id: army.id,
        campaignId: army.campaignId,
        playerId: army.playerId,
        factionId: army.factionId,
        name: army.name,
        heraldry: army.heraldry,
        realmOfOrigin: army.realmOfOrigin,
        battleFormation: army.battleFormation,
        glory: army.glory,
        renown: army.renown,
        background: army.background,
        notableEvents: army.notableEvents,
        currentQuest: army.currentQuest,
        questPoints: army.questPoints,
        completedQuests: army.completedQuests,
        spellLore: army.spellLore,
        prayerLore: army.prayerLore,
        manifestationLore: army.manifestationLore,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
      };
    },
  },
};
