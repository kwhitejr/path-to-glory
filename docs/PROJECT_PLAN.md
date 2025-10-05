# Path to Glory Campaign Tracker - Project Plan

## Overview
A web application for tracking Warhammer Age of Sigmar Path to Glory campaigns among friends.

## Tech Stack

### Frontend
- **Framework:** React with TypeScript
- **Build:** Vite or Next.js (static export)
- **Hosting:** AWS S3 + CloudFront
- **Design:** Mobile-first responsive (primary: mobile, secondary: desktop)
- **UI Library:** TailwindCSS or similar for responsive utilities

### Backend
- **Runtime:** Node.js with TypeScript
- **API:** GraphQL (Apollo Server)
- **Hosting:** AWS Lambda (serverless)
- **API Gateway:** AWS API Gateway (HTTP API)

### Database
- **Primary:** DynamoDB
- **Access:** AWS SDK v3

### Authentication
- **Provider:** Google OAuth 2.0 (Federated Login)
- **Service:** AWS Cognito User Pool with Google Identity Provider
- **Token Management:** JWT tokens issued by Cognito
- **Authorization:** API Gateway Lambda authorizer

### Infrastructure
- **IaC:** Terraform
- **Environment:** Production only

### CI/CD
- **Pipeline:** GitHub Actions
- **Deployments:** Automated to AWS

## Repository Structure

```
path-to-glory/
├── packages/
│   ├── frontend/          # React TypeScript app with Apollo Client
│   ├── backend/           # GraphQL Lambda (Apollo Server)
│   └── shared/            # Shared types, GraphQL schema, utils
├── infrastructure/        # Terraform configs
├── docs/
│   ├── references/        # Game rule PDFs
│   ├── PROJECT_PLAN.md
│   └── schemas/           # Data model & GraphQL schema docs
├── .github/workflows/     # CI/CD pipelines
└── package.json           # Monorepo root
```

## Phase 1: Roster Management Capability

### Core Features
1. **Army Creation** - Create new warbands with faction selection
2. **Unit Management** - Add/remove units to roster
3. **Unit Upgrades** - Track veteran abilities, enhancements, injuries
4. **Roster Validation** - Enforce composition rules (points, unit limits)

### DynamoDB Schema Design

#### Table Strategy
Single-table design with composite keys:

**Primary Table: `path-to-glory`**

| Entity | PK | SK | Attributes |
|--------|----|----|------------|
| User | `USER#<cognitoId>` | `METADATA` | email, name, googleId, createdAt |
| Campaign | `CAMPAIGN#<id>` | `METADATA` | name, createdAt, ownerId (cognitoId) |
| Army | `CAMPAIGN#<id>` | `ARMY#<armyId>` | playerId (cognitoId), faction, glory, renown |
| Unit | `CAMPAIGN#<id>` | `ARMY#<armyId>#UNIT#<unitId>` | unitType, size, veteranAbilities, injuries |
| Battle | `CAMPAIGN#<id>` | `BATTLE#<timestamp>` | armies, outcome, glory |

**GSI1: User Lookup**
- PK: `USER#<cognitoId>`
- SK: `CAMPAIGN#<id>` or `ARMY#<armyId>`

#### Reference Data Strategy
Faction rules, unit profiles, abilities stored as:
- **Option A:** Separate DynamoDB table (read-heavy, infrequent updates)
- **Option B:** S3 JSON files loaded at runtime (cheaper, cacheable)
- **Recommendation:** S3 + CloudFront for reference data

### PDF Extraction Priority (Roster Focus)

#### From "Path To Glory Roster.pdf"
- [ ] Faction list
- [ ] Starting glory/renown rules
- [ ] Unit composition rules
- [ ] Roster size limits

#### From "Core Rules.pdf"
- [ ] Battle sequence (for later battle recording)
- [ ] Glory point system
- [ ] Veteran abilities table

#### From "Battle Profiles.pdf"
- [ ] Unit stats (wounds, movement, save)
- [ ] Weapon profiles
- [ ] Keywords

#### From Faction Packs (e.g., Ossiarch Bonereapers)
- [ ] Faction-specific units
- [ ] Faction enhancements
- [ ] Faction quests

### Data Extraction Approach
1. Manual extraction into TypeScript type definitions
2. Create JSON files in `packages/shared/data/`
3. Type-safe access via barrel exports
4. Version control all extracted data

## Next Implementation Steps

1. **Monorepo Setup**
   - Initialize npm workspace
   - Configure TypeScript (shared config)
   - Setup ESLint + Prettier

2. **Schema Definition**
   - Define GraphQL schema (shared package)
   - Create TypeScript types for all entities
   - Define DynamoDB key structure
   - Document access patterns
   - Setup GraphQL Code Generator for type-safe client

3. **Authentication Setup**
   - Cognito User Pool configuration
   - Google OAuth app registration
   - Lambda authorizer implementation
   - Frontend auth flow (login, token management)

4. **Backend Scaffold**
   - Apollo Server setup for Lambda
   - GraphQL schema definition (typeDefs)
   - Resolvers implementation
   - DynamoDB data sources
   - Auth context from Cognito JWT
   - Roster queries & mutations

5. **Frontend Scaffold**
   - React app with routing
   - Mobile-first responsive layout
   - TailwindCSS setup with mobile breakpoints
   - Google Sign-In integration
   - Apollo Client setup
   - Auth context/hooks (token → Apollo headers)
   - GraphQL queries/mutations via codegen
   - Roster UI components (mobile-optimized)

6. **Infrastructure**
   - Terraform modules (Cognito, DynamoDB, Lambda, API Gateway, S3/CloudFront)
   - Google OAuth credentials management

7. **CI/CD**
   - Build pipeline
   - Test pipeline
   - Deploy to production on main branch merge

## Development Workflow

1. Local development: `npm run dev` (frontend + backend)
2. Backend runs via `serverless-offline` or similar
3. DynamoDB local for testing
4. PR checks: lint, type-check, test
5. Merge to main → auto-deploy to production

## GraphQL Schema Example

```graphql
# packages/shared/src/schema.graphql
type Army {
  id: ID!
  campaignId: ID!
  playerId: ID!
  faction: Faction!
  glory: Int!
  renown: Int!
  units: [Unit!]!
}

type Unit {
  id: ID!
  armyId: ID!
  unitType: String!
  size: Int!
  veteranAbilities: [String!]
  injuries: [String!]
}

type Query {
  army(id: ID!): Army
  campaign(id: ID!): Campaign
}

type Mutation {
  createArmy(input: CreateArmyInput!): Army!
  addUnit(armyId: ID!, input: AddUnitInput!): Unit!
  upgradeUnit(unitId: ID!, ability: String!): Unit!
}
```

## PDF Extraction Format Example

```typescript
// packages/shared/src/data/factions.ts
export const FACTIONS = {
  ossiarchBonereapers: {
    id: 'ossiarch-bonereapers',
    name: 'Ossiarch Bonereapers',
    startingGlory: 0,
    startingRenown: 1,
    units: [/* ... */],
    enhancements: [/* ... */],
  },
  // ...
} as const;
```
