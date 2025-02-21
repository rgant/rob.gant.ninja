module "amplify_website" {
  source = "./amplify"
  name   = "www.robgant.com"
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "amplify_website" {
  statement {
    sid       = "AllowAmplifyToListPrefix_${module.amplify_website.amplify_site.id}_${module.amplify_website.amplify_site.branch_name}_"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.website.arn]

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
    resources = ["${aws_s3_bucket.website.arn}/*"]

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
    resources = ["${aws_s3_bucket.website.arn}/*"]

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

resource "null_resource" "deploy_from_s3" {
  triggers = {
    file_hashes = jsonencode({
      for fn in fileset("${path.root}/dist", "**") :
      fn => filesha256("${path.root}/dist/${fn}")
    })
  }

  provisioner "local-exec" {
    command = <<EOF
aws --profile personal --region us-east-1 \
  amplify start-deployment \
  --app-id ${module.amplify_website.amplify_site.id} \
  --branch-name ${module.amplify_website.amplify_site.branch_name} \
  --source-url s3://${aws_s3_bucket.website.id}/ \
  --source-url-type BUCKET_PREFIX
EOF
  }
}
