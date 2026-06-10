#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4001}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to serve the built site locally."
  exit 1
fi

cd "${REPO_ROOT}"

export BUNDLE_FORCE_RUBY_PLATFORM=true

"${SCRIPT_DIR}/build.sh" "$@"

echo "Serving the production build at http://${HOST}:${PORT}"

python3 -m http.server "${PORT}" --bind "${HOST}" --directory _site
