# my-ip.io API returns 429 Too Many Requests sometimes which is quite annoying
data "http" "my_ip4" {
  url = "https://api4.my-ip.io/ip.txt"
}

# If I have IPv6 enabled on my connection, then this will return it, otherwise v4 is returned
data "http" "my_ip6" {
  url = "https://api.my-ip.io/ip.txt"
}
