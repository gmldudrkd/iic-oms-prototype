import { FetchWithToken } from "@/shared/apis/fetchExtended";
import {
  OnlineStockDistributionRate,
  OnlineStockSettingDistributionUpdateRequest,
  OnlineStockSettingResponse,
  ChannelStockSettingResponse,
  ChannelStockSettingSearchRequest,
  ChannelStockSettingDistributionUpdateRequest,
} from "@/shared/generated/oms/types/Stock";
import { createQueryParams } from "@/shared/utils/querystring";

/**
 * 온라인 재고 설정 조회
 * GET
 * /v1/api/online-stock-settings
 */
export const getOnlineStockSettings = async (
  brand: string,
  corporation: string,
) => {
  const response = await FetchWithToken<OnlineStockSettingResponse[]>(
    `/online-stock-settings?brand=${brand}&corporation=${corporation}`,
    "GET",
  );
  return response;
};

/**
 * 온라인 재고 채널 분배 비율 설정
 * PATCH
 * /v1/api/online-stock-settings/distribution-rates
 */
export const patchOnlineStockDistributionRates = async (
  data: OnlineStockSettingDistributionUpdateRequest,
) => {
  const response = await FetchWithToken<OnlineStockDistributionRate[]>(
    `/online-stock-settings/distribution-rates`,
    "PATCH",
    data,
  );
  return response;
};

/**
 * 온라인 재고 제품별 채널 분배 비율 설정 조회
 * GET
 * /v1/api/channel-stock-settings
 * ChannelStockSettingSearchRequest
 */

export const getChannelStockSetting = async (
  data: ChannelStockSettingSearchRequest,
) => {
  const queryString = createQueryParams(data);
  const response = await FetchWithToken<ChannelStockSettingResponse[]>(
    `/channel-stock-settings?${queryString}`,
    "GET",
  );
  return response;
};

/**
 * 온라인 재고 제품별 채널 분배 비율 설정
 * PATCH
 * /v1/api/channel-stock-settings/distribution-rates
 */
export const patchChannelStockDistributionRates = async (
  data: ChannelStockSettingDistributionUpdateRequest,
) => {
  const response = await FetchWithToken(
    `/channel-stock-settings/distribution-rates`,
    "PATCH",
    data,
  );
  return response;
};
