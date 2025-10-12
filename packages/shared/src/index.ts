/**
 * Shared package barrel exports
 */

// Enums
export * from './enums.js';

// Constants
export * from './constants/keywords.js';

// Types
export * from './types/faction.js';
export * from './types/models.js';
export * from './types/context.js';
export * from './types/unit.js';

// GraphQL types (generated - will be available after running codegen)
// export * from './types/graphql.js';

// Data (all static game data consolidated in data/ directory)
export * from '../data/index.js';
