# Authentication Implementation

This document explains the authentication system for Path to Glory.

## Overview

The application uses **AWS Cognito** with **Google OAuth** for user authentication. Users sign in with their Google account, and their profile information (name, email, profile picture) is stored in Cognito and used throughout the app.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │─────▶│   Cognito    │─────▶│   Google    │
│  (React)    │◀─────│  User Pool   │◀─────│   OAuth     │
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │
       │                     │
       ▼                     ▼
┌─────────────┐      ┌──────────────┐
│  Amplify    │      │  Identity    │
│  Auth SDK   │      │    Pool      │
└─────────────┘      └──────────────┘
```

## Components

### 1. AWS Cognito (Infrastructure)

Defined in `infrastructure/frontend/cognito.tf`:

- **User Pool**: Manages user identities
- **User Pool Client**: OAuth client for the React app
- **Identity Pool**: Provides AWS credentials for authenticated users
- **Google Identity Provider**: Connects Cognito to Google OAuth
- **User Pool Domain**: Hosted UI domain for OAuth flows

### 2. Frontend Authentication (React)

#### Configuration

`packages/frontend/src/config/amplify.ts`:
- Configures Amplify with Cognito settings
- Uses environment variables for deployment flexibility

#### Auth Context

`packages/frontend/src/contexts/AuthContext.tsx`:
- Provides authentication state to entire app
- Exposes `user`, `login()`, `logout()` functions
- Automatically loads user session on mount

#### Header Component

`packages/frontend/src/components/Header.tsx`:
- Shows "Sign in with Google" button when not authenticated
- Displays user profile picture and name when authenticated
- Provides logout functionality

## User Flow

### Sign In

1. User clicks "Sign in with Google" button
2. Browser redirects to Cognito hosted UI
3. Cognito redirects to Google OAuth consent screen
4. User authorizes the app
5. Google redirects back to Cognito with auth code
6. Cognito exchanges code for tokens
7. User is redirected back to app with session
8. Frontend loads user profile and displays picture/name

### Authenticated Session

- User data is stored in `AuthContext`
- Profile picture appears in header
- Creator profile pictures shown on army cards (in "All Armies" view)
- "My Armies" filter uses authenticated user ID

### Sign Out

1. User clicks "Logout" button
2. `signOut()` clears Cognito session
3. User data removed from context
4. UI updates to show login button

## Profile Data

User profiles include:

```typescript
interface User {
  id: string;           // Cognito user ID (sub claim)
  email: string;        // From Google
  name: string;         // From Google
  picture?: string;     // Google profile picture URL
  username: string;     // Cognito username
}
```

This data comes from:
- **Google**: email, name, picture
- **Cognito**: id (sub), username

## Environment Variables

### Development (`.env.local`)

```env
VITE_APP_URL=http://localhost:5173
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx
VITE_COGNITO_DOMAIN=path-to-glory-auth.auth.us-east-1.amazoncognito.com
```

### Production (GitHub Actions)

Environment variables are automatically populated from Terraform outputs during deployment:

```yaml
env:
  VITE_APP_URL: https://ptg.kwhitejr.com
  VITE_COGNITO_USER_POOL_ID: ${{ steps.tf-outputs.outputs.cognito_user_pool_id }}
  VITE_COGNITO_USER_POOL_CLIENT_ID: ${{ steps.tf-outputs.outputs.cognito_user_pool_client_id }}
  VITE_COGNITO_IDENTITY_POOL_ID: ${{ steps.tf-outputs.outputs.cognito_identity_pool_id }}
  VITE_COGNITO_DOMAIN: ${{ steps.tf-outputs.outputs.cognito_domain }}.auth.us-east-1.amazoncognito.com
```

## Terraform Variables

Google OAuth credentials must be provided as Terraform variables:

### Via GitHub Secrets (Production)

Set in repository secrets:
- `TF_VAR_GOOGLE_CLIENT_ID`
- `TF_VAR_GOOGLE_CLIENT_SECRET`

### Via terraform.tfvars (Local)

```hcl
google_client_id     = "your-client-id.apps.googleusercontent.com"
google_client_secret = "your-client-secret"
```

**⚠️ Never commit this file!** It's already in `.gitignore`.

## Security Features

1. **OAuth 2.0 Authorization Code Flow**: Most secure OAuth flow
2. **HTTPS Only**: All OAuth redirects use HTTPS in production
3. **PKCE**: Cognito uses PKCE for additional security
4. **Token Storage**: Amplify securely stores tokens in browser
5. **Automatic Refresh**: Access tokens automatically refreshed
6. **Short Token Lifetime**: 60-minute access tokens, 30-day refresh tokens
7. **Federated Identity**: No passwords stored in our system

## UI Integration

### Header

- Shows user profile picture (or initials if no picture)
- Displays user name and email on desktop
- "Sign in with Google" button for unauthenticated users
- "Logout" button for authenticated users

### Army Cards

When viewing "All Armies":
- Creator's profile picture displayed next to army name
- Fallback to initials if no profile picture
- Shows "by [Player Name]" under army title

### Filtering

- "My Armies" view filters by authenticated user ID
- If not logged in, shows empty state
- "All Armies" shows all armies regardless of authentication

## Development Workflow

1. **Set up Google OAuth** (one-time):
   - Follow `docs/GOOGLE_OAUTH_SETUP.md`
   - Add credentials to Terraform variables

2. **Deploy Cognito infrastructure**:
   ```bash
   cd infrastructure/frontend
   terraform apply
   ```

3. **Get Cognito configuration**:
   ```bash
   terraform output
   ```

4. **Create `.env.local`** with Terraform outputs

5. **Run locally**:
   ```bash
   npm run dev
   ```

## Testing Authentication

### Manual Testing

1. Visit the app (local or production)
2. Click "Sign in with Google"
3. Authorize the app with Google
4. Verify:
   - Redirected back to app
   - Profile picture appears in header
   - Name and email shown
   - "My Armies" shows only your armies
   - Logout button works

### Common Issues

See `docs/GOOGLE_OAUTH_SETUP.md` Troubleshooting section.

## Future Enhancements

Potential improvements:

1. **Social features**: Friend lists, army sharing
2. **Permissions**: Role-based access control (admin, player)
3. **Account linking**: Support multiple OAuth providers
4. **Profile editing**: Custom display names, avatars
5. **Privacy settings**: Control army visibility
6. **Email notifications**: Campaign updates, battle reminders

## Related Documentation

- `docs/GOOGLE_OAUTH_SETUP.md` - Detailed Google OAuth configuration
- `infrastructure/frontend/cognito.tf` - Cognito infrastructure code
- `packages/frontend/src/contexts/AuthContext.tsx` - React auth implementation
