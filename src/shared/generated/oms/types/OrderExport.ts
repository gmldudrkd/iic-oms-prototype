/* eslint-disable */
export interface OrderExportRequest {
  /** @uniqueItems true */
  channelTypes?: OrderExportRequestChannelTypesEnum[];
  exportType: OrderExportRequestExportTypeEnum;
  /** @format date-time */
  from: string;
  /**
   * @minLength 4
   * @maxLength 10
   */
  password: string;
  /**
   * @minLength 0
   * @maxLength 50
   */
  purposeMessage: string;
  /** @format date-time */
  to: string;
  /**
   * 타임존 id
   * @example "Asia/Seoul"
   */
  zoneId?: string;
}

export enum OrderExportRequestExportTypeEnum {
  ALL = "ALL",
  ORDER = "ORDER",
  SHIPMENT = "SHIPMENT",
  ORDER_CANCEL = "ORDER_CANCEL",
  RETURN = "RETURN",
  EXCHANGE = "EXCHANGE",
}

export enum OrderExportRequestChannelTypesEnum {
  GENTLE_MONSTER_OFFICIAL_US = "GENTLE_MONSTER_OFFICIAL_US",
  GENTLE_MONSTER_OFFICIAL_CA = "GENTLE_MONSTER_OFFICIAL_CA",
  ATIISSU_OFFICIAL = "ATIISSU_OFFICIAL",
  ATIISSU_TEST = "ATIISSU_TEST",
  NUFLAAT_OFFICIAL = "NUFLAAT_OFFICIAL",
}
