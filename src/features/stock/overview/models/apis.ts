import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";

import { FetchWithToken } from "@/shared/apis/fetchExtended";
import {
  OnlineStockSafetyQuantityUpdateRequest,
  PageResponseStockDashboardResponse,
  ChannelStockTransferRequest,
  ChannelStockSyncUpdateRequest,
  ChannelStockPreorderSettingRequest,
} from "@/shared/generated/oms/types/Stock";
import { StockExportRequest } from "@/shared/generated/oms/types/StockExport";
import {
  createQueryParams,
  normalizeToArray,
} from "@/shared/utils/querystring";

/**
 * 온라인 또는 채널 재고 현황을 조회합니다.
 * @param type - 조회할 재고 타입 ("online" | "channel")
 * @param params - 검색 조건 및 페이지네이션 파라미터
 * @returns 재고 현황 데이터
 */
export const getStockOverview = async (
  type: "online" | "channel",
  params: StockDashboardRequestForm | null,
) => {
  if (!params) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedParams: Record<string, any> = {
    page: params.page,
    size: params.size,
    brand: params.brand,
    channelTypes: params.channelTypes,
    corporation: params.corporation,
    hasPreorderQuantity:
      params.hasPreorderQuantity === "All" ? null : params.hasPreorderQuantity,
    hasSafetyQuantity:
      params.hasSafetyQuantity === "All" ? null : params.hasSafetyQuantity,
    productType: params.productTypes.length > 1 ? [] : params.productTypes, // SINGLE, BUNDLE 모두 조회시 빈 값으로 요청
    channelSendStatus:
      params.channelSendStatus.length > 1 ? [] : params.channelSendStatus, // ON, OFF 모두 조회시 빈 값으로 요청
  };

  // 검색 키 타입 선택에 따라 단 하나의 필드만 전송
  const searchableFields = ["productCodes", "productName", "skus"] as const;
  type SearchableField = (typeof searchableFields)[number];
  const isSearchableField = (value: unknown): value is SearchableField =>
    typeof value === "string" &&
    searchableFields.includes(value as SearchableField);

  if (isSearchableField(params.currentSearchKeyType)) {
    const activeField = params.currentSearchKeyType;
    transformedParams[activeField] = normalizeToArray(params.searchKeyword);
    searchableFields.forEach((field) => {
      if (field !== activeField) {
        delete transformedParams[field];
      }
    });
  }

  const queryString = createQueryParams(transformedParams);

  const url =
    type === "online"
      ? `/stocks/online-stock-overview?${queryString}`
      : `/stocks/channel-stock-overview?${queryString}`;

  const responseData = await FetchWithToken<PageResponseStockDashboardResponse>(
    url,
    "GET",
  );
  return responseData;
};

/**
 * 온라인 재고의 안전 재고 수량을 수정합니다.
 * @param data - 안전 재고 수정 요청 데이터
 */
export const patchSafetyStock = async (
  data: OnlineStockSafetyQuantityUpdateRequest,
) => {
  const responseData = await FetchWithToken<void>(
    `/online-stocks/safety-quantity`,
    "PATCH",
    data,
  );
  return responseData;
};

/**
 * 채널 재고를 이동합니다.
 * @param data - 재고 이동 요청 데이터
 */
export const patchStockTransfer = async (data: ChannelStockTransferRequest) => {
  const responseData = await FetchWithToken<void>(
    `/channel-stocks/transfer-stocks`,
    "PATCH",
    data,
  );
  return responseData;
};

/**
 * 재고 데이터를 엑셀 파일로 내보냅니다.
 * @param data - 내보내기 요청 데이터 (타입, 브랜드, 법인, 기간 등)
 * @returns Excel 파일 Response 객체
 */
export const postStockExport = async (
  data: StockExportRequest,
): Promise<Response> => {
  const responseData = await FetchWithToken<Response>(
    `/stocks/export`,
    "POST",
    data,
    {
      responseType: "blob",
    },
  );
  return responseData;
};

/**
 * 채널 재고 연동 여부를 업데이트합니다.
 * @param data - 연동 여부 업데이트 요청 데이터
 * @returns 연동 여부 업데이트 응답 데이터
 */
export const patchChannelSendStatus = async (
  data: ChannelStockSyncUpdateRequest,
) => {
  const responseData = await FetchWithToken<void>(
    `/channel-stock-settings/stock-syncs`,
    "PATCH",
    data,
  );
  return responseData;
};

interface PreOrderSettingRequest
  extends Omit<ChannelStockPreorderSettingRequest, "preorderExpiredAt"> {
  preorderExpiredAt?: string | null;
}

/**
 * Pre-order 설정을 업데이트합니다.
 * @param data - Pre-order 설정 업데이트 요청 데이터
 * @returns Pre-order 설정 업데이트 응답 데이터
 */
export const patchPreOrderSetting = async (data: PreOrderSettingRequest) => {
  const responseData = await FetchWithToken<void>(
    `/channel-stocks/pre-order-settings`,
    "PATCH",
    data,
  );
  return responseData;
};
