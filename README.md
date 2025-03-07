# rob.gant.ninja

Personal Website

## Deployment

Install AWS CLI, S3cmd and Terraform:

```sh
brew tap hashicorp/tap
brew install awscli hashicorp/tap/terraform s3cmd
```

Configure AWS: `aws configure --profile personal`. Use profiles, don't setup default
credentials. If you want to stop typing `--profile` then use `export AWS_PROFILE=personal`.

Configure s3cmd: `s3cmd --configure`

### Manually sync website files

Terraform might update the website bucket if you mark that resource as tainted,
but it is probably easier to just do the command yourself.

```sh
s3cmd sync --no-preserve --delete-removed --add-header="Cache-Control:public,max-age=31536000,immutable" ./dist/ s3://rob-gant-ninja/
s3cmd modify --cf-invalidate-default-index --add-header="Cache-Control:public,max-age=2592000,stale-while-revalidate=86400" s3://rob-gant-ninja/index.html
```

By default `s3cmd sync` preserves file attributes as metadata on the s3 key and that
data is then converted into an HTTP header in the response. Using `--no-preserve`
won't impact the ability of [sync to check](https://github.com/s3tools/s3cmd/blob/ae6a635312abba7e5353f257e60e845034ad9ecf/S3/Config.py#L163)
for changed files.

## Icons

* favicon.ico

  ```sh
  magick -density 256x256 -background transparent src/icon.svg -define icon:auto-resize -colors 256 src/favicon.ico
  ```

* Android Icon (Big icon; so 58px of padding around icon.):

  ```sh
  magick -density 256x256 -background '#3e454c' src/icon.svg -resize 454x454 -gravity center -extent 512x512 src/icon-512.png
  ```

* Apple Touch Icon (Put 20px of padding around the icon.):

  ```sh
  magick -density 256x256 -background '#3e454c' src/icon.svg -resize 152x152 -gravity center -extent 192x192 src/icon.png
  ```
