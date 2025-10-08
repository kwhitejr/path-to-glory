# Backend Setup Guide

Complete guide to setting up and running the Path to Glory backend locally and in production.

## Overview

The backend is a GraphQL API built with:
- **Apollo Server** - GraphQL server
- **AWS Lambda** - Serverless compute
- **API Gateway HTTP API** - GraphQL endpoint at `https://ptg.kwhitejr.com/graphql`
- **DynamoDB** - Single-table data storage
- **Cognito** - JWT authentication

## Prerequisites

1. **Node.js** >= 20
2. **AWS CLI** configured with credentials
3. **Java** (for DynamoDB Local) - `brew install openjdk`
4. **Terraform** >= 1.0
5. **Cognito User Pool** (already deployed from frontend)

## Local Development Setup

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Build Shared Package

The backend depends on the shared package for GraphQL schema and faction data:

```bash
npm run build -w @path-to-glory/shared
```

### 3. Configure Environment

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` and fill in Cognito values:

```bash
# Get Cognito configuration from frontend infrastructure
cd ../../infrastructure/frontend
terraform output

# Copy these values to packages/backend/.env:
# - cognito_user_pool_id → COGNITO_USER_POOL_ID
# - cognito_client_id → COGNITO_CLIENT_ID
```

Your `.env` should look like:

```env
DYNAMODB_TABLE=path-to-glory-dev
IS_OFFLINE=true
COGNITO_USER_POOL_ID=us-east-1_YourPoolId
COGNITO_CLIENT_ID=your-client-id
ENABLE_MOCK_DATA=true
```

### 4. Build Backend

```bash
cd packages/backend
npm run build
```

### 5. Start Local Server

```bash
npm run dev
```

This starts:
- **DynamoDB Local** on port 8000 (in-memory)
- **GraphQL API** on port 4000
- **Auto-reload** on code changes

GraphQL Playground: http://localhost:4000/graphql

### 6. Seed Mock Data (Optional)

```bash
# In another terminal
npm run seed
```

This creates mock users, campaigns, and armies for testing.

## Testing the API

### Option 1: GraphQL Playground

1. Open http://localhost:4000/graphql
2. Run queries:

```graphql
# Get all factions (no auth required)
query GetFactions {
  factions {
    id
    name
    grandAlliance
    startingGlory
    startingRenown
  }
}

# Get my armies (requires auth)
query GetMyArmies {
  myArmies {
    id
    name
    factionId
    glory
    renown
  }
}

# Create army (requires auth)
mutation CreateArmy {
  createArmy(input: {
    campaignId: "campaign-001"
    factionId: "stormcast-eternals"
    name: "The Thunderborn"
  }) {
    id
    name
    glory
    renown
  }
}
```

3. Add auth header (HTTP Headers panel):

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Option 2: curl

```bash
# No auth required
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ factions { id name } }"}'

# With auth
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query":"{ myArmies { id name } }"}'
```

### Getting a JWT Token

You need a real Cognito JWT token to test authenticated endpoints:

**Option A: From Frontend**
1. Start frontend: `npm run dev -w @path-to-glory/frontend`
2. Login with Google at http://localhost:5173
3. Open DevTools > Application > Cookies
4. Find `CognitoIdentityServiceProvider.{clientId}.{userId}.idToken`
5. Copy the value

**Option B: AWS CLI**
```bash
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id YOUR_CLIENT_ID \
  --auth-parameters USERNAME=test@example.com,PASSWORD=YourPassword
```

## Full Stack Local Development

To run frontend + backend together:

```bash
# Terminal 1: Backend
cd packages/backend
npm run dev

# Terminal 2: Frontend
cd packages/frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/graphql
- DynamoDB Local: http://localhost:8000

The frontend `.env.local` should have:
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

## Production Deployment

### Prerequisites

1. **AWS Account** with credentials configured
2. **Terraform State** bucket already set up (from bootstrap)
3. **GitHub Secrets** configured:
   - `AWS_ROLE_ARN` or `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`
   - `COGNITO_USER_POOL_ID`
   - `COGNITO_CLIENT_ID`

### Manual Deployment

