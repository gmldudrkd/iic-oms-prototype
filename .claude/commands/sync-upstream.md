# Upstream 동기화 (Prototype 프로젝트)

upstream(bitbucket iic-oms-frontend)의 최신 코드를 origin(github prototype)에 병합한다.

## 절차

1. `git fetch upstream`
2. `git merge upstream/master` (충돌 발생 시 아래 규칙에 따라 해결)
3. upstream에만 있는 새 파일이 누락되었는지 확인: `git ls-tree -r --name-only upstream/master -- src/ | while read f; do [ ! -f "$f" ] && echo "MISSING: $f"; done` → 누락 파일은 upstream에서 복원
4. 충돌 해결 후 커밋
5. `git push origin main`

## 충돌 해결 규칙

### Origin(ours) 유지 — 프로토타입 전용 파일
다음 파일들은 프로토타입 모드 로직이 들어있으므로 **항상 origin 버전 유지**:
- `src/shared/apis/fetchExtended.ts` — mock fetcher 분기
- `src/shared/apis/mockData.ts` — mock 데이터
- `src/shared/apis/utils.ts` — signOut 우회
- `src/shared/provider/AuthCheck.tsx` — 인증 체크 비활성화
- `src/shared/provider/NextAuthProvider.tsx` — mock 세션 주입
- `src/shared/hooks/useCustomMutation.ts` — mutation no-op
- `src/features/navigation/modules/constants.ts` — 프로모션 메뉴 포함
- `src/app/(unauth)/sign-in/page.tsx` — 프로토타입 모드 분기 (headers() 우회)
- `package.json` — prototype 스크립트, gh-pages 등 포함
- `next.config.mjs` — GitHub Pages 빌드 설정 포함
- `.env` — PROTOTYPE_MODE 설정
- `.husky/pre-push` — origin 전용 설정
- `.gitignore` — origin 전용 설정

### Origin 유지하되 upstream 신규 항목 확인
- `tailwind.config.ts` — 프로토타입 색상(shipment, storePickup, reshipment) 유지 + upstream 새 색상 추가 여부 확인
- `src/shared/styles/globals.css` — 프로토타입 CSS 변수 유지 + upstream 신규 변수 확인
- `src/features/integrated-order-list/modules/constants.tsx` — status 필터 추가분 유지
- `src/features/integrated-order-detail/models/transforms.ts` — receiveMethod 매핑 유지
- `src/features/integrated-order-list/models/transforms.ts` — receiveMethod 매핑 유지
- `src/features/integrated-order-detail/components/ReturnDetailInfo.tsx` — Refund 버튼 + grading 유지
- `src/features/integrated-order-detail/components/InfoReturn.tsx` — corporation prop 유지
- `src/shared/components/modal/ModalBump.tsx` — children prop 유지

### Upstream(theirs) 수락 — API 타입 및 공통 코드
- `src/shared/generated/**` — API 스펙에서 자동 생성된 타입, upstream이 최신
- 그 외 대부분의 feature/component 파일 — upstream이 최신

### GitHub Pages 정적 빌드 주의사항
- 동적 라우트(`[param]`) 페이지는 `page.tsx`(서버) + `PageClient.tsx`(클라이언트) 분리 필수
- `page.tsx`에 `"use client"`와 `generateStaticParams()` 공존 불가
- upstream에서 새 동적 라우트가 추가되면 같은 패턴으로 분리 + `generateStaticParams` 추가 필요

### 병합 후 확인사항
- `npm run dev`로 로컬 실행 확인
- `/sign-in`으로 리다이렉트 안 되는지 확인 (프로토타입 모드)
- Overview 대시보드 탭/색상 정상 표시 확인
- Order list → detail 진입 시 에러 없는지 확인
- `npm run deploy`로 GitHub Pages 배포 확인