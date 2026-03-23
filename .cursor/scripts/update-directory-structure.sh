#!/bin/bash

# 오류 처리를 위한 함수
error_exit() {
    echo "오류: $1" >&2
    exit 1
}

# 스크립트의 실제 위치를 찾음
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# .cursor 디렉토리 경로 (스크립트가 .cursor/scripts에 있으므로 한 단계 위로)
CURSOR_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CURSOR_RULES_DIR="${CURSOR_ROOT}/rules"
STRUCTURE_FILE="${CURSOR_RULES_DIR}/directory-structure.mdc"
TEMP_FILE="${CURSOR_ROOT}/temp_structure.txt"

# 필요한 디렉토리 생성
mkdir -p "$CURSOR_RULES_DIR"

# 파일 구조 생성 함수
generate_structure() {
    # MDC 헤더 추가
    echo "---"
    echo "alwaysApply: true"
    echo "---"
    echo "<!-- # 프로젝트 디렉토리 구조 -->"
    echo "# Project Directory Structure"
    echo ""
    
    # 제외할 디렉토리/파일 패턴
    local EXCLUDE_PATTERNS="node_modules|.git|.next|public|.DS_Store|*.log|dist|coverage"
    
    if command -v tree &> /dev/null; then
        # tree 명령어 사용 시 src 디렉토리만 표시
        tree -I "$EXCLUDE_PATTERNS" --dirsfirst -L 10 \
             --charset ascii \
             --noreport \
             src | sed 's/|/│/g' | sed 's/`/└/g' | sed 's/+/├/g'
    else
        echo "src" # src 디렉토리 표시
        
        # 디렉토리 먼저 출력
        find src -type d -not -path "*/\.*" \
            $(echo "$EXCLUDE_PATTERNS" | tr '|' '\n' | xargs -I {} echo "-not -path '*/{}'") \
            | sort | while read -r dir; do
            if [ "$dir" = "src" ]; then continue; fi
            depth=$(echo "$dir" | tr -cd '/' | wc -c)
            indent=$(printf '%*s' "$((depth * 4))" '')
            echo "${indent}├── ${dir##*/}/"
        done

        # 파일 출력
        find src -type f -not -path "*/\.*" \
            $(echo "$EXCLUDE_PATTERNS" | tr '|' '\n' | xargs -I {} echo "-not -path '*/{}'") \
            | sort | while read -r file; do
            depth=$(echo "$file" | tr -cd '/' | wc -c)
            indent=$(printf '%*s' "$((depth * 4))" '')
            echo "${indent}└── ${file##*/}"
        done
    fi
    
    # 마지막에 빈 줄 추가
    echo ""
}

# 임시 파일에 구조 생성
generate_structure > "$TEMP_FILE"

# 파일이 존재하지 않거나 내용이 다른 경우에만 업데이트
if [ ! -f "$STRUCTURE_FILE" ] || ! cmp -s "$TEMP_FILE" "$STRUCTURE_FILE"; then
    cp "$TEMP_FILE" "$STRUCTURE_FILE"
    echo "디렉토리 구조가 성공적으로 MDC 파일로 업데이트되었습니다."
else
    echo "디렉토리 구조가 변경되지 않았습니다."
fi

# 임시 파일 정리
rm -f "$TEMP_FILE"