### gant.ninja

resource "aws_route53_zone" "main" {
  name = "gant.ninja"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_record" "gant_ninja_verify_bing" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "d5883115e215d14a407ea420207e22e0.rob.gant.ninja"
  type    = "CNAME"
  ttl     = 172800 # 2 days
  records = ["verify.bing.com"]
}

# Just let AWS manage NS and SOA records.

### robgant.com

resource "aws_route53_zone" "alt_com" {
  name = "robgant.com"

  lifecycle {
    prevent_destroy = true
  }
}

# Just let AWS manage NS and SOA records.

# Don't update these if not running on the home network!
resource "aws_route53_record" "home_robgant_com_a" {
  zone_id = aws_route53_zone.alt_com.zone_id
  name    = "home.robgant.com"
  type    = "A"
  ttl     = 21600 # 6 hours
  records = local.home_a
}

resource "aws_route53_record" "home_robgant_com_aaaa" {
  count   = length(local.home_aaaa) > 0 ? 1 : 0
  zone_id = aws_route53_zone.alt_com.zone_id
  name    = "home.robgant.com"
  type    = "AAAA"
  ttl     = 21600 # 6 hours
  records = local.home_aaaa
}

### robgant.name

resource "aws_route53_zone" "alt_name" {
  name = "robgant.name"

  lifecycle {
    prevent_destroy = true
  }
}

# Just let AWS manage NS and SOA records.

resource "aws_route53_record" "robgant_name_txt" {
  zone_id = aws_route53_zone.alt_name.zone_id
  name    = "robgant.name"
  type    = "TXT"
  ttl     = "86400"
  records = ["google-site-verification=jfV-y--mQ-To_Slx_Ivq3pthtVoEpcycm3aJOMxAyuI"]
}

# Don't update these if not running on the home network!
resource "aws_route53_record" "home_robgant_name_a" {
  zone_id = aws_route53_zone.alt_name.zone_id
  name    = "home.robgant.name"
  type    = "A"
  ttl     = 21600 # 6 hours
  records = local.home_a

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_record" "home_robgant_name_aaaa" {
  count   = length(local.home_aaaa) > 0 ? 1 : 0
  zone_id = aws_route53_zone.alt_name.zone_id
  name    = "home.robgant.name"
  type    = "AAAA"
  ttl     = 21600 # 6 hours
  records = local.home_aaaa
}
