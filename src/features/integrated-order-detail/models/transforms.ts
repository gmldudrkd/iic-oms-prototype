import { GridRowModel } from "@mui/x-data-grid";
import { GridRowModel as GridRowModelPro } from "@mui/x-data-grid-pro";

import { NOT_STARTED } from "@/features/integrated-order-detail/modules/constants";
import { TAddressForm } from "@/features/integrated-order-detail/modules/types";

import { ClaimCreateRequestTypeEnum } from "@/shared/generated/oms/types/Claim";
import {
  ExchangeDetailResponse,
  ExchangeDetailShipmentResponse,
  ExchangeSearchRequestExchangeStatusesEnum,
} from "@/shared/generated/oms/types/Exchange";
import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
  OrderDetailShipmentItemResponse,
  OrderEstimateRefundFeeResponse,
  OrderHistoryResponse,
  RefundPayment,
} from "@/shared/generated/oms/types/Order";
import { ReshipmentDetailResponse } from "@/shared/generated/oms/types/Reshipment";
import {
  ReturnDetailClaimItemResponse,
  ReturnDetailResponse,
} from "@/shared/generated/oms/types/Return";
import { getLocalTime } from "@/shared/utils/formatDate";
import { getDefaultImageUrl } from "@/shared/utils/imageUtils";
import { formatLine1, snakeToTitleCase } from "@/shared/utils/stringUtils";

interface TransformOrderDetailDataProps {
  data?: OrderDetailResponse;
  timezone: string;
}

/**
 * order detail 데이터 변환
 * @param TransformOrderDetailDataProps { data: OrderDetailResponse, timezone: string }
 */
export const transformOrderDetailData = ({
  data,
  timezone,
}: TransformOrderDetailDataProps) => {
  return {
    orderDetail: {
      channel: data?.channelType?.description ?? "-",
      orderDate: getLocalTime(data?.orderedAt ?? "-", timezone),
      orderStatus: data?.status.description ?? "-",
      purchaseNo: data?.purchaseNo,
      ordererName: data?.orderer?.fullName ?? "-",
      phoneCountryNo: data?.orderer?.phoneCountryNo || "",
      ordererPhone: data?.orderer?.phone,
      ordererEmail: data?.orderer?.email ?? "-",
      receiveMethod:
        ((data as Record<string, unknown>)?.receiveMethod as string) ??
        "Delivery",
      orderType: data?.orderType?.description ?? "-",
    },
    recipientInfo: {
      orderStatus: snakeToTitleCase(data?.status.name ?? "-"),
      recipientFirstName: data?.recipient.firstName ?? "-",
      recipientLastName: data?.recipient.lastName ?? "-",
      recipientName: data?.recipient.fullName ?? "-",
      phoneCountryNo: data?.recipient?.phoneCountryNo || "",
      recipientPhone: data?.recipient?.phone,
      deliveryAddress: {
        postcode: data?.recipient?.address?.postalCode ?? "-",
        address1: formatLine1(
          data?.recipient?.address?.line1 ?? "-",
          data?.recipient?.address?.state ?? "",
          data?.recipient?.address?.city ?? "",
        ),
        address2: data?.recipient?.address?.line2 ?? "-",
        city: data?.recipient?.address?.city ?? "-",
        stateProvince: data?.recipient?.address?.state ?? "-",
        countryRegion: data?.recipient?.address?.countryType ?? "-",
      },
    },
  };
};

const formatWithSequence = (
  value: string | number | null | undefined,
  sequence: number | string,
): string => {
  return `${value ?? ""}^${sequence}`;
};

const createCommonQuantityFields = <T>(
  fields: (keyof T)[],
  item: T,
  sequence: number | string,
) => {
  return fields.reduce(
    (acc, key) => {
      const value = (item as Record<string, unknown>)[key as string];
      acc[key as string] = `${value ?? ""}^${sequence}`;
      return acc;
    },
    {} as Record<string, string>,
  );
};

