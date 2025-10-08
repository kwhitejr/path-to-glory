import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { resolvers } from '../resolvers/index.js';
import { GraphQLContext, getUserFromToken } from '../auth/context.js';
import { UserRepository } from '../repositories/UserRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load GraphQL schema from shared package
const schemaPath = join(__dirname, '../../../shared/src/schema/schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf-8');

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  introspection: true, // Enable GraphQL Playground
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event }) => {
      const authHeader = event.headers?.authorization || event.headers?.Authorization;
      const user = await getUserFromToken(authHeader);

      // If user is authenticated, ensure they exist in database
      if (user) {
        const userRepo = new UserRepository();
        await userRepo.upsert({
          cognitoId: user.cognitoId,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
        });
      }

      return {
        user,
        repositories: {
          users: new UserRepository(),
        },
      };
    },
  }
);
