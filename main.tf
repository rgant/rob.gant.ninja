terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.41.0"
    }

    http = {
      source  = "hashicorp/http"
      version = "2.1.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "3.1.0"
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
