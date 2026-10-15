import { OrderSearchRequestShipmentStatusesEnum } from "@/shared/generated/oms/types/Order";

export const NOT_STARTED = "Not started";

export const { PICKING_REJECTED } = OrderSearchRequestShipmentStatusesEnum;

export const CLAIM_OPTIONS = [
  {
    value: "RETURN",
    label: "Return",
  },
  {
    value: "EXCHANGE",
    label: "Exchange",
  },
  {
    value: "RESHIPMENT",
    label: "Reshipment",
  },
  {
    value: "RETURN_FORCE_REFUND",
    label: "Force Refund",
  },
];

export const PICKUP_OPTIONS = [
  {
    value: "true",
    label: "Request Pickup",
  },
  {
    value: "false",
    label: "Do Not Request Pickup",
  },
];
// ------------------------------------------------------------
// 취소, 교환, 반품 이유 리스트
export const CLAIM_REASON_LISTS = {
  TAMBURINS: {
    cancelOrder: [
      {
        label: "Price Dissatisfaction",
        value: "Price Dissatisfaction",
        isCustomerFault: true,
      },
      {
        label: "Payment Method Change",
        value: "Payment Method Change",
        isCustomerFault: true,
      },
      {
        label: "Purchased Through Another Channel",
        value: "Purchased Through Another Channel",
        isCustomerFault: true,
      },
      {
        label: "Change of Mind",
        value: "Change of Mind",
        isCustomerFault: true,
      },
      {
        label: "Purchase of Similar Product",
        value: "Purchase of Similar Product",
        isCustomerFault: true,
      },
      { label: "System Error", value: "System Error", isCustomerFault: false },
      { label: "Out of Stock", value: "Out of Stock", isCustomerFault: false },
      {
        label: "Policy Violation",
        value: "Policy Violation",
        isCustomerFault: true,
      },
    ],

    registerClaim: {
      return: [
        {
          label: "Price Dissatisfaction",
          value: "Price Dissatisfaction",
          isCustomerFault: true,
        },
        {
          label: "Payment Method Change",
          value: "Payment Method Change",
          isCustomerFault: true,
        },
        {
          label: "Purchased Through Another Channel",
          value: "Purchased Through Another Channel",
          isCustomerFault: true,
        },
        {
          label: "Change of Mind",
          value: "Change of Mind",
          isCustomerFault: true,
        },
        {
          label: "Purchanse of Similar Product",
          value: "Purchanse of Similar Product",
          isCustomerFault: true,
        },

        {
          label: "Product Defect",
          value: "Product Defect",
          isCustomerFault: false,
        },
        {
          label: "Incorrect Shipping",
          value: "Incorrect Shipping",
          isCustomerFault: false,
        },
        { label: "Parcel Loss", value: "Parcel Loss", isCustomerFault: false },
        {
          label: "Delivery Delay",
          value: "Delivery Delay",
          isCustomerFault: false,
        },

        {
          label: "Others (Seller’s fault)",
          value: "Others (Seller’s fault)",
          isCustomerFault: false,
        },
        {
          label: "Others (Customer’s fault)",
          value: "Others (Customer’s fault)",
          isCustomerFault: true,
        },
      ],

      exchange: [
        {
          label: "Product Defect",
          value: "Product Defect",
          isCustomerFault: false,
        },
        {
          label: "Incorrect Shipping",
          value: "Incorrect Shipping",
          isCustomerFault: false,
        },
        { label: "Parcel Loss", value: "Parcel Loss", isCustomerFault: false },
        {
          label: "Delivery Delay",
          value: "Delivery Delay",
          isCustomerFault: false,
        },
      ],
    },
  },

  NO_TAMBURINS: {
    cancelOrder: [
      {
        label: "Offline Store Purchase",
        value: "Offline Store Purchase",
        isCustomerFault: true,
      },
      {
        label: "Payment Method Change",
        value: "Payment Method Change",
        isCustomerFault: true,
      },
      {
        label: "Purchase a Different Product",
        value: "Purchase a Different Product",
        isCustomerFault: true,
      },
      {
        label: "Change of Mind",
        value: "Change of Mind",
        isCustomerFault: true,
      },
      { label: "System Error", value: "System Error", isCustomerFault: false },
      { label: "Out of Stock", value: "Out of Stock", isCustomerFault: false },
      {
        label: "Policy Violation",
        value: "Policy Violation",
        isCustomerFault: true,
      },
    ],

    registerClaim: {
      return: [
        { label: "Product-Size", value: "Product-Size", isCustomerFault: true },
        {
          label: "Product-Design",
          value: "Product-Design",
          isCustomerFault: true,
        },
        {
          label: "Product-Material",
          value: "Product-Material",
          isCustomerFault: true,
        },
        {
          label: "Policy Violation",
          value: "Policy Violation",
          isCustomerFault: true,
        },
        {
          label: "Refused Delivery",
          value: "Refused Delivery",
          isCustomerFault: true,
        },

        {
          label: "Product-Defect",
          value: "Product-Defect",
          isCustomerFault: false,
        },
        {
          label: "Delivery-Delay",
          value: "Delivery-Delay",
          isCustomerFault: false,
        },
        {
          label: "Incorrect Amount",
          value: "Incorrect Amount",
          isCustomerFault: false,
        },
        {
          label: "Wrong Shipment",
          value: "Wrong Shipment",
          isCustomerFault: false,
        },

        {
          label: "Others (Seller’s fault)",
          value: "Others (Seller’s fault)",
          isCustomerFault: false,
        },
        {
          label: "Others (Customer’s fault)",
          value: "Others (Customer’s fault)",
          isCustomerFault: true,
        },
      ],

      exchange: [
        {
          label: "Product-Shipping",
          value: "Product-Shipping",
          isCustomerFault: false,
        },
        {
          label: "Product-Defect",
          value: "Product-Defect",
          isCustomerFault: false,
        },
        {
          label: "Wrong Shipment",
          value: "Wrong Shipment",
          isCustomerFault: false,
        },
        { label: "Others", value: "Others", isCustomerFault: false },
      ],
    },
  },
};