/**
 * ordered product info rows 변환
 * @param data OrderDetailResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsOrderedProductInfo = (
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];
  const { currency } = data.payments[0] ?? {};

  const rows: GridRowModel[] = data.items.flatMap((item, itemIndex) => {
    const hasProducts = (item.products?.length || 0) > 0;
    const hasComponents = (item.components?.length || 0) > 0;
    const { sequence } = item;
    const imageValue = `${getDefaultImageUrl(item.thumbnailUrl)}?${sequence}`;
    const itemRows: GridRowModel[] = [];

    const buildSubRow = (
      sub: Record<string, unknown>,
      keyPrefix: string,
      subIndex: number,
      productNamePrefix = "",
    ): GridRowModel => {
      const subSeq = `${keyPrefix}-${sequence}-${subIndex}`;
      const quantity = Number(sub.quantity ?? 0);
      const price = Number(sub.price ?? 0);
      const shipmentQuantity = Number(sub.shipmentQuantity ?? quantity);
      const canceledQuantity = Number(sub.canceledQuantity ?? 0);
      const returnedQuantity = Number(sub.returnedQuantity ?? 0);
      const reshippedQuantity = Number(sub.reshippedQuantity ?? 0);
      return {
        id: `item-${itemIndex}-${keyPrefix}-${subIndex}-${sequence}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(sub.sku as string, subSeq),
        productName: formatWithSequence(
          `${productNamePrefix}${sub.productName ?? ""}`,
          subSeq,
        ),
        orderedQuantity: formatWithSequence(quantity, subSeq),
        shipmentQuantity: formatWithSequence(shipmentQuantity, subSeq),
        canceledQuantity: formatWithSequence(canceledQuantity, subSeq),
        returnedQuantity: formatWithSequence(returnedQuantity, subSeq),
        reshippedQuantity: formatWithSequence(reshippedQuantity, subSeq),
        price: formatWithSequence(price, subSeq),
        subTotal: formatWithSequence(price * quantity, subSeq),
        currency,
      };
    };

    if (hasProducts) {
      // Bundle: 헤더 row + products 하위 row ("└ " prefix)
      const headerSeq = `bundle-${sequence}`;
      itemRows.push({
        id: `item-${itemIndex}-bundle-${sequence}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(item.sku, headerSeq),
        productName: formatWithSequence(item.productName, headerSeq),
        orderedQuantity: formatWithSequence(item.orderedQuantity, headerSeq),
        shipmentQuantity: formatWithSequence(item.shipmentQuantity, headerSeq),
        canceledQuantity: formatWithSequence(item.canceledQuantity, headerSeq),
        returnedQuantity: formatWithSequence("", headerSeq),
        reshippedQuantity: formatWithSequence("", headerSeq),
        price: formatWithSequence(item.price, headerSeq),
        subTotal: formatWithSequence(item.subTotal, headerSeq),
        currency,
      });

      item.products.forEach((product, productIndex) => {
        itemRows.push(
          buildSubRow(
            product as unknown as Record<string, unknown>,
            "product",
            productIndex,
            "└ ",
          ),
        );
      });

      // Bundle에 components도 있다면 함께 렌더
      item.components?.forEach((component, componentIndex) => {
        itemRows.push(
          buildSubRow(
            component as unknown as Record<string, unknown>,
            "component",
            componentIndex,
            "└ ",
          ),
        );
      });
    } else if (hasComponents) {
      // 메인 item row + components row (prefix 없음)
      const mainSeq = `main-${sequence}`;
      itemRows.push({
        id: `item-${itemIndex}-main-${sequence}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(item.sku, mainSeq),
        productName: formatWithSequence(item.productName, mainSeq),
        orderedQuantity: formatWithSequence(item.orderedQuantity, mainSeq),
        shipmentQuantity: formatWithSequence(item.shipmentQuantity, mainSeq),
        canceledQuantity: formatWithSequence(item.canceledQuantity, mainSeq),
        returnedQuantity: formatWithSequence(item.returnedQuantity, mainSeq),
        reshippedQuantity: formatWithSequence(item.reshippedQuantity, mainSeq),
        price: formatWithSequence(item.price, mainSeq),
        subTotal: formatWithSequence(item.subTotal, mainSeq),
        currency,
      });

      item.components.forEach((component, componentIndex) => {
        itemRows.push(
          buildSubRow(
            component as unknown as Record<string, unknown>,
            "component",
            componentIndex,
          ),
        );
      });
    } else {
      // 단일 상품
      const singleSeq = `single-${sequence}`;
      itemRows.push({
        id: item.productCode || `item-${itemIndex}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(item.sku, singleSeq),
        productName: formatWithSequence(item.productName, singleSeq),
        orderedQuantity: formatWithSequence(item.orderedQuantity, singleSeq),
        shipmentQuantity: formatWithSequence(item.shipmentQuantity, singleSeq),
        canceledQuantity: formatWithSequence(item.canceledQuantity, singleSeq),
        returnedQuantity: formatWithSequence(item.returnedQuantity, singleSeq),
        reshippedQuantity: formatWithSequence(
          item.reshippedQuantity,
          singleSeq,
        ),
        price: formatWithSequence(item.price, singleSeq),
        subTotal: formatWithSequence(item.subTotal, singleSeq),
        currency,
      });
    }

    return itemRows;
  });

  // 배송비 추가
  rows.push({
    id: "shipping-fee",
    no: "-",
    skuCode: "",
    image: null,
    productName: "배송비",
    orderedQuantity: `^`,
    shipmentQuantity: `^`,
    canceledQuantity: `^`,
    returnedQuantity: `^`,
    reshippedQuantity: `^`,
    price: null,
    subTotal: `${data.shippingFee}^`,
    currency,
  });

  return rows;
};

/**
 * payment info rows 변환
 * @param data OrderDetailResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsPaymentInfo = (
  data: OrderDetailResponse | undefined,
  timezone: string,
): GridRowModel[] => {
  if (!data) return [];
  const { currency } = data.payments[0] ?? {};

  const payments = data.payments.map((payment, index) => {
    const paidAmount = payment.paidAmount ?? 0;
    const taxAmount = payment.taxAmount ?? 0;
    return {
      id: `${payment.transactionNo}-${index}`,
      no: index + 1,
      occurredAt: getLocalTime(payment.paidAt, timezone),
      type: "Payment",
      method: payment.method,
      tid: payment.transactionNo,
      note: null,
      tax: taxAmount,
      net: paidAmount - taxAmount,
      amount: paidAmount,
      currency,
    };
  });

  // 이전 refundGroup들의 총 refundPayments 개수를 누적하기 위한 변수
  let previousRefundCount = 0;

  const refundPayments = data.refundPayments.flatMap(
    (refundGroup, refundGroupIndex) => {
      const refunds = refundGroup.refundPayments
        .filter((refund) => refund !== null)
        .map((refund: RefundPayment, refundIndex) => {
          const amount = refund.refundAmount ? refund.refundAmount * -1 : 0;
          const tax = refund.taxAmount ? refund.taxAmount * -1 : 0;
          return {
            id: `${refund.transactionNo}-${refundGroupIndex}-${refundIndex}`,
            no: data.payments.length + previousRefundCount + refundIndex + 1,
            occurredAt: getLocalTime(refund.refundAt, timezone),
            type: "Refund",
            method: refund.method,
            tid: refund.transactionNo,
            note: refundGroup.reason
              ? `${refundGroup.reason}${
                  refund.shippingFee
                    ? ` (excl., shipping ${refund.shippingFee.toLocaleString()})`
                    : ""
                }`
              : "-",
            tax,
            net: amount - tax,
            amount,
            currency,
          };
        });

      // 현재 refundGroup의 개수를 누적
      previousRefundCount += refundGroup.refundPayments.length;

      return refunds;
    },
  );

  return [...payments, ...refundPayments];
};

/**
 * shipment info 데이터 변환
 * @param data OrderDetailResponse
 */
