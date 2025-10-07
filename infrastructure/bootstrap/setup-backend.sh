#!/bin/bash
# One-time setup for Terraform backend
# Creates S3 bucket and DynamoDB table for state management

set -e

AWS_REGION="${AWS_REGION:-us-east-1}"
STATE_BUCKET="kwhitejr-terraform-state"
LOCK_TABLE="terraform-state-lock"

echo "Setting up Terraform backend infrastructure..."
echo "Region: $AWS_REGION"
echo "Bucket: $STATE_BUCKET"
echo "Table: $LOCK_TABLE"
echo ""

# Check if bucket exists
if aws s3 ls "s3://$STATE_BUCKET" 2>/dev/null; then
    echo "✓ S3 bucket '$STATE_BUCKET' already exists"
else
    echo "Creating S3 bucket '$STATE_BUCKET'..."

    # Create bucket
    if [ "$AWS_REGION" = "us-east-1" ]; then
        aws s3api create-bucket \
            --bucket "$STATE_BUCKET" \
            --region "$AWS_REGION"
    else
        aws s3api create-bucket \
            --bucket "$STATE_BUCKET" \
            --region "$AWS_REGION" \
            --create-bucket-configuration LocationConstraint="$AWS_REGION"
    fi

    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket "$STATE_BUCKET" \
        --versioning-configuration Status=Enabled

    # Enable encryption
    aws s3api put-bucket-encryption \
        --bucket "$STATE_BUCKET" \
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
        --bucket "$STATE_BUCKET" \
        --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

    echo "✓ S3 bucket created and configured"
fi

echo ""

# Check if DynamoDB table exists
if aws dynamodb describe-table --table-name "$LOCK_TABLE" --region "$AWS_REGION" &>/dev/null; then
    echo "✓ DynamoDB table '$LOCK_TABLE' already exists"
else
    echo "Creating DynamoDB table '$LOCK_TABLE'..."

    aws dynamodb create-table \
        --table-name "$LOCK_TABLE" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$AWS_REGION"

    echo "Waiting for table to be active..."
    aws dynamodb wait table-exists \
        --table-name "$LOCK_TABLE" \
        --region "$AWS_REGION"

    echo "✓ DynamoDB table created"
fi

echo ""
echo "✅ Terraform backend setup complete!"
echo ""
echo "Backend configuration:"
echo "  Bucket:  $STATE_BUCKET"
echo "  Table:   $LOCK_TABLE"
echo "  Region:  $AWS_REGION"
echo ""
echo "You can now run 'terraform init' in your infrastructure directories."