// ------------------------------------------------------------
// GM US / GM KR + INTELLIGENT EYEWEAR 제품 포함 주문 전용 반품 사유
// - group(대카테고리)은 헤더로만 노출, 하위 항목만 사유로 선택 가능
// - 귀책: CUSTOMER(고객) / SELLER(판매자) / CONDITIONAL(상황에 따라 다름 → 우선 고객 귀책으로 처리)
const IE_FAULT = { CUSTOMER: true, SELLER: false, CONDITIONAL: true };

const INTELLIGENT_EYEWEAR_RETURN_REASON_GROUPS = [
  {
    group: "Fit / Comfort",
    reasons: [
      { label: "Too Small", isCustomerFault: IE_FAULT.CUSTOMER },
      { label: "Too Large", isCustomerFault: IE_FAULT.CUSTOMER },
      { label: "Comfort / Weight", isCustomerFault: IE_FAULT.CUSTOMER },
    ],
  },
  {
    group: "Setup / Connectivity",
    reasons: [
      { label: "Phone Connection", isCustomerFault: IE_FAULT.CONDITIONAL },
      { label: "App / Account Setup", isCustomerFault: IE_FAULT.CONDITIONAL },
    ],
  },
  {
    group: "Feature",
    reasons: [
      { label: "Gemini / Assistant", isCustomerFault: IE_FAULT.CONDITIONAL },
      { label: "Camera", isCustomerFault: IE_FAULT.CONDITIONAL },
      { label: "Audio / Microphone", isCustomerFault: IE_FAULT.CONDITIONAL },
      { label: "Touch Controls", isCustomerFault: IE_FAULT.CONDITIONAL },
    ],
  },
  {
    group: "Battery / Charging",
    reasons: [
      { label: "Battery", isCustomerFault: IE_FAULT.CONDITIONAL },
      { label: "Charging Case", isCustomerFault: IE_FAULT.CONDITIONAL },
    ],
  },
  {
    group: "Damaged / Defective",
    reasons: [
      { label: "Physical Damage", isCustomerFault: IE_FAULT.CONDITIONAL },
      // 제조상 하자 확인 시
      { label: "Physical Defect", isCustomerFault: IE_FAULT.SELLER },
    ],
  },
  {
    group: "Not as Expected",
    reasons: [
      { label: "Design", isCustomerFault: IE_FAULT.CUSTOMER },
      { label: "Performance", isCustomerFault: IE_FAULT.CONDITIONAL },
    ],
  },
  {
    // 판매자 또는 배송사 귀책 확인 시
    group: "Delivery",
    reasons: [
      { label: "Misdelivery", isCustomerFault: IE_FAULT.SELLER },
      { label: "Delivery Delay", isCustomerFault: IE_FAULT.SELLER },
    ],
  },
];

export const INTELLIGENT_EYEWEAR_RETURN_REASONS =
  INTELLIGENT_EYEWEAR_RETURN_REASON_GROUPS.flatMap(({ group, reasons }) =>
    reasons.map(({ label, isCustomerFault }) => ({
      group,
      label,
      value: label,
      isCustomerFault,
    })),
  );

export const MODAL_CONFIGS = {
  force_refund: {
    text: "Force refund processing without product pickup? This action cannot be undone.",
    dialogCloseLabel: "Cancel",
    dialogConfirmLabel: "Refund",
    closeButtonClassNames: "!text-primary",
    postButtonClassNames: "!text-error",
  },
  keychain: {
    text: "This order includes a keychain. Are you sure you want to proceed with the claim without including it?",
    dialogCloseLabel: "Cancel",
    dialogConfirmLabel: "Proceed",
    closeButtonClassNames: "!text-primary",
    postButtonClassNames: "!text-primary",
  },
  // tracking_info: {
  //   text: "'Tracking information' has been entered. Are you sure you want to proceed with the claim without a pickup?",
  //   dialogCloseLabel: "Back",
  //   dialogConfirmLabel: "Continue",
  //   closeButtonClassNames: "!text-error",
  //   postButtonClassNames: "!text-primary",
  // },
};
