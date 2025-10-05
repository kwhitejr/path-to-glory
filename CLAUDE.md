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

1. Local dev: `npm run dev` (when implemented)
2. Backend: Use serverless-offline or similar
3. DynamoDB: Use DynamoDB Local for testing
4. GraphQL: Use GraphQL Code Generator for type-safe client code

## Phase 1: Roster Management

Initial capability focuses on:
- Army creation with faction selection
- Unit management (add/remove)
- Unit upgrades (veteran abilities, injuries)
- Roster validation (composition rules, limits)

See `docs/PROJECT_PLAN.md` for full implementation roadmap.
