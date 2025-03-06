# `terraform validate` reports "Module not installed" here, but that is seemingly an error in the validate command
# https://discuss.hashicorp.com/t/is-there-a-way-to-fix-module-not-installed-for-local-submodules/54067
module "amplify_website" {
  source           = "./amplify"
  name             = "rob.gant.ninja"
  domain_name      = "gant.ninja"
  hosted_zone_id   = aws_cloudfront_distribution.redirect.hosted_zone_id
  route_53_zone_id = aws_route53_zone.main.zone_id
  script_sri       = var.script_sri
  style_sri        = var.style_sri
  sub_domain       = "rob"
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "amplify_website" {
  statement {
    sid       = "AllowAmplifyToListPrefix_${module.amplify_website.amplify_site.id}_${module.amplify_website.amplify_site.branch_name}_"
    actions   = ["s3:ListBucket"]
    resources = [module.website_bucket.s3_bucket.arn]

    principals {
      type        = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [urlencode(module.amplify_website.amplify_site.deployment_branch_name_arn)]
    }

    condition {
      test     = "StringEquals"
      variable = "s3:prefix"
      values   = [""]
    }
  }

  statement {
    sid       = "AllowAmplifyToReadPrefix_${module.amplify_website.amplify_site.id}_${module.amplify_website.amplify_site.branch_name}_"
    actions   = ["s3:GetObject"]
    resources = ["${module.website_bucket.s3_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [urlencode(module.amplify_website.amplify_site.deployment_branch_name_arn)]
    }
  }

  statement {
    actions   = ["s3:*"]
    effect    = "Deny"
    resources = ["${module.website_bucket.s3_bucket.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = module.website_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.amplify_website.json
}

# Manually deploy the S3
resource "null_resource" "deploy_from_s3" {
  triggers = {
    file_hashes = jsonencode({
      for fn in fileset("${path.root}/dist", "**") :
      fn => filesha256("${path.root}/dist/${fn}")
    })
  }

  depends_on = [null_resource.sync_to_website]

  provisioner "local-exec" {
    command = <<EOF
aws --profile ${var.aws_profile} --region ${var.region} \
  amplify start-deployment \
  --app-id ${module.amplify_website.amplify_site.id} \
  --branch-name ${module.amplify_website.amplify_site.branch_name} \
  --source-url s3://${module.website_bucket.s3_bucket.id}/ \
  --source-url-type BUCKET_PREFIX
EOF
  }
}
