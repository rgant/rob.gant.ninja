# Using s3cmd

No longer want to do this manually as the Amplify website needs to be deployed
after updating the bucket, so let Terraform handle it!

## Manually sync website files

Terraform will update the website bucket if you mark that resource as tainted,
but it is probably easier to just do the command yourself.

```sh
s3cmd sync --no-preserve --delete-removed --add-header="Cache-Control:public,max-age=31536000,immutable" ./dist/ s3://rob-gant-ninja/
s3cmd modify --cf-invalidate-default-index --add-header="Cache-Control:public,max-age=2592000,stale-while-revalidate=86400" s3://rob-gant-ninja/index.html
```

By default `s3cmd sync` preserves file attributes as metadata on the s3 key and that
data is then converted into an HTTP header in the response. Using `--no-preserve`
won't impact the ability of [sync to check](https://github.com/s3tools/s3cmd/blob/ae6a635312abba7e5353f257e60e845034ad9ecf/S3/Config.py#L163)
for changed files.
