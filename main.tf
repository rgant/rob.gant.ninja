# tflint-ignore-file: terraform_standard_module_structure
# Create the Firebase infrastructure for project
# `./infrastructure` is a Terraform module to keep things tidy.
# Attempting to have only `main.tf` file in the root for cleanliness.

terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket       = "tfstate-ninja-rob-gant"
    key          = "tfstate"
    encrypt      = true
    profile      = "personal"
    region       = "us-east-1"
    use_lockfile = true
  }
}

locals {
  json_data = jsondecode(file("${path.root}/generated/sriHashes.json"))
}

module "amazon" {
  source       = "./infrastructure"
  aws_profile  = "personal"
  alerts_email = var.my_email
  check_ip     = var.check_ip
  script_sri   = local.json_data.scripts
  style_sri    = local.json_data.styles
}

# Use `terraform (apply|plan) -var="check_ip=true"` to lookup the current external IP address and
# set it in DNS.
variable "check_ip" {
  type        = bool
  description = "Lookup dynamic home IP, or use existing values from current DNS"
  default     = false
}

variable "my_email" {
  type        = string
  description = "My email address for budget alerts"
}

# Apparently moved need to be at the root, not within the modules!
# https://www.reddit.com/r/Terraform/comments/17685zu/comment/k4kemog/
moved {
  from = module.amazon.aws_s3_bucket.website
  to   = module.amazon.module.website_bucket.aws_s3_bucket.bucket
}

moved {
  from = module.amazon.aws_s3_bucket_public_access_block.website
  to   = module.amazon.module.website_bucket.aws_s3_bucket_public_access_block.bucket
}

moved {
  from = module.amazon.aws_s3_bucket_ownership_controls.website
  to   = module.amazon.module.website_bucket.aws_s3_bucket_ownership_controls.bucket
}

moved {
  from = module.amazon.aws_s3_bucket_acl.website
  to   = module.amazon.module.website_bucket.aws_s3_bucket_acl.bucket
}

moved {
  from = module.amazon.aws_s3_bucket.redirect
  to   = module.amazon.module.redirect_bucket.aws_s3_bucket.bucket
}

moved {
  from = module.amazon.aws_s3_bucket_ownership_controls.redirect
  to   = module.amazon.module.redirect_bucket.aws_s3_bucket_ownership_controls.bucket
}

moved {
  from = module.amazon.aws_s3_bucket_public_access_block.redirect
  to   = module.amazon.module.redirect_bucket.aws_s3_bucket_public_access_block.bucket
}

moved {
  from = module.amazon.aws_s3_bucket_acl.redirect
  to   = module.amazon.module.redirect_bucket.aws_s3_bucket_acl.bucket
}
