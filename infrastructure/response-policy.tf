resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = "OurSecurityHeadersPolicy"
  comment = "Adds our security headers to every response"

  security_headers_config {
    content_security_policy {
      content_security_policy = "default-src 'none'; font-src https://fonts.gstatic.com; img-src 'self'; manifest-src 'self'; script-src 'self' https://code.jquery.com/jquery-3.7.1.slim.min.js; style-src 'self' https://fonts.googleapis.com/"
      override                = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "same-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      override                   = true
      preload                    = true
    }

    xss_protection {
      mode_block = true
      override   = true
      protection = true
    }
  }
}
