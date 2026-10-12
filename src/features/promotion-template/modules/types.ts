// Promotion Template — Create Promotion 의 Basic Info · Target · Reward 를 저장해 두고
// 채널만 골라 채널별 기간을 입력하면 채널 수만큼 프로모션(DRAFT)이 생성되는 원본.
// Period(Start · End · Always on)와 Status 는 채널마다 다르므로 템플릿에 두지 않는다.

export type TemplateType = "GWP" | "PACKAGE";

export type TargetMode = "product" | "amount" | "all";

export type PurchaseBasis = "any" | "all";

export type RewardBasis = "per_order" | "per_qty";

export type RewardType = "default" | "option";

export interface TemplateProduct {
  sap: string;
  name: string;
  model: string;
  category: string;
  price: number;
}

// Target = Order Amount 의 주문 금액 구간 — 하한 포함(≤), 상한 미포함(<). 무제한은 마지막 구간만 가능
// 구간별로 증정할 Reward 제품(SAP)만 저장하고, 재고 수량은 생성된 프로모션의 Shared SKU Inventory 에서 입력한다
export interface TemplateAmountRange {
  min: number;
  max: number;
  unlimited: boolean;
  rewards: string[];
}

export interface PromotionTemplate {
  id: number;
  name: string;
  type: TemplateType;
  goal: string;
  // Target
  tmode: TargetMode;
  basis: PurchaseBasis;
  skus: string[];
  // Target = Order Amount 일 때만 사용
  amountRanges: TemplateAmountRange[];
  qty: number;
  rewardBasis: RewardBasis;
  multiplier: number;
  // Reward
  rewardType: RewardType;
  // Order Amount 는 모든 구간의 Reward 제품을 합친 목록(중복 제거) — 카드·검색 표기용
  rewards: string[];
  createdBy: string;
  createdAt: string;
}

export type TemplateDraft = Omit<
  PromotionTemplate,
  "id" | "createdBy" | "createdAt"
>;

// 멀티 등록 모달의 채널별 행 — 같은 채널에 다른 기간(1차·2차)을 추가할 수 있어 채널 기준 유일하지 않다
export interface MultiRegisterRow {
  key: string;
  channel: string;
  name: string;
  start: string; // datetime-local ("YYYY-MM-DDTHH:mm")
  end: string;
  always: boolean;
}

export type TemplateFilter = "all" | TemplateType;
