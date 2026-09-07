<!-- BEGIN_TF_DOCS -->

# Terraform for AWS static website hosting

## Update Dynamic IPs

To update the dynamic IP of the home network, set the `check_ip` variable to
true:

```sh
terraform plan -var="check_ip=true"
```

Run this only from the home network. From any other network it writes the wrong
address into `home.robgant.com` and `home.robgant.name`.

The default is `false`. The A records then keep the address that DNS holds now.

The AAAA records always come from DNS, because the home network has no IPv6.

## Requirements

| Name                                                                     | Version   |
| ------------------------------------------------------------------------ | --------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.14   |
| <a name="requirement_aws"></a> [aws](#requirement_aws)                   | >= 6.30.0 |
| <a name="requirement_dns"></a> [dns](#requirement_dns)                   | >= 3.5.0  |
| <a name="requirement_http"></a> [http](#requirement_http)                | >= 3.5.0  |

## Providers

| Name                                                               | Version   |
| ------------------------------------------------------------------ | --------- |
| <a name="provider_aws"></a> [aws](#provider_aws)                   | >= 6.30.0 |
| <a name="provider_dns"></a> [dns](#provider_dns)                   | >= 3.5.0  |
| <a name="provider_http"></a> [http](#provider_http)                | >= 3.5.0  |
| <a name="provider_terraform"></a> [terraform](#provider_terraform) | n/a       |

## Modules

| Name                                                                             | Source      | Version |
| -------------------------------------------------------------------------------- | ----------- | ------- |
| <a name="module_amplify_website"></a> [amplify_website](#module_amplify_website) | ./amplify   | n/a     |
| <a name="module_redirect_bucket"></a> [redirect_bucket](#module_redirect_bucket) | ./s3-bucket | n/a     |
| <a name="module_website_bucket"></a> [website_bucket](#module_website_bucket)    | ./s3-bucket | n/a     |

## Resources

| Name                                                                                                                                                                      | Type        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [aws_acm_certificate.alt_cert](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate)                                               | resource    |
| [aws_budgets_budget.monthly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/budgets_budget)                                                  | resource    |
| [aws_cloudfront_distribution.redirect](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution)                               | resource    |
| [aws_cloudfront_response_headers_policy.security_headers](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_response_headers_policy) | resource    |
| [aws_route53_record.alt_acm_validation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                       | resource    |
| [aws_route53_record.gant_ninja_verify_bing](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                   | resource    |
| [aws_route53_record.home_robgant_com_a](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                       | resource    |
| [aws_route53_record.home_robgant_com_aaaa](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                    | resource    |
| [aws_route53_record.home_robgant_name_a](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                      | resource    |
| [aws_route53_record.home_robgant_name_aaaa](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                   | resource    |
| [aws_route53_record.redirect_a](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                               | resource    |
| [aws_route53_record.redirect_aaaa](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                            | resource    |
| [aws_route53_record.robgant_name_txt](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record)                                         | resource    |
| [aws_route53_zone.alt_com](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone)                                                      | resource    |
| [aws_route53_zone.alt_name](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone)                                                     | resource    |
| [aws_route53_zone.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone)                                                         | resource    |
| [aws_s3_bucket_policy.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy)                                              | resource    |
| [aws_s3_bucket_website_configuration.redirect](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_website_configuration)               | resource    |
| [terraform_data.amplify_custom_headers](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data)                                           | resource    |
| [terraform_data.deploy_from_s3](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data)                                                   | resource    |
| [terraform_data.sync_to_website](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data)                                                  | resource    |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity)                                             | data source |
| [aws_iam_policy_document.amplify_website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document)                             | data source |
| [dns_a_record_set.home_a](https://registry.terraform.io/providers/hashicorp/dns/latest/docs/data-sources/a_record_set)                                                    | data source |
| [dns_aaaa_record_set.home_aaaa](https://registry.terraform.io/providers/hashicorp/dns/latest/docs/data-sources/aaaa_record_set)                                           | data source |
| [http_http.my_ip4](https://registry.terraform.io/providers/hashicorp/http/latest/docs/data-sources/http)                                                                  | data source |

## Inputs

| Name                                                                  | Description                                                     | Type     | Default       | Required |
| --------------------------------------------------------------------- | --------------------------------------------------------------- | -------- | ------------- | :------: |
| <a name="input_alerts_email"></a> [alerts_email](#input_alerts_email) | Email address for budget alerts                                 | `string` | n/a           |   yes    |
| <a name="input_aws_profile"></a> [aws_profile](#input_aws_profile)    | A profile name. See `aws configure list-profiles`               | `string` | n/a           |   yes    |
| <a name="input_check_ip"></a> [check_ip](#input_check_ip)             | Lookup dynamic home IP, or use existing values from current DNS | `bool`   | n/a           |   yes    |
| <a name="input_region"></a> [region](#input_region)                   | AWS region to use for resources.                                | `string` | `"us-east-1"` |    no    |
| <a name="input_script_sri"></a> [script_sri](#input_script_sri)       | SRI hashes for scripts-src in the CSP header                    | `string` | `""`          |    no    |
| <a name="input_style_sri"></a> [style_sri](#input_style_sri)          | SRI hashes for style-src in the CSP header                      | `string` | `""`          |    no    |

## Outputs

No outputs.

<!-- END_TF_DOCS -->
