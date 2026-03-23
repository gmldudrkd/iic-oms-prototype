import { OrderSearchRequestShipmentStatusesEnum } from "@/shared/generated/oms/types/Order";

export const NOT_STARTED = "Not started";

export const { PICKING_REJECTED } = OrderSearchRequestShipmentStatusesEnum;

export const CLAIM_OPTIONS = [
  {
    value: "RETURN",
    label: "Return and request Pickup",
    tooltip: "Register return and triggers pickup",
  },
  {
    value: "RETURN_FORCE_REFUND",
    label: "Force Refund without Pickup",
    tooltip: "Register return and triggers refund without pickup",
  },
  {
    value: "EXCHANGE",
    label: "Exchange",
    tooltip: "Register exchange and triggers pickup",
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

export const MODAL_CONFIGS = {
  force_refund: {
    text: "Force refund processing without product pickup? This action cannot be undone.",
    dialogCloseLabel: "Cancel",
    dialogConfirmLabel: "Refund",
    closeButtonClassNames: "!text-primary",
    postButtonClassNames: "!text-error",
  },
  tracking_info: {
    text: "'Tracking information' has been entered. Are you sure you want to proceed with the claim without a pickup?",
    dialogCloseLabel: "Back",
    dialogConfirmLabel: "Continue",
    closeButtonClassNames: "!text-error",
    postButtonClassNames: "!text-primary",
  },
};
