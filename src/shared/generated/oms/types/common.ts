/* eslint-disable */
export interface Recipient {
  address: Address;
  deliveryMessage?: string;
  firstName: string;
  fullName: string;
  lastName: string;
  phone: string;
  phoneCountryNo?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city?: string;
  countryType: AddressCountryTypeEnum;
  district?: string;
  postalCode?: string;
  state?: string;
}

export enum AddressCountryTypeEnum {
  KR = "KR",
  JP = "JP",
  GL = "GL",
  AU = "AU",
  GH = "GH",
  GA = "GA",
  GY = "GY",
  GM = "GM",
  GG = "GG",
  GP = "GP",
  GT = "GT",
  GU = "GU",
  VA = "VA",
  GD = "GD",
  GR = "GR",
  GW = "GW",
  NA = "NA",
  NR = "NR",
  NG = "NG",
  SS = "SS",
  ZA = "ZA",
  NL = "NL",
  NP = "NP",
  NO = "NO",
  NC = "NC",
  NZ = "NZ",
  NU = "NU",
  NE = "NE",
  NI = "NI",
  TW = "TW",
  DK = "DK",
  DO = "DO",
  DE = "DE",
  TL = "TL",
  LA = "LA",
  LR = "LR",
  LV = "LV",
  RU = "RU",
  LB = "LB",
  LS = "LS",
  RE = "RE",
  RO = "RO",
  LU = "LU",
  RW = "RW",
  LY = "LY",
  LT = "LT",
  LI = "LI",
  MG = "MG",
  MQ = "MQ",
  MH = "MH",
  YT = "YT",
  FM = "FM",
  MO = "MO",
  MW = "MW",
  MY = "MY",
  ML = "ML",
  IM = "IM",
  MX = "MX",
  MC = "MC",
  MA = "MA",
  MU = "MU",
  MR = "MR",
  ME = "ME",
  MS = "MS",
  MD = "MD",
  MV = "MV",
  MT = "MT",
  MN = "MN",
  MM = "MM",
  US = "US",
  VU = "VU",
  BH = "BH",
  BB = "BB",
  BS = "BS",
  BD = "BD",
  BM = "BM",
  BJ = "BJ",
  VE = "VE",
  VN = "VN",
  BE = "BE",
  BY = "BY",
  BZ = "BZ",
  BA = "BA",
  BW = "BW",
  BO = "BO",
  BI = "BI",
  BF = "BF",
  BT = "BT",
  MP = "MP",
  MK = "MK",
  BG = "BG",
  BR = "BR",
  BN = "BN",
  AS = "AS",
  SA = "SA",
  CY = "CY",
  SM = "SM",
  SN = "SN",
  RS = "RS",
  SC = "SC",
  SO = "SO",
  SB = "SB",
  SD = "SD",
  SR = "SR",
  LK = "LK",
  SE = "SE",
  CH = "CH",
  ES = "ES",
  SK = "SK",
  SI = "SI",
  SY = "SY",
  SL = "SL",
  SG = "SG",
  AW = "AW",
  AM = "AM",
  AR = "AR",
  IS = "IS",
  HT = "HT",
  GB = "GB",
  AZ = "AZ",
  AF = "AF",
  AD = "AD",
  AL = "AL",
  DZ = "DZ",
  AO = "AO",
  AG = "AG",
  AI = "AI",
  ER = "ER",
  SZ = "SZ",
  EE = "EE",
  EC = "EC",
  SV = "SV",
  VG = "VG",
  IO = "IO",
  YE = "YE",
  HN = "HN",
  WF = "WF",
  JO = "JO",
  UG = "UG",
  UY = "UY",
  UZ = "UZ",
  UA = "UA",
  IQ = "IQ",
  IR = "IR",
  IL = "IL",
  EG = "EG",
  IT = "IT",
  IN = "IN",
  ID = "ID",
  JM = "JM",
  ZM = "ZM",
  JE = "JE",
  GQ = "GQ",
  GS = "GS",
  CF = "CF",
  CR = "CR",
  CI = "CI",
  CO = "CO",
  CG = "CG",
  CU = "CU",
  KW = "KW",
  CK = "CK",
  HR = "HR",
  KG = "KG",
  KI = "KI",
  TJ = "TJ",
  TZ = "TZ",
  TH = "TH",
  TC = "TC",
  TG = "TG",
  TO = "TO",
  TM = "TM",
  TV = "TV",
  TN = "TN",
  PA = "PA",
  PY = "PY",
  PK = "PK",
  PW = "PW",
  PS = "PS",
  PE = "PE",
  PT = "PT",
  PL = "PL",
  PR = "PR",
  FR = "FR",
  GF = "GF",
  PF = "PF",
  FJ = "FJ",
  FI = "FI",
  PH = "PH",
  PN = "PN",
  HU = "HU",
  TT = "TT",
  PG = "PG",
  AE = "AE",
}

export interface EnumResponse {
  description?: string;
  name: string;
}

export interface OrderItemComponent {
  category?: string;
  price: number;
  productCode: string;
  productName?: string;
  /** @format int32 */
  quantity: number;
  sku?: string;
}

export interface OrderItemProduct {
  category?: string;
  price: number;
  productCode: string;
  productName?: string;
  /** @format int32 */
  quantity: number;
  sku: string;
}

export interface Item {
  /** @format int64 */
  orderItemId: number;
  productCode?: string;
  /** @format int32 */
  quantity: number;
  sku: string;
}

export interface Delivery {
  carrierCode?: string;
  /** @format date-time */
  deliveredAt?: string;
  deliveryType?: string;
  trackingNo?: string;
}

export interface DeliveryTracking {
  trackingNo: string;
  trackingUrl?: string;
}
