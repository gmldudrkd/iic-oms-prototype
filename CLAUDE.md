# CLAUDE.md

## Agentation

- 대화 시작 시 `agentation_get_all_pending`으로 미처리 어노테이션을 확인하고, 있으면 사용자에게 알려줄 것
- 어노테이션 처리 후 반드시 `agentation_resolve`로 완료 처리할 것
- 작업 중에도 주기적으로 `agentation_watch_annotations`로 새 어노테이션을 감시할 것
