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

module "amazon" {
  source      = "./infrastructure"
  aws_profile = "personal"
  check_ip    = var.check_ip
}

# Use `terraform (apply|plan) -var="check_ip=true"` to lookup the current external IP address and
# set it in DNS.
variable "check_ip" {
  type        = bool
  description = "Lookup dynamic home IP, or use existing values from current DNS"
  default     = false
}
