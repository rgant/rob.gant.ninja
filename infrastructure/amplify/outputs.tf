output "amplify_site" {
  description = "The Amplify site configuration details"
  value = {
    branch_name                = aws_amplify_branch.site.branch_name
    deployment_branch_name_arn = aws_amplify_branch.site.arn
    domain                     = aws_amplify_app.site.default_domain
    id                         = aws_amplify_app.site.id
    name                       = aws_amplify_app.site.name
  }
}

output "custom_headers" {
  description = "The rendered custom-headers.yaml template"
  value = local.custom_headers
}
