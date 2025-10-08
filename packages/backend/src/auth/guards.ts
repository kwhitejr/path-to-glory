import { GraphQLError } from 'graphql';
import { GraphQLContext } from './context.js';

/**
 * Ensure user is authenticated
 */
export function requireAuth(context: GraphQLContext): asserts context is GraphQLContext & { user: NonNullable<GraphQLContext['user']> } {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

/**
 * Ensure user owns the resource
 */
export function requireOwnership(
  context: GraphQLContext,
  resourceOwnerId: string
): void {
  requireAuth(context);

  if (context.user.cognitoId !== resourceOwnerId) {
    throw new GraphQLError('You do not have permission to access this resource', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}
