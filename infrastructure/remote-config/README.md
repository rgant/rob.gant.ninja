<!-- BEGIN_TF_DOCS -->
# Terraform state S3 backend

This module is used to create the S3 bucket for the [main](/main.tf) Terraform
state. It should only be necessary to execute it once, but is done to preserve
the configuration.

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.87.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.88.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_s3_bucket.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_ownership_controls.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_ownership_controls) | resource |
| [aws_s3_bucket_public_access_block.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_versioning.terraform_state](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_region"></a> [region](#input\_region) | AWS region to use for tfstate bucket. | `string` | `"us-east-1"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_tfstate_bucket_name"></a> [tfstate\_bucket\_name](#output\_tfstate\_bucket\_name) | n/a |
<!-- END_TF_DOCS -->