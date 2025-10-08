import { GraphQLContext } from '../auth/context.js';
import { requireAuth, requireOwnership } from '../auth/guards.js';
import { ArmyRepository } from '../repositories/ArmyRepository.js';
import { CampaignRepository } from '../repositories/CampaignRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { getAllFactions, getFactionById } from '@path-to-glory/shared';

// Initialize repositories
const armyRepo = new ArmyRepository();
const campaignRepo = new CampaignRepository();
const userRepo = new UserRepository();

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: GraphQLContext) => {
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
        googleId: user.googleId,
        createdAt: user.createdAt,
      };
    },

    campaign: async (_: any, { id }: { id: string }) => {
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

    myCampaigns: async (_: any, __: any, context: GraphQLContext) => {
      requireAuth(context);

      const campaigns = await campaignRepo.findByOwnerId(context.user.cognitoId);
      return campaigns.map(c => ({
        id: c.id,
        name: c.name,
        ownerId: c.ownerId,
        createdAt: c.createdAt,
      }));
    },

    army: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
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
        glory: army.glory,
        renown: army.renown,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
      };
    },

    myArmies: async (_: any, __: any, context: GraphQLContext) => {
      requireAuth(context);

      const armies = await armyRepo.findByPlayerId(context.user.cognitoId);
      return armies.map(a => ({
        id: a.id,
        campaignId: a.campaignId,
        playerId: a.playerId,
        factionId: a.factionId,
        name: a.name,
        glory: a.glory,
        renown: a.renown,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
    },

    factions: () => {
      return getAllFactions();
    },

    faction: (_: any, { id }: { id: string }) => {
      return getFactionById(id);
    },
  },

  Mutation: {
    createCampaign: async (
      _: any,
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
      _: any,
      {
        input,
      }: {
        input: {
          campaignId: string;
          factionId: string;
          name: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);

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
        name: input.name,
        glory: faction.startingGlory,
        renown: faction.startingRenown,
      });

      return {
        id: army.id,
        campaignId: army.campaignId,
        playerId: army.playerId,
        factionId: army.factionId,
        name: army.name,
        glory: army.glory,
        renown: army.renown,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
      };
    },

    updateArmy: async (
      _: any,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name?: string;
          glory?: number;
          renown?: number;
        };
      },
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

      const army = await armyRepo.update(existingArmy.campaignId, id, input);

      return {
        id: army.id,
        campaignId: army.campaignId,
        playerId: army.playerId,
        factionId: army.factionId,
        name: army.name,
        glory: army.glory,
        renown: army.renown,
        createdAt: army.createdAt,
        updatedAt: army.updatedAt,
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
        glory: a.glory,
        renown: a.renown,
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
        glory: a.glory,
        renown: a.renown,
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
        googleId: user.googleId,
        createdAt: user.createdAt,
      };
    },

    faction: (parent: { factionId: string }) => {
      return getFactionById(parent.factionId);
    },

    units: () => {
      // TODO: Implement when Unit repository is ready
      return [];
    },
  },
};
