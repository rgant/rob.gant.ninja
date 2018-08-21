# rob.gant.ninja

Personal Website

## Deployment

Install s3cmd on MacOS using Homebrew: `brew install s3cmd`.

Configure s3cmd: `s3cmd --configure`

```bash
s3cmd sync --no-preserve --cf-invalidate --cf-invalidate-default-index --delete-removed --exclude=* --rinclude-from=dist-files ./ s3://rob-gant-ninja/
```

When we build the website we should be able to cachebust the asset/css/img/js file
names using a hash and we won't need `--cf-invalidate`.

Should also setup [Cache-Control Headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
once we have cachebusting setup.

## Static Site Generator

* [Zodiac](https://github.com/nuex/zodiac)
* [Webpack for Static Sites](https://medium.com/riow/webpack-for-static-sites-9cbfd8363abb)
* [How To Bundle A Simple Static Site Using Webpack](https://www.sitepoint.com/bundle-static-site-webpack/)
* [Spike](https://www.spike.cf/)
