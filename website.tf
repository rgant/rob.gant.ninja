resource "aws_s3_bucket" "website" {
  bucket = "rob-gant-ninja"
  # Because CloudFront directly accesses this bucket using origin access identity it does not need to be a website
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "website" {
  depends_on = [
    aws_s3_bucket_ownership_controls.website,
    aws_s3_bucket_public_access_block.website,
  ]

  bucket = aws_s3_bucket.website.id
  # Because this bucket redirects all requests it does not need any public acl or policy for access.
  acl = "private"
}

# I could use hashicorp/dir/template and aws_s3_bucket_object to upload the site
# https://registry.terraform.io/modules/hashicorp/dir/template/latest#uploading-files-to-amazon-s3
# But since I frequently use s3cmd to upload the files without Terraform I'll still with this method.
# But perhaps I shouldn't have this as part of the infrastructure at all.
resource "null_resource" "sync_to_website" {
  triggers = {
    file_hashes = jsonencode({
      for fn in fileset("${path.module}/dist", "**") :
      fn => filesha256("${path.module}/dist/${fn}")
    })
  }

  provisioner "local-exec" {
    command = <<EOF
s3cmd sync \
  --no-preserve \
  --delete-removed \
  --add-header="Cache-Control:max-age=31536000" \
  ./dist/ s3://${aws_s3_bucket.website.id}/;
s3cmd modify \
  --cf-invalidate \
  --add-header="Cache-Control:max-age=86400" \
  s3://${aws_s3_bucket.website.id}/index.html
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

data "aws_iam_policy_document" "cloudfront" {
  statement {
    sid       = "AllowCloudFrontServicePrincipal"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.website.arn]
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

resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "OAC ${aws_s3_bucket.website.bucket}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
    origin_id                = local.website_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  comment             = "Personal Website using S3 and Route 53"
  default_root_object = "index.html" # Should not start with a slash!
  aliases             = ["rob.gant.ninja"]

  default_cache_behavior {
    # Managed-CachingOptimized (Recommended for S3)
    # https://us-east-1.console.aws.amazon.com/cloudfront/v4/home#/policies/cache/658327ea-f89d-4fab-a63d-7e88639e58f6
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.website_origin_id
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
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
    minimum_protocol_version = "TLSv1.2_2021"
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
