# Backend Package

GraphQL API for Path to Glory campaign tracker.

## Tech Stack

- **Apollo Server**: GraphQL server
- **DynamoDB**: Data storage (single-table design)
- **Cognito JWT**: Authentication
- **AWS Lambda**: Serverless deployment

## Local Development

### Prerequisites

1. Node.js >= 20
2. AWS CLI configured (for accessing Cognito)
3. Java (for DynamoDB Local)

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Get Cognito values from frontend infrastructure
cd ../../infrastructure/frontend
terraform output
# Copy COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID to .env

# Build TypeScript
npm run build
```

### Running Locally

```bash
# Start local DynamoDB + API server
npm run dev

# GraphQL Playground available at:
# http://localhost:4000/graphql
```

The local server includes:
- **DynamoDB Local** on port 8000 (in-memory)
- **GraphQL API** on port 4000
- **Auto-reload** on code changes (via serverless-offline)

### Seeding Data

```bash
# Seed mock campaigns and armies
npm run seed

# Or set ENABLE_MOCK_DATA=true in .env
# Mock data will be auto-loaded on startup
```

## Testing GraphQL API

### Using curl

```bash
# Get factions (no auth required)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ factions { id name grandAlliance } }"}'

# Get my armies (requires auth)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query":"{ myArmies { id name factionId glory } }"}'

# Create army (requires auth)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateArmy($input: CreateArmyInput!) { createArmy(input: $input) { id name glory } }",
    "variables": {
      "input": {
        "campaignId": "campaign-123",
        "factionId": "stormcast-eternals",
        "name": "The Thunder Guard"
      }
    }
  }'
```

### Getting a JWT Token

1. Log in to the frontend (http://localhost:5173)
2. Open browser DevTools > Application > Cookies
3. Copy the value of the Cognito ID token
4. Use it in Authorization header: `Bearer <token>`

Or use the Apollo Server Playground at http://localhost:4000/graphql and set headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## Project Structure

```
src/
├── auth/           # Cognito JWT verification and auth guards
├── db/             # DynamoDB client and utilities
│   ├── client.ts   # DynamoDB DocumentClient
│   ├── keys.ts     # Single-table key generation
│   └── models.ts   # TypeScript types for DynamoDB items
├── repositories/   # Data access layer
│   ├── ArmyRepository.ts
│   ├── CampaignRepository.ts
│   └── UserRepository.ts
├── resolvers/      # GraphQL resolvers
│   └── index.ts
├── handlers/       # Lambda handlers
│   └── graphql.ts  # Apollo Server Lambda handler
└── scripts/        # Utility scripts
    └── seed.ts     # Seed mock data
```

## DynamoDB Schema

Single-table design with composite keys:

| Entity   | PK                  | SK                      | GSI1PK          | GSI1SK           |
|----------|---------------------|-------------------------|-----------------|------------------|
| User     | USER#{cognitoId}    | METADATA                | -               | -                |
| Campaign | CAMPAIGN#{id}       | METADATA                | USER#{ownerId}  | CAMPAIGN#{id}    |
| Army     | CAMPAIGN#{id}       | ARMY#{armyId}           | USER#{playerId} | ARMY#{armyId}    |
| Unit     | CAMPAIGN#{id}       | ARMY#{armyId}#UNIT#{id} | -               | -                |
| Battle   | CAMPAIGN#{id}       | BATTLE#{timestamp}      | -               | -                |

## Authentication

All authenticated requests require a Cognito JWT token in the `Authorization` header:

```
Authorization: Bearer <cognito-id-token>
```

The GraphQL context automatically:
1. Verifies the JWT signature
2. Extracts user info (cognitoId, email, name)
3. Ensures user exists in DynamoDB
4. Provides user in resolver context

Resolvers use auth guards:
- `requireAuth(context)` - Ensures user is logged in
- `requireOwnership(context, ownerId)` - Ensures user owns the resource

## Deployment

Deployment is handled by Terraform and GitHub Actions. See:
- `infrastructure/backend/README.md` - Infrastructure details
- `.github/workflows/deploy-backend.yml` - CI/CD pipeline

Manual deployment:

```bash
# Build and package
npm run build
cd dist
zip -r ../lambda.zip .
cd ../../../infrastructure/backend

# Deploy via Terraform
terraform apply
```

## Troubleshooting

### DynamoDB Local won't start

```bash
# Install Java if needed
brew install openjdk

# Or disable DynamoDB Local and use AWS DynamoDB
# Remove serverless-dynamodb from serverless.yml plugins
```

### JWT verification fails

- Ensure `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID` match frontend
- Token must be from the same Cognito User Pool
- Token expires after 1 hour - get a fresh one

### Schema not loading

- Ensure shared package is built: `npm run build -w @path-to-glory/shared`
- Check schema path in `src/handlers/graphql.ts`
