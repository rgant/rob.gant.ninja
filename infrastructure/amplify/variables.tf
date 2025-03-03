variable "domain_name" {
  type        = string
  description = "The root domain name for the site: E.g.: gant.ninja"
}

variable "name" {
  type        = string
  description = "Name of the Amplify app"
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