export const transformRowsShipmentInfo = (
  shipment: OrderDetailShipmentResponse,
  // index: number,
  timezone: string,
) => {
  const rows = transformRowsShipmentInfoRows(shipment);

  return {
    sequence: shipment.shipmentNo,
    shipmentNo: shipment.shipmentNo,
    event: shipment.event,
    status: shipment.status,
    updatedAt: getLocalTime(shipment.updatedAt, timezone),
    carrier: shipment.delivery?.carrierCode ?? NOT_STARTED,
    trackingNo:
      shipment.deliveries.length > 0
        ? shipment.deliveries
        : [{ trackingNo: NOT_STARTED, trackingUrl: null }],
    recipientName: shipment.recipient.fullName,
    phoneCountryNo: shipment.recipient.phoneCountryNo ?? "",
    recipientNo: shipment.recipient.phone ?? "",
    deliveryAddress: {
      postcode: shipment.recipient.address.postalCode ?? "",
      address1: formatLine1(
        shipment.recipient.address.line1,
        shipment.recipient.address.state ?? "",
        shipment.recipient.address.city ?? "",
      ),
      address2: shipment.recipient.address.line2 ?? "",
      city: shipment.recipient.address.city ?? "",
      stateProvince: shipment.recipient.address.state ?? "",
      countryRegion: shipment.recipient.address.countryType,
    },
    deliveryMessage: shipment.recipient.deliveryMessage || "-",
    rows,
  };
};

/**
 * shipment info rows 데이터 변환
 * @param shipment OrderDetailShipmentResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsShipmentInfoRows = (
  shipment: OrderDetailShipmentResponse,
) => {
  const fields: (keyof OrderDetailShipmentItemResponse)[] = [
    "shipmentQuantity",
    "canceledQuantity",
    "shippedQuantity",
  ];

  const rows: GridRowModel[] = shipment.items.flatMap((item, itemIndex) => {
    const hasProducts = (item.products?.length || 0) > 0;
    const hasComponents = (item.components?.length || 0) > 0;
    const { sequence } = item;
    const imageValue = `${getDefaultImageUrl(item.thumbnailUrl)}?${sequence}`;

    const commonFields = createCommonQuantityFields(fields, item, sequence);
    const itemRows: GridRowModel[] = [];

    // ✅ bundle products - 각 row는 자체 SKU/Product Name 표시
    item.products?.forEach((product, productIndex) => {
      const rowSeq = `product-${sequence}-${productIndex}`;
      itemRows.push({
        id: `item-${itemIndex}-product-${productIndex}-${sequence}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(product.sku, rowSeq),
        productName: formatWithSequence(product.productName, rowSeq),
        sapCode: formatWithSequence(product.productCode, rowSeq),
        sapName: formatWithSequence(product.productName, rowSeq),
        ...commonFields,
      });
    });

    // ✅ bundle이 아닌 경우 메인 item row 먼저 표시
    if (!hasProducts && hasComponents) {
      const mainSeq = `main-${sequence}`;
      itemRows.push({
        id: `item-${itemIndex}-main-${sequence}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(item.sku, mainSeq),
        productName: formatWithSequence(item.productName, mainSeq),
        sapCode: formatWithSequence(item.productCode, mainSeq),
        sapName: formatWithSequence(item.productName, mainSeq),
        ...commonFields,
      });
    }

    // ✅ components - 각 row는 자체 SKU/Product Name 표시
    item.components?.forEach((component, componentIndex) => {
      const rowSeq = `component-${sequence}-${componentIndex}`;
      itemRows.push({
        id: `item-${itemIndex}-component-${componentIndex}-${sequence}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(component.sku, rowSeq),
        productName: formatWithSequence(component.productName, rowSeq),
        sapCode: formatWithSequence(component.productCode, rowSeq),
        sapName: formatWithSequence(component.productName, rowSeq),
        ...commonFields,
      });
    });

    // ✅ 단일 상품
    if (!hasProducts && !hasComponents) {
      itemRows.push({
        id: item.productCode || `item-${itemIndex}`,
        no: sequence,
        image: imageValue,
        skuCode: formatWithSequence(item.sku, sequence),
        productName: item.productName ?? "-",
        sapCode: formatWithSequence(item.productCode, sequence),
        sapName: formatWithSequence(item.productName, sequence),
        ...commonFields,
      });
    }

    return itemRows;
  });

  return rows;
};

/**
 * request shipment rows 데이터 변환
 * @param data OrderDetailResponse
 * @param shipment? OrderDetailShipmentResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsRequestShipment = (
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];

  return data.items.map((item) => {
    const shippable = item.allocateQuantity - item.shipmentQuantity;

    return {
      no: item.sequence,
      id: item.orderItemId,
      sapCode: item.productCode,
      image: getDefaultImageUrl(item.thumbnailUrl),
      productName: item.productName,
      orderedQuantity: item.orderedQuantity,
      shippable: shippable > 0 ? shippable : 0, // 음수 방지를 위한 0 조건
      toShip: shippable > 0 ? shippable : 0, // TODO: toShip 디폴트 값 맞는지 체크
      products: item.products,
      components: item.components,
      sku: item.sku,
    };
  });
};

/**
 * [cancel order] rows 데이터 변환
 * @param data OrderDetailResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsCancelOrder = (
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];
  return data.items.flatMap((item, itemIndex): GridRowModel[] => {
    const itemOriginalQuantity = Number(item.orderedQuantity) || 0;
    const itemId = item.orderItemId;
    const { currency } = data.payments[0] ?? {};

    // 취소 가능한 실제 수량 계산
    const actualAvailableQuantity = Math.max(
      0,
      itemOriginalQuantity -
        (Number(item.canceledQuantity) || 0) -
        (Number(item.shipmentQuantity) || 0) -
        (Number(item.returnedQuantity) || 0),
    );

    const rowsToAdd: GridRowModel[] = [];

    // 취소 가능한 수량이 있는 경우 행 추가 (활성)
    if (actualAvailableQuantity > 0) {
      rowsToAdd.push({
        no: item.sequence,
        id: itemId,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        sapCode: item.productCode,
        productName: item.productName,
        cellQuantity: actualAvailableQuantity, // TODO: cellQuantity 디폴트 값 맞는지 체크
        cancelPrice: item.price,
        initialAvailableQuantity: actualAvailableQuantity,
        isActive: actualAvailableQuantity > 0,
        currency,
      });
    }

    // 이미 취소된 수량이 있는 경우 행 추가 (비활성)
    if ((Number(item.canceledQuantity) || 0) > 0) {
      const canceledQuantity = Number(item.canceledQuantity);
      rowsToAdd.push({
        no: item.sequence,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        id: `${itemId}-canceled-${itemIndex}`,
        sapCode: item.productCode,
        productName: item.productName,
        cellQuantity:
          canceledQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : canceledQuantity,
        cancelPrice: item.price,
        isActive: false,
        currency,
      });
    }

    // 이미 배송된 수량이 있는 경우 행 추가 (비활성, 취소 불가 상태 표시 목적)
    if ((Number(item.shipmentQuantity) || 0) > 0) {
      const shipmentQuantity = Number(item.shipmentQuantity);
      rowsToAdd.push({
        no: item.sequence,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        id: `${itemId}-shipment-${itemIndex}`,
        sapCode: item.productCode,
        productName: item.productName,
        cellQuantity:
          shipmentQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : shipmentQuantity,
        cancelPrice: item.price,
        isActive: false,
        currency,
      });
    }

    // 이미 반환된 수량이 있는 경우 행 추가 (비활성)
    if ((Number(item.returnedQuantity) || 0) > 0) {
      const returnedQuantity = Number(item.returnedQuantity);
      rowsToAdd.push({
        no: item.sequence,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        id: `${itemId}-returned-${itemIndex}`,
        sapCode: item.productCode,
        image: item.thumbnailUrl,
        productName: item.productName,
        cellQuantity:
          returnedQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : returnedQuantity,
        cancelPrice: item.price,
        isActive: false,
        currency,
      });
    }

    return rowsToAdd;
  });
};

/**
 * [cancel order] shipment level rows 데이터 변환
 * @param shipmentOrderItemId string[]
 * @param data OrderDetailResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsCancelOrderShipment = (
  shipment: OrderDetailShipmentResponse | undefined,
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];
  return data.items.flatMap((item, itemIndex): GridRowModel[] => {
    const itemOriginalQuantity = Number(item.orderedQuantity) || 0;
    const itemId = item.orderItemId;

    // 취소 가능한 실제 수량 계산
    const actualAvailableQuantity = Math.max(
      0,
      itemOriginalQuantity -
        (Number(item.canceledQuantity) || 0) -
        (Number(item.shipmentQuantity) || 0) -
        (Number(item.returnedQuantity) || 0),
    );

    const rowsToAdd: GridRowModel[] = [];

    // 취소 가능한 수량이 있는 경우 행 추가 (활성)
    if (actualAvailableQuantity > 0) {
      rowsToAdd.push({
        no: item.sequence,
        id: itemId,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        sapCode: item.productCode,
        productName: item.productName,
        cellQuantity: actualAvailableQuantity,
        cancelPrice: item.price,
        initialAvailableQuantity: actualAvailableQuantity,
        isActive: actualAvailableQuantity > 0,
      });
    }

    // 이미 취소된 수량이 있는 경우 행 추가 (비활성)
    if ((Number(item.canceledQuantity) || 0) > 0) {
      const canceledQuantity = Number(item.canceledQuantity);
      rowsToAdd.push({
        no: item.sequence,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        id: `${itemId}-canceled-${itemIndex}`,
        sapCode: item.productCode,
        productName: item.productName,
        cellQuantity:
          canceledQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : canceledQuantity,
        cancelPrice: item.price,
        isActive: false,
      });
    }

    // 이미 배송된 수량이 있는 경우 행 추가 (비활성, 취소 불가 상태 표시 목적)
    if ((Number(item.shipmentQuantity) || 0) > 0) {
      const shipmentQuantity = Number(item.shipmentQuantity);
      rowsToAdd.push({
        no: item.sequence,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        id: `${itemId}-shipment-${itemIndex}`,
        sapCode: item.productCode,
        productName: item.productName,
        cellQuantity:
          shipmentQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : shipmentQuantity,
        cancelPrice: item.price,
        isActive: false,
      });
    }

    // 이미 반환된 수량이 있는 경우 행 추가 (비활성)
    if ((Number(item.returnedQuantity) || 0) > 0) {
      const returnedQuantity = Number(item.returnedQuantity);
      rowsToAdd.push({
        no: item.sequence,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        products: item.products,
        components: item.components,
        id: `${itemId}-returned-${itemIndex}`,
        sapCode: item.productCode,
        image: item.thumbnailUrl,
        productName: item.productName,
        cellQuantity:
          returnedQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : returnedQuantity,
        cancelPrice: item.price,
        isActive: false,
      });
    }

    return rowsToAdd;
  });
};

/**
 * [cancel shipment] shipment level rows 데이터 변환
 * @param shipment OrderDetailShipmentResponse
 * @param data OrderDetailResponse
 * @returns rows: GridRowModel[]
 */
