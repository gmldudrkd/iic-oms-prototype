import { CLAIM_REASON_LISTS } from "@/features/integrated-order-detail/modules/constants";

import { OrderDetailResponse } from "@/shared/generated/oms/types/Order";

/**
 * 브랜드 이름에 따라 적절한 claim reason list를 반환하는 함수
 * @param brandName 브랜드 이름
 * @returns CLAIM_REASON_LISTS.TAMBURINS 또는 CLAIM_REASON_LISTS.NO_TAMBURINS
 */
export const getClaimReasonList = (brandName?: string) => {
  const isTamburins = brandName === "TAMBURINS";
  return isTamburins
    ? CLAIM_REASON_LISTS.TAMBURINS
    : CLAIM_REASON_LISTS.NO_TAMBURINS;
};

/**
 * 전화번호 문자열을 반환하는 함수
 * @param phoneCountryNo 국가번호
 * @param recipientPhone 전화번호
 * @returns 전화번호 문자열
 */
export const getRecipientPhone = (
  phoneCountryNo: string | undefined,
  recipientPhone: string,
) => {
  return `${phoneCountryNo ? `(+${phoneCountryNo}) ` : ""}${recipientPhone}`;
};

const INTELLIGENT_EYEWEAR = "INTELLIGENT EYEWEAR";
// INTELLIGENT EYEWEAR 전용 반품 사유 노출 대상 GM 법인
const INTELLIGENT_EYEWEAR_RETURN_CORPORATIONS = ["US", "KR"];

/**
 * GM US / GM KR 주문 중 INTELLIGENT EYEWEAR 제품이 1개라도 포함되어 있는지 판별하는 함수
 * (해당 주문은 반품 사유를 INTELLIGENT EYEWEAR 전용 사유로 노출)
 * @param data 주문 상세 데이터
 * @returns 전용 반품 사유 노출 여부
 */
export const isIntelligentEyewearReturnOrder = (data?: OrderDetailResponse) => {
  if (!data) return false;
  const isTargetBrandCorp =
    data.brand?.name === "GENTLE_MONSTER" &&
    INTELLIGENT_EYEWEAR_RETURN_CORPORATIONS.includes(data.corporation);
  if (!isTargetBrandCorp) return false;
  return data.items.some(
    (item) =>
      (item as unknown as Record<string, unknown>).category ===
        INTELLIGENT_EYEWEAR ||
      [...(item.products ?? []), ...(item.components ?? [])].some(
        (sub) => sub.category === INTELLIGENT_EYEWEAR,
      ),
  );
};

const PRODUCT_CATEGORIES = [
  "GWP",
  "PERFUME",
  "PACKAGE",
  "SUNGLASS",
  INTELLIGENT_EYEWEAR,
] as const;
type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/**
 * 제품 Category를 판별하는 함수
 * 1) GWP 로 접수된 제품(isGwp)은 항상 "GWP"
 * 2) 응답에 명시된 category가 PERFUME / PACKAGE / SUNGLASS / INTELLIGENT EYEWEAR 중 하나면 그 값을 사용
 * 3) 그 외에는 가격으로 판별: 0원 제품은 PACKAGE(패키지 접수), 나머지는 SUNGLASS
 * @param price 제품 가격
 * @param isGwp GWP 증정품 여부
 * @param explicitCategory 응답에 명시된 category (있을 경우 우선 적용)
 * @returns "GWP" | "PERFUME" | "PACKAGE" | "SUNGLASS" | "INTELLIGENT EYEWEAR"
 */
export const getProductCategory = (
  price: number | string | null | undefined,
  isGwp = false,
  explicitCategory?: unknown,
): ProductCategory => {
  if (isGwp) return "GWP";
  if (
    typeof explicitCategory === "string" &&
    (PRODUCT_CATEGORIES as readonly string[]).includes(explicitCategory)
  )
    return explicitCategory as ProductCategory;
  // 가격을 알 수 없는 경우는 SUNGLASS로 처리
  if (price === null || price === undefined || price === "") return "SUNGLASS";
  const numericPrice = Number(price);
  return numericPrice === 0 ? "PACKAGE" : "SUNGLASS";
};
