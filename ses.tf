resource "aws_ses_domain_identity" "main" {
  domain = aws_route53_zone.main.name
}

resource "aws_ses_email_identity" "main" {
  email = "robgant@gmail.com"
}

resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_route53_record" "amazonses_verification_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_amazonses.${aws_ses_domain_identity.main.id}"
  type    = "TXT"
  ttl     = "86400"
  records = [aws_ses_domain_identity.main.verification_token]
}

resource "aws_route53_record" "amazonses_mx" {
  zone_id = aws_route53_zone.main.id
  name    = aws_route53_zone.main.name
  type    = "MX"
  ttl     = "86400"
  records = ["10 inbound-smtp.${var.region}.amazonaws.com"]
}

# Don't really need these as ses is only for recieving email, but doesn't hurt.
resource "aws_route53_record" "amazonses_dkim_records" {
  count   = length(aws_ses_domain_dkim.main.dkim_tokens)
  zone_id = aws_route53_zone.main.zone_id
  name    = "${element(aws_ses_domain_dkim.main.dkim_tokens, count.index)}._domainkey.${aws_route53_zone.main.name}"
  type    = "CNAME"
  ttl     = "86400"
  records = ["${element(aws_ses_domain_dkim.main.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

# Don't really need this as ses is only for recieving email, but doesn't hurt.
resource "aws_route53_record" "amazonses_txt" {
  zone_id = aws_route53_zone.main.id
  name    = aws_route53_zone.main.name
  type    = "TXT"
  ttl     = "86400"
  records = ["v=spf1 include:amazonses.com -all"]
}

# Don't really need this as ses is only for recieving email, and this could hurt
resource "aws_route53_record" "amazonses_dmarc" {
  zone_id = aws_route53_zone.main.id
  name    = "_dmarc.${aws_route53_zone.main.name}"
  type    = "TXT"
  ttl     = "86400"
  records = ["v=DMARC1; p=reject"]
}

resource "aws_s3_bucket" "emails" {
  bucket = "email-gant-ninja"
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "emails" {
  bucket = aws_s3_bucket.emails.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "emails" {
  statement {
    sid       = "AllowSESPuts-1500409465678"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.emails.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "aws:Referer"
      values   = ["638703125017"]
    }

    principals {
      type        = "Service"
      identifiers = ["ses.amazonaws.com"]
    }
  }
}

resource "aws_s3_bucket_policy" "emails" {
  bucket = aws_s3_bucket.emails.id
  policy = data.aws_iam_policy_document.emails.json
}

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "default-rule-set"
}

resource "aws_ses_receipt_rule" "store" {
  name          = "administrator-gant-ninja"
  rule_set_name = "default-rule-set"
  recipients    = ["administrator@gant.ninja"]
  enabled       = true
  scan_enabled  = true

  s3_action {
    bucket_name = aws_s3_bucket.emails.bucket
    position    = 1
  }
}
