import {
  OrderRow,
  ReturnRow,
  ExchangeRow,
  ReshipmentRow,
} from "@/features/integrated-order-list/models/types";
import { OrderGroup } from "@/features/integrated-order-list/models/types";

import { ExchangeResponse } from "@/shared/generated/oms/types/Exchange";
import { OrderResponse } from "@/shared/generated/oms/types/Order";
import { ReshipmentResponse } from "@/shared/generated/oms/types/Reshipment";
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
        orderType: row.orderType.description,
        receiveMethod:
          (row as Record<string, unknown>).receiveMethod || "Delivery",
        channel: row.channelType.description,
        orderNo: row.originOrderNo,
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
        shipmentNo: row.shipments.map((shipment) =>
          convertShippingText(shipment.shipmentNo),
        ),
        shipmentStatus: row.shipments.map((shipment) =>
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
        trackingNo: row.pickupTrackingNo || "-",
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

export const transformReshipmentData = ({
  data,
  timezone,
}: TransformParams<ReshipmentResponse>) => {
  return data
    .map((row) => {
      if (!row.reshipmentId) return null;

      return {
        id: row.reshipmentId,
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
        reshipmentNo: row.reshipmentNo,
        trackingNo: row.trackingNo || "-",
      };
    })
    .filter(Boolean);
};

// ✅ 통합 entry 함수
export const transformGroupData = (
  group: OrderGroup,
  data:
    | OrderResponse[]
    | ReturnResponse[]
    | ExchangeResponse[]
    | ReshipmentResponse[],
  timezone: string,
): OrderRow[] | ReturnRow[] | ExchangeRow[] | ReshipmentRow[] => {
  if (data === null || data === undefined) return [];

  switch (group) {
    case "order":
    case "shipment":
    case "storePickup":
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
    case "reshipment":
      return transformReshipmentData({
        data: data as ReshipmentResponse[],
        timezone,
      }) as ReshipmentRow[];
    default:
      return [];
  }
};
