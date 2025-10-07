import { Amplify } from 'aws-amplify';

// Amplify configuration
// These values will be populated from environment variables at build time
// or from Terraform outputs in production
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || '',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [
            import.meta.env.VITE_APP_URL || 'http://localhost:5173',
          ],
          redirectSignOut: [
            import.meta.env.VITE_APP_URL || 'http://localhost:5173',
          ],
          responseType: 'code',
        },
      },
    },
  },
};

export function configureAmplify() {
  Amplify.configure(amplifyConfig);
}
