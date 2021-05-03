resource "aws_s3_bucket" "com_redirect" {
  bucket = "robgant.com"
  acl    = "private"

  website {
    redirect_all_requests_to = "rob.gant.ninja"
  }
}

resource "aws_s3_bucket_public_access_block" "com_redirect" {
  bucket = aws_s3_bucket.com_redirect.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_route53_record" "robgant_com_a" {
  zone_id = aws_route53_zone.alt_com.zone_id
  name    = "robgant.com"
  type    = "A"

  alias {
    name                   = aws_s3_bucket.com_redirect.website_domain
    zone_id                = aws_s3_bucket.com_redirect.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket" "name_redirect" {
  bucket = "robgant.name"
  acl    = "private"

  website {
    redirect_all_requests_to = "rob.gant.ninja"
  }
}

resource "aws_s3_bucket_public_access_block" "name_redirect" {
  bucket = aws_s3_bucket.name_redirect.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_route53_record" "robgant_name_a" {
  zone_id = aws_route53_zone.alt_name.zone_id
  name    = "robgant.name"
  type    = "A"

  alias {
    name                   = aws_s3_bucket.name_redirect.website_domain
    zone_id                = aws_s3_bucket.name_redirect.hosted_zone_id
    evaluate_target_health = false
  }
}
