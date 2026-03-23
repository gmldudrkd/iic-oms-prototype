import { GroupType, CategoryType } from "@/features/dashboard/models/types";

import IconExchange from "@/assets/icons/IconExchange";
import IconOrder from "@/assets/icons/IconOrder";
import IconReturn from "@/assets/icons/IconReturn";

// 섹션 데이터
export const SECTION_DATA = [
  {
    group: "order" as const,
    icon: <IconOrder />,
    color: "order",
  },
  {
    group: "return" as const,
    icon: <IconReturn />,
    color: "return",
  },
  {
    group: "exchange" as const,
    icon: <IconExchange />,
    color: "exchange",
  },
];

// 카테고리 데이터
export const CATEGORY_DATA: Record<GroupType, CategoryType[]> = {
  order: ["awaiting", "inProgress", "shipping", "shippingClosed", "finalized"],
  return: ["awaiting", "inProgress", "finalized"],
  exchange: ["awaiting", "inProgress", "finalized"],
};

// 카테고리 라벨
export const CATEGORY_LABEL_DATA = {
  awaiting: "Awaiting",
  inProgress: "In Progress",
  shipping: "Shipping",
  shippingClosed: "Shipping Closed",
  finalized: "Finalized",
};
