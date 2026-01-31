# tflint-ignore-file: terraform_standard_module_structure
# Create the AWS infrastructure for project
# `./infrastructure` is a Terraform module to keep things tidy.
# Attempting to have only `main.tf` file in the root for cleanliness.

terraform {
  required_version = ">= 1.12"

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

# Amplify DNS record imports. @see infrastructure/amplify/dns.tf for details
# These are safe to leave in place https://developer.hashicorp.com/terraform/language/import#plan-and-apply-an-import
locals {
  ninja_zone_id = "ZBBRM66A8UP3U"
}

import {
  to = module.amazon.module.amplify_website.aws_route53_record.certificate_verification
  # The hash here is randomly generated, so it must be manually looked up
  id = "${local.ninja_zone_id}__3de338234e081e7bf90a582dc2e37b07.gant.ninja_CNAME"
}

import {
  to = module.amazon.module.amplify_website.aws_route53_record.site_a
  id = "${local.ninja_zone_id}_gant.ninja_A"
}

import {
  to = module.amazon.module.amplify_website.aws_route53_record.site_aaaa
  id = "${local.ninja_zone_id}_gant.ninja_AAAA"
}

import {
  to = module.amazon.module.amplify_website.aws_route53_record.site_subdomain_cname
  id = "${local.ninja_zone_id}_rob.gant.ninja_CNAME"
}
