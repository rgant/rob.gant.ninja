moved {
  from = aws_route53_zone.main
  to   = module.amazon.aws_route53_zone.main
}

moved {
  from = aws_route53_record.gant_ninja_verify_bing
  to   = module.amazon.aws_route53_record.gant_ninja_verify_bing
}

moved {
  from = aws_route53_zone.alt_com
  to   = module.amazon.aws_route53_zone.alt_com
}

moved {
  from = aws_route53_record.home_robgant_com_a[0]
  to   = module.amazon.aws_route53_record.home_robgant_com_a
}

moved {
  from = aws_route53_zone.alt_name
  to   = module.amazon.aws_route53_zone.alt_name
}

moved {
  from = aws_route53_record.robgant_name_txt
  to   = module.amazon.aws_route53_record.robgant_name_txt
}

moved {
  from = aws_route53_record.home_robgant_name_a[0]
  to   = module.amazon.aws_route53_record.home_robgant_name_a
}
