# Path to Glory - Frontend Infrastructure

Terraform configuration for deploying the React frontend to AWS with CloudFront, S3, and Route53.

## Architecture

- **S3 Bucket**: Hosts static frontend files
- **CloudFront**: CDN for fast global delivery with HTTPS
- **Route53**: DNS configuration for ptg.kwhitejr.com
- **ACM Certificate**: SSL/TLS certificate for HTTPS

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Route53 Hosted Zone** for kwhitejr.com (must exist)
3. **Terraform** >= 1.0
4. **S3 Backend** for Terraform state:
   - Bucket: `kwhitejr-terraform-state`
   - DynamoDB table: `terraform-state-lock`

## Setup

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Preview changes:
   ```bash
   terraform plan
   ```

3. Apply infrastructure:
   ```bash
   terraform apply
   ```

## Deployment

Frontend deployment is automated via GitHub Actions (`.github/workflows/deploy-frontend.yml`).

### Required GitHub Secrets

- `AWS_DEPLOY_ROLE_ARN` - IAM role ARN for GitHub Actions OIDC

### Manual Deployment

If you need to deploy manually:

```bash
# Build frontend
cd ../..
npm run build -w @path-to-glory/shared
npm run build -w @path-to-glory/frontend

# Deploy infrastructure
cd infrastructure/frontend
terraform apply

# Sync files to S3
aws s3 sync ../../packages/frontend/dist/ s3://ptg.kwhitejr.com/ --delete

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## Outputs

After `terraform apply`, you'll get:

- `frontend_url` - https://ptg.kwhitejr.com
- `s3_bucket_name` - S3 bucket name
- `cloudfront_distribution_id` - CloudFront distribution ID
- `cloudfront_domain_name` - CloudFront domain
- `certificate_arn` - ACM certificate ARN

## Features

- **HTTPS only** - Redirects HTTP to HTTPS
- **SPA routing** - Serves index.html for 404s (client-side routing)
- **Caching** - Assets cached for 1 year, index.html not cached
- **IPv6 support** - CloudFront serves over IPv4 and IPv6
- **Compression** - Automatic gzip compression
- **Versioning** - S3 bucket versioning enabled

## Estimated Costs

- **CloudFront**: ~$0.085/GB (first 10TB)
- **S3**: ~$0.023/GB storage + ~$0.0004/1000 requests
- **Route53**: $0.50/month per hosted zone
- **ACM Certificate**: Free

Typical monthly cost for low traffic: **< $5**

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Note**: This will delete the S3 bucket and all files. CloudFront distribution deletion can take up to 15 minutes.
