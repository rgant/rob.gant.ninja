variable "aws_profile" {
  type        = string
  description = "A profile name. See `aws configure list-profiles`"
}

variable "check_ip" {
  type        = bool
  description = "Lookup dynamic home IP, or use existing values from current DNS"
}

variable "region" {
  type        = string
  description = "AWS region to use for resources."
  default     = "us-east-1"
}
