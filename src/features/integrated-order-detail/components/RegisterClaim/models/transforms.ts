import { GridRowModel } from "@mui/x-data-grid-pro";

import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
} from "@/shared/generated/oms/types/Order";

/**
 * [claim order] rows 데이터 변환
 *
 * 1. transformRowsClaimOrder        - 기존: item 단위 active/inactive 분리
 * 2. transformRowsClaimOrderGrouped   - Grouped: item 기준 1 row
 * 3. transformRowsClaimOrderSeparated - Separated: products/components 각각 1 row (번들 item 레벨 제외)
 * 4. transformRowsClaimShipmentLost   - shipment item 단위 active row 분리
 */

/**
 * 1. 기존 - item 단위 active/inactive row 분리
 */
export const transformRowsClaimOrder = (
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];

  let globalIndex = 1;

  return data.items.flatMap((item, itemIndex): GridRowModel[] => {
    const itemId = item.orderItemId;

    const actualAvailableQuantity = Math.max(
      (Number(item.shipmentQuantity) || 0) +
        (Number(item.reshippedQuantity) || 0) -
        (Number(item.returnedQuantity) || 0),
    );

    const isActive = actualAvailableQuantity > 0;
    const rowsToAdd: GridRowModel[] = [];

    if (actualAvailableQuantity > 0 && item.shippedQuantity > 0) {
      rowsToAdd.push({
        no: globalIndex++,
        id: `${itemId}-active-${itemIndex}`,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        isBundle: !item.productCode,
        products: item.products,
        components: item.components,
        sapCode: item.productCode,
        productName: item.productName,
        orderQty: item.orderedQuantity,
        cellQuantity: actualAvailableQuantity,
        cancelPrice: item.price,
        initialAvailableQuantity: actualAvailableQuantity,
        isActive,
      });
    }

    if (item.returnedQuantity > 0 || item.shippedQuantity === 0) {
      rowsToAdd.push({
        no: "-",
        id: `${itemId}-inActive-${itemIndex}`,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        isBundle: !item.productCode,
        products: item.products,
        components: item.components,
        sapCode: item.productCode,
        productName: item.productName,
        orderQty: item.orderedQuantity,
        cellQuantity:
          item.returnedQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : item.returnedQuantity,
        cancelPrice: item.price,
        isActive: false,
      });
    }

    return rowsToAdd;
  });
};

/**
 * 2. Grouped - items 기준 하나의 row
 *    no | skuCode | category | productName | orderQty | claimableQty
 */
export const transformRowsClaimOrderGrouped = (
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];

  let globalIndex = 1;

  return data.items.flatMap((item, itemIndex): GridRowModel[] => {
    const itemId = item.orderItemId;

    const actualAvailableQuantity = Math.max(
      (Number(item.shipmentQuantity) || 0) +
        (Number(item.reshippedQuantity) || 0) -
        (Number(item.returnedQuantity) || 0),
    );

    const isActive = actualAvailableQuantity > 0;
    const rowsToAdd: GridRowModel[] = [];

    if (actualAvailableQuantity > 0 && item.shippedQuantity > 0) {
      rowsToAdd.push({
        no: globalIndex++,
        id: `${itemId}-active-${itemIndex}`,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        isBundle: !item.productCode,
        products: item.products,
        components: item.components,
        sapCode: item.productCode,
        productName: item.productName,
        orderQty: item.orderedQuantity,
        cellQuantity: actualAvailableQuantity,
        cancelPrice: item.price,
        initialAvailableQuantity: actualAvailableQuantity,
        isActive,
      });
    }

    if (item.returnedQuantity > 0 || item.shippedQuantity === 0) {
      rowsToAdd.push({
        no: "-",
        id: `${itemId}-inActive-${itemIndex}`,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: item.sku,
        isBundle: !item.productCode,
        products: item.products,
        components: item.components,
        sapCode: item.productCode,
        productName: item.productName,
        orderQty: item.orderedQuantity,
        cellQuantity:
          item.returnedQuantity > item.orderedQuantity
            ? item.orderedQuantity
            : item.returnedQuantity,
        cancelPrice: item.price,
        isActive: false,
      });
    }

    return rowsToAdd;
  });
};

