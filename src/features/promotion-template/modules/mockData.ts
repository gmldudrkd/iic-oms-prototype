import dayjs from "dayjs";

import { skusOfModel } from "@/features/promotion-template/modules/constants";
import {
  PromotionTemplate,
  TemplateDraft,
} from "@/features/promotion-template/modules/types";

// 9월 GWP 시트(탬버린즈, gid 904858322)를 정규화한 예시 템플릿.
// 브라우저 메모리에만 유지되며 새로고침하면 초기 상태로 돌아간다.

let seq = 0;

const base = (): Omit<
  PromotionTemplate,
  "id" | "name" | "createdBy" | "createdAt"
> => ({
  type: "GWP",
  goal: "Increase Sales",
  tmode: "product",
  basis: "any",
  skus: [],
  minAmount: 100000,
  qty: 1,
  rewardBasis: "per_order",
  multiplier: 1,
  rewardType: "default",
  rewards: [],
});

const mk = (
  name: string,
  o: Partial<PromotionTemplate>,
  daysAgo = 0,
): PromotionTemplate => ({
  ...base(),
  ...o,
  id: ++seq,
  name,
  createdBy: o.createdBy ?? "tam35",
  createdAt: dayjs()
    .subtract(daysAgo, "day")
    .startOf("hour")
    .format("YYYY.MM.DD HH:mm:ss"),
});

const G = {
  ohand: skusOfModel("MDL-OHC-030"),
  shellx: skusOfModel("MDL-SHX-030"),
  balm: skusOfModel("MDL-PB-006"),
  p50: skusOfModel("MDL-PF-050"),
  egg: skusOfModel("MDL-EGG-014"),
};

function seed(): PromotionTemplate[] {
  return [
    mk(
      "PERFUME_CHAMO_2ML 전제품 GWP",
      { tmode: "all", rewards: ["12002438"] },
      14,
    ),
    mk(
      "KEY COMB 10만원 GWP",
      { tmode: "amount", minAmount: 100000, rewards: ["12002354"] },
      14,
    ),
    mk(
      "15만원 사은품 선택 GWP",
      {
        tmode: "amount",
        minAmount: 150000,
        rewardType: "option",
        rewards: ["12002417", "12500587"],
      },
      12,
    ),
    mk(
      "O HAND CREAM_CHAMO_2ML GWP",
      { skus: G.ohand, rewards: ["12500593"] },
      10,
    ),
    mk(
      "PERFUME VINYL BLUE HINOKI GWP",
      { skus: G.balm, rewardBasis: "per_qty", rewards: ["12001603"] },
      10,
    ),
    mk(
      "O HAND RIBBON MINI BAG 킬러카드",
      { skus: G.ohand, rewardBasis: "per_qty", rewards: ["12500598"] },
      8,
    ),
    mk(
      "PUPPY CASE + CHAMO 2ML 퍼퓸 50ml GWP",
      { skus: G.p50, rewards: ["12002472", "12002438"] },
      7,
    ),
    mk(
      "TAMBURINS SHOPPING BAG S 상시",
      { skus: G.p50, rewardBasis: "per_qty", rewards: ["16000248"] },
      30,
    ),
    // Packaging Benefit
    mk(
      "O HAND CREAM_GREEN RIBBON_26",
      {
        type: "PACKAGE",
        skus: G.ohand,
        rewardBasis: "per_qty",
        multiplier: 2,
        rewards: ["32002382"],
      },
      5,
    ),
    mk(
      "PERFUME BALM/OIL MINI PACKAGE_25",
      {
        type: "PACKAGE",
        skus: G.balm,
        rewardBasis: "per_qty",
        rewards: ["32002336"],
      },
      40,
    ),
    mk(
      "PERFUME 50ML PINK RIBBON_23년",
      {
        type: "PACKAGE",
        skus: G.p50,
        rewardBasis: "per_qty",
        rewards: ["32001988"],
      },
      60,
    ),
    mk(
      "HEART PACKAGE PINK(BLACK LOGO)_23년",
      {
        type: "PACKAGE",
        skus: G.shellx,
        rewardBasis: "per_qty",
        rewards: ["32001965"],
      },
      60,
    ),
  ];
}

// 모듈 스코프에 유지 — 페이지를 오가도 세션 동안 저장 결과가 남는다 (MOCK_PROMOTIONS 와 동일 방식)
export const MOCK_TEMPLATES: PromotionTemplate[] = seed();

export function createTemplate(draft: TemplateDraft): PromotionTemplate {
  const t: PromotionTemplate = {
    ...draft,
    id: ++seq,
    createdBy: "tam35",
    createdAt: dayjs().format("YYYY.MM.DD HH:mm:ss"),
  };
  MOCK_TEMPLATES.unshift(t);
  return t;
}

export function updateTemplate(
  id: number,
  draft: TemplateDraft,
): PromotionTemplate | undefined {
  const idx = MOCK_TEMPLATES.findIndex((t) => t.id === id);
  if (idx < 0) return undefined;
  MOCK_TEMPLATES[idx] = { ...MOCK_TEMPLATES[idx], ...draft };
  return MOCK_TEMPLATES[idx];
}

export function deleteTemplate(id: number): boolean {
  const idx = MOCK_TEMPLATES.findIndex((t) => t.id === id);
  if (idx < 0) return false;
  MOCK_TEMPLATES.splice(idx, 1);
  return true;
}
