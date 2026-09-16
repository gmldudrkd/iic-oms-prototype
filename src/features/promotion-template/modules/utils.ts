import dayjs from "dayjs";

import {
  MOCK_PROMOTIONS,
  PromotionRow,
} from "@/features/promotion-list/modules/mockData";
import {
  BRAND_CORP_CHANNELS,
  CHANNEL_COLORS,
  DEFAULT_BRAND,
  DEFAULT_CORP,
  PRODUCT_BY_SAP,
  TARGET_MODE_LABEL,
  TemplateSearchKeyType,
} from "@/features/promotion-template/modules/constants";
import {
  MultiRegisterRow,
  PromotionTemplate,
  TemplateDraft,
  TemplateType,
} from "@/features/promotion-template/modules/types";

import { BrandResponse } from "@/shared/generated/oms/types/User";

// ---- 표기 ----
export const productName = (sap: string) => PRODUCT_BY_SAP[sap]?.name ?? sap;

export const formatKrw = (n: number) =>
  `KRW ${(Number(n) || 0).toLocaleString()}`;

export const targetDesc = (t: TemplateDraft) => {
  if (t.tmode === "all") return TARGET_MODE_LABEL.all;
  if (t.tmode === "amount") return `Order Amount ${formatKrw(t.minAmount)}+`;
  return `${t.skus.length} products · ${t.basis === "any" ? "Any" : "All"}`;
};

export const conditionDesc = (t: TemplateDraft) =>
  t.rewardBasis === "per_order"
    ? `Per order · ${t.qty}+`
    : `Per product qty × ${t.multiplier}`;

export const rewardDesc = (t: TemplateDraft) =>
  t.rewards.map(productName).join(", ") || "—";

// "YYYY-MM-DDTHH:mm" → "M/D HH:mm"
export const fmtLocal = (s: string) => {
  if (!s) return "";
  const d = dayjs(s);
  return d.isValid() ? d.format("M/D HH:mm") : s;
};

// datetime-local 기본값: 오늘 10:00 / +15일 10:00 (시트의 통상 기간 패턴)
export const defaultStart = () =>
  dayjs().add(1, "day").hour(10).minute(0).format("YYYY-MM-DDTHH:mm");
export const defaultEnd = () =>
  dayjs().add(16, "day").hour(10).minute(0).format("YYYY-MM-DDTHH:mm");

// ---- 채널 ----
export const channelColor = (channels: string[], name: string) => {
  const i = Math.max(0, channels.indexOf(name));
  return CHANNEL_COLORS[i % CHANNEL_COLORS.length];
};

// 상단 헤더 Brand & Corp 선택 기반 채널 목록 (없으면 GM|KR 기본)
export const availableChannelsFor = (permission: BrandResponse[]) => {
  const result: string[] = [];
  permission.forEach((item) => {
    const brand = item.brand?.description ?? "";
    item.corporations?.forEach((c) => {
      (BRAND_CORP_CHANNELS[`${brand}|${c.name}`] ?? []).forEach((ch) => {
        if (!result.includes(ch)) result.push(ch);
      });
    });
  });
  return result.length
    ? result
    : BRAND_CORP_CHANNELS[`${DEFAULT_BRAND}|${DEFAULT_CORP}`];
};

export const brandCorpOf = (permission: BrandResponse[]) => {
  const first = permission.find((item) => item.corporations?.length);
  return {
    brand: first?.brand?.description ?? DEFAULT_BRAND,
    corp: first?.corporations?.[0]?.name ?? DEFAULT_CORP,
  };
};

// ---- 검증 ----
export const validateTemplate = (d: TemplateDraft): string => {
  if (!d.name.trim()) return "Enter a Template Name.";
  if (!d.goal.trim()) return "Enter a Promotion Goal.";
  if (d.tmode === "product" && d.skus.length === 0)
    return "Add at least one Target product.";
  if (d.tmode === "amount" && !(d.minAmount > 0))
    return "Enter a Minimum Order Amount.";
  // Packaging Benefit: Order Amount 불가, Reward Basis 는 Per product quantity 고정
  if (d.type === "PACKAGE" && d.tmode === "amount")
    return "Order Amount is not available for Packaging Benefit.";
  if (d.type === "PACKAGE" && d.rewardBasis !== "per_qty")
    return "Packaging Benefit must use Per product quantity as Reward Basis.";
  if (d.rewards.length === 0) return "Add at least one Reward product.";
  return "";
};

