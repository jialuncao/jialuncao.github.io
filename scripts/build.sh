#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

compat_opt="-r${SCRIPT_DIR}/jekyll_ruby_compat"
export RUBYOPT="${RUBYOPT:+${RUBYOPT} }${compat_opt}"
export BUNDLE_FORCE_RUBY_PLATFORM=true
export JEKYLL_ENV="${JEKYLL_ENV:-production}"

bundle exec jekyll build "$@"
