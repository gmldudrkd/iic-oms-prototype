import {
  PromotionRewardProduct,
  PromotionRow,
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
