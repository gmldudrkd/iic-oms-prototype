/**
 * Swagger API 문서를 기반으로 타입 생성
 * scripts/gen-types.mjs
 * 
 * @date 2025-09-25
 * @version 1.0.0
 * @description Swagger API 문서를 기반으로 타입 생성
 */

import { generateApi } from "swagger-typescript-api";
import path from "path";
import { API_TARGETS } from "./api-targets.mjs";

async function main() {
  for (const target of API_TARGETS) {
    const outputPath = path.resolve(process.cwd(), "src/shared/generated", target.name);

    await generateApi({
      url: target.url,
      output: outputPath,
      name: "index.ts", // 엔트리포인트 파일
      generateClient: false,
      modular: true,
      modularStructure: "tags",
      extractEnums: true,
      extractRequestBody: true,
      extractResponseBody: true,
      extractResponseError: true,
      sortTypes: true,
      prettier: true,
    });

    console.log(`✅ [${target.name}] 타입 생성 완료 (data-contracts.ts 생성됨)`);
  }
}

main().catch((e) => {
  console.error("❌ 타입 생성 실패:", e);
  process.exit(1);
});
