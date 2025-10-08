# Security & Cost Optimization

## Overview

This document covers security measures and cost optimizations implemented in the Path to Glory backend infrastructure.

## 🔒 Security Measures Implemented

### ✅ Already in Place

| Measure | Status | Cost | Impact |
|---------|--------|------|--------|
| **IAM Least Privilege** | ✅ | Free | High |
| **HTTPS/TLS 1.2** | ✅ | Free | High |
| **JWT Authentication** | ✅ | Free | High |
| **CORS Protection** | ✅ | Free | Medium |
| **Encrypted Terraform State** | ✅ | Free | Medium |
| **Point-in-Time Recovery** | ✅ | Free | High |
| **CloudWatch Logging** | ✅ | ~$0.50/mo | Medium |
| **API Gateway Rate Limiting** | ✅ NEW | Free | High |
| **Lambda Concurrency Limits** | ✅ NEW | Free | High |
| **DynamoDB Encryption** | ✅ NEW | Free | Medium |
| **Deletion Protection** | ✅ NEW | Free | Medium |
| **CloudWatch Alarms** | ✅ NEW | Free | Medium |

### Security Details

#### 1. Rate Limiting (API Gateway)

**Purpose:** Prevent abuse and runaway costs

**Configuration:**
```terraform
default_route_settings {
  throttling_burst_limit = 200  # Max burst
  throttling_rate_limit  = 100  # Requests/second steady state
}
```

**What it does:**
- Limits requests to 100/second sustained
- Allows bursts up to 200 requests
- Returns `429 Too Many Requests` when exceeded
- Applies per AWS account (not per IP)

**Cost impact:**
- Prevents unlimited Lambda invocations
- Caps maximum theoretical cost at ~$15/hour worst case
- No additional AWS charges

#### 2. Lambda Reserved Concurrency

**Purpose:** Prevent runaway Lambda invocations

**Configuration:**
```terraform
reserved_concurrent_executions = 10
```

**What it does:**
- Limits Lambda to 10 concurrent executions max
- Additional requests get throttled (503 error)
- Prevents cost spikes from attacks or bugs

**Cost impact:**
- Caps Lambda costs at ~$0.50/hour maximum
- Protects against $1000+ surprise bills
- No additional AWS charges

#### 3. DynamoDB Encryption at Rest

**Purpose:** Protect data at rest

**Configuration:**
```terraform
server_side_encryption {
  enabled = true  # Uses AWS-managed keys
}
```

**What it does:**
- Encrypts all data stored in DynamoDB
- Uses AWS-managed keys (free)
- Transparent to application

**Cost impact:** $0 (AWS-managed keys are free)

#### 4. CloudWatch Alarms

**Purpose:** Monitor costs and errors

**Alarms created:**
1. **Billing Alert** - Email when costs exceed $10/month
2. **Lambda Errors** - Email when errors exceed 10 in 5 minutes
3. **API 5xx Errors** - Email when server errors occur

**Setup:**
```bash
# Optional: Set email for alerts
export TF_VAR_alarm_email="your-email@example.com"
export TF_VAR_billing_alert_threshold=10

terraform apply
```

**Cost impact:** $0 (first 10 alarms are free)

## 💰 Cost Analysis

### Current Monthly Costs (Estimated)

**Before optimizations:**
- DynamoDB: ~$1 (10K operations)
- Lambda: $0 (free tier)
- API Gateway: ~$1 (10K requests)
- CloudWatch Logs: ~$0.50
- Route53: ~$0.50
- **Total: ~$3/month**

**After optimizations:**
- Same as before (optimizations are free!)
- Protected against cost spikes
- **Total: ~$3/month**

### Cost Protection in Place

| Scenario | Before | After |
|----------|--------|-------|
| Normal usage (10K req/mo) | $3 | $3 |
| Attack (1M req/hour) | $200+ | **$0** (throttled) |
| Bug causing infinite loop | $500+ | **$15** (concurrency limit) |

### CloudFront Analysis - NOT Recommended

**Why CloudFront is difficult for GraphQL:**

1. **POST requests don't cache** - GraphQL uses POST by default
2. **Dynamic queries** - Every query is unique
3. **User-specific data** - Authenticated queries vary per user
4. **Minimal cacheable content** - Only public faction data

**Cost comparison:**
```
Current setup:
- API Gateway: $1/million requests
- Total: ~$3/month

With CloudFront:
- CloudFront: $0.085/GB + $0.0075/10K requests
- API Gateway: Still $1/million
- Total: ~$4-5/month (67% increase)
```

**Recommendation:** Skip CloudFront unless DDoS becomes a concern

**When to add CloudFront:**
- Experiencing DDoS attacks
- Need geographic distribution
- Traffic exceeds 100K requests/month
- Willing to pay extra for AWS Shield protection

## 🚫 Security Measures NOT Implemented (and why)

### WAF (Web Application Firewall)

**Cost:** $5/month base + $1/rule + $0.60/million requests = **~$6-10/month**

