/**
 * Cloudfront Function
 * Terraform does not currently support: https://github.com/hashicorp/terraform-provider-aws/issues/19225
 * This replaces the Lambda@EDGE function of the same name.
 * Based on: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example-function-add-security-headers.html
 */
function handler(event) {
    // const and let are not supported
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
    var response = event.response;
    var headers = response.headers;

    // Set HTTP security headers in lower case because that is what Cloudfront Functions require.
    // Error Message: The CloudFront function returned an invalid value: response.headers must have header names in lower case.
    headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubdomains; preload' };
    headers['content-security-policy'] = {
        value: "default-src 'none'; font-src https://fonts.gstatic.com; img-src 'self'; script-src 'self' https://code.jquery.com/jquery-3.6.0.slim.min.js; style-src 'self' https://fonts.googleapis.com/",
    };
    headers['x-content-type-options'] = { value: 'nosniff' };
    headers['x-frame-options'] = { value: 'DENY' };
    headers['x-xss-protection'] = { value: '1; mode=block' };
    headers['referrer-policy'] = { value: 'same-origin' };

    // Return the response to viewers
    return response;
}
