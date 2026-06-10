#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4000}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to serve the built site locally."
  exit 1
fi

cd "${REPO_ROOT}"

compat_opt="-r${SCRIPT_DIR}/jekyll_ruby_compat"
export RUBYOPT="${RUBYOPT:+${RUBYOPT} }${compat_opt}"
export BUNDLE_FORCE_RUBY_PLATFORM=true
export JEKYLL_ENV="${JEKYLL_ENV:-development}"

bundle exec jekyll build
bundle exec jekyll build --watch &
watch_pid=$!

cleanup() {
  kill "${watch_pid}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo "Watching for changes and serving _site at http://${HOST}:${PORT}"
echo "Refresh the browser after edits to see the rebuilt page."

python3 -m http.server "${PORT}" --bind "${HOST}" --directory _site
