variable "name" {
  type        = string
  description = "Name of the Amplify app"
}

variable "domain_name" {
  type        = string
  description = "The root domain name for the site: E.g.: gant.ninja"
}

variable "sub_domain" {
  type        = string
  description = "Sub-domain of the root domain_name for the primary website"
}
