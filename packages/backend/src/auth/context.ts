import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { UserRepository } from '../repositories/UserRepository.js';

export interface AuthenticatedUser {
  cognitoId: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export interface GraphQLContext {
  user: AuthenticatedUser | null;
  repositories: {
    users: UserRepository;
  };
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

/**
 * Extract and verify Cognito JWT from Authorization header
 */
export async function getUserFromToken(
  authHeader?: string
): Promise<AuthenticatedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verifier.verify(token);

    return {
      cognitoId: payload.sub,
      email: payload.email as string,
      name: payload.name as string,
      picture: payload.picture as string | undefined,
      googleId: payload.identities?.[0]?.userId as string || payload.sub,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Ensure user exists in database, creating if necessary
 */
export async function ensureUserExists(
  user: AuthenticatedUser,
  userRepo: UserRepository
): Promise<void> {
  await userRepo.upsert({
    cognitoId: user.cognitoId,
    email: user.email,
    name: user.name,
    picture: user.picture,
    googleId: user.googleId,
  });
}
