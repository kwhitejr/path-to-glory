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
    key            = "path-to-glory/frontend/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "path-to-glory"
      Component   = "frontend"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront requires ACM certificates in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "path-to-glory"
      Component   = "frontend"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
