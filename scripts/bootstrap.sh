#!/usr/bin/env bash
set -euo pipefail

if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler is required. Install Ruby and Bundler first."
  exit 1
fi

export BUNDLE_FORCE_RUBY_PLATFORM=true

bundle check >/dev/null 2>&1 || bundle install

echo "Ruby gems are ready."
