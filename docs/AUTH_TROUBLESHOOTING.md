# Authentication Troubleshooting Guide

Common issues encountered during Google OAuth + AWS Cognito implementation and their solutions.

## Table of Contents
- [OAuth Flow Issues](#oauth-flow-issues)
- [Cognito Configuration Issues](#cognito-configuration-issues)
- [Token and Session Issues](#token-and-session-issues)
- [Debugging Tips](#debugging-tips)

---

## OAuth Flow Issues

### Issue: No tokens after OAuth redirect
**Symptoms:**
- User completes Google OAuth successfully
- Redirected back to app
- No user session established
- Console shows `hasTokens: false`

**Root Cause:**
App is auto-redirecting (e.g., from `/` to `/armies`) before Amplify can process the OAuth authorization code in the URL parameters.

**Solution:**
Implement smart routing that detects OAuth callback parameters:

```typescript
// In App.tsx
function RootRedirect() {
  const location = useLocation();
  const { loading } = useAuth();

  // Don't redirect if we have OAuth callback parameters
  const hasOAuthParams = location.search.includes('code=') || location.search.includes('error=');

  if (hasOAuthParams) {
    // Wait for auth to complete before redirecting
    if (!loading) {
      return <Navigate to="/armies" replace />;
    }
    // Show loading state while OAuth processes
    return <LoadingWidget />;
  }

  return <Navigate to="/armies" replace />;
}
```

---

### Issue: "redirect is coming from a different origin"
**Symptoms:**
- `InvalidOriginException: redirect is coming from a different origin`
- OAuth flow fails to start

**Root Cause:**
Stale OAuth state from a previous session is stored in localStorage/cookies with a different origin.

**Solution:**
Clear OAuth state before initiating new flow:

```typescript
const login = async () => {
  // Clear stale OAuth state
  try {
    await signOut({ global: false });
  } catch (e) {
    // Ignore if not signed in
  }

  await signInWithRedirect({ provider: 'Google' });
};
```

---

### Issue: User returned to wrong page after login
**Symptoms:**
- User clicks login from `/battles`
- After OAuth, redirected to `/armies` instead

**Root Cause:**
No return path tracking implemented.

**Solution:**
Save current path before OAuth redirect:

```typescript
// Before OAuth redirect
const currentPath = window.location.pathname + window.location.search;
localStorage.setItem('oauth_return_path', currentPath);

// After OAuth completes
const returnPath = localStorage.getItem('oauth_return_path') || '/armies';
localStorage.removeItem('oauth_return_path');
```

---

## Cognito Configuration Issues

### Issue: "user.email: Attribute cannot be updated"
**Symptoms:**
- OAuth flow completes
- Error in URL: `?error=invalid_request&error_description=user.email%3A+Attribute+cannot+be+updated`
- No user created in Cognito

**Root Cause:**
Custom schema defined with `mutable = false` on email attribute. Cognito interprets this as "cannot set during OAuth user creation."

**Solution:**
Remove custom schema for standard attributes:

```hcl
# ❌ WRONG - Don't define custom schema for standard attributes
schema {
  name                = "email"
  attribute_data_type = "String"
  required            = true
  mutable             = false  # This causes the error
}

# ✅ CORRECT - Let Cognito handle standard attributes
# Just use alias_attributes and auto_verified_attributes
resource "aws_cognito_user_pool" "main" {
  alias_attributes         = ["email", "preferred_username"]
  auto_verified_attributes = ["email"]

  # No schema block needed for email, name, picture
}
```

**Important:** Schema changes require recreating the User Pool (will lose existing users).

---

### Issue: "provider Google does not exist for User Pool"
**Symptoms:**
- Terraform apply fails
- Error: `InvalidParameterException: The provider Google does not exist`

**Root Cause:**
User Pool Client is created before Google Identity Provider, but Client references Google in `supported_identity_providers`.

**Solution:**
Add explicit dependency:

```hcl
resource "aws_cognito_user_pool_client" "main" {
  supported_identity_providers = ["Google"]

  # Ensure Google provider is created first
  depends_on = [aws_cognito_identity_provider.google]
}
```

---

### Issue: Redirect URI mismatch in Google OAuth
**Symptoms:**
- Google shows "redirect_uri_mismatch" error
- OAuth flow fails at Google consent screen

**Root Cause:**
Google OAuth credentials don't have the correct Cognito callback URL.

**Solution:**
Ensure Google OAuth authorized redirect URI includes:
```
https://path-to-glory-auth.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
```

**Note:** Must be exact match including:
- `https://` protocol
- Full Cognito domain
- `/oauth2/idpresponse` path

---

## Token and Session Issues

### Issue: "Access Token does not have required scopes"
**Symptoms:**
- OAuth completes successfully
- Tokens are present (`hasTokens: true`)
- Error when calling `getCurrentUser()` or `fetchUserAttributes()`
- `NotAuthorizedException: Access Token does not have required scopes`

**Root Cause:**
Missing `aws.cognito.signin.user.admin` scope in OAuth configuration.

**Solution:**
Add scope to both Cognito and Amplify config:

```hcl
# Terraform - Cognito User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"  # Required for user attributes
  ]
}
```

```typescript
// Frontend - Amplify config
export const amplifyConfig = {
  Auth: {
    Cognito: {
      loginWith: {
        oauth: {
          scopes: [
            'email',
            'openid',
            'profile',
            'aws.cognito.signin.user.admin'  // Required for user attributes
          ]
        }
      }
    }
  }
};
```

---

### Issue: Tokens not persisting across page reloads
**Symptoms:**
- User logs in successfully
- Refresh page → logged out again

**Root Cause:**
Browser privacy settings blocking cookies/localStorage (common in Brave, Safari).

**Solution:**
1. **For Development:** Disable browser shields/tracking prevention for your domain
2. **For Production:** Ensure cookies are set with correct attributes:
   - `SameSite=Lax` or `SameSite=None; Secure`
   - `Secure` flag for HTTPS
   - Correct domain attribute

Amplify handles this automatically, but browser extensions or privacy settings may still block.

---

## Debugging Tips

### Enable Detailed Logging

Add these logs to track OAuth flow:

```typescript
// 1. Log Amplify configuration
console.log('Amplify Config:', {
  userPoolId: amplifyConfig.Auth.Cognito.userPoolId,
  domain: amplifyConfig.Auth.Cognito.loginWith.oauth.domain,
  redirectSignIn: amplifyConfig.Auth.Cognito.loginWith.oauth.redirectSignIn,
});

// 2. Log OAuth callback detection
console.log('[App] Current URL:', window.location.href);
console.log('[App] URL has OAuth params:', window.location.href.includes('code='));

// 3. Log Hub events
Hub.listen('auth', ({ payload }) => {
  console.log('[AuthContext] Hub event:', payload.event, payload);
});

// 4. Log session state
const session = await fetchAuthSession();
console.log('[AuthContext] Session check:', {
  hasTokens: !!session.tokens,
  hasIdToken: !!session.tokens?.idToken,
  hasAccessToken: !!session.tokens?.accessToken,
});
```

### Inspect Network Traffic

Use browser DevTools Network tab to inspect:

1. **OAuth Initiation:**
   - Look for redirect to `*.amazoncognito.com/oauth2/authorize`
   - Check `redirect_uri` parameter matches Cognito config

2. **OAuth Callback:**
   - Look for redirect back to your app with `code=` parameter
   - Check for any error parameters in URL

3. **Token Exchange:**
   - Look for POST to `cognito-idp.*.amazonaws.com`
   - Check for 400/401 responses indicating scope or permission issues

### Export HAR File

For complex issues, export a HAR file:
1. Open DevTools → Network tab
2. Complete the OAuth flow
3. Right-click → "Save all as HAR with content"
4. Analyze the request/response chain

### Check Cognito User Pool

Verify configuration via AWS CLI:

```bash
# Check callback URLs
aws cognito-idp describe-user-pool-client \
  --user-pool-id us-east-1_XXXXXXXXX \
  --client-id YOUR_CLIENT_ID \
  --query 'UserPoolClient.{CallbackURLs:CallbackURLs,AllowedOAuthScopes:AllowedOAuthScopes}'

# Check identity providers
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_XXXXXXXXX \
  --query 'UserPool.{SupportedIdentityProviders:SupportedIdentityProviders}'
```

---

## Quick Reference

### Successful OAuth Flow Logs

When working correctly, you should see this sequence:

```
[App] OAuth callback detected, not redirecting
[AuthContext] Loading user...
[AuthContext] Current URL: https://app.com/?code=XXX&state=XXX
[AuthContext] URL has OAuth params: true
[AuthContext] Hub event: signInWithRedirect
[AuthContext] Hub event: signedIn
[AuthContext] Session check: {hasTokens: true, hasIdToken: true, hasAccessToken: true}
[AuthContext] User loaded successfully: {userId: '...', email: '...', name: '...'}
[AuthContext] Loading complete. User: logged in
[App] OAuth processing complete, redirecting to: /armies
```

### Required Environment Variables

```env
VITE_APP_URL=https://your-domain.com
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
```

### Required GitHub Secrets

```
TF_VAR_GOOGLE_CLIENT_ID
TF_VAR_GOOGLE_CLIENT_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ROLE_TO_ASSUME
```

---

## Getting Help

If you encounter an issue not covered here:

1. Check browser console for errors
2. Export HAR file from Network tab
3. Check CloudWatch logs for Lambda errors (backend)
4. Review Cognito User Pool settings in AWS Console
5. Verify Google OAuth configuration in Google Cloud Console

Remember: OAuth debugging often requires checking configuration in multiple places:
- Frontend code (Amplify config)
- Terraform (Cognito config)
- Google Cloud Console (OAuth credentials)
- Browser DevTools (network requests, cookies, localStorage)
