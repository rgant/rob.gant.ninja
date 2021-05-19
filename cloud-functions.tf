###
# Replaced the Lambda@EDGE with CloudFront Function
###

resource "aws_cloudfront_function" "security_headers" {
  name    = "injectSecurityHeaders"
  runtime = "cloudfront-js-1.0"
  comment = "Add security headers to origin-response"
  publish = true
  code    = file("./cloud_functions/injectSecurityHeaders.js")
}
