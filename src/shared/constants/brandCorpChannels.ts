import { BrandResponse } from "@/shared/generated/oms/types/User";

// Brand & Corp 조합에 따른 판매 채널 목록
// key = `${brand.description}|${corporation.name}` (예: "GM|KR")
// Promotion 등록/수정(V2) · Promotion Template · Promotion List 가 공통으로 사용한다
export const BRAND_CORP_CHANNELS: Record<string, string[]> = {
  "GM|AU": ["GM_Official_AU"],
  "GM|JP": ["GM_Official_JP"],
  "GM|KR": [
    "GM_ONLINE_FARFETCH",
    "GM_SI_VILLAGE_KR",
    "GM_SSF_KR",
    "GM_SSG_KR",
    "GM_KAKAO_KR",
    "GM_Official_INT",
    "GM_Official_KR",
  ],
  "GM|US": ["GM_Official_US"],
  "GM|CA": ["GM_Official_CA"],
  "NUF|KR": ["NUF_Official_KR"],
  "ATS|KR": ["ATS_Official_KR"],
};

export const brandCorpKey = (brand: string, corp: string) => `${brand}|${corp}`;

export const channelsFor = (brand: string, corp: string): string[] =>
  BRAND_CORP_CHANNELS[brandCorpKey(brand, corp)] ?? [];

// 상단 헤더 Brand & Corp 선택(selectedPermission)에 포함된 `brand|corp` 키 목록
export const brandCorpKeysOf = (permission: BrandResponse[]): string[] => {
  const keys: string[] = [];
  permission.forEach((item) => {
    const brand = item.brand?.description ?? "";
    item.corporations?.forEach((c) => {
      const key = brandCorpKey(brand, c.name);
      if (!keys.includes(key)) keys.push(key);
    });
  });
  return keys;
};

// 상단 헤더 Brand & Corp 선택 기준 사용 가능 채널 목록 (중복 제거, 선택 순서 유지)
export const availableChannelsFor = (permission: BrandResponse[]): string[] => {
  const result: string[] = [];
  brandCorpKeysOf(permission).forEach((key) => {
    (BRAND_CORP_CHANNELS[key] ?? []).forEach((ch) => {
      if (!result.includes(ch)) result.push(ch);
    });
  });
  return result;
};
