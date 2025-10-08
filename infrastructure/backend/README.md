# Backend Infrastructure

Terraform configuration for the Path to Glory GraphQL API backend.

## Architecture

- **API Gateway HTTP API**: Entry point at `https://api.kwhitejr.com/graphql`
- **Lambda Function**: GraphQL server (Apollo Server on Node.js 20)
- **DynamoDB**: Single-table design for all data storage
- **Cognito**: JWT authentication (using existing user pool)

## Prerequisites

1. AWS CLI configured
2. Terraform >= 1.0
3. Backend package built and zipped
4. Cognito User Pool deployed (from frontend infrastructure)

## Environment Variables

Set these in GitHub Actions secrets or export locally:

```bash
export TF_VAR_cognito_user_pool_id="us-east-1_XXXXXXXXX"
export TF_VAR_cognito_client_id="your-client-id"
```

## Deployment

### Initial Setup

```bash
cd infrastructure/backend

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Deploy
terraform apply
```

### Update Lambda Code

After making backend code changes:

```bash
# Build and package
cd packages/backend
npm run build
cd dist
zip -r ../lambda.zip .
cd ../../../infrastructure/backend

# Deploy updated function
terraform apply
```

## Local Development

See `packages/backend/README.md` for local development with serverless-offline.

## Outputs

After deployment, Terraform will output:

- `graphql_url`: GraphQL endpoint (https://api.kwhitejr.com/graphql)
- `api_endpoint`: Raw API Gateway endpoint
- `dynamodb_table_name`: Table name for local development
- `lambda_function_name`: For CloudWatch logs

## Monitoring

- **Lambda Logs**: CloudWatch Logs `/aws/lambda/path-to-glory-graphql`
- **API Logs**: CloudWatch Logs `/aws/apigateway/path-to-glory`
- **DynamoDB Metrics**: CloudWatch DynamoDB metrics

## Security & Cost Protection

**Built-in protections:**
- **Rate Limiting**: 100 requests/second (prevents abuse)
- **Concurrency Limits**: Max 10 concurrent Lambda executions
- **DynamoDB Encryption**: Data encrypted at rest
- **Deletion Protection**: Prevents accidental table deletion
- **CloudWatch Alarms**: Email alerts for errors and cost spikes

**Optional: Enable Email Alerts**
```bash
export TF_VAR_alarm_email="your-email@example.com"
export TF_VAR_billing_alert_threshold=10
terraform apply
```

See `docs/SECURITY_AND_COST_OPTIMIZATION.md` for details.

## Cost Optimization

- DynamoDB: Pay-per-request billing (no idle costs)
- Lambda: Pay per invocation (generous free tier)
- API Gateway: HTTP API (cheaper than REST API)
- Logs: 7-day retention to minimize storage costs
- **Rate limiting prevents runaway costs**
- **Concurrency limits cap Lambda spend**