**Why not:**
- Doubles current infrastructure cost
- Overkill for current scale (<10K requests/month)
- API Gateway rate limiting provides basic protection

**When to add:**
- Traffic exceeds 50K requests/month
- Experiencing targeted attacks
- Compliance requires WAF

### CloudFront + AWS Shield

**Cost:** $1-2/month additional

**Why not:**
- GraphQL caching provides minimal benefit
- API Gateway already uses HTTPS + TLS
- No DDoS attacks currently

**When to add:**
- DDoS attacks occurring
- Need global edge caching
- Traffic is geographically distributed

### VPC Deployment

**Cost:** $0 (but adds complexity)

**Why not:**
- Lambda already has secure IAM-based DynamoDB access
- No RDS or other VPC resources
- Adds NAT Gateway costs if needed (~$30/month)

**When to add:**
- Connecting to RDS in VPC
- Compliance requires private subnets
- Need VPC endpoints for services

## 🎯 Recommended Actions

### Immediate (Already Implemented)

- [x] Enable API Gateway rate limiting
- [x] Set Lambda concurrency limits
- [x] Enable DynamoDB encryption
- [x] Add deletion protection
- [x] Create billing alarms

### Optional (Set email alerts)

```bash
# In GitHub Secrets or local .env
export TF_VAR_alarm_email="your-email@example.com"
export TF_VAR_billing_alert_threshold=10

# Deploy
cd infrastructure/backend
terraform apply
```

You'll receive an email to confirm the SNS subscription.

### Future Considerations

**If traffic grows beyond 50K requests/month:**
1. Consider WAF for advanced protection
2. Analyze DynamoDB access patterns for provisioned capacity
3. Review Lambda memory settings for optimization

**If experiencing attacks:**
1. Add WAF with rate-based rules
2. Add CloudFront for DDoS protection
3. Implement API keys for public endpoints

**If costs exceed $20/month:**
1. Review CloudWatch Logs retention (reduce from 7 days)
2. Analyze DynamoDB for hot partitions
3. Consider Lambda Provisioned Concurrency for cold starts

## 🔍 Monitoring & Alerts

### CloudWatch Dashboards

Create custom dashboard to monitor:
- API Gateway request count and latency
- Lambda invocations, errors, duration
- DynamoDB consumed capacity
- Estimated charges

### Log Analysis

```bash
# View API Gateway logs
aws logs tail /aws/apigateway/path-to-glory --follow

# View Lambda logs
aws logs tail /aws/lambda/path-to-glory-graphql --follow

# Search for errors
aws logs filter-pattern "ERROR" \
  --log-group-name /aws/lambda/path-to-glory-graphql
```

### Cost Monitoring

```bash
# Get current month costs
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 📊 Security Best Practices

### ✅ Followed

- Least privilege IAM roles
- Encryption in transit (HTTPS)
- Encryption at rest (DynamoDB)
- JWT token verification
- Rate limiting
- Cost controls
- Deletion protection
- Audit logging (CloudWatch)

### 🔲 Not Applicable (for current scale)

- WAF protection
- VPC isolation
- Multi-region deployment
- DDoS mitigation (beyond basic)
- API key management
- Custom KMS keys

### 🎓 Recommendations for Production at Scale

**If this becomes a public-facing app with thousands of users:**

1. **Add WAF** ($6-10/month)
   - Rate limiting per IP
   - Bot detection
   - SQL injection protection

2. **Add CloudFront** ($1-2/month)
   - DDoS protection
   - Geographic distribution
   - Reduce API Gateway costs at scale

3. **Implement API Keys**
   - Track usage per user/app
   - Fine-grained rate limiting
   - Monetization ready

4. **Add X-Ray Tracing**
   - Performance monitoring
   - Request path analysis
   - Bottleneck identification

5. **Multi-region Deployment**
   - High availability
   - Disaster recovery
   - Global performance

## 📝 Summary

### Current Protection Level: **Good for Small Scale**

- ✅ Protected against common attacks
- ✅ Cost overruns prevented
- ✅ Monitoring in place
- ✅ Zero additional monthly cost
- ✅ Data encrypted

### What You're Protected Against

- ✅ Accidental infinite loops (concurrency limit)
- ✅ Simple DDoS (rate limiting)
- ✅ Runaway costs (throttling + alarms)
- ✅ Data breaches (encryption + JWT auth)
- ✅ Accidental deletions (deletion protection)

### What You're NOT Protected Against

- ❌ Sophisticated DDoS (need WAF + CloudFront)
- ❌ Distributed bot attacks (need WAF)
- ❌ Regional AWS outages (need multi-region)
- ❌ Advanced persistent threats (need extensive monitoring)

### Bottom Line

For your current use case (~10K requests/month, small user base):
- **Current setup is appropriate**
- **Cost is optimized (~$3/month)**
- **Security is adequate for the scale**
- **No immediate need for expensive add-ons**

Revisit when traffic exceeds 50K requests/month or if attacks occur.