/**
 * 3. Separated - products/components 각각 하나의 row
 *    번들(item 레벨)은 표기하지 않고, 하위 product/component만 개별 row로 표기
 *    non-bundle item은 그대로 1 row
 */
export const transformRowsClaimOrderSeparated = (
  data: OrderDetailResponse | undefined,
) => {
  if (!data) return [];

  let globalIndex = 1;

  return data.items.flatMap((item, itemIndex): GridRowModel[] => {
    const itemId = item.orderItemId;
    const isBundle = !item.productCode;

    // 번들이 아닌 경우 → item 자체를 1 row
    if (!isBundle) {
      const claimableQty = Math.max(
        (Number(item.shipmentQuantity) || 0) +
          (Number(item.reshippedQuantity) || 0) -
          (Number(item.returnedQuantity) || 0),
        0,
      );

      return [
        {
          no: globalIndex++,
          id: `${itemId}-separated-${itemIndex}`,
          orderItemId: item.orderItemId,
          originItemId: item.originItemId,
          skuCode: item.sku,
          category: "",
          productName: item.productName,
          orderQty: item.orderedQuantity,
          claimableQty,
          cancelPrice: item.price,
          isBundle: false,
          parentItemId: null,
          isActive: claimableQty > 0,
        },
      ];
    }

    // 번들인 경우 → item 레벨 스킵, products + components 각각 row
    const subRows: GridRowModel[] = [];

    if (item.products?.length) {
      item.products.forEach((product, prodIndex) => {
        // TODO: claimableQty 계산 로직 추가
        const claimableQty = 0;

        subRows.push({
          no: globalIndex++,
          id: `${itemId}-product-${prodIndex}`,
          orderItemId: item.orderItemId,
          originItemId: item.originItemId,
          skuCode: product.sku,
          category: product.category,
          productName: product.productName,
          orderQty: product.quantity,
          claimableQty,
          cancelPrice: product.price,
          isBundle: false,
          parentItemId: itemId,
          isActive: claimableQty > 0,
        });
      });
    }

    if (item.components?.length) {
      item.components.forEach((component, compIndex) => {
        // TODO: claimableQty 계산 로직 추가
        const claimableQty = 0;

        subRows.push({
          no: globalIndex++,
          id: `${itemId}-component-${compIndex}`,
          orderItemId: item.orderItemId,
          originItemId: item.originItemId,
          skuCode: component.sku,
          category: component.category,
          productName: component.productName,
          orderQty: component.quantity,
          claimableQty,
          cancelPrice: component.price,
          isBundle: false,
          parentItemId: itemId,
          isActive: claimableQty > 0,
        });
      });
    }

    return subRows;
  });
};

/**
 * 4. shipment item 단위 active row 분리
 *    번들(item 레벨)은 표기하지 않고, 하위 product/component만 개별 row로 표기
 *    non-bundle item은 그대로 1 row
 */
export const transformRowsClaimShipmentLost = (
  shipment: OrderDetailShipmentResponse | undefined,
) => {
  if (!shipment) return [];

  const rowsToAdd: GridRowModel[] = [];
  shipment.items.flatMap((item, itemIndex) => {
    rowsToAdd.push({
      no: item.sequence,
      id: `${item.orderItemId}-active-${itemIndex}`,
      orderItemId: item.orderItemId,
      originItemId: item.originItemId,
      skuCode: item.sku,
      isBundle: !item.productCode,
      products: item.products,
      components: item.components,
      sapCode: item.productCode,
      productName: item.productName,
      refundQty: item.shipmentQuantity,
      // shipmentQuantity: item.shipmentQuantity,
      // cancelPrice: item.price,
      // initialAvailableQuantity: actualAvailableQuantity,
      isActive: true,
    });
  });

  return rowsToAdd;
};
