# `terraform validate` reports "Module not installed" here, but that is seemingly an error in the validate command
# https://discuss.hashicorp.com/t/is-there-a-way-to-fix-module-not-installed-for-local-submodules/54067
module "website_bucket" {
  source      = "./s3-bucket"
  bucket_name = "rob-gant-ninja"
}

# I could use hashicorp/dir/template and aws_s3_bucket_object to upload the site
# https://registry.terraform.io/modules/hashicorp/dir/template/latest#uploading-files-to-amazon-s3
# But since I frequently use s3cmd to upload the files without Terraform I'll stick with this method.
resource "terraform_data" "sync_to_website" {
  triggers_replace = {
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
  ./dist/ s3://${module.website_bucket.s3_bucket.id}/;
s3cmd modify \
  --cf-invalidate \
  --add-header="Cache-Control:public,max-age=2592000,stale-while-revalidate=86400" \
  s3://${module.website_bucket.s3_bucket.id}/index.html
EOF
  }
}

