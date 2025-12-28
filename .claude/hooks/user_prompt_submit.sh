#!/usr/bin/env bash
set -euo pipefail

# 1) Claude Code가 훅으로 넘겨주는 payload(JSON)를 stdin에서 읽음
payload="$(cat)"

# 2) prompt 텍스트 추출 (jq 필요)
prompt="$(echo "$payload" | jq -r '.prompt // empty')"

# 3) prompt가 비어있으면 아무 것도 하지 않음
[[ -z "$prompt" ]] && exit 0

# 4) 로그 파일 경로 (원하는 위치로 바꿔도 됨)
LOG_DIR=".claude/prompt-log"
LOG_FILE="$LOG_DIR/prompts.md"

mkdir -p "$LOG_DIR"

# 5) Markdown으로 append
{
  echo ""
  echo "## $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  echo '```'
  echo "$prompt"
  echo '```'
} >> "$LOG_FILE"