export const transformRowsCancelShipment = (
  shipment: OrderDetailShipmentResponse | undefined,
  currency: string | undefined,
) => {
  if (!shipment) return [];

  return shipment.items.map((item): GridRowModel => {
    // 실제 취소 가능한 수량 계산 (배송 예정 수량 - 이미 취소된 수량)
    const availableQuantity = Math.max(
      0,
      item.shipmentQuantity - item.canceledQuantity,
    );

    return {
      no: item.sequence,
      id: item.orderItemId,
      orderItemId: item.orderItemId,
      originItemId: item.originItemId,
      skuCode: item.sku,
      products: item.products,
      components: item.components,
      sapCode: item.productCode,
      productName: item.productName,
      cellQuantity:
        availableQuantity > 0 ? availableQuantity : item.canceledQuantity, // TODO: cellQuantity 디폴트 값 맞는지 체크
      cancelPrice:
        item.products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0,
        ) +
        item.components.reduce(
          (acc, component) => acc + component.price * component.quantity,
          0,
        ),
      initialAvailableQuantity: availableQuantity,
      isActive: availableQuantity > 0,
      currency,
    };
  });
};

/**
 * summary 데이터 변환
 */
export const transformSummaryDefaultData = (
  data: OrderDetailResponse | undefined,
): OrderEstimateRefundFeeResponse => {
  if (!data)
    return {
      orderPayment: {
        subtotal: 0,
        taxAmount: 0,
        dutyAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
      },
      estimateRefundPayment: {
        subtotal: 0,
        taxAmount: 0,
        dutyAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
      },
      refundPayment: {
        subtotal: 0,
        taxAmount: 0,
        dutyAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
      },
      netPayment: {
        subtotal: 0,
        taxAmount: 0,
        dutyAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
      },
    };

  const orderPayment = {
    subtotal: data.payments.reduce(
      (acc, payment) =>
        acc + (payment.paidAmount ?? 0) - (payment.shippingFee ?? 0),
      0,
    ),
    taxAmount: data.payments.reduce(
      (acc, payment) => acc + (payment.taxAmount ?? 0),
      0,
    ),
    dutyAmount: data.payments.reduce(
      (acc, payment) => acc + (payment.dutyAmount ?? 0),
      0,
    ),
    shippingFee: data.shippingFee,
    totalAmount: data.payments.reduce(
      (acc, payment) => acc + (payment.paidAmount ?? 0),
      0,
    ),
  };

  // 이미 반환된 금액
  const refundPayment = {
    subtotal: data.refundPayments.reduce(
      (acc, payment) =>
        acc +
        payment.refundPayments.reduce(
          (acc, refund) =>
            acc + (refund.refundAmount ?? 0) - (refund.shippingFee ?? 0),
          0,
        ),
      0,
    ),
    taxAmount: data.refundPayments.reduce(
      (acc, payment) =>
        acc +
        payment.refundPayments.reduce(
          (acc, refund) => acc + (refund.taxAmount ?? 0),
          0,
        ),
      0,
    ),
    dutyAmount: data.refundPayments.reduce(
      (acc, payment) =>
        acc +
        payment.refundPayments.reduce(
          (acc, refund) => acc + (refund.dutyAmount ?? 0),
          0,
        ),
      0,
    ),
    shippingFee: data.refundPayments.reduce(
      (acc, payment) =>
        acc +
        payment.refundPayments.reduce(
          (acc, refund) => acc + (refund.shippingFee ?? 0),
          0,
        ),
      0,
    ),
    totalAmount: data.refundPayments.reduce(
      (acc, payment) =>
        acc +
        payment.refundPayments.reduce(
          (acc, refund) => acc + (refund.refundAmount ?? 0),
          0,
        ),
      0,
    ),
  };

  // 반환 요청 예상 금액
  const estimateRefundPayment = {
    subtotal: 0,
    taxAmount: 0,
    dutyAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
  };

  const orderFinancialSummary = {
    orderPayment,
    refundPayment,
    estimateRefundPayment,
    netPayment: {
      subtotal: orderPayment.subtotal - refundPayment.subtotal,
      taxAmount: orderPayment.taxAmount - refundPayment.taxAmount,
      dutyAmount: orderPayment.dutyAmount - refundPayment.dutyAmount,
      shippingFee: orderPayment.shippingFee - refundPayment.shippingFee,
      totalAmount: orderPayment.totalAmount - refundPayment.totalAmount,
    },
  };

  return orderFinancialSummary;
};

