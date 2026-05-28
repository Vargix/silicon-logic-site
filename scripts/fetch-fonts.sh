#!/usr/bin/env bash
# scripts/fetch-fonts.sh
#
# Fetches Tiempos WOFF2 fonts from the private silicon-logic-fonts repo
# and copies them into public/fonts/tiempos/ so Astro can serve them.
#
# Runs in two contexts:
#   1. Cloudflare Pages build (uses FONTS_DEPLOY_KEY env variable)
#   2. Local development (clones from GitHub using your normal git auth)
#
# Required env variables (CI only):
#   FONTS_DEPLOY_KEY  -  SSH private key with read access to silicon-logic-fonts
#
# Exits 0 if fonts are successfully placed in public/fonts/tiempos/.
# Exits non-zero on any failure. Fonts are required - the build cannot
# proceed without them, even though Astro would not fail to build.

set -euo pipefail

# Resolve script location and project root regardless of cwd
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_DIR="${PROJECT_ROOT}/public/fonts/tiempos"

# Configuration
FONTS_REPO_SSH="git@github.com:Silicon-Logic/silicon-logic-fonts.git"
FONTS_REPO_HTTPS="https://github.com/Silicon-Logic/silicon-logic-fonts.git"
FONTS_BRANCH="main"
TEMP_DIR="$(mktemp -d)"
CLONE_DIR="${TEMP_DIR}/silicon-logic-fonts"

# Cleanup function runs on any exit
cleanup() {
  local exit_code=$?
  rm -rf "${TEMP_DIR}"
  # If we wrote a temp SSH key, delete it
  if [ -n "${TEMP_SSH_KEY:-}" ] && [ -f "${TEMP_SSH_KEY}" ]; then
    rm -f "${TEMP_SSH_KEY}"
  fi
  if [ ${exit_code} -ne 0 ]; then
    echo "fetch-fonts.sh: failed with exit code ${exit_code}" >&2
  fi
  exit ${exit_code}
}
trap cleanup EXIT INT TERM

echo "fetch-fonts.sh: starting"
echo "fetch-fonts.sh: project root = ${PROJECT_ROOT}"
echo "fetch-fonts.sh: target dir   = ${TARGET_DIR}"

# Ensure target directory exists
mkdir -p "${TARGET_DIR}"

# Choose authentication strategy based on environment
if [ -n "${FONTS_DEPLOY_KEY:-}" ]; then
  # CI mode: write deploy key to a temp file and use SSH
  echo "fetch-fonts.sh: CI mode (FONTS_DEPLOY_KEY present)"

  TEMP_SSH_KEY="${TEMP_DIR}/deploy_key"
  printf '%s\n' "${FONTS_DEPLOY_KEY}" > "${TEMP_SSH_KEY}"
  chmod 600 "${TEMP_SSH_KEY}"

  # Add GitHub host key to known_hosts so SSH doesn't prompt
  mkdir -p ~/.ssh
  chmod 700 ~/.ssh
  if ! grep -q "github.com" ~/.ssh/known_hosts 2>/dev/null; then
    ssh-keyscan -t ed25519,rsa github.com >> ~/.ssh/known_hosts 2>/dev/null
    chmod 644 ~/.ssh/known_hosts
  fi

  # Tell git to use our deploy key for this clone
  export GIT_SSH_COMMAND="ssh -i ${TEMP_SSH_KEY} -o IdentitiesOnly=yes -o UserKnownHostsFile=${HOME}/.ssh/known_hosts -o StrictHostKeyChecking=yes"

  # Clone with global/system git config disabled to bypass any inherited
  # insteadOf URL rewrites (Cloudflare Pages injects an HTTPS token rewrite
  # that would otherwise hijack our SSH URL and fail to find the private repo).
  echo "fetch-fonts.sh: cloning ${FONTS_REPO_SSH} (depth=1, branch=${FONTS_BRANCH})"
  GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null \
    git clone --depth 1 --branch "${FONTS_BRANCH}" "${FONTS_REPO_SSH}" "${CLONE_DIR}"
else
  # Local mode: rely on your normal git auth (HTTPS with credential helper or
  # SSH agent if you have one configured for github.com)
  echo "fetch-fonts.sh: local mode (no FONTS_DEPLOY_KEY)"
  echo "fetch-fonts.sh: cloning ${FONTS_REPO_HTTPS} (depth=1, branch=${FONTS_BRANCH})"
  git clone --depth 1 --branch "${FONTS_BRANCH}" "${FONTS_REPO_HTTPS}" "${CLONE_DIR}"
fi

# Validate the clone has what we expect
if [ ! -d "${CLONE_DIR}/tiempos" ]; then
  echo "fetch-fonts.sh: ERROR - cloned repo missing tiempos/ directory" >&2
  exit 1
fi

# Count WOFF2 files in source
SOURCE_COUNT=$(find "${CLONE_DIR}/tiempos" -name "*.woff2" -type f | wc -l | tr -d ' ')
if [ "${SOURCE_COUNT}" -eq 0 ]; then
  echo "fetch-fonts.sh: ERROR - no .woff2 files found in cloned tiempos/" >&2
  exit 1
fi

# Copy the WOFF2 files
echo "fetch-fonts.sh: copying ${SOURCE_COUNT} WOFF2 files to ${TARGET_DIR}"
cp "${CLONE_DIR}/tiempos/"*.woff2 "${TARGET_DIR}/"

# Validate the copy
TARGET_COUNT=$(find "${TARGET_DIR}" -name "*.woff2" -type f | wc -l | tr -d ' ')
if [ "${TARGET_COUNT}" -ne "${SOURCE_COUNT}" ]; then
  echo "fetch-fonts.sh: ERROR - copy mismatch (source=${SOURCE_COUNT}, target=${TARGET_COUNT})" >&2
  exit 1
fi

echo "fetch-fonts.sh: success - ${TARGET_COUNT} font files in ${TARGET_DIR}"
