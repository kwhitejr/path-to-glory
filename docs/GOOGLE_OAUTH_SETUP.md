# Google OAuth Setup Guide

This guide explains how to configure Google OAuth for AWS Cognito authentication.

## Prerequisites

- Google Cloud Platform account
- AWS account with Cognito User Pool created

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

Visit: https://console.cloud.google.com/

### 1.2 Create or Select a Project

1. Click the project dropdown at the top of the page
2. Click "New Project" or select an existing project
3. Name it something like "Path to Glory" (if creating new)

### 1.3 Enable Google+ API

1. Navigate to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click "Enable"

### 1.4 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Path to Glory
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. On "Scopes" page, click "Add or Remove Scopes"
7. Select these scopes:
   - `email`
   - `profile`
   - `openid`
8. Click "Save and Continue"
9. Add test users if still in testing mode (optional)
10. Review and click "Back to Dashboard"

### 1.5 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "Path to Glory Web Client"
5. Add Authorized JavaScript origins:
   ```
   https://ptg.kwhitejr.com
   ```
6. Add Authorized redirect URIs:
   ```
   https://path-to-glory-auth.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```

   **Note**: Replace `path-to-glory-auth` with your actual Cognito domain name from Terraform outputs.

7. Click "Create"
8. **Save the Client ID and Client Secret** - you'll need these!

## Step 2: Configure Terraform Variables

You need to provide the Google OAuth credentials to Terraform.

### Option 1: Environment Variables (Recommended for CI/CD)

Add these secrets to GitHub Actions:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add new repository secrets:
   - `TF_VAR_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `TF_VAR_GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

The workflow will automatically use these when running Terraform.

### Option 2: Terraform Variables File (For Local Development)

Create a file `infrastructure/frontend/terraform.tfvars`:

```hcl
google_client_id     = "your-client-id.apps.googleusercontent.com"
google_client_secret = "your-client-secret"
```

**⚠️ Important**: This file is already in `.gitignore`. Never commit it to git!

## Step 3: Deploy Infrastructure

Once the Google OAuth credentials are configured:

### Via GitHub Actions (Recommended)

1. Push changes to trigger the deployment workflow
2. The workflow will:
   - Create Cognito resources with Google provider
   - Build frontend with Cognito configuration
   - Deploy to S3/CloudFront

### Manually (Local Testing Only)

```bash
cd infrastructure/frontend

# Initialize Terraform (first time only)
terraform init

# Plan changes
terraform plan

# Apply changes (creates Cognito resources)
terraform apply

# Get outputs
terraform output
```

## Step 4: Update Google OAuth Redirect URI

After Terraform creates the Cognito domain, you may need to update the redirect URI in Google Cloud Console:

1. Run `terraform output cognito_auth_url` to get your Cognito domain
2. The redirect URI should be:
   ```
   https://YOUR-COGNITO-DOMAIN.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
3. Go back to Google Cloud Console > Credentials
4. Edit your OAuth client
5. Verify the redirect URI matches the Cognito domain
6. Save changes

## Step 5: Test Authentication

1. Visit https://ptg.kwhitejr.com
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorizing, you'll be redirected back to the app
5. Your profile picture and name should appear in the header

## Troubleshooting

### "redirect_uri_mismatch" Error

**Cause**: The redirect URI in Google Cloud Console doesn't match the one Cognito is using.

**Fix**:
1. Check the Cognito domain: `terraform output cognito_auth_url`
2. Update the redirect URI in Google Cloud Console to match exactly
3. Format: `https://YOUR-DOMAIN.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`

### "Access Denied" After Login

**Cause**: App might still be in testing mode and user isn't added as test user.

**Fix**:
1. Go to Google Cloud Console > OAuth consent screen
2. Either:
   - Add your email as a test user, OR
   - Publish the app (remove testing mode)

### User Attributes Not Syncing

**Cause**: Cognito attribute mapping might be incorrect.

**Fix**: Check `infrastructure/frontend/cognito.tf` - the `attribute_mapping` should include:
```hcl
attribute_mapping = {
  email    = "email"
  name     = "name"
  picture  = "picture"
  username = "sub"
}
```

### Local Development Issues

For local development (`http://localhost:5173`):

1. Add to Google OAuth authorized origins:
   ```
   http://localhost:5173
   ```

2. Add to authorized redirect URIs:
   ```
   https://YOUR-COGNITO-DOMAIN.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```

3. Create `.env.local` in `packages/frontend/`:
   ```env
   VITE_APP_URL=http://localhost:5173
   VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
   VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
   VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   VITE_COGNITO_DOMAIN=path-to-glory-auth.auth.us-east-1.amazoncognito.com
   ```

   Get these values from `terraform output`.

## Security Best Practices

1. **Never commit OAuth secrets** - Use environment variables or Terraform variables files (which are gitignored)
2. **Rotate credentials regularly** - Update OAuth client secrets periodically
3. **Limit OAuth scopes** - Only request `email`, `profile`, and `openid`
4. **Use HTTPS only** - Never use OAuth with HTTP in production
5. **Restrict redirect URIs** - Only add legitimate domains to authorized URIs

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [AWS Cognito Identity Providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-provider.html)
- [Amplify Auth Documentation](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)
