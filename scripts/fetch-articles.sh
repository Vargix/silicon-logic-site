#!/usr/bin/env bash
# scripts/fetch-articles.sh
#
# Fetches article markdown from the private silicon-logic-articles repo and
# copies it into src/content/articles/ for Astro content collections.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_DIR="${PROJECT_ROOT}/src/content/articles"

ARTICLES_REPO_SSH="git@github.com:Silicon-Logic/silicon-logic-articles.git"
ARTICLES_REPO_HTTPS="https://github.com/Silicon-Logic/silicon-logic-articles.git"
ARTICLES_BRANCH="main"
TEMP_DIR="$(mktemp -d)"
CLONE_DIR="${TEMP_DIR}/silicon-logic-articles"

cleanup() {
  local exit_code=$?
  rm -rf "${TEMP_DIR}"
  if [ -n "${TEMP_SSH_KEY:-}" ] && [ -f "${TEMP_SSH_KEY}" ]; then
    rm -f "${TEMP_SSH_KEY}"
  fi
  if [ ${exit_code} -ne 0 ]; then
    echo "fetch-articles.sh: failed with exit code ${exit_code}" >&2
  fi
  exit ${exit_code}
}
trap cleanup EXIT INT TERM

echo "fetch-articles.sh: starting"
echo "fetch-articles.sh: project root = ${PROJECT_ROOT}"
echo "fetch-articles.sh: target dir   = ${TARGET_DIR}"

mkdir -p "${TARGET_DIR}"

if [ -n "${ARTICLES_DEPLOY_KEY:-}" ]; then
  echo "fetch-articles.sh: CI mode (ARTICLES_DEPLOY_KEY present)"

  TEMP_SSH_KEY="${TEMP_DIR}/deploy_key"
  printf '%s\n' "${ARTICLES_DEPLOY_KEY}" > "${TEMP_SSH_KEY}"
  chmod 600 "${TEMP_SSH_KEY}"

  mkdir -p ~/.ssh
  chmod 700 ~/.ssh
  if ! grep -q "github.com" ~/.ssh/known_hosts 2>/dev/null; then
    ssh-keyscan -t ed25519,rsa github.com >> ~/.ssh/known_hosts 2>/dev/null
    chmod 644 ~/.ssh/known_hosts
  fi

  export GIT_SSH_COMMAND="ssh -i ${TEMP_SSH_KEY} -o IdentitiesOnly=yes -o UserKnownHostsFile=${HOME}/.ssh/known_hosts -o StrictHostKeyChecking=yes"

  echo "fetch-articles.sh: cloning ${ARTICLES_REPO_SSH} (depth=1, branch=${ARTICLES_BRANCH})"
  GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null \
    git clone --depth 1 --branch "${ARTICLES_BRANCH}" "${ARTICLES_REPO_SSH}" "${CLONE_DIR}"
else
  echo "fetch-articles.sh: local mode (no ARTICLES_DEPLOY_KEY)"
  echo "fetch-articles.sh: cloning ${ARTICLES_REPO_HTTPS} (depth=1, branch=${ARTICLES_BRANCH})"
  git clone --depth 1 --branch "${ARTICLES_BRANCH}" "${ARTICLES_REPO_HTTPS}" "${CLONE_DIR}"
fi

SOURCE_DIR="${CLONE_DIR}"
if [ -d "${CLONE_DIR}/articles" ]; then
  SOURCE_DIR="${CLONE_DIR}/articles"
fi

echo "fetch-articles.sh: clearing existing markdown in ${TARGET_DIR}"
find "${TARGET_DIR}" -type f \( -name "*.md" -o -name "*.markdown" \) -delete

SOURCE_COUNT=$(find "${SOURCE_DIR}" -type f \( -name "*.md" -o -name "*.markdown" \) ! -iname "README.md" ! -iname "README.markdown" | wc -l | tr -d ' ')
if [ "${SOURCE_COUNT}" -eq 0 ]; then
  echo "fetch-articles.sh: warning - no markdown files found in ${SOURCE_DIR}"
  echo "fetch-articles.sh: success - no articles copied"
  exit 0
fi

echo "fetch-articles.sh: copying ${SOURCE_COUNT} markdown files to ${TARGET_DIR}"
while IFS= read -r -d '' source_file; do
  relative_path="${source_file#${SOURCE_DIR}/}"
  target_file="${TARGET_DIR}/${relative_path}"
  mkdir -p "$(dirname "${target_file}")"
  cp "${source_file}" "${target_file}"
done < <(find "${SOURCE_DIR}" -type f \( -name "*.md" -o -name "*.markdown" \) ! -iname "README.md" ! -iname "README.markdown" -print0)

TARGET_COUNT=$(find "${TARGET_DIR}" -type f \( -name "*.md" -o -name "*.markdown" \) | wc -l | tr -d ' ')
if [ "${TARGET_COUNT}" -ne "${SOURCE_COUNT}" ]; then
  echo "fetch-articles.sh: ERROR - copy mismatch (source=${SOURCE_COUNT}, target=${TARGET_COUNT})" >&2
  exit 1
fi

echo "fetch-articles.sh: success - ${TARGET_COUNT} article files in ${TARGET_DIR}"
