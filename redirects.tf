moved {
  from = aws_s3_bucket.redirect
  to   = module.amazon.aws_s3_bucket.redirect
}

moved {
  from = aws_s3_bucket_website_configuration.redirect
  to   = module.amazon.aws_s3_bucket_website_configuration.redirect
}

moved {
  from = aws_s3_bucket_ownership_controls.redirect
  to   = module.amazon.aws_s3_bucket_ownership_controls.redirect
}

moved {
  from = aws_s3_bucket_public_access_block.redirect
  to   = module.amazon.aws_s3_bucket_public_access_block.redirect
}

moved {
  from = aws_s3_bucket_acl.redirect
  to   = module.amazon.aws_s3_bucket_acl.redirect
}

moved {
  from = aws_acm_certificate.alt_cert
  to   = module.amazon.aws_acm_certificate.alt_cert
}

moved {
  from = aws_route53_record.alt_acm_validation["*.robgant.com"]
  to   = module.amazon.aws_route53_record.alt_acm_validation["*.robgant.com"]
}

moved {
  from = aws_route53_record.alt_acm_validation["*.robgant.name"]
  to   = module.amazon.aws_route53_record.alt_acm_validation["*.robgant.name"]
}

moved {
  from = aws_route53_record.alt_acm_validation["robgant.com"]
  to   = module.amazon.aws_route53_record.alt_acm_validation["robgant.com"]
}

moved {
  from = aws_route53_record.alt_acm_validation["robgant.name"]
  to   = module.amazon.aws_route53_record.alt_acm_validation["robgant.name"]
}

moved {
  from = aws_cloudfront_response_headers_policy.security_headers
  to   = module.amazon.aws_cloudfront_response_headers_policy.security_headers
}

moved {
  from = aws_cloudfront_distribution.redirect
  to   = module.amazon.aws_cloudfront_distribution.redirect
}

moved {
  from = aws_route53_record.redirect_a["*.robgant.com"]
  to   = module.amazon.aws_route53_record.redirect_a["*.robgant.com"]
}

moved {
  from = aws_route53_record.redirect_a["*.robgant.name"]
  to   = module.amazon.aws_route53_record.redirect_a["*.robgant.name"]
}

moved {
  from = aws_route53_record.redirect_a["robgant.com"]
  to   = module.amazon.aws_route53_record.redirect_a["robgant.com"]
}

moved {
  from = aws_route53_record.redirect_a["robgant.name"]
  to   = module.amazon.aws_route53_record.redirect_a["robgant.name"]
}

moved {
  from = aws_route53_record.redirect_aaaa["*.robgant.com"]
  to   = module.amazon.aws_route53_record.redirect_aaaa["*.robgant.com"]
}

moved {
  from = aws_route53_record.redirect_aaaa["*.robgant.name"]
  to   = module.amazon.aws_route53_record.redirect_aaaa["*.robgant.name"]
}

moved {
  from = aws_route53_record.redirect_aaaa["robgant.com"]
  to   = module.amazon.aws_route53_record.redirect_aaaa["robgant.com"]
}

moved {
  from = aws_route53_record.redirect_aaaa["robgant.name"]
  to   = module.amazon.aws_route53_record.redirect_aaaa["robgant.name"]
}