```bash
# 1. Build backend
cd packages/backend
npm run build

# 2. Package Lambda
cd dist
zip -r ../lambda.zip .
cd ..
npm ci --production
cd node_modules
zip -r ../lambda.zip .
cd ..

# 3. Deploy infrastructure
cd ../../infrastructure/backend
terraform init
terraform plan
terraform apply
```

### GitHub Actions Deployment

Deployment automatically triggers on push to `main` when these paths change:
- `packages/backend/**`
- `packages/shared/**`
- `infrastructure/backend/**`

Or manually trigger:
```bash
gh workflow run deploy-backend.yml
```

### Post-Deployment Verification

```bash
# Get GraphQL URL
cd infrastructure/backend
terraform output graphql_url

# Test endpoint
curl -X POST https://ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ factions { id name } }"}'
```

## Monitoring & Debugging

### CloudWatch Logs

```bash
# Lambda function logs
aws logs tail /aws/lambda/path-to-glory-graphql --follow

# API Gateway logs
aws logs tail /aws/apigateway/path-to-glory --follow
```

### DynamoDB Console

```bash
# List items in table
aws dynamodb scan --table-name path-to-glory-prod --limit 10

# Query user's armies
aws dynamodb query \
  --table-name path-to-glory-prod \
  --index-name GSI1 \
  --key-condition-expression "GSI1PK = :pk AND begins_with(GSI1SK, :sk)" \
  --expression-attribute-values '{":pk":{"S":"USER#google-oauth2|123"},":sk":{"S":"ARMY#"}}'
```

### Local DynamoDB Admin

```bash
# Install admin UI
npm install -g dynamodb-admin

# Run (while serverless offline is running)
DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin
```

Open http://localhost:8001

## Troubleshooting

### DynamoDB Local Won't Start

```bash
# Make sure Java is installed
java -version

# If not: brew install openjdk

# Clear serverless cache
rm -rf .serverless
```

### JWT Verification Fails

- Ensure `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID` match frontend
- Token expires after 1 hour - get a fresh one
- Check token is from same Cognito User Pool

### Schema Not Found

```bash
# Rebuild shared package
npm run build -w @path-to-glory/shared

# Rebuild backend
npm run build -w @path-to-glory/backend
```

### Module Resolution Errors

```bash
# Ensure package.json has "type": "module"
# All imports must use .js extension (even for .ts files)

# Example:
import { keys } from '../db/keys.js'  // ✅ Correct
import { keys } from '../db/keys'     // ❌ Wrong
```

## Architecture Details

### Single-Table DynamoDB Design

All entities stored in one table with composite keys:

| Entity   | PK                | SK                    | Access Pattern           |
|----------|-------------------|-----------------------|--------------------------|
| User     | USER#{cognitoId}  | METADATA              | Get user by Cognito ID   |
| Campaign | CAMPAIGN#{id}     | METADATA              | Get campaign by ID       |
| Army     | CAMPAIGN#{id}     | ARMY#{armyId}         | Get army by campaign+ID  |
| Unit     | CAMPAIGN#{id}     | ARMY#{id}#UNIT#{id}   | Get units for army       |

GSI1 for user-centric queries:
- Get all campaigns owned by user
- Get all armies owned by user

### Authentication Flow

1. User logs in via frontend (Google OAuth + Cognito)
2. Frontend stores JWT in Amplify session
3. Apollo Client fetches JWT from session
4. JWT sent in `Authorization: Bearer <token>` header
5. Lambda handler verifies JWT with `aws-jwt-verify`
6. User info extracted and added to GraphQL context
7. Resolvers use `requireAuth()` and `requireOwnership()` guards

### Cost Optimization

- **DynamoDB**: Pay-per-request (no idle costs)
- **Lambda**: 1M free requests/month
- **API Gateway HTTP API**: $1/million requests
- **CloudWatch Logs**: 7-day retention

Expected cost: **< $5/month** for small-scale usage

## Next Steps

1. ✅ Backend infrastructure deployed
2. ✅ Create army functionality working
3. 🔲 Add unit management (add/edit/remove units)
4. 🔲 Implement battles and glory tracking
5. 🔲 Add campaign management features

See `docs/PROJECT_PLAN.md` for full roadmap.
