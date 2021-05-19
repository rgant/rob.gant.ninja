### https?://robgant.com & https?://robgant.name should redirect to https://rob.gant.ninja
# S3 Bucket
resource "aws_s3_bucket" "redirect" {
  bucket = "robgant-redirect"
  # Because this bucket redirects all requests it does not need any public acl or policy for access.
  acl = "private"

  website {
    redirect_all_requests_to = "https://rob.gant.ninja"
  }
}

resource "aws_s3_bucket_public_access_block" "redirect" {
  bucket = aws_s3_bucket.redirect.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
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
  redirect_origin_id = "S3-Website-${aws_s3_bucket.redirect.website_endpoint}"
}

resource "aws_cloudfront_distribution" "redirect" {
  origin {
    domain_name = aws_s3_bucket.redirect.website_endpoint
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
  is_ipv6_enabled = true
  comment         = "Redirect alternative domains to rob.gant.ninja. Includes SSL support."
  aliases = [
    "robgant.com",
    "*.robgant.com",
    "robgant.name",
    "*.robgant.name",
  ]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.redirect_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.security_headers.arn
    }

    min_ttl                = 0
    default_ttl            = 604800
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "allow-all"
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
    minimum_protocol_version = "TLSv1.2_2019"
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
