/**
 * GraphQL context available to all resolvers
 */
export interface GraphQLContext {
  /**
   * Authenticated user's Cognito ID (from JWT)
   */
  userId?: string;

  /**
   * Whether the request is authenticated
   */
  isAuthenticated: boolean;
}
