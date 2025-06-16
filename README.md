# rob.gant.ninja

Personal Website

## Deployment

```sh
npm run deploy
```

### Setup

Install AWS CLI, S3cmd and Terraform:

```sh
brew tap hashicorp/tap
brew install awscli hashicorp/tap/terraform s3cmd
```

Configure AWS: `aws configure --profile personal`. Use profiles, don't setup default
credentials. If you want to stop typing `--profile` then use `export AWS_PROFILE=personal`.

Configure S3cmd: `s3cmd --configure`

## Linting

```sh
npm run lint
```

## Local Server

```sh
npm run dev
```
