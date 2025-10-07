variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
  default     = "kwhitejr.com"
}

variable "subdomain" {
  description = "Subdomain for the frontend"
  type        = string
  default     = "ptg"
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for kwhitejr.com"
  type        = string
  # This should be set via environment variable or terraform.tfvars
}
