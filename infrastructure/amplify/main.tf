resource "aws_amplify_app" "site" {
  name        = var.name
  description = "Static website"

  cache_config {
    type = "AMPLIFY_MANAGED_NO_COOKIES"
  }

  custom_headers = file("${path.module}/custom-headers.yaml")

  # Redirect the root domain to the subdomain. Needs to be first or else it doesn't work!
  custom_rule {
    source = "https://${var.domain_name}"
    status = "301"
    target = "https://${var.sub_domain}.${var.domain_name}"
  }

  # The default rewrites and redirects added by the Amplify Console.
  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/404.html"
  }

  lifecycle {
    # Terraform always reports custom_headers need to be updated because of this bug:
    # https://github.com/hashicorp/terraform-provider-aws/issues/34318
    # Have to manually comment this out if custom-headers.yaml changes.
    ignore_changes = [custom_headers]
  }
}

resource "aws_amplify_branch" "site" {
  app_id      = aws_amplify_app.site.id
  branch_name = "main"
  stage       = "PRODUCTION"
}

# This automagically creates Route53 DNS records and AWS Certificate Manager (ACM) SSL certificates
# (which are hidden in the UI). Cleanup and setup is pretty messy, it doesn't remove the
# `certificate_verification_dns_record` which can cause problems. It is generally better to delete
# the entire `aws_amplify_domain_association` and manually cleanup the DNS record, then recreate.
resource "aws_amplify_domain_association" "site" {
  app_id      = aws_amplify_app.site.id
  domain_name = var.domain_name

  sub_domain {
    branch_name = "main"
    prefix      = ""
  }

  sub_domain {
    branch_name = "main"
    prefix      = var.sub_domain
  }
}