interface TransformClaimCreateRequestProps {
  claimType: ClaimCreateRequestTypeEnum;
  reason: string;
  fault: string;
  recipientInfo: {
    pickupRecipient?: TAddressForm;
    shipmentRecipient?: TAddressForm;
  };
  selectedRows: GridRowModelPro[];
  carrierCode?: string;
  trackingNo?: string;
  pickupOption?: boolean;
  modalType?: "DEFAULT" | "LOST";
}

/**
 * claim 생성 요청 데이터 변환
 * @param TransformClaimCreateRequestProps
 * @returns ClaimCreateRequest
 */
export const transformClaimCreateRequest = ({
  claimType,
  reason,
  fault,
  recipientInfo,
  selectedRows,
  carrierCode,
  trackingNo,
  pickupOption,
  modalType = "DEFAULT",
}: TransformClaimCreateRequestProps) => {
  const items = selectedRows.map((row) => ({
    orderItemId: row.orderItemId,
    quantity: modalType === "LOST" ? row.refundQty : row.cellQuantity,
  }));

  if (claimType === "RETURN") {
    return {
      type: "RETURN" as ClaimCreateRequestTypeEnum,
      reason,
      fault,
      ...(pickupOption &&
        recipientInfo.pickupRecipient && {
          pickupRecipient: {
            fullName:
              recipientInfo.pickupRecipient.recipientLastName +
              recipientInfo.pickupRecipient.recipientFirstName,
            firstName: recipientInfo.pickupRecipient.recipientFirstName,
            lastName: recipientInfo.pickupRecipient.recipientLastName,
            phone: recipientInfo.pickupRecipient.recipientPhone,
            phoneCountryNo: recipientInfo.pickupRecipient.phoneCountryNo,
            address: {
              countryType: recipientInfo.pickupRecipient.countryRegion,
              postalCode: recipientInfo.pickupRecipient.postcode,
              state: recipientInfo.pickupRecipient.stateProvince,
              city: recipientInfo.pickupRecipient.city,
              line1: `${recipientInfo.pickupRecipient.stateProvince} ${recipientInfo.pickupRecipient.city} ${recipientInfo.pickupRecipient.address1}`,
              line2: recipientInfo.pickupRecipient.address2,
            },
          },
        }),
      items,
      ...(carrierCode &&
        trackingNo && {
          carrierCode,
          trackingNo,
        }),
    };
  }

  if (claimType === "RETURN_FORCE_REFUND") {
    return {
      type: "RETURN_FORCE_REFUND" as ClaimCreateRequestTypeEnum,
      reason,
      fault,
      items,
    };
  }

  if (claimType === "EXCHANGE") {
    return {
      type: "EXCHANGE" as ClaimCreateRequestTypeEnum,
      reason,
      fault,
      ...(pickupOption &&
        recipientInfo.pickupRecipient && {
          pickupRecipient: {
            fullName:
              `${recipientInfo.pickupRecipient.recipientLastName || ""}${recipientInfo.pickupRecipient.recipientFirstName || ""}`.trim(),
            firstName: recipientInfo.pickupRecipient.recipientFirstName,
            lastName: recipientInfo.pickupRecipient.recipientLastName,
            phone: recipientInfo.pickupRecipient.recipientPhone,
            phoneCountryNo: recipientInfo.pickupRecipient.phoneCountryNo,
            address: {
              countryType: recipientInfo.pickupRecipient.countryRegion,
              postalCode: recipientInfo.pickupRecipient.postcode,
              state: recipientInfo.pickupRecipient.stateProvince,
              city: recipientInfo.pickupRecipient.city,
              line1: `${recipientInfo.pickupRecipient.stateProvince} ${recipientInfo.pickupRecipient.city} ${recipientInfo.pickupRecipient.address1}`,
              line2: recipientInfo.pickupRecipient.address2,
            },
          },
        }),
      ...(recipientInfo.shipmentRecipient && {
        shipmentRecipient: {
          fullName:
            `${recipientInfo.shipmentRecipient.recipientLastName || ""}${recipientInfo.shipmentRecipient.recipientFirstName || ""}`.trim(),
          firstName: recipientInfo.shipmentRecipient.recipientFirstName,
          lastName: recipientInfo.shipmentRecipient.recipientLastName,
          phone: recipientInfo.shipmentRecipient.recipientPhone,
          phoneCountryNo: recipientInfo.shipmentRecipient.phoneCountryNo,
          address: {
            countryType: recipientInfo.shipmentRecipient.countryRegion,
            postalCode: recipientInfo.shipmentRecipient.postcode,
            state: recipientInfo.shipmentRecipient.stateProvince,
            city: recipientInfo.shipmentRecipient.city,
            line1: `${recipientInfo.shipmentRecipient.stateProvince} ${recipientInfo.shipmentRecipient.city} ${recipientInfo.shipmentRecipient.address1}`,
            line2: recipientInfo.shipmentRecipient.address2,
          },
        },
      }),
      items,
      ...(carrierCode &&
        trackingNo && {
          carrierCode,
          trackingNo,
        }),
    };
  }

  if (claimType === "RESHIPMENT") {
    return {
      type: "RESHIPMENT" as ClaimCreateRequestTypeEnum,
      reason,
      fault,
      ...(recipientInfo.shipmentRecipient && {
        shipmentRecipient: {
          fullName:
            `${recipientInfo.shipmentRecipient.recipientLastName || ""}${recipientInfo.shipmentRecipient.recipientFirstName || ""}`.trim(),
          firstName: recipientInfo.shipmentRecipient.recipientFirstName,
          lastName: recipientInfo.shipmentRecipient.recipientLastName,
          phone: recipientInfo.shipmentRecipient.recipientPhone,
          phoneCountryNo: recipientInfo.shipmentRecipient.phoneCountryNo,
          address: {
            countryType: recipientInfo.shipmentRecipient.countryRegion,
            postalCode: recipientInfo.shipmentRecipient.postcode,
            state: recipientInfo.shipmentRecipient.stateProvince,
            city: recipientInfo.shipmentRecipient.city,
            line1: `${recipientInfo.shipmentRecipient.stateProvince} ${recipientInfo.shipmentRecipient.city} ${recipientInfo.shipmentRecipient.address1}`,
            line2: recipientInfo.shipmentRecipient.address2,
          },
        },
      }),
      items,
    };
  }

  throw new Error(`Unsupported claim type: ${claimType}`);
};

