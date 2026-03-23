import { z } from "zod";

import {
  CHANNEL_DEFAULT_RATE,
  PRODUCT_RATE,
} from "@/features/stock/distributionSetting/modules/constants";

import {
  ChannelStockSettingSearchRequestBrandEnum,
  ChannelStockSettingSearchRequestCorporationEnum,
} from "@/shared/generated/oms/types/Stock";

export const DistributionSettingTabSchema = z.enum([
  CHANNEL_DEFAULT_RATE,
  PRODUCT_RATE,
]);

export type DistributionSettingTabType = z.infer<
  typeof DistributionSettingTabSchema
>;

export const toBrandEnum = (brand?: string) =>
  ChannelStockSettingSearchRequestBrandEnum[
    brand as keyof typeof ChannelStockSettingSearchRequestBrandEnum
  ];

export const toCorpEnum = (corp?: string) =>
  ChannelStockSettingSearchRequestCorporationEnum[
    corp as keyof typeof ChannelStockSettingSearchRequestCorporationEnum
  ];

export interface ProductRateSearchForm {
  brand: string;
  corporation: string;
  searchKeyType: string;
  searchKeyword: string | undefined;
}
