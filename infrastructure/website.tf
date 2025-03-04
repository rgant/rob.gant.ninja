# Because CloudFront directly accesses this bucket using origin access identity it does not need to be a website
resource "aws_s3_bucket" "website" {
  bucket = "rob-gant-ninja"
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

# This may not be used anymore, got an error adding it to the new bucket in remote-config
resource "aws_s3_bucket_acl" "website" {
  depends_on = [
    aws_s3_bucket_ownership_controls.website,
    aws_s3_bucket_public_access_block.website,
  ]

  bucket = aws_s3_bucket.website.id
  acl    = "private" # Because this bucket is a CloudFront origin it does not need to be public.
}

# I could use hashicorp/dir/template and aws_s3_bucket_object to upload the site
# https://registry.terraform.io/modules/hashicorp/dir/template/latest#uploading-files-to-amazon-s3
# But since I frequently use s3cmd to upload the files without Terraform I'll stick with this method.
resource "null_resource" "sync_to_website" {
  triggers = {
    file_hashes = jsonencode({
      for fn in fileset("${path.root}/dist", "**") :
      fn => filesha256("${path.root}/dist/${fn}")
    })
  }

  provisioner "local-exec" {
    command = <<EOF
s3cmd sync \
  --no-preserve \
  --delete-removed \
  --add-header="Cache-Control:public,max-age=31536000" \
  ./dist/ s3://${aws_s3_bucket.website.id}/;
s3cmd modify \
  --cf-invalidate \
  --add-header="Cache-Control:public,max-age=2592000,stale-while-revalidate=86400" \
  s3://${aws_s3_bucket.website.id}/index.html
EOF
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.amplify_website.json
}
