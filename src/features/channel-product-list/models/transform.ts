import { FieldValues } from "react-hook-form";

import {
  OmsProductResponseDTO,
  OmsProductSearchResponseDTO,
} from "@/shared/generated/pim/types/Product";
import { OmsChannelProductSearchRequestDTO } from "@/shared/generated/pim/types/Product";
import { normalizeToArray } from "@/shared/utils/querystring";
export const transformProductChannelList = (
  data: OmsProductSearchResponseDTO | undefined,
) => {
  if (!data) {
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
  }

  const rows = data.products.map((row, index) => {
    const { isBundle } = row;

    return {
      id: `${row.sapCode}-${index}`,
      productType: isBundle ? "Bundle" : "Single",
      skuCode: row.sku || "-",
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
      channel: row.salesAndDistributionSettings?.[0]?.channelName || "-",
      channelAvailability: row.salesAndDistributionSettings?.[0]?.availability
        ? "Yes"
        : "No",
      productInfoStatus: row.isCompleted,
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

export const transformChannelProductSearchRequest = (
  data: FieldValues,
  params: OmsChannelProductSearchRequestDTO,
  channelActiveListLength: number,
) => {
  const {
    skuCode,
    sapCode,
    modelCode,
    upcCode,
    sapName,
    channel,
    channelAvailability,
    productInfoStatus,
    productType,
  } = data;

  return {
    brandId: params.brandId,
    skuCodes: normalizeToArray(skuCode),
    sapCodes: normalizeToArray(sapCode),
    modelCodes: normalizeToArray(modelCode),
    upcCodes: normalizeToArray(upcCode),
    sapName: sapName.trim(),
    channelName:
      channel.includes("All") || channel.length === channelActiveListLength
        ? "ALL"
        : channel.join(","),
    channelActive:
      channelAvailability.includes("All") || channelAvailability.length === 2
        ? "ALL"
        : channelAvailability[0],
    productInfoStatus:
      productInfoStatus.includes("All") || productInfoStatus.length === 2
        ? "ALL"
        : productInfoStatus[0],
    productType:
      productType.includes("All") || productType.length === 2
        ? "ALL"
        : productType[0],
    pageNo: 0,
    pageSize: params.pageSize,
  };
};
