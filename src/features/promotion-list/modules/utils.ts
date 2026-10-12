import {
  PromotionPurchaseBasis,
  PromotionRewardBasis,
  PromotionRewardProduct,
  PromotionRow,
  PromotionTargetProduct,
} from "@/features/promotion-list/modules/mockData";

// 리스트 Target Type (등록 화면의 Target 구분과 동일)
export type PromotionTargetType =
  | "Specific Product"
  | "Order Amount"
  | "All Product";

// 저장된 triggerType → Target Type
export const getTargetType = (triggerType: string): PromotionTargetType => {
  const t = (triggerType || "").toLowerCase();
  if (t.includes("amount")) return "Order Amount";
  if (t.includes("specific") || t.includes("label")) return "Specific Product";
  return "All Product";
};

export const getRemaining = (p: PromotionRewardProduct) =>
  Math.max(0, (p.total ?? 0) - (p.sold ?? 0));

// 재고 표시 단계: 소진(0) / 경고(Alert 이하) / 정상
export type StockLevel = "empty" | "low" | "ok";
export const getStockLevel = (p: PromotionRewardProduct): StockLevel => {
  const remaining = getRemaining(p);
  if (remaining <= 0) return "empty";
  if (p.alert !== undefined && remaining <= p.alert) return "low";
  return "ok";
};

// 리스트 Reward Product / Stock 컬럼에 노출할 행
// - Specific Product / All Product: 증정 제품 전체를 한 줄씩
// - Order Amount: 금액 구간별로 재고가 가장 적게 남은 제품 1개 (+ 나머지 제품 수)
//   잔여 재고가 동일하면 조회된 제품 중 첫 번째 제품을 노출
export interface RewardDisplayRow {
  key: string;
  rangeLabel?: string;
  product: PromotionRewardProduct;
  // 같은 구간 내 함께 증정되는 다른 제품 수 (Order Amount 만)
  otherCount: number;
}

export const getRewardDisplayRows = (row: PromotionRow): RewardDisplayRow[] => {
  const targetType = getTargetType(row.triggerType);

  if (targetType === "Order Amount" && row.rangeRewards?.length) {
    return row.rangeRewards
      .filter((range) => range.products.length > 0)
      .map((range, index) => {
        // 재고가 동일한 제품이 여럿이면 앞선(먼저 조회된) 제품을 유지 — 뒤 제품은 엄격히 적을 때만 교체
        const lowest = range.products.reduce((min, p) =>
          getRemaining(p) < getRemaining(min) ? p : min,
        );
        return {
          key: `${range.label}-${index}`,
          rangeLabel: range.label,
          product: lowest,
          otherCount: range.products.length - 1,
        };
      });
  }

  return row.rewardProducts.map((product, index) => ({
    key: `${product.skuCode}-${index}`,
    product,
    otherCount: 0,
  }));
};

// ---- Export(Excel) 용 값 ----

// Target Type → 엑셀 표기 (SPECIFIC_PRODUCT / ORDER_AMOUNT / ALL_PRODUCT)
export const getTargetTypeCode = (row: PromotionRow) =>
  getTargetType(row.triggerType).toUpperCase().replace(/\s+/g, "_");

// 구매 조건 (Specific Product 만) — 미설정 시 등록 화면 기본값 ANY / 1
export const getPurchaseBasis = (
  row: PromotionRow,
): PromotionPurchaseBasis | "" =>
  getTargetType(row.triggerType) === "Specific Product"
    ? (row.purchaseBasis ?? "ANY")
    : "";

export const getPurchaseQuantity = (row: PromotionRow): number | "" =>
  getTargetType(row.triggerType) === "Specific Product"
    ? (row.purchaseQuantity ?? 1)
    : "";

// 증정 기준 (Specific Product / All Product) — 미설정 시 GWP=PER_ORDER, PACKAGE=PER_PRODUCT_QUANTITY
export const getRewardBasis = (
  row: PromotionRow,
): PromotionRewardBasis | "" => {
  if (getTargetType(row.triggerType) === "Order Amount") return "";
  if (row.rewardBasis) return row.rewardBasis;
  return row.promotionType === "PACKAGE" ? "PER_PRODUCT_QUANTITY" : "PER_ORDER";
};

// 제품 목록 → "제품명 - 코드" 한 줄씩
export const formatProductLines = (products?: PromotionTargetProduct[]) =>
  (products ?? []).map((p) => `${p.productName} - ${p.id}`).join("\n");