export const validateRows = (rows: MultiRegisterRow[]): string => {
  if (rows.length === 0) return "Select at least one channel.";
  for (const r of rows) {
    if (!r.name.trim()) return `${r.channel}: Promotion Name is required.`;
    if (!r.start) return `${r.channel}: Start is required.`;
    if (!r.always) {
      if (!r.end)
        return `${r.channel}: End is required (or turn on Always on).`;
      if (r.end <= r.start) return `${r.channel}: End must be after Start.`;
    }
  }
  return "";
};

// "… · 2차" 식으로 같은 채널의 다음 회차 이름 생성
export const nextRoundName = (name: string) =>
  name.replace(/( · (\d+)차)?$/, (_m, _g, n) =>
    n ? ` · ${Number(n) + 1}차` : " · 2차",
  );

// ---- Promotion List 연동 ----
const TRIGGER_TYPE_OF = {
  product: "Purchase Specific Product or Label",
  amount: "Purchase Over Amount Threshold",
  all: "Purchase Any Product",
} as const;

// datetime-local → 리스트 표기 "YYYY.MM.DD HH:mm:ss"
const toListDate = (s: string) =>
  s ? dayjs(s).format("YYYY.MM.DD HH:mm:ss") : "";

// 멀티 등록: 채널 행 1개 = 프로모션 1건, 모두 Draft 로 Promotion List(MOCK_PROMOTIONS) 에 추가
export function registerPromotions(
  t: PromotionTemplate,
  rows: MultiRegisterRow[],
  brandCorp: { brand: string; corp: string },
): PromotionRow[] {
  let nextId = Math.max(0, ...MOCK_PROMOTIONS.map((p) => p.id)) + 1;
  const now = dayjs().format("YYYY.MM.DD HH:mm:ss");
  const rewardProducts = t.rewards.map((sap) => ({
    productName: productName(sap),
    skuCode: sap,
    // Reward 수량은 생성된 프로모션에서 입력한다 (템플릿에는 없음)
    total: 0,
    sold: 0,
    alert: 0,
  }));
  const rewardText = `${rewardDesc(t)} * ${t.multiplier}\n(${
    t.rewardBasis === "per_order" ? "per order" : "per target item"
  })`;
  const targetProducts =
    t.tmode === "product"
      ? t.skus.map((sap) => {
          const p = PRODUCT_BY_SAP[sap];
          return {
            id: sap,
            productName: p?.name ?? sap,
            price: p?.price ?? 0,
            category: p?.category ?? "",
          };
        })
      : undefined;
  const trigger =
    t.tmode === "product"
      ? [
          productName(t.skus[0]),
          t.skus.length > 1
            ? `(+${t.skus.length - 1} more specific products)`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      : t.tmode === "amount"
        ? `Order Amount ${formatKrw(t.minAmount)}+`
        : "Purchase Any Product";

  const created: PromotionRow[] = rows.map((r) => ({
    id: nextId++,
    brand: brandCorp.brand,
    corp: brandCorp.corp,
    title: r.name.trim(),
    status: "Draft",
    triggerType: TRIGGER_TYPE_OF[t.tmode],
    triggerChannels: [r.channel],
    trigger,
    targetProducts,
    reward: rewardText,
    rewardProducts,
    startDate: toListDate(r.start),
    endDate: r.always ? "" : toListDate(r.end),
    createdBy: "tam35",
    createdAt: now,
    updatedBy: "-",
  }));
  MOCK_PROMOTIONS.unshift(...created);
  return created;
}

// ---- 템플릿 목록 검색 ----
export interface TemplateSearchValues {
  // "" = All
  promotionType: "" | TemplateType;
  searchKeyType: TemplateSearchKeyType;
  searchKeyword: string;
}

// 검색 키별로 비교할 문자열 (줄바꿈으로 여러 값을 이어 부분 일치)
const searchFieldOf = (t: PromotionTemplate, key: TemplateSearchKeyType) => {
  switch (key) {
    case "title":
      return t.name;
    case "gwpName":
      return t.rewards.map(productName).join("\n");
    case "rewardSapCode":
      return t.rewards.join("\n");
    case "targetProductName":
      return t.skus.map(productName).join("\n");
    case "targetSapCode":
      return t.skus.join("\n");
    default:
      return "";
  }
};

export const filterTemplates = (
  list: PromotionTemplate[],
  v: TemplateSearchValues,
) => {
  let result = list;
  if (v.promotionType) {
    result = result.filter((t) => t.type === v.promotionType);
  }
  const keywords = String(v.searchKeyword ?? "")
    .split("\n")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  if (keywords.length > 0) {
    result = result.filter((t) => {
      const field = searchFieldOf(t, v.searchKeyType).toLowerCase();
      return keywords.some((kw) => field.includes(kw));
    });
  }
  return result;
};
