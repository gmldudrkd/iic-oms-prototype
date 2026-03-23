import { FieldValues } from "react-hook-form";

import {
  OmsProductSearchRequestDTO,
  OmsProductSearchResponseDTO,
  OmsProductResponseDTO,
} from "@/shared/generated/pim/types/Product";
import { getLocalTime } from "@/shared/utils/formatDate";
import { normalizeToArray } from "@/shared/utils/querystring";

export const transformProductSearchRequest = (
  data: FieldValues,
  params: OmsProductSearchRequestDTO,
) => {
  const {
    skuCode,
    sapCode,
    modelCode,
    upcCode,
    sapName,
    productInfoStatus,
    productType,
    direction,
  } = data;

  return {
    brandId: params.brandId,
    worker: params.worker,
    skuCodes: normalizeToArray(skuCode),
    sapCodes: normalizeToArray(sapCode),
    modelCodes: normalizeToArray(modelCode),
    upcCodes: normalizeToArray(upcCode),
    sapName: sapName.trim(),
    productInfoStatus:
      productInfoStatus.includes("All") || productInfoStatus.length === 2
        ? "ALL"
        : productInfoStatus[0],
    productType:
      productType.includes("All") || productType.length === 2
        ? "ALL"
        : productType[0],
    detail: false,
    direction: direction ?? "NEXT",
    pageNo: 0, // 검색시 페이지 번호 초기화
    pageSize: params.pageSize,
  };
};

export const transformProductList = (
  data: OmsProductSearchResponseDTO | undefined,
  timezone: string,
) => {
  if (!data)
    return {
      rows: [],
      pagination: {
        currentPageSize: 0,
        hasNext: false,
        hasPrevious: false,
        nextCursor: null,
        pageNo: 0,
        pageSize: 0,
        previousCursor: null,
        totalCount: 0,
      },
    };

  const rows = data.products.map((row) => {
    const { isBundle } = row;
    return {
      id: row.sku,
      productType: isBundle ? "Bundle" : "Single",
      skuCode: row.sku || "-",
      // bundle, single을 위해 배열처리
      sapCode: isBundle
        ? row.bundleProducts.map((item: OmsProductResponseDTO) => item.sapCode)
        : [row.sapCode],
      quantity: isBundle
        ? row.bundleProducts.map((item: OmsProductResponseDTO) => item.qty)
        : [row.qty],
      modelCode: isBundle
        ? row.bundleProducts.map(
            (item: OmsProductResponseDTO) => item.modelCode,
          )
        : [row.modelCode],
      upcCode: isBundle
        ? row.bundleProducts.map((item: OmsProductResponseDTO) => item.upcCode)
        : [row.upcCode],
      sapName: isBundle
        ? row.bundleProducts.map((item: OmsProductResponseDTO) => item.sapName)
        : [row.sapName],
      productInfoStatus: row.isCompleted,
      createdAt: row.createdAt ? getLocalTime(row.createdAt, timezone) : "-",
      lastUpdatedAt: row.updatedAt
        ? getLocalTime(row.updatedAt, timezone)
        : "-",
    };
  });

  const pagination = {
    currentPageSize: data.pagination.currentPageSize,
    hasNext: data.pagination.hasNext,
    hasPrevious: data.pagination.hasPrevious,
    nextCursor: data.pagination.nextCursor,
    pageNo: data.pagination.pageNo,
    pageSize: data.pagination.pageSize,
    previousCursor: data.pagination.previousCursor,
    totalCount: data.pagination.totalCount,
  };

  return { rows, pagination };
};
