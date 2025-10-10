import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { NodeEnv } from '@path-to-glory/shared';
import { resolvers } from '../resolvers/index.js';
import { GraphQLContext, getUserFromToken } from '../auth/context.js';
import { UserRepository } from '../repositories/UserRepository.js';
import typeDefs from '../../../shared/src/schema/schema.graphql';

const isDevelopment = process.env.NODE_ENV !== NodeEnv.PRODUCTION;

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for GraphQL clients
  plugins: [
    // Enable GraphiQL in development, Apollo Sandbox in production
    isDevelopment
      ? ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          includeCookies: true,
        })
      : ApolloServerPluginLandingPageProductionDefault({
          embed: true,
          graphRef: 'path-to-glory@current',
          includeCookies: true,
        }),
  ],
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
          picture: user.picture,
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
