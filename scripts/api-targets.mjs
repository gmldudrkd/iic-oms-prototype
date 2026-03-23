/**
 * Swagger API 문서 URL 목록
 * scripts/api-targets.mjs
 * 
 * @date 2025-09-25
 * @version 1.0.0
 * @description Swagger API 문서 URL 목록
 */

import dotenv from "dotenv";
import path from "path";

const RUN_ENV = process.env.RUN_ENV || "local";

const envFileMap = {
  local: ".env.localhost.target",
  dev: ".env.development.target",
  prd: ".env.production.target",
};

dotenv.config({ path: path.resolve(process.cwd(), envFileMap[RUN_ENV]) });
console.log(`🌍 Loaded: ${envFileMap[RUN_ENV]}`);


// 대상 .env 파일 경로
const envFile = path.resolve(process.cwd(), `.env.${RUN_ENV}.target`);

// 해당 파일 로드
dotenv.config({ path: envFile });
console.log(`🌍 Loaded env file: ${envFile}`); // 디버깅용

// API Targets
export const API_TARGETS = [
  { name: "oms", url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/v3/api-docs` },
  { name: "auth", url: `${process.env.NEXT_PUBLIC_AUTH_API_BASE_URL}/v3/api-docs` },
  { name: "sap", url: `https://api-v1-dev.systemiic.com/v3/api-docs` },
  { name: "pim", url: `${process.env.NEXT_PUBLIC_PIM_API_BASE_URL}/v3/api-docs/admin` },
];
