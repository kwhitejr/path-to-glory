# AWS Setup Guide

## IAM Configuration for GitHub Actions

### Option 1: IAM User with Role Assumption (Recommended)

This is the pattern used in the deployment workflow.

#### Step 1: Create IAM User for GitHub Actions

```bash
# Create user
aws iam create-user --user-name github-actions-ptg

# Create access key
aws iam create-access-key --user-name github-actions-ptg
```

Save the `AccessKeyId` and `SecretAccessKey` - you'll need these for GitHub Secrets.

#### Step 2: Create Deployment Role

```bash
# Create role trust policy
cat > trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::{ACCOUNT_ID}:user/github-actions-ptg"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name PTGDeploymentRole \
  --assume-role-policy-document file://trust-policy.json
```

**Note**: Replace `{ACCOUNT_ID}` with your actual AWS account ID.

#### Step 3: Attach Permissions to Role

Create a policy with deployment permissions:

```bash
cat > deployment-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::ptg.kwhitejr.com",
        "arn:aws:s3:::ptg.kwhitejr.com/*",
        "arn:aws:s3:::kwhitejr-terraform-state",
        "arn:aws:s3:::kwhitejr-terraform-state/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "acm:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:{ACCOUNT_ID}:table/terraform-state-lock"
    }
  ]
}
EOF

# Create and attach policy
aws iam create-policy \
  --policy-name PTGDeploymentPolicy \
  --policy-document file://deployment-policy.json

aws iam attach-role-policy \
  --role-name PTGDeploymentRole \
  --policy-arn arn:aws:iam::{ACCOUNT_ID}:policy/PTGDeploymentPolicy
```

#### Step 4: Allow User to Assume Role

Attach a policy to the IAM user:

```bash
cat > assume-role-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::{ACCOUNT_ID}:role/PTGDeploymentRole"
    }
  ]
}
EOF

aws iam put-user-policy \
  --user-name github-actions-ptg \
  --policy-name AssumeDeploymentRole \
  --policy-document file://assume-role-policy.json
```

#### Step 5: Add Secrets to GitHub

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `AWS_ACCESS_KEY_ID`: The AccessKeyId from Step 1
- `AWS_SECRET_ACCESS_KEY`: The SecretAccessKey from Step 1
- `AWS_ROLE_TO_ASSUME`: `arn:aws:iam::{ACCOUNT_ID}:role/PTGDeploymentRole`

### Option 2: IAM User with Direct Permissions (Simpler, Less Secure)

If you don't want to use role assumption:

1. Create IAM user as above
2. Attach the deployment policy directly to the user
3. Only set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in GitHub Secrets
4. Remove `role-to-assume` from the workflow

**Note**: This is less secure as the credentials have direct permissions.

## Troubleshooting

### Error: "The request signature we calculated does not match"

**Possible causes:**
1. **Incorrect secrets**: Double-check GitHub Secrets are correct
2. **Extra whitespace**: Ensure no spaces at beginning/end of secrets
3. **Wrong region**: Verify AWS_REGION is correct
4. **Role trust policy**: User must be allowed to assume role

**To debug:**
```bash
# Test credentials locally
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_DEFAULT_REGION="us-east-1"

# Test basic access
aws sts get-caller-identity

# Test role assumption
aws sts assume-role \
  --role-arn arn:aws:iam::{ACCOUNT_ID}:role/PTGDeploymentRole \
  --role-session-name test
```

### Verify Terraform Backend Access

```bash
# List Terraform state bucket
aws s3 ls s3://kwhitejr-terraform-state/

# Test DynamoDB access
aws dynamodb describe-table --table-name terraform-state-lock
```

### Check IAM User Permissions

```bash
# List user policies
aws iam list-user-policies --user-name github-actions-ptg

# List attached policies
aws iam list-attached-user-policies --user-name github-actions-ptg

# Check if user can assume role
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::{ACCOUNT_ID}:user/github-actions-ptg \
  --action-names sts:AssumeRole \
  --resource-arns arn:aws:iam::{ACCOUNT_ID}:role/PTGDeploymentRole
```

## Security Best Practices

1. **Least Privilege**: Only grant necessary permissions
2. **Rotate Keys**: Regularly rotate IAM access keys
3. **Use Roles**: Prefer role assumption over direct credentials
4. **Audit**: Enable CloudTrail to track API calls
5. **MFA**: Consider requiring MFA for sensitive operations

## Required AWS Resources

Before running Terraform, ensure these exist:

1. **Route53 Hosted Zone**: `kwhitejr.com`
   ```bash
   aws route53 list-hosted-zones --query "HostedZones[?Name=='kwhitejr.com.']"
   ```

2. **S3 Bucket for Terraform State**: `kwhitejr-terraform-state`
   ```bash
   aws s3 ls s3://kwhitejr-terraform-state/
   ```

3. **DynamoDB Table for State Locking**: `terraform-state-lock`
   ```bash
   aws dynamodb describe-table --table-name terraform-state-lock
   ```

If any are missing, create them first before deploying.
