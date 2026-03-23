export type TriggerType =
  | "Purchase Over Amount Threshold"
  | "Purchase Specific Product or Label"
  | "Purchase Specific Product Over Amount Threshold"
  | "Purchase Any Product";

export type RewardType = "Order Level" | "Product Level";

export interface TriggerProduct {
  no: number;
  imageUrl: string;
  skuCode: string;
  productName: string;
}

export interface RewardProduct {
  no: number;
  imageUrl: string;
  skuCode: string;
  productName: string;
  rewardQty: number;
  stockUseDedicated: number | null;
  stockUseRemained: number | null;
  stockUseAlertThreshold: number | null;
}

export interface PromotionDetail {
  promotionNo: number;
  title: string;
  status: "Active" | "Upcoming" | "Expired" | "Draft";

  // General
  type: string;
  brand: string;
  corp: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  reason: string;

  // Trigger Detail
  triggerType: TriggerType;
  amount: number | null;
  amountCurrency: string | null;
  triggerChannels: string[];
  triggerProducts: TriggerProduct[];

  // Reward Detail
  rewardType: RewardType;
  rewardProducts: RewardProduct[];
}
