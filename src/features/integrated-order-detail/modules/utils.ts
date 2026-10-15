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