/**
 * return detail 데이터 변환
 * @param returnData ReturnDetailResponse
 * @returns returnDetail
 */
export const transformReturnDetail = (
  returnData: ReturnDetailResponse,
  timezone: string,
) => {
  return {
    productInspectionResult: returnData.items.map((item, idx) => ({
      id: item.productCode || `item-${idx}`,
      ...item,
    })),
    claimFault: returnData.claimFault,
    returnId: returnData.returnId,
    registeredBy: returnData.claimCreatedBy,
    returnReason: returnData.claimReason,
    returnMethod:
      ((returnData as Record<string, unknown>).returnMethod as string) ?? "-",
    returnStatus: snakeToTitleCase(returnData.status.name),
    returnUpdatedDate: getLocalTime(returnData.updatedAt, timezone),
    recipientName: returnData.recipient?.fullName || "-",
    recipientFirstName: returnData.recipient?.firstName || "-",
    recipientLastName: returnData.recipient?.lastName || "-",
    recipientPhone: returnData.recipient?.phone || "",
    phoneCountryNo: returnData.recipient?.phoneCountryNo || "",
    pickupAddress: {
      postcode: returnData.recipient?.address?.postalCode || "",
      address1: formatLine1(
        returnData.recipient?.address?.line1 || "-",
        returnData.recipient?.address?.state || "-",
        returnData.recipient?.address?.city || "",
      ),
      address2: returnData.recipient?.address?.line2 || "",
      city: returnData.recipient?.address?.city || "",
      stateProvince: returnData.recipient?.address?.state || "-",
      countryRegion: returnData.recipient?.address?.countryType || "-",
    },
    returnNo: returnData.returnNo,
    carrier: returnData.delivery?.carrierCode || NOT_STARTED,
    trackingNo: returnData.delivery?.trackingNo || NOT_STARTED,
    trackingUrl: returnData.trackingUrl,
  };
};

/**
 * return detail rows 데이터 변환
 * @param returnData ReturnDetailResponse
 * @returns returnDetailRows
 */
