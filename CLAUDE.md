# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Path to Glory Campaign Tracker - A web application for tracking Warhammer Age of Sigmar Path to Glory campaigns among friends.

## Architecture

### Monorepo Structure
- **packages/frontend** - React TypeScript app with Apollo Client (mobile-first responsive)
- **packages/backend** - GraphQL API (Apollo Server) on AWS Lambda
- **packages/shared** - Shared TypeScript types, GraphQL schema, game data
- **infrastructure** - Terraform configs for AWS resources
- **docs/references** - Game rule PDFs for data extraction

### Tech Stack
- **Frontend**: React + TypeScript + Apollo Client + TailwindCSS (mobile-first)
- **Backend**: Node.js + TypeScript + Apollo Server + AWS Lambda
- **API**: GraphQL (all frontend-backend communication)
- **Database**: DynamoDB (single-table design)
- **Auth**: AWS Cognito with Google OAuth federated login
- **Infrastructure**: Terraform
- **CI/CD**: GitHub Actions → Production on main merge

### Key Design Decisions
1. **Mobile-first**: Primary view is mobile, desktop is secondary
2. **GraphQL**: All API communication uses GraphQL (not REST)
3. **Single Environment**: Production only (no dev/staging)
4. **Single-table DynamoDB**: All entities in one table with composite keys
5. **Serverless**: Backend runs on Lambda, frontend on S3+CloudFront

## DynamoDB Schema

Single-table design with composite keys:

**Primary Table: `path-to-glory`**
- User: PK=`USER#<cognitoId>` SK=`METADATA`
- Campaign: PK=`CAMPAIGN#<id>` SK=`METADATA`
- Army: PK=`CAMPAIGN#<id>` SK=`ARMY#<armyId>`
- Unit: PK=`CAMPAIGN#<id>` SK=`ARMY#<armyId>#UNIT#<unitId>`
- Battle: PK=`CAMPAIGN#<id>` SK=`BATTLE#<timestamp>`

**GSI1: User Lookup**
- PK: `USER#<cognitoId>`
- SK: `CAMPAIGN#<id>` or `ARMY#<armyId>`

## Game Data Management

Reference data (factions, units, abilities) extracted from PDFs in `docs/references/`:
- Manually extract into TypeScript types in `packages/shared/data/`
- Store as version-controlled JSON files
- Serve via S3 + CloudFront (not DynamoDB) for cost efficiency
- Type-safe access via barrel exports

Priority extraction order (roster management focus):
1. Path To Glory Roster.pdf - faction lists, glory/renown, composition rules
2. Battle Profiles.pdf - unit stats, weapon profiles
3. Faction Packs - faction-specific units/enhancements
4. Core Rules.pdf - battle sequence, glory system

## GraphQL Schema Location

GraphQL schema lives in **packages/shared/src/schema.graphql** and is shared between:
- Backend resolvers (Apollo Server)
- Frontend queries/mutations (Apollo Client + GraphQL Code Generator)

## Authentication Flow

1. User signs in with Google via Cognito hosted UI
2. Cognito issues JWT tokens
3. Frontend includes JWT in Apollo Client headers
4. API Gateway Lambda authorizer validates JWT
5. Backend resolvers receive auth context (cognitoId) for authorization

## Development Workflow

### Build Commands
```bash
# Build all packages
npm run build

# Build specific package
npm run build -w @path-to-glory/shared
npm run build -w @path-to-glory/frontend

# Run faction ingestion
npm run ingest:factions

# Frontend development (when backend is ready)
npm run dev -w @path-to-glory/frontend
```

### Development Setup
1. **Shared package**: Build first (`npm run build -w @path-to-glory/shared`)
2. **Frontend**: Runs on Vite dev server (port 3000)
3. **Backend**: Use serverless-offline or similar (port 4000)
4. **DynamoDB**: Use DynamoDB Local for testing
5. **GraphQL Codegen**: Run after schema changes

## Phase 1: Roster Management (Current Focus)

### Implemented Features
- ✅ Army list view with faction info
- ✅ Create new army with faction selection
- ✅ Army detail view (Order of Battle)
- ✅ Mobile-first responsive UI
- ✅ Faction data ingestion from PDFs

### Next Implementation Steps
- Add/edit units in army roster
- Track Glory Points and Renown
- Manage enhancements and path abilities (based on `docs/references/forms/Path To Glory Roster.pdf`)
- Backend GraphQL API implementation
- Connect frontend to real API (currently using mock data)

### Roster Data Structure (from PDF)
The roster tracks:
- **Army metadata**: Name, Faction, Realm of Origin, Glory Points, Battle Formation
- **Warlord**: Single commander unit with rank, renown, enhancements, path abilities
- **Units**: Multiple units with name, warscroll, rank, renown, reinforced status
- **Arcane Tome**: Spell/Prayer/Manifestation lores
- **Quest Log**: Current quest, quest points, completed quests
- **Background**: Army story and notable events

See `docs/PROJECT_PLAN.md` for full implementation roadmap.
