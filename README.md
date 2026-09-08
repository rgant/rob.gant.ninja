# rob.gant.ninja

Personal Website

[How I built this website](https://rob.gant.ninja/ninja-site/)

## Deployment

```sh
npm run deploy
```

### Setup

Install the command line tools that `Brewfile` names:

```sh
brew bundle
```

Install the Node version that `.nvmrc` names:

```sh
nvm install
```

Configure AWS: `aws configure --profile personal`. Use profiles, don't setup
default credentials. If you want to stop typing `--profile` then use `export
AWS_PROFILE=personal`.

Configure S3cmd: `s3cmd --configure`

## Linting

```sh
npm run lint
```

## Local Server

```sh
npm run dev
```
