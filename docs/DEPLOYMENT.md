# Deployment Guide

## Prerequisites

### AWS Setup
1. ✅ AWS Account with admin access
2. ✅ Route53 hosted zone for `kwhitejr.com`
3. ✅ S3 bucket for Terraform state: `kwhitejr-terraform-state`
4. ✅ DynamoDB table for state locking: `terraform-state-lock`

### GitHub Setup
1. **GitHub Secrets** (Settings → Secrets → Actions):
   - `AWS_DEPLOY_ROLE_ARN` - IAM role ARN for OIDC authentication

2. **IAM Role for GitHub Actions** (OIDC):
   ```hcl
   # Trust policy for GitHub Actions
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::{ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:kwhitejr/path-to-glory:*"
           }
         }
       }
     ]
   }
   ```

2. **IAM Permissions** (attach to role):
   - S3 (bucket creation, object upload)
   - CloudFront (distribution management)
   - ACM (certificate management)
   - Route53 (DNS record management)
   - IAM (for Terraform state locking)

## Initial Deployment

### Step 1: Set GitHub Secret
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add:
   - `AWS_DEPLOY_ROLE_ARN`: `arn:aws:iam::{ACCOUNT_ID}:role/{ROLE_NAME}`

### Step 2: Verify Route53 Zone Exists
```bash
aws route53 list-hosted-zones-by-name --query "HostedZones[?Name=='kwhitejr.com.'].Id" --output text
```
The zone should already exist from your domain setup.

### Step 3: Manual Infrastructure Setup (First Time, Optional)
```bash
cd infrastructure/frontend

# Initialize and apply
terraform init
terraform plan
terraform apply
```

### Step 4: Deploy Frontend
Push to main branch or trigger workflow manually:
```bash
git push origin main
```

Or via GitHub UI:
- Actions → Deploy Frontend → Run workflow

## Subsequent Deployments

After initial setup, deployments are automatic:

1. **Automatic** - Push to `main` branch
   - Triggered by changes to:
     - `packages/frontend/**`
     - `packages/shared/**`
     - `.github/workflows/deploy-frontend.yml`

2. **Manual** - GitHub Actions UI
   - Actions → Deploy Frontend → Run workflow

## Deployment Process

The GitHub Actions workflow:

1. **Build** (on all PRs and pushes)
   - Installs dependencies
   - Builds shared package
   - Builds frontend with production config
   - Uploads artifacts

2. **Terraform Validate** (on all PRs and pushes)
   - Validates Terraform syntax
   - Checks formatting

3. **Terraform Plan** (on PRs only)
   - Generates execution plan
   - Comments plan on PR

4. **Deploy** (on main branch only)
   - Applies Terraform changes
   - Syncs files to S3
   - Invalidates CloudFront cache
   - Posts deployment summary

## Monitoring

### Check Deployment Status
- GitHub: Actions tab
- CloudFront: AWS Console → CloudFront
- S3: AWS Console → S3 → `ptg.kwhitejr.com`

### Verify Live Site
```bash
curl -I https://ptg.kwhitejr.com
```

Should return `200 OK` with CloudFront headers.

### View CloudFront Logs
```bash
aws cloudfront get-distribution --id {DISTRIBUTION_ID}
```

## Rollback

### Option 1: Revert Git Commit
```bash
git revert {commit-hash}
git push origin main
```
Triggers automatic redeployment.

### Option 2: Manual S3 Rollback
```bash
# List previous versions
aws s3api list-object-versions --bucket ptg.kwhitejr.com

# Restore specific version
aws s3api copy-object \
  --copy-source ptg.kwhitejr.com/index.html?versionId={VERSION_ID} \
  --bucket ptg.kwhitejr.com \
  --key index.html

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id {DISTRIBUTION_ID} \
  --paths "/*"
```

## Costs

### Monthly Estimate (Low Traffic)
- CloudFront: $0.50 - $2.00
- S3 Storage: $0.10 - $0.50
- S3 Requests: $0.05 - $0.20
- Route53: $0.50 (hosted zone)
- ACM Certificate: $0.00 (free)

**Total: ~$1.15 - $3.20/month**

### Cost Optimization
- CloudFront caching reduces origin requests
- S3 versioning only keeps recent versions
- Assets cached for 1 year (immutable)
- index.html not cached (always fresh)

## Troubleshooting

### Certificate Validation Stuck
- Check Route53 for validation records
- Wait up to 30 minutes for DNS propagation
- Verify nameservers are correct

### CloudFront Shows Old Content
```bash
# Force invalidation
aws cloudfront create-invalidation \
  --distribution-id {DISTRIBUTION_ID} \
  --paths "/*"
```

### 404 on Routes
- CloudFront should serve `index.html` for 404s (SPA routing)
- Check custom error responses in CloudFront config

### Deployment Fails
- Check GitHub Actions logs
- Verify AWS credentials are valid
- Ensure Terraform state is accessible
- Check IAM permissions

## Production URLs

- **Frontend**: https://ptg.kwhitejr.com
- **Backend** (future): https://ptg.kwhitejr.com/graphql

## Security

### HTTPS Only
- All HTTP requests redirect to HTTPS
- TLS 1.2+ required

### S3 Bucket Access
- Not publicly accessible
- CloudFront uses OAC (Origin Access Control)
- All access logged

### Secrets Management
- No secrets in code
- Environment variables via GitHub Secrets
- Terraform state encrypted in S3
