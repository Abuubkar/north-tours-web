#!/bin/bash
# Blocks destructive git commands. Pushing a named feature branch and merging a PR with
# `gh pr merge` are allowed; pushing to main, force pushes, deletions, pushes without an
# explicit branch, admin merges that bypass protections and merges that delete the branch are not.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

block() {
  echo "BLOCKED: '$COMMAND' $1. The user has prevented you from doing this." >&2
  exit 2
}

DANGEROUS_PATTERNS=(
  "reset --hard"
  "git (-C [^ ]+ )?clean .*-[a-zA-Z]*f"
  "git (-C [^ ]+ )?branch .*(-D|-d|--delete)( |$)"
  "git checkout \."
  "git restore \."
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    block "matches dangerous pattern '$pattern'"
  fi
done

# `gh pr merge` may not use --admin or delete the branch.
# Every `git push` must name a remote and a feature branch, with no force, delete or bulk flags.
PUSH_CHECK=$(COMMAND="$COMMAND" python3 - <<'PY'
import os, re, shlex
cmd = os.environ["COMMAND"]
for segment in re.split(r"&&|\|\||;|\||\n", cmd):
    try:
        words = shlex.split(segment)
    except ValueError:
        words = segment.split()
    if words[:3] == ["gh", "pr", "merge"]:
        bad = [a for a in words[3:] if a in {"--admin", "-d", "--delete-branch"}]
        if bad:
            print(f"uses merge flag {bad[0]}"); break
        continue
    if "git" not in words or "push" not in words:
        continue
    args = words[words.index("push") + 1:]
    allowed_flags = {"-u", "--set-upstream", "-q", "--quiet", "-v", "--verbose"}
    flags = [a for a in args if a.startswith("-")]
    bad = [f for f in flags if f not in allowed_flags]
    if bad:
        print(f"uses push flag {bad[0]}"); break
    positional = [a for a in args if not a.startswith("-")]
    if len(positional) < 2:
        print("does not name a remote and a branch"); break
    for ref in positional[1:]:
        target = ref.split(":")[-1].removeprefix("refs/heads/")
        if ref.startswith((":", "+")) or target in {"main", "master", "HEAD", ""}:
            print(f"pushes to '{ref}' (main, HEAD, force or delete)"); break
    else:
        continue
    break
PY
)
if [ -n "$PUSH_CHECK" ]; then
  block "$PUSH_CHECK"
fi

exit 0
