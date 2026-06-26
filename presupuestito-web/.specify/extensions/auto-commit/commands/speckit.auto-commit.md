---
description: "Commit uncommitted changes after a Spec Kit step"
---

# Auto-Commit After Spec Kit Steps

Commits any uncommitted changes after a Spec Kit command (specify, plan, tasks, implement) to preserve AGENTS.md updates and other context files across context window limits.

## Behavior

After each major Spec Kit step, the script:

1. Detects if there are uncommitted changes (staged or unstaged)
2. Adds all modified and untracked files (except common ignored patterns)
3. Creates a commit with the message: `chore(save): auto-save after <step>`

The commit scope always reflects which Spec Kit step triggered it (specify, plan, tasks, implement).

## Execution

- **Bash**: `.specify/extensions/auto-commit/scripts/bash/auto-commit.sh <step_name>`
