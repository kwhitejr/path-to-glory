# Terraform Backend Bootstrap

One-time setup for Terraform remote state management.

## What This Creates

1. **S3 Bucket** (`kwhitejr-terraform-state`)
   - Stores Terraform state files
   - Versioning enabled (can recover previous states)
   - Encryption enabled (AES256)
   - Public access blocked

2. **DynamoDB Table** (`terraform-state-lock`)
   - Prevents concurrent Terraform runs
   - Pay-per-request billing
   - Hash key: `LockID`

## Prerequisites

- AWS CLI configured with credentials
- Permissions to create S3 buckets and DynamoDB tables

## Setup

### Automatic Setup (Recommended)

```bash
cd infrastructure/bootstrap
./setup-backend.sh
```

The script will:
- Check if resources already exist
- Create them if missing
- Configure security settings
- Skip if already present (idempotent)

### Manual Setup

If you prefer to create manually:

#### 1. Create S3 Bucket

```bash
# Create bucket (us-east-1)
aws s3api create-bucket \
  --bucket kwhitejr-terraform-state \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket kwhitejr-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket kwhitejr-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      },
      "BucketKeyEnabled": true
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket kwhitejr-terraform-state \
  --public-access-block-configuration \
    BlockPublicAcls=true,\
    IgnorePublicAcls=true,\
    BlockPublicPolicy=true,\
    RestrictPublicBuckets=true
```

#### 2. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Verification

Check that resources exist:

```bash
# Check S3 bucket
aws s3 ls s3://kwhitejr-terraform-state/

# Check DynamoDB table
aws dynamodb describe-table \
  --table-name terraform-state-lock \
  --query 'Table.[TableName,TableStatus]' \
  --output text
```

## Using the Backend

After setup, Terraform will automatically use these resources when you run:

```bash
terraform init
```

The backend configuration is in `infrastructure/frontend/versions.tf`:

```hcl
terraform {
  backend "s3" {
    bucket         = "kwhitejr-terraform-state"
    key            = "path-to-glory/frontend/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

## State File Organization

State files are organized by project component:

```
s3://kwhitejr-terraform-state/
├── path-to-glory/
│   ├── frontend/
│   │   └── terraform.tfstate
│   └── backend/
│       └── terraform.tfstate
└── other-projects/
    └── ...
```

## Costs

- **S3**: ~$0.023/GB/month + $0.0004 per 1,000 requests
- **DynamoDB**: Pay-per-request (very low for lock operations)

**Estimated monthly cost**: < $0.50 for typical usage

## Security Notes

1. **State files may contain sensitive data** (passwords, keys)
   - Encryption at rest enabled
   - Access controlled via IAM
   - Versioning allows recovery

2. **Never commit state files to git**
   - Already in `.gitignore`
   - Always use remote backend

3. **Lock table prevents race conditions**
   - Multiple users can't modify state simultaneously
   - Prevents corruption

## Cleanup

To delete backend resources (⚠️ destroys all Terraform state):

```bash
# Delete all state files
aws s3 rm s3://kwhitejr-terraform-state/ --recursive

# Delete bucket
aws s3api delete-bucket \
  --bucket kwhitejr-terraform-state

# Delete table
aws dynamodb delete-table \
  --table-name terraform-state-lock
```

**Warning**: Only do this if you want to completely remove all Terraform state!

## Troubleshooting

### "AccessDenied" when creating bucket

Check IAM permissions include:
- `s3:CreateBucket`
- `s3:PutBucketVersioning`
- `s3:PutBucketEncryption`
- `s3:PutPublicAccessBlock`

### "ResourceInUseException" for DynamoDB

Table already exists - this is fine, you can proceed with Terraform.

### State lock timeout

If Terraform crashes, you may need to manually release the lock:

```bash
# List locks
aws dynamodb scan \
  --table-name terraform-state-lock

# Delete stuck lock (use LockID from scan output)
aws dynamodb delete-item \
  --table-name terraform-state-lock \
  --key '{"LockID": {"S": "kwhitejr-terraform-state/path-to-glory/frontend/terraform.tfstate"}}'
```
