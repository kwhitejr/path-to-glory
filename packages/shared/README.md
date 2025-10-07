# @path-to-glory/shared

Shared TypeScript types, GraphQL schema, and game data for Path to Glory.

## Contents

- **GraphQL Schema** (`src/schema/schema.graphql`) - API contract
- **Type Definitions** (`src/types/`) - TypeScript types and Zod schemas
- **Game Data** (`src/data/`) - Extracted faction data from PDFs
- **Scripts** (`scripts/`) - Data ingestion utilities

## Usage

### Generate GraphQL Types

```bash
npm run codegen
```

Generates TypeScript types from the GraphQL schema into `src/types/graphql.ts`.

### Ingest Faction Data

```bash
npm run ingest:factions
```

Processes PDF files in `docs/references/factions/` and generates `src/data/factions.json`.

**Note**: The ingestion script performs automated extraction but requires manual verification of:
- Grand Alliance assignments
- Starting Glory values
- Starting Renown values
- Faction descriptions

## Adding a New Faction

1. Add the faction PDF to `docs/references/factions/`
2. Run `npm run ingest:factions`
3. Manually verify and update the generated data in `src/data/factions.json`
4. Commit the changes
