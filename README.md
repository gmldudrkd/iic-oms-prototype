# haus oms

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Material UI v6
- TanStack Query v5
- ESLint v8
- Prettier
- Tailwind CSS
- Zustand
- Zod
- react-hook-form
- usehooks-ts

## 시작하기

### 필수 요구사항

- Node.js 22.14.0
- nvm (Node Version Manager)

### 로컬 세팅

host 접속하여 로컬 도메인 추가하기

```bash
sudo vi /etc/hosts
127.0.0.1 oms-local.systemiic
```

### HTTPS 개발환경 초기화 스크립트 실행

```bash
sh init-https.sh
```

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run local
```

### swagger-typescript generator

- Swagger(OpenAPI) 스펙(requestParam(QueryString) / requestBody / responseBody)을 기반으로 자동 타입 생성
- 태그(Tag) 단위로 타입 파일 분리
- 여러 API 스펙(oms, auth)을 src/shared/generated 하위 별도 디렉토리에서 관리
- 여러 태그에서 공통으로 사용되는 타입은 자동으로 common.ts에 분리
- CI/CD 파이프라인 빌드 시에도 실행되어 항상 최신 Swagger 스펙 기반으로 타입 생성
- npm run local 시 자동 실행 또는 수동으로 실행 가능

```bash
npm run codegen:types
```

## 코드 컨벤션

- ESLint와 Prettier를 사용하여 코드 스타일을 관리합니다
- 절대 경로 임포트 사용 (@/...)

## URL

- local : https://oms-local.systemiic.com
- dev : https://oms-dev.systemiic.com
- stg : https://oms.systemiic.com

## 계정등록 방법

## 배포

- PRD: `master` 브랜치
- DEV: `dev` 브랜치

## 기타

searchForm

- OMS: ALL 일 경우 요청 값 제외해서 검색
- PIM: ALL 일 경우 "ALL" string으로 요청
