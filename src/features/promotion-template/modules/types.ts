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

export interface PromotionTemplate {
  id: number;
  name: string;
  type: TemplateType;
  goal: string;
  // Target
  tmode: TargetMode;
  basis: PurchaseBasis;
  skus: string[];
  minAmount: number;
  qty: number;
  rewardBasis: RewardBasis;
  multiplier: number;
  // Reward
  rewardType: RewardType;
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
