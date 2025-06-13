terraform {
  required_version = ">= 1.12"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.100.0"
    }

    dns = {
      source  = "hashicorp/dns"
      version = ">= 3.4.3"
    }

    http = {
      source  = "hashicorp/http"
      version = ">= 3.5.0"
    }
  }
}
