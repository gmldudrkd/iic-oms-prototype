/**
 * Swagger API 문서를 기반으로 타입 분리
 * scripts/split-contracts.mjs
 * 
 * @date 2025-09-25
 * @version 1.0.0
 * @description Swagger API 문서를 기반으로 타입 분리
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { API_TARGETS } from "./api-targets.mjs";

const isControllerTag = (tag) => /Controller$/i.test(tag);

async function splitContracts({ name, url }) {
  const GEN_PATH = path.resolve(process.cwd(), "src/shared/generated", name);
  const TYPES_PATH = path.join(GEN_PATH, "types");
  const DATA_CONTRACTS_FILE = path.join(GEN_PATH, "data-contracts.ts");

  console.log(`📥 [${name}] Fetching Swagger spec from ${url}...`);
  const swagger = await fetch(url).then((res) => res.json());

  // schemaName → tag 매핑
  const schemaTagMap = {};
  for (const pathItem of Object.values(swagger.paths)) {
    for (const op of Object.values(pathItem)) {
      if (!op.tags) continue;
      const tag = op.tags[0];
      if (isControllerTag(tag)) continue;

      const addRef = (schema) => {
        if (schema?.$ref) {
          const schemaName = schema.$ref.split("/").pop();
          schemaTagMap[schemaName] = tag;
        }
        // 배열 타입의 items.$ref도 추적
        if (schema?.type === "array" && schema?.items?.$ref) {
          const schemaName = schema.items.$ref.split("/").pop();
          schemaTagMap[schemaName] = tag;
        }
      };

      addRef(op.requestBody?.content?.["application/json"]?.schema);
      if (op.parameters) op.parameters.forEach((p) => addRef(p.schema));
      for (const resp of Object.values(op.responses ?? {})) {
        addRef(resp.content?.["application/json"]?.schema);
        addRef(resp.content?.["*/*"]?.schema);
      }
    }
  }

  console.log(
    `🗂 [${name}] Schema → Tag mapping count:`,
    Object.keys(schemaTagMap).length
  );

  if (!fs.existsSync(DATA_CONTRACTS_FILE)) {
    throw new Error(`❌ ${name}: data-contracts.ts not found`);
  }
  const content = fs.readFileSync(DATA_CONTRACTS_FILE, "utf8");
  const blocks = content.split(/(?=export (interface|type|enum) )/g);

  // 타입명 → 코드 블록
  const typeMap = {};
  for (const block of blocks) {
    const nameMatch = block.match(/export (?:interface|type|enum) (\w+)/);
    if (nameMatch) typeMap[nameMatch[1]] = block.trim();
  }

  const extractRefs = (code) => {
    const refs = [];
    const regex = /\b([A-Z]\w+)\b/g;
    let m;
    while ((m = regex.exec(code))) {
      const n = m[1];
      if (typeMap[n] && !["string", "number", "boolean", "Date"].includes(n)) {
        refs.push(n);
      }
    }
    return refs;
  };

  // 타입 사용 관계 추적 (태그별로 재귀적으로 따라감)
  const typeUsage = {};
  for (const [typeName, tag] of Object.entries(schemaTagMap)) {
    if (!typeMap[typeName]) continue;
    if (!typeUsage[typeName]) typeUsage[typeName] = new Set();
    typeUsage[typeName].add(tag);

    const stack = [typeName];
    const visited = new Set();
    while (stack.length) {
      const current = stack.pop();
      if (!typeMap[current]) continue;
      if (visited.has(current)) continue;
      visited.add(current);

      const refs = extractRefs(typeMap[current]);
      refs.forEach((ref) => {
        if (typeMap[ref]) {
          if (!typeUsage[ref]) typeUsage[ref] = new Set();
          typeUsage[ref].add(tag);
          stack.push(ref);
        }
      });
    }
  }

  // 공통 타입 자동 탐지 (여러 태그에서 쓰이면 common.ts로 이동)
  const commonTypes = Object.entries(typeUsage)
    .filter(([_, tags]) => tags.size > 1)
    .map(([t]) => t);

  console.log(`🌐 [${name}] Common types:`, commonTypes);

  fs.rmSync(TYPES_PATH, { recursive: true, force: true });
  fs.mkdirSync(TYPES_PATH, { recursive: true });

  // common.ts
  if (commonTypes.length) {
    const commonBlocks = commonTypes.map((n) => typeMap[n]);
    fs.writeFileSync(
      path.join(TYPES_PATH, "common.ts"),
      `/* eslint-disable */\n${commonBlocks.join("\n\n")}\n`,
      "utf8"
    );
  }

  // 태그별 타입 수집 (refs도 따라감)
  const tagMap = {};
  for (const [typeName, tag] of Object.entries(schemaTagMap)) {
    if (!typeMap[typeName]) continue;
    if (!tagMap[tag]) tagMap[tag] = new Set();

    const stack = [typeName];
    const visited = new Set();
    while (stack.length) {
      const current = stack.pop();
      if (!typeMap[current]) continue;
      if (visited.has(current)) continue;
      visited.add(current);

      if (!commonTypes.includes(current)) {
        tagMap[tag].add(current);
      }

      const refs = extractRefs(typeMap[current]);
      refs.forEach((ref) => stack.push(ref));
    }
  }

  // 태그별 파일 생성
  for (const [tag, typeNames] of Object.entries(tagMap)) {
    const imports = new Set();
    const blocks = [...typeNames].map((n) => {
      const code = typeMap[n];
      extractRefs(code).forEach((ref) => {
        if (commonTypes.includes(ref)) imports.add(ref);
      });
      return code;
    });

    const importLine = imports.size
      ? `import { ${[...imports].join(", ")} } from "./common";\n\n`
      : "";

    const fileName = `${tag.replace(/[^a-zA-Z0-9]/g, "")}.ts`;
    fs.writeFileSync(
      path.join(TYPES_PATH, fileName),
      `/* eslint-disable */\n${importLine}${blocks.join("\n\n")}\n`,
      "utf8"
    );
  }

  if (fs.existsSync(DATA_CONTRACTS_FILE)) {
    fs.unlinkSync(DATA_CONTRACTS_FILE);
    console.log(`🗑 [${name}] Deleted data-contracts.ts`);
  }

  console.log(
    `✅ [${name}] Split contracts complete:`,
    Object.keys(tagMap).length,
    "tag files"
  );
}

async function main() {
  for (const target of API_TARGETS) {
    await splitContracts(target);
  }
}

main().catch((e) => {
  console.error("❌ Split contracts failed:", e);
  process.exit(1);
});
