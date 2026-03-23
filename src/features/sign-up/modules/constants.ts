import { KR, JP, US, TW, SG, AU } from "@/shared/constants";
import {
  UserCreateRequestPermissionCorporationsEnum,
  UserCreateRequestPermissionBrandEnum,
} from "@/shared/generated/auth/types/Auth";

export const AVAILABLE_BRANDS = [
  UserCreateRequestPermissionBrandEnum.GENTLE_MONSTER,
  UserCreateRequestPermissionBrandEnum.TAMBURINS,
  UserCreateRequestPermissionBrandEnum.ATIISSU,
  UserCreateRequestPermissionBrandEnum.NUFLAAT,
] as const;

export const CORPORATION_OPTIONS: Record<
  UserCreateRequestPermissionBrandEnum,
  {
    value: string;
    enum: UserCreateRequestPermissionCorporationsEnum;
  }[]
> = {
  GENTLE_MONSTER: [
    { value: KR, enum: UserCreateRequestPermissionCorporationsEnum.KR },
    { value: JP, enum: UserCreateRequestPermissionCorporationsEnum.JP },
    { value: US, enum: UserCreateRequestPermissionCorporationsEnum.US },
    { value: TW, enum: UserCreateRequestPermissionCorporationsEnum.TW },
    { value: SG, enum: UserCreateRequestPermissionCorporationsEnum.SG },
    { value: AU, enum: UserCreateRequestPermissionCorporationsEnum.AU },
  ],
  TAMBURINS: [
    { value: KR, enum: UserCreateRequestPermissionCorporationsEnum.KR },
    { value: JP, enum: UserCreateRequestPermissionCorporationsEnum.JP },
  ],
  NUDAKE: [{ value: KR, enum: UserCreateRequestPermissionCorporationsEnum.KR }],
  NUFLAAT: [
    { value: KR, enum: UserCreateRequestPermissionCorporationsEnum.KR },
  ],
  ATIISSU: [
    { value: KR, enum: UserCreateRequestPermissionCorporationsEnum.KR },
  ],
};

// 브랜드 약어 매핑
export const BRAND_ABBREVIATIONS = {
  [UserCreateRequestPermissionBrandEnum.GENTLE_MONSTER]: "GM",
  [UserCreateRequestPermissionBrandEnum.TAMBURINS]: "TAM",
  [UserCreateRequestPermissionBrandEnum.ATIISSU]: "ATS",
  [UserCreateRequestPermissionBrandEnum.NUFLAAT]: "NUF",
} as const;
