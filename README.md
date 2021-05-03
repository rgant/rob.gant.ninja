# rob.gant.ninja

Personal Website

## Deployment

Install AWS CLI, S3cmd and Terraform:

```bash
brew tap hashicorp/tap
brew install awscli hashicorp/tap/terraform s3cmd
```

Configure AWS: `aws configure`. Use profiles, don't setup default credentials. If
you want to stop tying `--profile` then use `export AWS_PROFILE=personal`.

Configure s3cmd: `s3cmd --configure`

### Manually sync website files

Terraform might update the website bucket if you mark that resource as tainted,
but it is probably easier to just do the command yourself.

```bash
s3cmd sync --no-preserve --cf-invalidate --cf-invalidate-default-index --delete-removed --exclude=* --rinclude-from=dist-files ./ s3://rob-gant-ninja/
```

By default `s3cmd sync` preserves file attributes as metadata on the s3 key and that
data is then converted into an HTTP header in the response. Using `--no-preserve`
won't impact the ability of [sync to check](https://github.com/s3tools/s3cmd/blob/ae6a635312abba7e5353f257e60e845034ad9ecf/S3/Config.py#L163)
for changed files.

### Future

When we build the website we should be able to cachebust the asset/css/img/js file
names using a hash and we won't need `--cf-invalidate`.

Should also setup [Cache-Control Headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
once we have cachebusting setup.

## Static Site Generator

* [Zodiac](https://github.com/nuex/zodiac)
* [Webpack for Static Sites](https://medium.com/riow/webpack-for-static-sites-9cbfd8363abb)
* [How To Bundle A Simple Static Site Using Webpack](https://www.sitepoint.com/bundle-static-site-webpack/)
* [Spike](https://www.spike.cf/)
