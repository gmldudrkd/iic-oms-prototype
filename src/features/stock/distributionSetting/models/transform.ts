import {
  ChannelStockSettingResponse,
  OnlineStockSettingResponse,
} from "@/shared/generated/oms/types/Stock";

export const transformOnlineStockSettings = (
  data: OnlineStockSettingResponse[] | undefined,
) => {
  if (!data) {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    channelType: item.channelType,
    distributionRate: item.distributionRate,
    distributionPriority: item.distributionPriority,
  }));
};

export const transformChannelStockSetting = (
  data: ChannelStockSettingResponse[],
) => {
  return data.map((item) => ({
    id: item.sku,
    skuCode: item.sku,
    sapCode: item.productCode,
    name: item.productName,
    rateType: item.rateType,
    channelName: item.channelDistributeRates.map(
      (rate) => rate.channelType.description,
    ),
    distributionRate: item.channelDistributeRates.map(
      (rate) => rate.distributedRate,
    ),
  }));
};
