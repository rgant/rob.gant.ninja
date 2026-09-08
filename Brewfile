# Homebrew dependencies for this project. Install them with `brew bundle`.
# Node comes from nvm, not Homebrew. `.nvmrc` names the version, and
# `engines.node` in package.json names the range.

tap "hashicorp/tap"
tap "terraform-linters/tap"

# `aws amplify start-deployment` in infrastructure/amplify.tf deploys the site.
brew "awscli"
# `npm run format` runs dprint. It is not an npm dependency.
brew "dprint"
# nvm installs and selects the Node version that `.nvmrc` names.
brew "nvm"
# `s3cmd sync` in infrastructure/website.tf uploads dist/ to the bucket.
brew "s3cmd"
# `svgo` optimizes raw-assets/svgs by hand. See docs/optimizing-svgs.md.
brew "svgo"
# terraform-docs regenerates infrastructure/README.md from .terraform-docs.yaml.
brew "terraform-docs"
brew "hashicorp/tap/terraform"

# `# tflint-ignore-file` in main.tf expects tflint.
cask "tflint"
