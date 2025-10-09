# API Testing Guide

This document shows how to test the Path to Glory GraphQL API.

## Base URL

```
https://api.ptg.kwhitejr.com/graphql
```

## Authentication

Protected mutations and queries require a JWT token from AWS Cognito in the `Authorization` header:

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query":"..."}'
```

## Public Queries (No Auth Required)

### Get All Factions

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ factions { id name grandAlliance startingGlory startingRenown } }"
  }'
```

### Get Specific Faction

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ faction(id: \"stormcast-eternals\") { id name grandAlliance } }"
  }'
```

## Protected Queries (Auth Required)

### Get Current User

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "{ me { id email name } }"
  }'
```

### Get My Campaigns

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "{ myCampaigns { id name createdAt armies { id name } } }"
  }'
```

### Get My Armies with Units

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "{ myArmies { id name glory renown faction { name } units { id name size wounds veteranAbilities } } }"
  }'
```

## Mutations (Auth Required)

### Create Campaign

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { createCampaign(input: { name: \"My Campaign\" }) { id name createdAt } }"
  }'
```

### Create Army

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { createArmy(input: { campaignId: \"CAMPAIGN_ID\", factionId: \"stormcast-eternals\", name: \"Thunder Warband\" }) { id name glory renown } }"
  }'
```

### Add Unit to Army

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { addUnit(armyId: \"ARMY_ID\", input: { unitTypeId: \"liberators\", name: \"Shield Wall\", size: 5, wounds: 10 }) { id name size wounds } }"
  }'
```

### Update Unit

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { updateUnit(id: \"UNIT_ID\", input: { wounds: 8 }) { id name wounds } }"
  }'
```

### Add Veteran Ability

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { addVeteranAbility(unitId: \"UNIT_ID\", ability: \"Hardened Fighter\") { id veteranAbilities } }"
  }'
```

### Remove Unit

```bash
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { removeUnit(id: \"UNIT_ID\") }"
  }'
```

## Complex Queries

### Get Army with Full Details

```graphql
query GetArmy($id: ID!) {
  army(id: $id) {
    id
    name
    glory
    renown
    faction {
      id
      name
      grandAlliance
    }
    player {
      name
      email
    }
    campaign {
      id
      name
    }
    units {
      id
      name
      unitTypeId
      size
      wounds
      veteranAbilities
      injuries
      enhancements
      createdAt
    }
  }
}
```

### Create Complete Army with Units

This would require multiple mutations in sequence:

1. Create campaign
2. Create army in campaign
3. Add units to army
4. Query army to verify

Example flow:

```bash
# 1. Create campaign
CAMPAIGN_ID=$(curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"mutation { createCampaign(input: { name: \"Test Campaign\" }) { id } }"}' \
  | jq -r '.data.createCampaign.id')

# 2. Create army
ARMY_ID=$(curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"query\":\"mutation { createArmy(input: { campaignId: \\\"$CAMPAIGN_ID\\\", factionId: \\\"stormcast-eternals\\\", name: \\\"Thunder Warband\\\" }) { id } }\"}" \
  | jq -r '.data.createArmy.id')

# 3. Add unit
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"query\":\"mutation { addUnit(armyId: \\\"$ARMY_ID\\\", input: { unitTypeId: \\\"liberators\\\", name: \\\"Shield Wall\\\", size: 5, wounds: 10 }) { id name } }\"}"

# 4. Query army with units
curl -X POST https://api.ptg.kwhitejr.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"query\":\"{ army(id: \\\"$ARMY_ID\\\") { name units { name size wounds } } }\"}"
```

## Error Responses

### Authentication Error

```json
{
  "errors": [{
    "message": "Authentication required",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```

### Not Found

```json
{
  "data": {
    "army": null
  }
}
```

### Validation Error

```json
{
  "errors": [{
    "message": "Army not found"
  }]
}
```
