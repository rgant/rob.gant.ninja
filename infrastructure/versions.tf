terraform {
  required_version = ">= 1.11"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.93.0"
    }

    dns = {
      source  = "hashicorp/dns"
      version = ">= 3.4.2"
    }

    http = {
      source  = "hashicorp/http"
      version = ">= 3.4.5"
    }

    null = {
      source  = "hashicorp/null"
      version = ">= 3.2.3"
    }
  }
}
