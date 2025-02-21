/**
 * This setup is designed to not query the current IP of my home network unless requested by setting
 * `var.check_ip` to `true`. It defaults to `false`.
 */

# my-ip.io API returns 429 Too Many Requests sometimes which is quite annoying
data "http" "my_ip4" {
  count = var.check_ip ? 1 : 0
  url   = "https://api4.my-ip.io/ip.txt"
}

# If I have IPv6 enabled on my connection, then this will return it, otherwise v4 is returned
data "http" "my_ip6" {
  count = var.check_ip ? 1 : 0
  url   = "https://api.my-ip.io/ip.txt"
}

# Need to lookup the home.robgant.name address because the home network router owns home.robgant.com
data "dns_a_record_set" "home_a" {
  host = "home.robgant.name"
}

data "dns_aaaa_record_set" "home_aaaa" {
  host = "home.robgant.name"
}

# If check_ip is true, then data.http.* will be set and we will use that value to set the home network
# IPs. Otherwise the DNS lookup of the current IPs will be used.
locals {
  home_a    = var.check_ip ? [data.http.my_ip4[0].response_body] : data.dns_a_record_set.home_a.addrs
  home_aaaa = var.check_ip ? (length(regexall("^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$", data.http.my_ip6[0].response_body)) > 0 ? [data.http.my_ip6[0].response_body] : []) : data.dns_aaaa_record_set.home_aaaa.addrs
}
