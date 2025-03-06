variable "domain_name" {
  type        = string
  description = "The root domain name for the site: E.g.: gant.ninja"
}

variable "hosted_zone_id" {
  type        = string
  description = "All Cloudfront distributions share the same hosted zone id: 'Z2FDTNDATAQYW2'"
  default     = "Z2FDTNDATAQYW2" # Only including a default here incase the parent module some day doesn't include a aws_cloudfront_distribution
}

variable "name" {
  type        = string
  description = "Name of the Amplify app"
}

variable "route_53_zone_id" {
  type        = string
  description = "The zone id of the aws_route53_zone that matches domain_name"
}

variable "script_sri" {
  type        = string
  description = "SRI hashes for scripts-src in the CSP header"
  default     = ""
}

variable "style_sri" {
  type        = string
  description = "SRI hashes for style-src in the CSP header"
  default     = ""
}

variable "sub_domain" {
  type        = string
  description = "Sub-domain of the root domain_name for the primary website"
}
