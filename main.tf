terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.49.0"
    }

    http = {
      source  = "hashicorp/http"
      version = "3.4.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }
}

variable "region" {
  default = "us-east-1"
}

provider "aws" {
  profile = "personal"
  region  = var.region
}
