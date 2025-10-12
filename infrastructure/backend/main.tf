terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "kwhitejr-terraform-state"
    key            = "path-to-glory/backend/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "path-to-glory"
      Environment = "production"
      ManagedBy   = "terraform"
      Component   = "backend"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}

# Reference the Cognito User Pool created by frontend infrastructure
# Use direct ID lookup instead of name-based search to avoid issues
data "aws_cognito_user_pool" "main" {
  user_pool_id = var.cognito_user_pool_id
}

data "aws_cognito_user_pool_client" "main" {
  user_pool_id = data.aws_cognito_user_pool.main.id
  client_id    = var.cognito_client_id
}

# DynamoDB Table
resource "aws_dynamodb_table" "main" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  point_in_time_recovery {
    enabled = true
  }

  # Encryption at rest with AWS-managed keys (free)
  server_side_encryption {
    enabled = true
  }

  # Prevent accidental deletion
  deletion_protection_enabled = true

  tags = {
    Name = "path-to-glory-data"
  }
}

# S3 Bucket for User-Uploaded Images
resource "aws_s3_bucket" "images" {
  bucket = "kwhitejr-path-to-glory-images-prod-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_public_access_block" "images" {
  bucket = aws_s3_bucket.images.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS configuration for direct upload from frontend
resource "aws_s3_bucket_cors_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = var.cors_allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}

# Lifecycle policy to manage costs
resource "aws_s3_bucket_lifecycle_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  rule {
    id     = "delete-old-images"
    status = "Enabled"

    # Delete images after 365 days (armies can be re-uploaded)
    expiration {
      days = 365
    }

    # Delete incomplete multipart uploads after 7 days
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lambda Execution Role (GraphQL API)
resource "aws_iam_role" "lambda_exec" {
  name = "path-to-glory-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Lambda Execution Role (Image Service)
resource "aws_iam_role" "lambda_images_exec" {
  name = "path-to-glory-lambda-images-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# S3 permissions for image Lambda (presigned URLs only)
resource "aws_iam_role_policy" "lambda_images_s3" {
  name = "s3-presigned-url-access"
  role = aws_iam_role.lambda_images_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.images.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_images_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_images_exec.name
}

resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "dynamodb-access"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.main.arn,
          "${aws_dynamodb_table.main.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec.name
}

# Lambda Function
resource "aws_lambda_function" "graphql" {
  function_name = "path-to-glory-graphql"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"

  # Package type must be Zip for handler-based invocation
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 512

  # Limit concurrent executions to prevent runaway costs
  reserved_concurrent_executions = 10

  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = {
      DYNAMODB_TABLE        = aws_dynamodb_table.main.name
      COGNITO_USER_POOL_ID  = data.aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID     = data.aws_cognito_user_pool_client.main.id
      ENABLE_MOCK_DATA      = var.enable_mock_data
    }
  }
}

# CloudWatch Log Group (GraphQL Lambda)
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.graphql.function_name}"
  retention_in_days = 7
}

# Lambda Function (Image Service)
resource "aws_lambda_function" "images" {
  function_name = "path-to-glory-images"
  role          = aws_iam_role.lambda_images_exec.arn
  handler       = "images.handler"

  runtime     = "nodejs20.x"
  timeout     = 10
  memory_size = 256

  # Limit concurrent executions
  reserved_concurrent_executions = 5

  filename         = var.lambda_images_zip_path
  source_code_hash = filebase64sha256(var.lambda_images_zip_path)

  environment {
    variables = {
      S3_BUCKET_NAME = aws_s3_bucket.images.id
      MAX_FILE_SIZE  = "524288" # 512KB in bytes
    }
  }
}

# CloudWatch Log Group (Image Lambda)
resource "aws_cloudwatch_log_group" "lambda_images" {
  name              = "/aws/lambda/${aws_lambda_function.images.function_name}"
  retention_in_days = 7
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "main" {
  name          = "path-to-glory-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.cors_allowed_origins
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true

  # Rate limiting to prevent abuse
  default_route_settings {
    throttling_burst_limit = 200  # Max burst capacity
    throttling_rate_limit  = 100  # Steady-state requests per second
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/apigateway/path-to-glory"
  retention_in_days = 7
}

# Lambda Integration
resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"

  integration_uri        = aws_lambda_function.graphql.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Routes
resource "aws_apigatewayv2_route" "graphql_post" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /graphql"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "graphql_get" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /graphql"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Lambda Permission (GraphQL)
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.graphql.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Image Lambda Integration
resource "aws_apigatewayv2_integration" "lambda_images" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"

  integration_uri        = aws_lambda_function.images.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Image Upload Route
resource "aws_apigatewayv2_route" "images_upload" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /images/upload-url"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_images.id}"
}

# Lambda Permission (Image Service)
resource "aws_lambda_permission" "api_gateway_images" {
  statement_id  = "AllowAPIGatewayInvokeImages"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.images.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Custom Domain (using api.ptg.kwhitejr.com)
data "aws_route53_zone" "main" {
  name         = var.root_domain
  private_zone = false
}

# Create ACM certificate for API subdomain
resource "aws_acm_certificate" "api" {
  domain_name       = var.api_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "path-to-glory-api"
  }
}

# DNS validation records
resource "aws_route53_record" "api_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

# Wait for certificate validation
resource "aws_acm_certificate_validation" "api" {
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]
}

resource "aws_apigatewayv2_domain_name" "main" {
  domain_name = var.api_domain_name

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  domain_name = aws_apigatewayv2_domain_name.main.id
  stage       = aws_apigatewayv2_stage.main.id
  # No api_mapping_key means map to root path
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.api_domain_name
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.main.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.main.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

# CloudWatch Alarms for Monitoring and Cost Control

# Billing alarm (requires billing metrics enabled in us-east-1)
resource "aws_cloudwatch_metric_alarm" "billing" {
  alarm_name          = "path-to-glory-backend-cost-alert"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = 21600 # 6 hours
  statistic           = "Maximum"
  threshold           = var.billing_alert_threshold
  alarm_description   = "Alert when estimated charges exceed threshold"
  alarm_actions       = var.alarm_email != "" ? [aws_sns_topic.alerts[0].arn] : []

  dimensions = {
    Currency      = "USD"
    ServiceName   = "AWSLambda"
  }
}

# Lambda error rate alarm
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "path-to-glory-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300 # 5 minutes
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Alert when Lambda errors exceed 10 in 5 minutes"
  alarm_actions       = var.alarm_email != "" ? [aws_sns_topic.alerts[0].arn] : []

  dimensions = {
    FunctionName = aws_lambda_function.graphql.function_name
  }
}

# API Gateway 5xx errors alarm
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "path-to-glory-api-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alert when API returns 5xx errors"
  alarm_actions       = var.alarm_email != "" ? [aws_sns_topic.alerts[0].arn] : []

  dimensions = {
    ApiId = aws_apigatewayv2_api.main.id
  }
}

# SNS topic for alarms (optional, only created if email provided)
resource "aws_sns_topic" "alerts" {
  count = var.alarm_email != "" ? 1 : 0
  name  = "path-to-glory-backend-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  count     = var.alarm_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}
