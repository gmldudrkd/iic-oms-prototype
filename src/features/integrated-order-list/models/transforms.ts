import {
  OrderRow,
  ReturnRow,
  ExchangeRow,
} from "@/features/integrated-order-list/models/types";
import { OrderGroup } from "@/features/integrated-order-list/models/types";

import { ExchangeResponse } from "@/shared/generated/oms/types/Exchange";
import { OrderResponse } from "@/shared/generated/oms/types/Order";
import { ReturnResponse } from "@/shared/generated/oms/types/Return";
import { getLocalTime } from "@/shared/utils/formatDate";
import { snakeToTitleCase } from "@/shared/utils/stringUtils";

interface TransformParams<T> {
  data: T[];
  timezone: string;
}

const convertShippingText = (text: string | undefined): string => {
  if (!text?.trim()) return "-";
  const items = text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);

  if (items.length === 0) return "-";
  const [firstItem, ...rest] = items;

  return rest.length > 0 ? `${firstItem} 외 ${rest.length}` : firstItem;
};

export const transformOrderData = ({
  data,
  timezone,
}: TransformParams<OrderResponse>) => {
  return data
    .map((row) => {
      if (!row.orderId) return null;

      const hasValidShipments =
        Array.isArray(row.shipments) && row.shipments.length > 0;

      return {
        id: row.orderId,
        orderId: row.orderId,
        brand: row.brand.description,
        corp: row.corporation,
        channel: row.channelType.description,
        orderNo: row.originOrderNo,
        receiveMethod: (row as Record<string, unknown>).receiveMethod
          ? String((row as Record<string, unknown>).receiveMethod)
          : (row.orderId.charCodeAt(row.orderId.length - 1) % 3 === 0
              ? "Store Pickup"
              : "Delivery"),
        orderType: row.orderType.description,
        tags: (row as Record<string, unknown>).tags
          ? String((row as Record<string, unknown>).tags)
          : "",
        orderDate: getLocalTime(row.orderedAt, timezone),
        ordererName: row.ordererName || "-",
        ordererEmail: row.ordererEmail,
        ordererPhone: row.ordererPhone || "-",
        status: snakeToTitleCase(row.status.name),
        recipientName: row.recipientName || "-",
        recipientPhone: row.recipientPhone || "-",
        shippingStatus: hasValidShipments
          ? row.shipments.map((shipment) =>
              snakeToTitleCase(shipment.status.name),
            )
          : [],
        fulfillmentNo: row.shipments.map((shipment) =>
          convertShippingText(shipment.shipmentNo),
        ),
        fulfillmentStatus: row.shipments.map((shipment) =>
          snakeToTitleCase(shipment.status.name),
        ),
        trackingNo: row.shipments.map((shipment) =>
          convertShippingText(shipment.trackingNo),
        ),
      };
    })
    .filter(Boolean);
};

export const transformReturnData = ({
  data,
  timezone,
}: TransformParams<ReturnResponse>) => {
  return data
    .map((row) => {
      if (!row.returnId) return null;

      return {
        id: row.returnId,
        orderId: row.orderId,
        brand: row.brand.description,
        corp: row.corporation,
        channel: row.channelType.description,
        orderNo: row.originOrderNo,
        createdAt: getLocalTime(row.createdAt, timezone),
        ordererName: row.ordererName || "-",
        ordererEmail: row.ordererEmail,
        ordererPhone: row.ordererPhone || "-",
        status: snakeToTitleCase(row.status.name),
        recipientName: row.recipientName,
        recipientPhone: row.recipientPhone,
        trackingNo: row.pickupTrackingNo,
        returnNo: row.returnNo,
      };
    })
    .filter(Boolean);
};

export const transformExchangeData = ({
  data,
  timezone,
}: TransformParams<ExchangeResponse>) => {
  return data
    .map((row) => {
      if (!row.exchangeId) return null;

      return {
        id: row.exchangeId,
        orderId: row.orderId,
        brand: row.brand.description,
        corp: row.corporation,
        channel: row.channelType.description,
        orderNo: row.originOrderNo || "",
        createdAt: getLocalTime(row.createdAt, timezone),
        ordererName: row.ordererName || "-",
        ordererEmail: row.ordererEmail,
        ordererPhone: row.ordererPhone || "-",
        status: snakeToTitleCase(row.status.name),
        recipientName: row.recipientName,
        recipientPhone: row.recipientPhone,
        exchangeNo: row.exchangeNo,
        trackingNo: convertShippingText(row.pickupTrackingNo),
        resendNo: row.exchangeShipmentNos.map((no: string) =>
          convertShippingText(no),
        ),
      };
    })
    .filter(Boolean);
};

// ✅ 통합 entry 함수
export const transformGroupData = (
  group: OrderGroup,
  data: OrderResponse[] | ReturnResponse[] | ExchangeResponse[],
  timezone: string,
): OrderRow[] | ReturnRow[] | ExchangeRow[] => {
  if (data === null || data === undefined) return [];

  switch (group) {
    case "order":
      return transformOrderData({
        data: data as OrderResponse[],
        timezone,
      }) as OrderRow[];
    case "return":
      return transformReturnData({
        data: data as ReturnResponse[],
        timezone,
      }) as ReturnRow[];
    case "exchange":
      return transformExchangeData({
        data: data as ExchangeResponse[],
        timezone,
      }) as ExchangeRow[];
    default:
      return [];
  }
};
