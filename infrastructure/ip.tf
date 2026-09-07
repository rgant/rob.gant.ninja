/**
 * This setup is designed to not query the current IP of my home network unless requested by setting
 * `var.check_ip` to `true`. It defaults to `false`.
 */

# ifconfig.io ends the address with a newline, so `chomp` removes it before Route53 sees it.
data "http" "my_ip4" {
  count = var.check_ip ? 1 : 0
  url   = "https://ifconfig.io/ip"
}

# Need to lookup the home.robgant.name address because the home network router owns home.robgant.com
data "dns_a_record_set" "home_a" {
  host = "home.robgant.name"
}

data "dns_aaaa_record_set" "home_aaaa" {
  host = "home.robgant.name"
}

# If check_ip is true, then data.http.my_ip4 sets the A records. Otherwise the DNS lookup of the
# current address is used.
# The home network has no IPv6, so the AAAA records always come from DNS. home.robgant.name holds no
# AAAA record, so home_aaaa is empty and the AAAA resources in dns.tf get `count = 0`.
locals {
  home_a    = var.check_ip ? [chomp(data.http.my_ip4[0].response_body)] : data.dns_a_record_set.home_a.addrs
  home_aaaa = data.dns_aaaa_record_set.home_aaaa.addrs
}
