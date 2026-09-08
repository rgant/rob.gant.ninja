terraform {
  required_version = ">= 1.16"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.63.0"
    }

    dns = {
      source  = "hashicorp/dns"
      version = ">= 3.6.1"
    }

    http = {
      source  = "hashicorp/http"
      version = ">= 3.6.1"
    }
  }
}
