#!/usr/bin/env bash
# Claude Code cloud session setup (run by the SessionStart hook in .claude/settings.json).
# Installs the locked dependencies for the Next.js app (the static docs/ copy needs none).
set -euo pipefail

cd "$(dirname "$0")/.."
npm ci --no-audit --no-fund --loglevel=error >/dev/null
