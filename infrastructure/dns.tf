### gant.ninja

resource "aws_route53_zone" "main" {
  name = "gant.ninja"
}

resource "aws_route53_record" "gant_ninja_verify_bing" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "d5883115e215d14a407ea420207e22e0.rob.gant.ninja"
  type    = "CNAME"
  ttl     = "86400"
  records = ["verify.bing.com"]
}

# Just let AWS manage NS and SOA records.

### robgant.com

resource "aws_route53_zone" "alt_com" {
  name = "robgant.com"
}

# Just let AWS manage NS and SOA records.

# Don't update these if not running on the home network!
resource "aws_route53_record" "home_robgant_com_a" {
  count   = data.http.my_ip4.response_body != "" ? 1 : 0
  zone_id = aws_route53_zone.alt_com.zone_id
  name    = "home.robgant.com"
  type    = "A"
  ttl     = "300"
  records = [data.http.my_ip4.response_body]
}

resource "aws_route53_record" "home_robgant_com_aaaa" {
  count   = length(regexall("^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$", data.http.my_ip6.response_body)) > 0 ? 1 : 0
  zone_id = aws_route53_zone.alt_com.zone_id
  name    = "home.robgant.com"
  type    = "AAAA"
  ttl     = "300"
  records = [data.http.my_ip6.response_body]
}

### robgant.name

resource "aws_route53_zone" "alt_name" {
  name = "robgant.name"
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
  count   = data.http.my_ip4.response_body != "" ? 1 : 0
  zone_id = aws_route53_zone.alt_name.zone_id
  name    = "home.robgant.name"
  type    = "A"
  ttl     = "300"
  records = [data.http.my_ip4.response_body]
}

resource "aws_route53_record" "home_robgant_name_aaaa" {
  count   = length(regexall("^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$", data.http.my_ip6.response_body)) > 0 ? 1 : 0
  zone_id = aws_route53_zone.alt_name.zone_id
  name    = "home.robgant.name"
  type    = "AAAA"
  ttl     = "300"
  records = [data.http.my_ip6.response_body]
}
