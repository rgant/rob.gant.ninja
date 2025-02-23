variable "name" {
  type        = string
  description = "Name of the Amplify app"
}

variable "domain_name" {
  type        = string
  description = "The root domain name for the site: E.g.: gant.ninja"
}

variable "sub_domains" {
  type        = list(string)
  description = "Sub-domains of the root domain_name"
}
