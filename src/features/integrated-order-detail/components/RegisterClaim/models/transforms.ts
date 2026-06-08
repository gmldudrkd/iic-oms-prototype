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
  let bundleCounter = 0;

  return data.items.flatMap((item, itemIndex): GridRowModel[] => {
    const itemId = item.orderItemId;
    // 하위 product를 가진 item만 번들로 취급 (번들은 싱글 단위로 풀어서 노출)
    const isBundle = (item.products?.length ?? 0) > 0;
    const subRows: GridRowModel[] = [];

    if (isBundle) {
      const bundleNo = ++bundleCounter;

      // 번들 구성품(product)/포장(component) 모두 개별 선택 가능한 row로 노출
      item.products?.forEach((product, prodIndex) => {
        // 구성품: 취소를 제외한 주문 수량 (=Order Qty), 가용재고 무관하게 출고 가능
        const qty = Number(product.quantity) || 0;
        subRows.push({
          no: globalIndex++,
          id: `${itemId}-product-${prodIndex}`,
          orderItemId: item.orderItemId,
          originItemId: item.originItemId,
          skuCode: product.sku,
          category: product.category ?? "",
          productName: product.productName,
          orderQty: qty,
          cellQuantity: qty,
          initialAvailableQuantity: qty,
          cancelPrice: product.price,
          bundleNo,
          isBundle: false,
          parentItemId: itemId,
          isActive: qty > 0,
        });
      });

      item.components?.forEach((component, compIndex) => {
        const qty = Number(component.quantity) || 0;
        subRows.push({
          no: globalIndex++,
          id: `${itemId}-component-${compIndex}`,
          orderItemId: item.orderItemId,
          originItemId: item.originItemId,
          skuCode: component.sku,
          category: component.category ?? "",
          productName: component.productName,
          orderQty: qty,
          cellQuantity: qty,
          initialAvailableQuantity: qty,
          cancelPrice: component.price,
          bundleNo,
          isBundle: false,
          parentItemId: itemId,
          isActive: qty > 0,
        });
      });

      return subRows;
    }

    // 일반 상품 → 본품 1 row + 포장/구성품 각각 1 row
    // 제품: 취소 제외 주문 수량 중 실제 출고 가능한 수량
    const productQty =
      Math.max(
        (Number(item.shipmentQuantity) || 0) +
          (Number(item.reshippedQuantity) || 0) -
          (Number(item.returnedQuantity) || 0),
        0,
      ) ||
      Number(item.orderedQuantity) ||
      0;

    subRows.push({
      no: globalIndex++,
      id: `${itemId}-separated-${itemIndex}`,
      orderItemId: item.orderItemId,
      originItemId: item.originItemId,
      skuCode: item.sku,
      category: "",
      productName: item.productName,
      orderQty: item.orderedQuantity,
      cellQuantity: productQty,
      initialAvailableQuantity: productQty,
      cancelPrice: item.price,
      isBundle: false,
      parentItemId: null,
      isActive: productQty > 0,
    });

    item.components?.forEach((component, compIndex) => {
      const qty = Number(component.quantity) || 0;
      subRows.push({
        no: globalIndex++,
        id: `${itemId}-component-${compIndex}`,
        orderItemId: item.orderItemId,
        originItemId: item.originItemId,
        skuCode: component.sku,
        category: component.category ?? "",
        productName: component.productName,
        orderQty: qty,
        cellQuantity: qty,
        initialAvailableQuantity: qty,
        cancelPrice: component.price,
        isBundle: false,
        parentItemId: itemId,
        isActive: qty > 0,
      });
    });

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
