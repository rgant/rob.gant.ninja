resource "aws_amplify_app" "site" {
  name        = var.name
  description = "Static website"

  cache_config {
    type = "AMPLIFY_MANAGED_NO_COOKIES"
  }

  custom_headers = file("${path.module}/custom-headers.yaml")

  # The default rewrites and redirects added by the Amplify Console.
  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/404.html"
  }

  custom_rule {
    source = "https://${var.domain_name}"
    status = "301"
    target = "https://${var.sub_domains[0]}.${var.domain_name}"
  }

  custom_rule {
    source = "https://*.${var.domain_name}"
    status = "302"
    target = "https://${var.sub_domains[0]}.${var.domain_name}"
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

locals {
  sub_domains = toset(concat(["", "*"], var.sub_domains))
}

resource "aws_amplify_domain_association" "site" {
  app_id      = aws_amplify_app.site.id
  domain_name = var.domain_name

  dynamic "sub_domain" {
    for_each = local.sub_domains

    content {
      branch_name = aws_amplify_branch.site.branch_name
      prefix = sub_domain.value
    }
  }
}
