#!/bin/bash

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

DANGEROUS_PATTERNS=(
  "git (-C [^ ]+ )?push"
  "push --force"
  "reset --hard"
  "git (-C [^ ]+ )?clean .*-[a-zA-Z]*f"
  "git (-C [^ ]+ )?branch .*(-D|-d|--delete)( |$)"
  "git checkout \."
  "git restore \."
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

exit 0
