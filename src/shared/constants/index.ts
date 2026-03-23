import { UserCreateConfirmRequestBrandEnum } from "@/shared/generated/auth/types/Auth";

// 브랜드
export const GENTLE_MONSTER = "GENTLE_MONSTER";
export const TAMBURINS = "TAMBURINS";
export const NUDAKE = "NUDAKE";
export const NUFLAAT = "NUFLAAT";
export const ATIISSU = "ATIISSU";

// 국가(법인)
export const KR = "KR";
export const JP = "JP";
export const US = "US";
export const TW = "TW";
export const SG = "SG";
export const AU = "AU";

// 권한
export const SUPER_ADMIN = "SUPER_ADMIN";
export const ADMIN = "ADMIN";
export const SYSTEM = "SYSTEM";
export const MANAGER = "MANAGER";

// 브랜드 표시명
export const BRAND_DISPLAY_NAME = {
  [UserCreateConfirmRequestBrandEnum.GENTLE_MONSTER]: "Gentle Monster",
  [UserCreateConfirmRequestBrandEnum.TAMBURINS]: "Tamburins",
  [UserCreateConfirmRequestBrandEnum.NUDAKE]: "Nudake",
  [UserCreateConfirmRequestBrandEnum.NUFLAAT]: "Nuflaat",
  [UserCreateConfirmRequestBrandEnum.ATIISSU]: "Atiissu",
};

// 테이블 페이지 사이즈 옵션
export const COMMON_TABLE_PAGE_SIZE_OPTIONS = [100, 300, 500];
export const INITIAL_PAGINATION_MODEL = {
  page: 0,
  pageSize: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
};

// 브랜드 ID 매핑
export const BRAND_ID_LIST = {
  GENTLE_MONSTER: "GM",
  TAMBURINS: "TB",
  NUDAKE: "NU",
  NUFLAAT: "NF",
  ATIISSU: "AT",
  HAUS: "HU",
} as const;
