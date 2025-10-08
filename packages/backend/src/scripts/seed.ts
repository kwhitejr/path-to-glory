#!/usr/bin/env tsx
/**
 * Seed script for local development
 * Creates mock users, campaigns, and armies
 */

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db/client.js';
import { keys, gsiKeys } from '../db/keys.js';
import { v4 as uuidv4 } from 'uuid';

// Check if mock data is enabled
const ENABLE_MOCK_DATA = process.env.ENABLE_MOCK_DATA === 'true';

if (!ENABLE_MOCK_DATA) {
  console.log('❌ Mock data seeding disabled. Set ENABLE_MOCK_DATA=true to enable.');
  process.exit(0);
}

console.log('🌱 Seeding mock data...\n');

const now = new Date().toISOString();

// Mock users (these should match actual Google OAuth users for testing)
const mockUsers = [
  {
    cognitoId: 'google-oauth2|108857389299686012345',
    email: 'test.user1@example.com',
    name: 'Test User 1',
    googleId: '108857389299686012345',
  },
  {
    cognitoId: 'google-oauth2|108857389299686067890',
    email: 'test.user2@example.com',
    name: 'Test User 2',
    googleId: '108857389299686067890',
  },
];

// Mock campaigns
const mockCampaigns = [
  {
    id: 'campaign-001',
    name: 'The Mortal Realms Awakening',
    ownerId: mockUsers[0].cognitoId,
  },
  {
    id: 'campaign-002',
    name: 'Battle for the Gnarlwood',
    ownerId: mockUsers[1].cognitoId,
  },
];

// Mock armies
const mockArmies = [
  {
    id: uuidv4(),
    campaignId: 'campaign-001',
    playerId: mockUsers[0].cognitoId,
    factionId: 'stormcast-eternals',
    name: "Sigmar's Hammers",
    glory: 5,
    renown: 3,
  },
  {
    id: uuidv4(),
    campaignId: 'campaign-001',
    playerId: mockUsers[1].cognitoId,
    factionId: 'slaves-to-darkness',
    name: 'The Crimson Reavers',
    glory: 3,
    renown: 2,
  },
  {
    id: uuidv4(),
    campaignId: 'campaign-002',
    playerId: mockUsers[1].cognitoId,
    factionId: 'ossiarch-bonereapers',
    name: 'Legions of Nagash',
    glory: 7,
    renown: 4,
  },
  {
    id: uuidv4(),
    campaignId: 'campaign-002',
    playerId: mockUsers[0].cognitoId,
    factionId: 'flesh-eater-courts',
    name: 'The Ghoul Court',
    glory: 2,
    renown: 1,
  },
];

async function seed() {
  try {
    // Seed users
    console.log('Creating users...');
    for (const user of mockUsers) {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...keys.user(user.cognitoId),
            type: 'USER',
            cognitoId: user.cognitoId,
            email: user.email,
            name: user.name,
            googleId: user.googleId,
            createdAt: now,
            updatedAt: now,
          },
        })
      );
      console.log(`  ✓ ${user.name} (${user.email})`);
    }

    // Seed campaigns
    console.log('\nCreating campaigns...');
    for (const campaign of mockCampaigns) {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...keys.campaign(campaign.id),
            ...gsiKeys.campaignOwner(campaign.ownerId, campaign.id),
            type: 'CAMPAIGN',
            id: campaign.id,
            name: campaign.name,
            ownerId: campaign.ownerId,
            createdAt: now,
            updatedAt: now,
          },
        })
      );
      console.log(`  ✓ ${campaign.name}`);
    }

    // Seed armies
    console.log('\nCreating armies...');
    for (const army of mockArmies) {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...keys.army(army.campaignId, army.id),
            ...gsiKeys.armyOwner(army.playerId, army.id),
            type: 'ARMY',
            id: army.id,
            campaignId: army.campaignId,
            playerId: army.playerId,
            factionId: army.factionId,
            name: army.name,
            glory: army.glory,
            renown: army.renown,
            createdAt: now,
            updatedAt: now,
          },
        })
      );
      console.log(`  ✓ ${army.name} (${army.factionId})`);
    }

    console.log('\n✅ Mock data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Users: ${mockUsers.length}`);
    console.log(`   Campaigns: ${mockCampaigns.length}`);
    console.log(`   Armies: ${mockArmies.length}`);
    console.log('\n💡 Use these credentials to test:');
    mockUsers.forEach(u => {
      console.log(`   ${u.name}: ${u.email}`);
    });
    console.log('\n⚠️  Remember: Set ENABLE_MOCK_DATA=false before deploying to production!\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
