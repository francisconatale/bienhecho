#!/usr/bin/env bash
# auto-commit.sh
#
# Auto-commits uncommitted changes after a Spec Kit step to preserve
# AGENTS.md and other context files across context window limits.
#
# Usage: auto-commit.sh <step_name>
#   step_name: specify | plan | tasks | implement

set -euo pipefail

STEP="${1:-unknown}"

# Skip if there are no changes
if git diff --quiet && git diff --cached --quiet && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  exit 0
fi

# Add everything except common generated/ignored patterns
git add -A

# Create commit with descriptive message
git commit -m "chore(save): auto-save after ${STEP}" --no-verify 2>/dev/null || true

echo "auto-commit: committed changes after ${STEP}"