export const transformRowsReturnDetail = (returnData: ReturnDetailResponse) => {
  const fields: (keyof ReturnDetailClaimItemResponse)[] = [
    "quantity",
    "cancelQuantity",
  ];

  const rows = returnData.claimItems.flatMap((item, itemIndex) => {
    const totalSubItems =
      (item.products?.length || 0) + (item.components?.length || 0);
    const sequence = itemIndex + 1;

    const commonFields = createCommonQuantityFields(fields, item, sequence);
    const itemRows: GridRowModel[] = [];

    // ✅ products
    item.products?.forEach((product, productIndex) => {
      itemRows.push({
        id: `${item.productCode || `item-${itemIndex}`}-product-${productIndex}-${itemIndex + 1}`,
        no: itemIndex + 1, // sequence가 없으므로 index + 1 사용
        image: `${getDefaultImageUrl(item.thumbnailUrl)}?${itemIndex + 1}`,
        skuCode: item.sku || "-",
        productName: item.productName || "-",
        sapCode: formatWithSequence(product.productCode, sequence),
        sapName: formatWithSequence(product.productName, sequence),
        returnItem: item.productName,
        ...commonFields,
      });
    });

    // ✅ components
    item.components?.forEach((component, componentIndex) => {
      itemRows.push({
        id: `${item.productCode || `item-${itemIndex}`}-component-${componentIndex}-${itemIndex + 1}`,
        no: itemIndex + 1, // sequence가 없으므로 index + 1 사용
        image: null,
        skuCode: component.sku || "-",
        productName: component.productName || "-",
        sapCode: formatWithSequence(component.productCode, sequence),
        sapName: formatWithSequence(component.productName, sequence),
        returnItem: item.productName,
        ...commonFields,
      });
    });

    // ✅ 단일 상품
    if (totalSubItems === 0) {
      itemRows.push({
        id: item.productCode || `item-${itemIndex}`,
        no: itemIndex + 1,
        image: `${getDefaultImageUrl(item.thumbnailUrl)}?${itemIndex + 1}`,
        skuCode: item.sku || "-",
        productName: item.productName || "-",
        sapCode: formatWithSequence(item.productCode, sequence),
        sapName: formatWithSequence(item.productName, sequence),
        returnItem: item.productName || "-",
        ...commonFields,
      });
    }

    return itemRows;
  });

  return rows;
};

/**
 * exchange detail 데이터 변환
 * @param exchangeData ExchangeDetailResponse
 * @returns exchangeDetail
 */
export const transformExchangeDetail = (
  exchangeData: ExchangeDetailResponse,
  timezone: string,
) => {
  const { CANCELED } = ExchangeSearchRequestExchangeStatusesEnum;

  const getResendInfo = (shipments: ExchangeDetailShipmentResponse[]) => {
    if (!shipments.length) {
      return [];
    }

    // TODO: updatedAt 추가예정
    return shipments.map(
      ({ status, updatedAt, wmsNo, shipmentNo, delivery, deliveries }) => {
        const isCanceled = status.name === CANCELED;

        return {
          status: snakeToTitleCase(status.name),
          shipmentNo: shipmentNo,
          updatedAt: getLocalTime(updatedAt, timezone),
          resendWMSNo: isCanceled ? CANCELED : wmsNo,
          resendSAPDeliveryID: isCanceled ? CANCELED : shipmentNo,
          resendShipCo: isCanceled
            ? CANCELED
            : delivery?.carrierCode || NOT_STARTED,
          resendDeliveries: isCanceled
            ? [{ trackingNo: CANCELED, trackingUrl: null }]
            : deliveries.length
              ? deliveries.map(({ trackingNo, trackingUrl }) => ({
                  trackingNo: trackingNo || NOT_STARTED,
                  trackingUrl,
                }))
              : [{ trackingNo: NOT_STARTED, trackingUrl: null }],
        };
      },
    );
  };

  return {
    productInspectionResult: exchangeData.items.map((item, idx) => ({
      id: item.productCode || `item-${idx}`,
      ...item,
    })),

    exchangeId: exchangeData.exchangeId,
    registeredBy: exchangeData.claimCreatedBy,
    exchangeReason: exchangeData.claimReason,
    exchangeStatus: snakeToTitleCase(exchangeData.status.name),
    returnUpdatedDate: getLocalTime(exchangeData.updatedAt, timezone),
    recipientName: exchangeData.pickupRecipient.fullName,
    recipientFirstName: exchangeData.pickupRecipient.firstName,
    recipientLastName: exchangeData.pickupRecipient.lastName,
    phoneCountryNo: exchangeData.pickupRecipient.phoneCountryNo ?? "",
    recipientPhone: exchangeData.pickupRecipient.phone ?? "",

    // pickup 정보
    pickupAddress: {
      postcode: exchangeData.pickupRecipient.address.postalCode || "",
      address1: formatLine1(
        exchangeData.pickupRecipient.address.line1,
        exchangeData.pickupRecipient.address.state || "",
        exchangeData.pickupRecipient.address.city || "",
      ),
      address2: exchangeData.pickupRecipient.address.line2 || "",
      city: exchangeData.pickupRecipient.address.city || "",
      stateProvince: exchangeData.pickupRecipient.address.state || "",
      countryRegion: exchangeData.pickupRecipient.address.countryType,
    },
    pickupWMSNo: exchangeData.wmsNo,
    exchangeNo: exchangeData.exchangeNo,
    pickupShipCo: exchangeData.pickupDelivery?.carrierCode || NOT_STARTED,
    pickupShippingNo: exchangeData.pickupDelivery?.trackingNo || NOT_STARTED,
    pickupTrackingUrl: exchangeData.pickupTrackingUrl,

    // resend 정보
    resendAddress: {
      postcode: exchangeData.shipmentRecipient.address.postalCode || "",
      address1: formatLine1(
        exchangeData.shipmentRecipient.address.line1,
        exchangeData.shipmentRecipient.address.state || "",
        exchangeData.shipmentRecipient.address.city || "",
      ),
      address2: exchangeData.shipmentRecipient.address.line2 || "",
      city: exchangeData.shipmentRecipient.address.city || "",
      stateProvince: exchangeData.shipmentRecipient.address.state || "",
      countryRegion: exchangeData.shipmentRecipient.address.countryType,
    },
    resendInfo: getResendInfo(exchangeData.shipments),
    carrier: exchangeData.pickupDelivery?.carrierCode || NOT_STARTED,
    trackingNo: exchangeData.pickupDelivery?.trackingNo || NOT_STARTED,
    trackingUrl: exchangeData.pickupTrackingUrl,
  };
};

/**
 * exchange detail rows 데이터 변환
 * @param exchangeData ExchangeDetailResponse
 * @returns exchangeDetailRows
 */
