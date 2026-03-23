import {
  ModifiedChannelStockHistoryRequest,
  StockHistorySearchFilterForm,
} from "@/features/stock/history/models/types";
import {
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE,
  CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
} from "@/features/stock/history/modules/constants";

import { FetchWithToken } from "@/shared/apis/fetchExtended";
import {
  StockHistorySearchRequest,
  StockHistoryWithProductResponse,
  OnlineStockHistoryRequest,
  OnlineStockHistoryResponse,
  ChannelStockHistoryResponse,
} from "@/shared/generated/oms/types/Stock";
import { createQueryParams } from "@/shared/utils/querystring";

/**
 * 재고 변경 이력을 조회합니다.
 * @param params - 검색 조건
 * @returns 재고 변경 이력
 */
export const getStockHistory = async (
  params: StockHistorySearchFilterForm | null,
) => {
  if (!params) {
    return null;
  }

  const transformedParams: StockHistorySearchRequest = {
    brand: params.brand,
    corporation: params.corporation,
    from: params.from,
    to: params.to,
    periodType: params.periodType,
    zoneId: params.zoneId,
  };

  // 검색 키 타입 선택에 따라 단 하나의 필드만 전송
  const searchableFields = [
    CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE,
    CURRENT_SEARCH_KEY_TYPE_SKU_CODE,
  ] as const;

  type SearchableField = (typeof searchableFields)[number];

  const isSearchableField = (value: unknown): value is SearchableField =>
    typeof value === "string" &&
    searchableFields.includes(value as SearchableField);

  if (isSearchableField(params.currentSearchKeyType)) {
    const activeField = params.currentSearchKeyType;
    transformedParams[activeField] = params.searchKeyword;
    searchableFields.forEach((field) => {
      if (field !== activeField) {
        delete transformedParams[field];
      }
    });
  }

  const url = "/stocks/histories";
  const queryString = createQueryParams(transformedParams);
  const response = await FetchWithToken<StockHistoryWithProductResponse>(
    `${url}?${queryString}`,
    "GET",
  );
  return response;
};

/**
 * 온라인 재고 변경 상세 이력을 조회합니다.
 * @param params - 검색 조건
 * @param sku - 제품 SKU
 * @returns 온라인 재고 변경 이력
 */
export const getOnlineStockHistory = async ({
  params,
  sku,
}: {
  params: OnlineStockHistoryRequest;
  sku: string;
}) => {
  const response = await FetchWithToken<OnlineStockHistoryResponse[]>(
    `/stocks/${sku}/online-histories?${createQueryParams(params)}`,
    "GET",
  );
  return response;
};

/**
 * 채널 재고 변경 상세 이력을 조회합니다.
 * @param params - 검색 조건
 * @param sku - 제품 SKU
 * @returns 채널 재고 변경 이력
 */
export const getChannelStockHistory = async ({
  params,
  sku,
}: {
  params: ModifiedChannelStockHistoryRequest;
  sku: string;
}) => {
  const response = await FetchWithToken<ChannelStockHistoryResponse[]>(
    `/stocks/${sku}/channel-histories?${createQueryParams(params)}`,
    "GET",
  );
  return response;
};
