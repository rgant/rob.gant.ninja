terraform {
  required_version = ">= 1.14"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.30.0"
    }

    dns = {
      source  = "hashicorp/dns"
      version = ">= 3.5.0"
    }

    http = {
      source  = "hashicorp/http"
      version = ">= 3.5.0"
    }
  }
}
