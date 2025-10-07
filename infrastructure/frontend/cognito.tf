# Cognito User Pool for authentication
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-user-pool"

  # Allow users to sign in with email
  alias_attributes = ["email", "preferred_username"]
  auto_verified_attributes = ["email"]

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # User attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = false
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "picture"
    attribute_data_type = "String"
    required            = false
    mutable             = true
  }

  # Prevent Terraform from trying to modify schema after creation
  lifecycle {
    ignore_changes = [schema]
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Prevent user existence errors
  user_pool_add_ons {
    advanced_security_mode = "AUDIT"
  }

  tags = {
    Name        = "${var.project_name}-user-pool"
    Environment = "production"
    Project     = var.project_name
  }
}

# Cognito User Pool Client (for the React app)
resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-web-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # OAuth configuration
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]

  callback_urls = [
    "https://${local.frontend_domain}",
    "https://${local.frontend_domain}/",
    "http://localhost:5173",  # For local development
    "http://localhost:5173/"
  ]

  logout_urls = [
    "https://${local.frontend_domain}",
    "https://${local.frontend_domain}/",
    "http://localhost:5173",
    "http://localhost:5173/"
  ]

  # Token validity
  id_token_validity      = 60  # minutes
  access_token_validity  = 60  # minutes
  refresh_token_validity = 30  # days

  token_validity_units {
    id_token      = "minutes"
    access_token  = "minutes"
    refresh_token = "days"
  }

  # Security
  prevent_user_existence_errors = "ENABLED"

  # Enable Google sign-in
  supported_identity_providers = ["Google"]

  # Read/write permissions
  read_attributes = [
    "email",
    "email_verified",
    "name",
    "picture",
    "preferred_username"
  ]

  write_attributes = [
    "email",
    "name",
    "picture",
    "preferred_username"
  ]
}

# Cognito User Pool Domain (for hosted UI)
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Google Identity Provider
# Note: This requires Google OAuth credentials to be set manually or via variables
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "email openid profile"
  }

  attribute_mapping = {
    email             = "email"
    name              = "name"
    picture           = "picture"
    username          = "sub"
    preferred_username = "email"
  }
}

# Cognito Identity Pool (for AWS credentials)
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "${var.project_name}-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.main.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = true
  }

  tags = {
    Name        = "${var.project_name}-identity-pool"
    Environment = "production"
    Project     = var.project_name
  }
}

# IAM role for authenticated users
resource "aws_iam_role" "authenticated" {
  name = "${var.project_name}-cognito-authenticated"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-cognito-authenticated"
    Environment = "production"
    Project     = var.project_name
  }
}

# Policy for authenticated users (minimal permissions)
resource "aws_iam_role_policy" "authenticated" {
  name = "${var.project_name}-cognito-authenticated-policy"
  role = aws_iam_role.authenticated.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-identity:GetId",
          "cognito-identity:GetCredentialsForIdentity"
        ]
        Resource = "*"
      }
    ]
  })
}

# Attach roles to identity pool
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id

  roles = {
    authenticated = aws_iam_role.authenticated.arn
  }
}
