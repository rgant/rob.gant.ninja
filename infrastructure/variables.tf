variable "check_ip" {
  type        = bool
  description = "Lookup dynamic home IP, or use existing values from current DNS"
}

variable "region" {
  type        = string
  description = "AWS region to use for resources."
  default     = "us-east-1"
}
