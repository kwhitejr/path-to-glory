variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "api_domain_name" {
  description = "Domain name for the API"
  type        = string
  default     = "api.ptg.kwhitejr.com"
}

variable "root_domain" {
  description = "Root domain name for Route53 zone lookup"
  type        = string
  default     = "kwhitejr.com"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "path-to-glory-prod"
}

variable "lambda_zip_path" {
  description = "Path to Lambda deployment package"
  type        = string
  default     = "../../packages/backend/lambda.zip"
}

variable "lambda_images_zip_path" {
  description = "Path to image service Lambda deployment package"
  type        = string
  default     = "../../packages/backend/lambda-images.zip"
}

variable "enable_mock_data" {
  description = "Enable mock data seeding"
  type        = string
  default     = "false"
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["https://ptg.kwhitejr.com", "http://localhost:5173", "http://localhost:3000"]
}

variable "billing_alert_threshold" {
  description = "Billing alert threshold in USD"
  type        = number
  default     = 10
}

variable "alarm_email" {
  description = "Email address for CloudWatch alarms (leave empty to disable)"
  type        = string
  default     = ""
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID from frontend infrastructure"
  type        = string
  default     = "us-east-1_l4Fob0tQH"
}

variable "cognito_client_id" {
  description = "Cognito User Pool Client ID from frontend infrastructure"
  type        = string
  default     = "7eod9l3vofi7ke8jodaapgcs65"
}
