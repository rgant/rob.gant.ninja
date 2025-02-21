terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.87.0"
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
