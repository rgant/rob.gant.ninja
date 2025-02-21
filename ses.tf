moved {
  from = aws_ses_domain_identity.main
  to   = module.amazon.aws_ses_domain_identity.main
}

moved {
  from = aws_ses_email_identity.main
  to   = module.amazon.aws_ses_email_identity.main
}

moved {
  from = aws_ses_domain_dkim.main
  to   = module.amazon.aws_ses_domain_dkim.main
}

moved {
  from = aws_route53_record.amazonses_verification_record
  to   = module.amazon.aws_route53_record.amazonses_verification_record
}

moved {
  from = aws_route53_record.amazonses_mx
  to   = module.amazon.aws_route53_record.amazonses_mx
}

moved {
  from = aws_route53_record.amazonses_dkim_records[0]
  to   = module.amazon.aws_route53_record.amazonses_dkim_records[0]
}

moved {
  from = aws_route53_record.amazonses_dkim_records[1]
  to   = module.amazon.aws_route53_record.amazonses_dkim_records[1]
}

moved {
  from = aws_route53_record.amazonses_dkim_records[2]
  to   = module.amazon.aws_route53_record.amazonses_dkim_records[2]
}

moved {
  from = aws_route53_record.amazonses_txt
  to   = module.amazon.aws_route53_record.amazonses_txt
}

moved {
  from = aws_route53_record.amazonses_dmarc
  to   = module.amazon.aws_route53_record.amazonses_dmarc
}

moved {
  from = aws_s3_bucket.emails
  to   = module.amazon.aws_s3_bucket.emails
}

moved {
  from = aws_s3_bucket_public_access_block.emails
  to   = module.amazon.aws_s3_bucket_public_access_block.emails
}

moved {
  from = aws_s3_bucket_ownership_controls.emails
  to   = module.amazon.aws_s3_bucket_ownership_controls.emails
}

moved {
  from = aws_s3_bucket_acl.emails
  to   = module.amazon.aws_s3_bucket_acl.emails
}

moved {
  from = data.aws_iam_policy_document.emails
  to   = module.amazon.data.aws_iam_policy_document.emails
}

moved {
  from = aws_s3_bucket_policy.emails
  to   = module.amazon.aws_s3_bucket_policy.emails
}

moved {
  from = aws_ses_receipt_rule_set.main
  to   = module.amazon.aws_ses_receipt_rule_set.main
}

moved {
  from = aws_ses_receipt_rule.store
  to   = module.amazon.aws_ses_receipt_rule.store
}
