moved {
  from = aws_s3_bucket.website
  to   = module.amazon.aws_s3_bucket.website
}

moved {
  from = aws_s3_bucket_public_access_block.website
  to   = module.amazon.aws_s3_bucket_public_access_block.website
}

moved {
  from = aws_s3_bucket_ownership_controls.website
  to   = module.amazon.aws_s3_bucket_ownership_controls.website
}

moved {
  from = aws_s3_bucket_acl.website
  to   = module.amazon.aws_s3_bucket_acl.website
}

moved {
  from = null_resource.sync_to_website
  to   = module.amazon.null_resource.sync_to_website
}

moved {
  from = aws_acm_certificate.gant_ninja_cert
  to   = module.amazon.aws_acm_certificate.gant_ninja_cert
}

moved {
  from = aws_route53_record.gant_ninja_acm_validation["*.gant.ninja"]
  to   = module.amazon.aws_route53_record.gant_ninja_acm_validation["*.gant.ninja"]
}

moved {
  from = aws_route53_record.gant_ninja_acm_validation["gant.ninja"]
  to   = module.amazon.aws_route53_record.gant_ninja_acm_validation["gant.ninja"]
}

moved {
  from = data.aws_iam_policy_document.cloudfront
  to   = module.amazon.data.aws_iam_policy_document.cloudfront
}

moved {
  from = aws_s3_bucket_policy.website
  to   = module.amazon.aws_s3_bucket_policy.website
}

moved {
  from = aws_cloudfront_origin_access_control.website
  to   = module.amazon.aws_cloudfront_origin_access_control.website
}

moved {
  from = aws_cloudfront_distribution.website
  to   = module.amazon.aws_cloudfront_distribution.website
}

moved {
  from = aws_route53_record.rob_gant_ninja_a
  to   = module.amazon.aws_route53_record.rob_gant_ninja_a
}

moved {
  from = aws_route53_record.rob_gant_ninja_aaaa
  to   = module.amazon.aws_route53_record.rob_gant_ninja_aaaa
}
