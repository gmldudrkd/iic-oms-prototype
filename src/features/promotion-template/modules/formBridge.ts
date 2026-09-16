import {
  GOALS,
  PRODUCT_BY_SAP,
  ensureProduct,
} from "@/features/promotion-template/modules/constants";
import {
  PromotionTemplate,
  TemplateDraft,
} from "@/features/promotion-template/modules/types";

// Promotion 등록 화면(PromotionFormV2)과 템플릿 사이의 변환 계층.
// FormV2 의 FormState 는 컴포넌트 내부 타입이므로, 양쪽이 모두 알 수 있는 중립 형태로 주고받는다.

export interface BridgeProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface TemplateFormBridge {
  name: string;
  goal: string;
  promoType: "gwp" | "package";
  condMode: "products" | "amount" | "allProducts";
  productMatch: "any" | "all";
  buyQty: number;
  rewardBasis: "order" | "product";
  rewardGive: "default" | "option";
  minAmount: number;
  targets: BridgeProduct[];
  rewardProducts: BridgeProduct[];
}

const toBridgeProduct = (sap: string): BridgeProduct => {
  const p = PRODUCT_BY_SAP[sap];
  return {
    id: sap,
    name: p?.name ?? sap,
    price: p?.price ?? 0,
    category: p?.category,
  };
};

// 템플릿 → 프로모션 등록 화면에 채울 값 (Period · Channel · Status 는 포함하지 않음)
export const templateToBridge = (t: PromotionTemplate): TemplateFormBridge => ({
  name: t.name,
  goal: t.goal,
  promoType: t.type === "GWP" ? "gwp" : "package",
  condMode:
    t.tmode === "product"
      ? "products"
      : t.tmode === "amount"
        ? "amount"
        : "allProducts",
  productMatch: t.basis,
  buyQty: t.qty,
  rewardBasis: t.rewardBasis === "per_order" ? "order" : "product",
  rewardGive: t.rewardType,
  minAmount: t.minAmount,
  targets: t.skus.map(toBridgeProduct),
  rewardProducts: t.rewards.map(toBridgeProduct),
});

// 프로모션 등록 화면의 현재 입력값 → 템플릿 (등록 화면에서 "Save as Template")
export const bridgeToDraft = (
  b: TemplateFormBridge,
  templateName: string,
): TemplateDraft => {
  const register = (p: BridgeProduct, fallbackCategory: string) =>
    ensureProduct({
      sap: p.id,
      name: p.name,
      model: "",
      category: p.category ?? fallbackCategory,
      price: p.price,
    });
  b.targets.forEach((p) => register(p, "Product"));
  b.rewardProducts.forEach((p) =>
    register(p, b.promoType === "package" ? "Packaging" : "GWP"),
  );
  return {
    name: templateName.trim(),
    type: b.promoType === "gwp" ? "GWP" : "PACKAGE",
    goal: b.goal || GOALS[0],
    tmode:
      b.condMode === "products"
        ? "product"
        : b.condMode === "amount"
          ? "amount"
          : "all",
    basis: b.productMatch,
    skus: b.condMode === "products" ? b.targets.map((p) => p.id) : [],
    minAmount: b.minAmount,
    qty: b.buyQty,
    rewardBasis: b.rewardBasis === "order" ? "per_order" : "per_qty",
    multiplier: 1,
    rewardType: b.rewardGive,
    rewards: b.rewardProducts.map((p) => p.id),
  };
};
