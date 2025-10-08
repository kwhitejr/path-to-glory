# Backend Quick Start

Get the Path to Glory backend running in 5 minutes.

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Shared Package

```bash
npm run build -w @path-to-glory/shared
```

### 3. Configure Backend

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` and add Cognito credentials:

```bash
# Get from frontend infrastructure
cd ../../infrastructure/frontend
terraform output

# Copy values to packages/backend/.env:
# cognito_user_pool_id → COGNITO_USER_POOL_ID
# cognito_client_id → COGNITO_CLIENT_ID
```

Your `.env` should look like:

```env
DYNAMODB_TABLE=path-to-glory-dev
IS_OFFLINE=true
COGNITO_USER_POOL_ID=us-east-1_YourPoolId
COGNITO_CLIENT_ID=abc123def456
ENABLE_MOCK_DATA=true
```

### 4. Build Backend

```bash
cd ../../packages/backend
npm run build
```

### 5. Start Server

```bash
npm run dev
```

GraphQL Playground: http://localhost:4000/graphql

### 6. Seed Mock Data (Optional)

In another terminal:

```bash
cd packages/backend
npm run seed
```

## Test the API

### GraphQL Playground

1. Open http://localhost:4000/graphql
2. Run this query:

```graphql
query {
  factions {
    id
    name
    grandAlliance
  }
}
```

### With Authentication

To test authenticated endpoints, you need a JWT token:

1. Start frontend: `npm run dev -w @path-to-glory/frontend`
2. Login at http://localhost:5173
3. Open DevTools > Application > Cookies
4. Find `CognitoIdentityServiceProvider.{clientId}.{userId}.idToken`
5. Copy the value

In GraphQL Playground, add to HTTP Headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

Now test authenticated queries:

```graphql
query {
  me {
    id
    email
    name
  }
  myArmies {
    id
    name
    factionId
    glory
  }
}

mutation {
  createArmy(input: {
    campaignId: "campaign-001"
    factionId: "stormcast-eternals"
    name: "The Thunderborn"
  }) {
    id
    name
    glory
  }
}
```

## Full Stack Development

Run backend + frontend together:

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
- DynamoDB Admin: http://localhost:8001 (install with `npm i -g dynamodb-admin`)

## Production Deployment

### Prerequisites

Ensure GitHub secrets are set:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ROLE_TO_ASSUME`
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`

### Deploy

```bash
# Commit your changes
git add .
git commit -m "Add backend infrastructure"
git push origin main
```

GitHub Actions will automatically deploy to production.

Or deploy manually:

```bash
# Build and package
cd packages/backend
npm run build
cd dist
zip -r ../lambda.zip .

# Deploy infrastructure
cd ../../infrastructure/backend
terraform init
terraform plan
terraform apply
```

### Verify Production

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ factions { id name } }"}'
```

## Troubleshooting

**DynamoDB Local won't start:**
```bash
brew install openjdk
```

**JWT verification fails:**
- Ensure COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID match frontend
- Get a fresh token (expires after 1 hour)

**Schema not found:**
```bash
npm run build -w @path-to-glory/shared
npm run build -w @path-to-glory/backend
```

**Module errors:**
- All imports must use `.js` extension
- Example: `import { keys } from '../db/keys.js'`

## Documentation

- `packages/backend/README.md` - Detailed usage guide
- `docs/BACKEND_SETUP.md` - Complete setup walkthrough
- `docs/BACKEND_SUMMARY.md` - Architecture and implementation details
- `infrastructure/backend/README.md` - Infrastructure documentation

## What's Working

✅ GraphQL API (local + production)
✅ Create/Read/Update armies
✅ Cognito authentication
✅ User ownership validation
✅ DynamoDB single-table design
✅ Terraform infrastructure
✅ CI/CD pipeline

## Next Steps

1. Test create army functionality locally
2. Deploy to production
3. Connect frontend to real backend
4. Implement unit management (future iteration)

For questions, see the full documentation in `docs/BACKEND_SETUP.md`.