export const transformRowsExchangeDetail = (
  exchangeData: ExchangeDetailResponse,
) => {
  const fields: (keyof ReturnDetailClaimItemResponse)[] = [
    "quantity",
    "cancelQuantity",
  ];

  const rows = exchangeData.claimItems.flatMap((item, itemIndex) => {
    const totalSubItems =
      (item.products?.length || 0) + (item.components?.length || 0);
    const sequence = itemIndex + 1;

    const commonFields = createCommonQuantityFields(fields, item, sequence);
    const itemRows: GridRowModel[] = [];

    // ✅ products
    item.products?.forEach((product, productIndex) => {
      itemRows.push({
        id: `${item.productCode || `item-${itemIndex}`}-product-${productIndex}-${itemIndex + 1}`,
        no: itemIndex + 1, // sequence가 없으므로 index + 1 사용
        image: `${getDefaultImageUrl(item.thumbnailUrl)}?${itemIndex + 1}`,
        skuCode: item.sku || "-",
        productName: item.productName || "-",
        sapCode: formatWithSequence(product.productCode, sequence),
        sapName: formatWithSequence(product.productName, sequence),
        returnItem: item.productName,
        ...commonFields,
      });
    });

    // ✅ components - 쇼핑백, 기프트 박스 등 부가제품
    item.components?.forEach((component, componentIndex) => {
      itemRows.push({
        id: `${item.productCode || `item-${itemIndex}`}-component-${componentIndex}-${itemIndex + 1}`,
        no: itemIndex + 1, // sequence가 없으므로 index + 1 사용
        image: null,
        skuCode: component.sku || "-",
        productName: component.productName || "-",
        sapCode: formatWithSequence(component.productCode, sequence),
        sapName: formatWithSequence(component.productName, sequence),
        returnItem: item.productName,
        ...commonFields,
      });
    });

    // ✅ 단일 상품
    if (totalSubItems === 0) {
      itemRows.push({
        id: item.productCode || `item-${itemIndex}`,
        no: itemIndex + 1,
        image: `${getDefaultImageUrl(item.thumbnailUrl)}?${itemIndex + 1}`,
        skuCode: item.sku || "-",
        productName: item.productName || "-",
        sapCode: formatWithSequence(item.productCode, sequence),
        sapName: formatWithSequence(item.productName, sequence),
        returnItem: item.productName || "-",
        ...commonFields,
      });
    }

    return itemRows;
  });

  return rows;
};

/**
 * log history detail 데이터 변환
 */
export const transformLogHistoryDetail = (
  data: OrderHistoryResponse,
  timezone: string,
) => {
  if (!data)
    return { orderHistories: [], returnHistories: [], exchangeHistories: [] };
  const getSapIf = (sapIf: { result: string; resultAt: string }[]) => {
    return sapIf.length > 0
      ? sapIf.map((item) => {
          const parts = item.result.split(" / ");
          return {
            sap: parts[0],
            if: parts[1],
            resultAt: getLocalTime(item.resultAt, timezone),
          };
        })
      : [];
  };

  const orderHistories = data.orderHistories.map((item) => {
    const isShipmentStatus = item.shipmentStatus !== null ? true : false;
    return {
      seq: isShipmentStatus ? item.sequence : "-",
      timeStamp: getLocalTime(item.updatedAt, timezone),
      sapIf: getSapIf(item.sapResults),
      updatedStatus: {
        status: isShipmentStatus
          ? (item.shipmentStatus?.description ?? "")
          : (item.status?.description ?? ""),
        groupStatus: isShipmentStatus ? "shipping" : "order",
      },
    };
  });

  const returnHistories =
    data.returnHistories !== null
      ? data.returnHistories.map((item) => ({
          seq: item.sequence,
          timeStamp: getLocalTime(item.updatedAt, timezone),
          sapIf: getSapIf(item.sapResults),
          updatedStatus: {
            status: item.status?.description ?? "",
            groupStatus: "return",
          },
        }))
      : [];

  const exchangeHistories =
    data.exchangeHistories !== null
      ? data.exchangeHistories.map((item) => ({
          seq: item.sequence,
          timeStamp: getLocalTime(item.updatedAt, timezone),
          sapIf: getSapIf(item.sapResults),
          updatedStatus: {
            status: item.status?.description ?? "",
            groupStatus: "exchange",
          },
        }))
      : [];

  return {
    orderHistories,
    returnHistories,
    exchangeHistories,
  };
};

/**
 * Reshipment Detail 데이터 변환
 */
export const transformReshipmentDetail = (
  data: ReshipmentDetailResponse,
  timezone: string,
) => {
  return {
    reshipmentId: data.reshipmentId,
    reshipmentNo: data.reshipmentNo,
    status: data.status,
    event: data.event,
    updatedAt: getLocalTime(data.updatedAt, timezone),
    carrier: data.delivery?.carrierCode ?? NOT_STARTED,
    trackingNo:
      data.deliveries && data.deliveries.length > 0
        ? data.deliveries
        : [{ trackingNo: NOT_STARTED, trackingUrl: undefined }],
    trackingUrl: data.trackingUrl,
    recipientName: data.recipient?.fullName || "-",
    phoneCountryNo: data.recipient?.phoneCountryNo ?? "",
    recipientPhone: data.recipient?.phone ?? "",
    deliveryAddress: {
      postcode: data.recipient?.address?.postalCode ?? "",
      address1: formatLine1(
        data.recipient?.address?.line1 ?? "",
        data.recipient?.address?.state ?? "",
        data.recipient?.address?.city ?? "",
      ),
      address2: data.recipient?.address?.line2 ?? "",
      city: data.recipient?.address?.city ?? "",
      stateProvince: data.recipient?.address?.state ?? "",
      countryRegion: data.recipient?.address?.countryType ?? "",
    },
  };
};

/**
 * Reshipment Detail rows (DataGrid용)
 */
export const transformRowsReshipmentDetail = (
  data: ReshipmentDetailResponse,
) => {
  return data.items.map((item, idx) => ({
    id: item.productCode || `item-${idx}`,
    no: idx + 1,
    skuCode: item.sku,
    sapCode: item.productCode ?? "-",
    sapName: item.productName,
    qty: item.quantity,
  }));
};
