output "amplify_site" {
  description = "The Amplify site configuration details"
  value = {
    id                         = aws_amplify_app.site.id
    name                       = aws_amplify_app.site.name
    domain                     = aws_amplify_app.site.default_domain
    deployment_branch_name_arn = aws_amplify_branch.site.arn
    branch_name                = aws_amplify_branch.site.branch_name
  }
}
