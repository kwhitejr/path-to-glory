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

## Authentication

### Implementation Status
✅ **Fully Implemented** - Google OAuth via AWS Cognito

### Architecture
- **Provider**: Google OAuth (federated identity)
- **Identity Management**: AWS Cognito User Pool
- **Frontend SDK**: AWS Amplify Auth
- **User Attributes**: email, name, picture (profile photo)

### Authentication Flow
1. User clicks "Sign in with Google" button
2. Redirected to Cognito hosted UI
3. Cognito redirects to Google OAuth consent screen
4. User authorizes app
5. Google redirects to Cognito with auth code
6. Cognito exchanges code for JWT tokens
7. User redirected back to app with session
8. Frontend loads user profile and displays picture/name

### Setup Required
Before deployment:
1. Create Google OAuth credentials (see `docs/GOOGLE_OAUTH_SETUP.md`)
2. Add GitHub Secrets:
   - `TF_VAR_GOOGLE_CLIENT_ID`
   - `TF_VAR_GOOGLE_CLIENT_SECRET`
3. Deploy Cognito infrastructure via Terraform
4. Update Google OAuth redirect URI with actual Cognito domain

### Local Development
Create `packages/frontend/.env.local` with Cognito configuration:
```env
VITE_APP_URL=http://localhost:5173
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_COGNITO_DOMAIN=path-to-glory-auth.auth.us-east-1.amazoncognito.com
```

Get these values from: `cd infrastructure/frontend && terraform output`

### UI Integration
- Header shows user profile picture and name when authenticated
- "Sign in with Google" button when not authenticated
- Logout button for authenticated users
- Creator profile pictures on army cards (in "All Armies" view)
- "My Armies" filter uses authenticated user ID

### Documentation
- `docs/AUTHENTICATION.md` - Architecture and implementation details
- `docs/GOOGLE_OAUTH_SETUP.md` - Step-by-step OAuth setup guide

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

## Deployment

### Frontend Deployment
- **URL**: https://ptg.kwhitejr.com
- **Infrastructure**: Terraform (in `infrastructure/frontend/`)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy-frontend.yml`)
- **Hosting**: S3 + CloudFront + Route53
- **SSL**: ACM certificate (auto-validated via DNS)

**Deployment Process:**
1. Push to `main` branch triggers GitHub Actions
2. Frontend and shared packages are built
3. Terraform provisions/updates infrastructure
4. Build artifacts synced to S3
5. CloudFront cache invalidated
6. Site live at https://ptg.kwhitejr.com

**Manual Deployment:**
See `infrastructure/frontend/README.md` for manual deployment steps.

### Backend Deployment
- **URL**: https://api.kwhitejr.com/graphql (future)
- **Infrastructure**: Terraform (in `infrastructure/backend/`) - not yet implemented
- **Hosting**: AWS Lambda + API Gateway

## Phase 1: Roster Management (Current Focus)

### Implemented Features
- ✅ Army list view with faction info and filtering
- ✅ Create new army with faction selection
- ✅ Army detail view (Order of Battle)
- ✅ Mobile-first responsive UI
- ✅ Faction data ingestion from PDFs
- ✅ AWS deployment infrastructure (Terraform + GitHub Actions)
- ✅ Google OAuth authentication with Cognito
- ✅ User profile pictures in header and on army cards
- ✅ "My Armies" vs "All Armies" filtering

### Next Implementation Steps
- Backend GraphQL API implementation (Lambda + Apollo Server)
- DynamoDB integration for persistent data
- Connect frontend to real API (currently using mock data)
- Add/edit units in army roster
- Track Glory Points and Renown
- Manage enhancements and path abilities (based on `docs/references/forms/Path To Glory Roster.pdf`)

### Roster Data Structure (from PDF)
The roster tracks:
- **Army metadata**: Name, Faction, Realm of Origin, Glory Points, Battle Formation
- **Warlord**: Single commander unit with rank, renown, enhancements, path abilities
- **Units**: Multiple units with name, warscroll, rank, renown, reinforced status
- **Arcane Tome**: Spell/Prayer/Manifestation lores
- **Quest Log**: Current quest, quest points, completed quests
- **Background**: Army story and notable events

See `docs/PROJECT_PLAN.md` for full implementation roadmap.
