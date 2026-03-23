require("@rushstack/eslint-config/patch/modern-module-resolution");
const path = require('path'); 

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["react-hooks", "import"],
  extends: [
    "@rushstack/eslint-config/profile/web-app",
    "@rushstack/eslint-config/mixins/react",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    // JSX에서 bind 사용 경고 => 경고 (useCallback 사용으로 해결)
    // https://stackoverflow.com/questions/36677733/why-shouldnt-jsx-props-use-arrow-functions-or-bind
    "react/jsx-no-bind": "off",

    // 쿼리키의 종속성 배열 표시 아닐 시 에러
    "@tanstack/query/exhaustive-deps": "error",

    // useEffect의 의존성 배열 관련 경고 => 에러
    "react-hooks/exhaustive-deps": "error",
    
    // 불필요한 타입(any) 정의 경고 => 에러
    "@typescript-eslint/no-explicit-any": "error",
    
    // 변수 선언 시 타입 정의를 강제하는 규칙 => 비활성화 (타입 추론으로 넘어갈 부분들도 불필요한 작업 요구)
    "@rushstack/typedef-var": "off",

    // null 타입 선언 경고 => 비활성화 (데이터 전달시 null 값 부여하는 경우 있음)
    "@rushstack/no-new-null": "off",

    // 함수의 반환 타입을 명시적으로 지정하는 규칙 => 비활성화 (타입 추론으로 넘어갈 부분들도 불필요한 작업 요구)
    "@typescript-eslint/explicit-function-return-type": "off",

    // 변수나 함수가 정의되기 전에 사용될 때 에러
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, variables: false, classes: true },
    ],

    // 사용되지 않는 변수 사용 금지 => 일부 허용
    // _로 시작하는 변수는 사용하지 않을 수 있음 (외부 라이브러리 타입 이슈로 T로 시작하는 타입도 사용하지 않을 수 있음)
    // Session, JWT 타입은 사용하지 않음
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_|^T|^Session$|^JWT$",
        argsIgnorePattern: "^_",
      },
    ],

    // 네이밍 컨벤션
    // 예외 (MUI ordering 사용시 __reorder__ 사용)
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        filter: {
          regex: "__reorder__",
          match: false,
        },
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
      },
      {
        selector: "typeAlias",
        format: ["PascalCase"],
      },
      {
        selector: "typeParameter",
        format: ["PascalCase"],
      },
    ],

    // 상대 경로 import 금지
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [".*"],
            message: "상대 경로 대신 절대 경로(@/)를 사용해주세요",
          },
        ],
      },
    ],

    // import 순서
    "import/order": [
      "error",
      {
        // import 문을 다음 그룹 순서로 정렬
        // 1. Node.js 내장 모듈
        // 2. 외부 패키지
        // 3. 내부 모듈
        // 4. 같은 폴더 내 파일
        // 5. object imports
        // 6. type imports
        groups: [
          "builtin",
          "external",
          "internal",
          "index",
          "object",
          "type",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "next(/**)?",
            group: "external",
            position: "after",
          },
          {
            pattern: "@/features/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "@/shared/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "@/public/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "**/*.css",
            group: "unknown",
            position: "after",
          },
          {
            pattern: "**/*.svg",
            group: "unknown",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"], // // builtin 모듈은 pathGroups에서 제외
        alphabetize: {
          order: "asc", // 알파벳 오름차순으로 정렬
          caseInsensitive: true, // 대소문자 구분 없이 정렬
        },
        "newlines-between": "always", // 각 그룹 사이에 빈 줄 추가
      },
    ],

    // 구조분해할당
    "prefer-destructuring": [
      "error",
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
    ],
  },
  ignorePatterns: ["mockServiceWorker.js", "run_server.js", "server.js", "scripts/*.mjs"],
  settings: {
    react: {
      project: true,
      version: "18",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
    },
  },
};
