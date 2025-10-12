output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "graphql_url" {
  description = "GraphQL endpoint URL"
  value       = "https://${var.api_domain_name}/graphql"
}

output "images_upload_url" {
  description = "Image upload endpoint URL"
  value       = "https://${var.api_domain_name}/images/upload-url"
}

output "images_bucket_name" {
  description = "S3 bucket for user-uploaded images"
  value       = aws_s3_bucket.images.id
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.main.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.main.arn
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.graphql.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.graphql.arn
}
