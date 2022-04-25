resource "aws_s3_bucket" "website" {
  bucket = "rob-gant-ninja"
  acl    = "private"

  # Because CloudFront directly accesses this bucket using origin access identity it does not need to be a website
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Using aws_s3_bucket_object to upload the site means we need to figure out the MIME types, so just
# stick with s3cmd
resource "null_resource" "sync_to_website" {
  provisioner "local-exec" {
    command = <<EOF
s3cmd sync \
  --no-preserve \
  --cf-invalidate \
  --cf-invalidate-default-index \
  --delete-removed \
  ./dist/ s3://${aws_s3_bucket.website.id}
EOF
  }
}

resource "aws_acm_certificate" "gant_ninja_cert" {
  domain_name               = "gant.ninja"
  validation_method         = "DNS"
  subject_alternative_names = ["*.gant.ninja"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "gant_ninja_acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.gant_ninja_cert.domain_validation_options : dvo.domain_name => {
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
  zone_id         = aws_route53_zone.main.zone_id
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "access-identity.s3.amazonaws.com"
}

data "aws_iam_policy_document" "cloudfront" {
  statement {
    sid       = "2"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.cloudfront.json
}

locals {
  website_origin_id = "S3-${aws_s3_bucket.website.bucket}"
}

resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id   = local.website_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Personal Website using S3 and Route 53"
  default_root_object = "index.html" # Should not start with a slash!
  aliases             = ["rob.gant.ninja"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.website_origin_id

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
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.gant_ninja_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }

  custom_error_response {
    # S3 responds with a 403 for mising files.
    error_code            = 403
    response_code         = 404
    error_caching_min_ttl = 300
    response_page_path    = "/404.html"
  }

  wait_for_deployment = false
}

resource "aws_route53_record" "rob_gant_ninja_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "rob.gant.ninja"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "rob_gant_ninja_aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "rob.gant.ninja"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}
