# This is a bit of a hack. These records (exceptting the AAAA) are created and mostly managed
# automagically by the aws_amplify_domain_association resource. But I want to change the TTLs and
# add a IPv6 record.

# Use `terraform state show module.amazon.module.amplify_website.aws_amplify_domain_association.site`
# to see the state, to create these records, then import them.

locals {
  certificate_verification_parts      = split(" CNAME ", aws_amplify_domain_association.site.certificate_verification_dns_record)
  certificate_verification_name       = local.certificate_verification_parts[0]
  certificate_verification_records    = [local.certificate_verification_parts[1]]
  cloudfront_distribution_domain_name = regex("[0-9a-z]+\\.cloudfront\\.net$", local.top_sub_domain)
  top_sub_domain                      = [for element in aws_amplify_domain_association.site.sub_domain : element.dns_record if element.prefix == ""][0]
}

resource "aws_route53_record" "certificate_verification" {
  zone_id = var.route_53_zone_id
  name    = local.certificate_verification_name
  type    = "CNAME"
  ttl     = 500 # 8⅓ minutes, the default from Amplify, so I guess don't mess with it.
  records = local.certificate_verification_records

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_record" "site_a" {
  zone_id = var.route_53_zone_id
  name    = aws_amplify_domain_association.site.domain_name
  type    = "A"

  alias {
    name                   = local.cloudfront_distribution_domain_name
    zone_id                = var.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "site_aaaa" {
  zone_id = var.route_53_zone_id
  name    = aws_amplify_domain_association.site.domain_name
  type    = "AAAA"

  alias {
    name                   = local.cloudfront_distribution_domain_name
    zone_id                = var.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "site_subdomain_cname" {
  zone_id = var.route_53_zone_id
  name    = "${var.sub_domain}.${aws_amplify_domain_association.site.domain_name}"
  type    = "CNAME"
  ttl     = 172800 # 2 days
  records = [local.cloudfront_distribution_domain_name]

  lifecycle {
    prevent_destroy = true
  }
}
