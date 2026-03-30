import AssignmentReturnTwoToneIcon from "@mui/icons-material/AssignmentReturnTwoTone";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import LocalShippingTwoToneIcon from "@mui/icons-material/LocalShippingTwoTone";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { GroupType, CategoryType } from "@/features/dashboard/models/types";

// 섹션 데이터
// export const SECTION_DATA = [
//   {
//     group: "order" as const,
//     icon: <IconOrder />,
//     color: "order",
//   },
//   {
//     group: "return" as const,
//     icon: <IconReturn />,
//     color: "return",
//   },
//   {
//     group: "exchange" as const,
//     icon: <IconExchange />,
//     color: "exchange",
//   },
// ];

export const SECTION_DATA: Record<
  "order" | "claim",
  { group: GroupType; icon: JSX.Element }[]
> = {
  order: [
    {
      group: "order",
      icon: <ShoppingCartOutlinedIcon />,
    },
    {
      group: "shipment",
      icon: <LocalShippingTwoToneIcon />,
    },
    {
      group: "storePickup",
      icon: <PlaceOutlinedIcon />,
    },
  ],
  claim: [
    {
      group: "return",
      icon: <AssignmentReturnTwoToneIcon />,
    },
    {
      group: "exchange",
      icon: <CurrencyExchangeOutlinedIcon />,
    },
    {
      group: "reshipment",
      icon: <LocalShippingTwoToneIcon />,
    },
  ],
};

// 카테고리 데이터
// export const CATEGORY_DATA: Record<GroupType, CategoryType[]> = {
//   order: ["awaiting", "inProgress", "shipping", "shippingClosed", "finalized"],
//   return: ["awaiting", "inProgress", "finalized"],
//   exchange: ["awaiting", "inProgress", "finalized"],
// };

export const CATEGORY_DATA: Record<GroupType, CategoryType[]> = {
  order: ["awaiting", "inProgress", "finalized"],
  shipment: ["inProgress", "finalized"],
  storePickup: ["inProgress", "finalized"],
  return: ["awaiting", "inProgress", "finalized"],
  exchange: ["awaiting", "inProgress", "finalized"],
  reshipment: ["inProgress", "finalized"],
};

// 카테고리 라벨
export const CATEGORY_LABEL_DATA = {
  awaiting: "Awaiting",
  inProgress: "In Progress",
  shipping: "Shipping",
  shippingClosed: "Shipping Closed",
  finalized: "Finalized",
};
