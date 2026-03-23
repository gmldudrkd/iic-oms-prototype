import { KR, JP, US, TW, SG, AU } from "@/shared/constants";
import {
  UserCreateConfirmRequestCorporationEnum,
  UserCreateConfirmRequestBrandEnum,
} from "@/shared/generated/auth/types/Auth";

export const BRAND_DISPLAY_NAME = {
  [UserCreateConfirmRequestBrandEnum.GENTLE_MONSTER]: "Gentle Monster",
  [UserCreateConfirmRequestBrandEnum.TAMBURINS]: "Tamburins",
  [UserCreateConfirmRequestBrandEnum.NUDAKE]: "Nudake",
  [UserCreateConfirmRequestBrandEnum.NUFLAAT]: "Nuflaat",
  [UserCreateConfirmRequestBrandEnum.ATIISSU]: "Atiissu",
};

export const BRAND_OPTIONS = [
  UserCreateConfirmRequestBrandEnum.GENTLE_MONSTER,
  UserCreateConfirmRequestBrandEnum.TAMBURINS,
  UserCreateConfirmRequestBrandEnum.NUFLAAT,
  UserCreateConfirmRequestBrandEnum.ATIISSU,
] as const;

export const CORPORATION_OPTIONS: Record<
  UserCreateConfirmRequestBrandEnum,
  {
    value: string;
    enum: UserCreateConfirmRequestCorporationEnum;
  }[]
> = {
  GENTLE_MONSTER: [
    { value: KR, enum: UserCreateConfirmRequestCorporationEnum.KR },
    { value: JP, enum: UserCreateConfirmRequestCorporationEnum.JP },
    { value: US, enum: UserCreateConfirmRequestCorporationEnum.US },
    { value: TW, enum: UserCreateConfirmRequestCorporationEnum.TW },
    { value: SG, enum: UserCreateConfirmRequestCorporationEnum.SG },
    { value: AU, enum: UserCreateConfirmRequestCorporationEnum.AU },
  ],
  TAMBURINS: [
    { value: KR, enum: UserCreateConfirmRequestCorporationEnum.KR },
    { value: JP, enum: UserCreateConfirmRequestCorporationEnum.JP },
  ],
  NUDAKE: [{ value: KR, enum: UserCreateConfirmRequestCorporationEnum.KR }],
  NUFLAAT: [{ value: KR, enum: UserCreateConfirmRequestCorporationEnum.KR }],
  ATIISSU: [{ value: KR, enum: UserCreateConfirmRequestCorporationEnum.KR }],
};
