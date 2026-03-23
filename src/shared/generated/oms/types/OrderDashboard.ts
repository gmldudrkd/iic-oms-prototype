/* eslint-disable */
import { EnumResponse } from "./common";

export interface OrderSummaryRequest {
  /** @uniqueItems true */
  channelTypes?: OrderSummaryRequestChannelTypesEnum[];
}

export enum OrderSummaryRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}

export interface DashboardSummaryResponse {
  exchangeSummaries: StatusSummary;
  orderSummaries: StatusSummary;
  returnSummaries: StatusSummary;
  shipmentSummaries: StatusSummary;
}

export interface StatusSummary {
  awaitingCounts: StatusCount[];
  /** @format int32 */
  awaitingTotalCount: number;
  finalizedCounts: StatusCount[];
  /** @format int32 */
  finalizedTotalCount: number;
  inProgressCounts: StatusCount[];
  /** @format int32 */
  inProgressTotalCount: number;
}

export interface StatusCount {
  /** @format int32 */
  count: number;
  status: EnumResponse;
}
