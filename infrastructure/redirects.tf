# `terraform validate` reports "Module not installed" here, but that is seemingly an error in the validate command
# https://discuss.hashicorp.com/t/is-there-a-way-to-fix-module-not-installed-for-local-submodules/54067
module "redirect_bucket" {
  source      = "./s3-bucket"
  bucket_name = "robgant-redirect"
}

# https?://robgant.com & https?://robgant.name should redirect to https://rob.gant.ninja
resource "aws_s3_bucket_website_configuration" "redirect" {
  bucket = module.redirect_bucket.s3_bucket.id

  redirect_all_requests_to {
    host_name = "rob.gant.ninja"
    protocol  = "https"
  }
}

resource "aws_acm_certificate" "alt_cert" {
  domain_name               = "robgant.com"
  validation_method         = "DNS"
  subject_alternative_names = ["*.robgant.com", "robgant.name", "*.robgant.name"]
}

resource "aws_route53_record" "alt_acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.alt_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 86400
  type            = each.value.type
  zone_id         = regex("\\.[a-z]+\\.$", each.value.name) == ".com." ? aws_route53_zone.alt_com.zone_id : aws_route53_zone.alt_name.zone_id
}

locals {
  redirect_origin_id = "S3-Website-${aws_s3_bucket_website_configuration.redirect.website_endpoint}"
}

resource "aws_cloudfront_distribution" "redirect" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.redirect.website_endpoint
    origin_id   = local.redirect_origin_id

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true
  http_version    = "http2and3"
  is_ipv6_enabled = true
  comment         = "Redirect alternative domains to rob.gant.ninja. Includes SSL support."
  aliases = [
    "robgant.com",
    "*.robgant.com",
    "robgant.name",
    "*.robgant.name",
  ]

  default_cache_behavior {
    # Managed-CachingOptimized (Recommended for S3)
    # https://us-east-1.console.aws.amazon.com/cloudfront/v4/home#/policies/cache/658327ea-f89d-4fab-a63d-7e88639e58f6
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.redirect_origin_id
    compress                   = true
    viewer_protocol_policy     = "allow-all"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.alt_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  wait_for_deployment = false
}

resource "aws_route53_record" "redirect_a" {
  for_each = toset(aws_cloudfront_distribution.redirect.aliases)
  zone_id  = regex("\\.[a-z]+$", each.value) == ".com" ? aws_route53_zone.alt_com.zone_id : aws_route53_zone.alt_name.zone_id
  name     = each.value
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "redirect_aaaa" {
  for_each = toset(aws_cloudfront_distribution.redirect.aliases)
  zone_id  = regex("\\.[a-z]+$", each.value) == ".com" ? aws_route53_zone.alt_com.zone_id : aws_route53_zone.alt_name.zone_id
  name     = each.value
  type     = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
    evaluate_target_health = false
  }
}
