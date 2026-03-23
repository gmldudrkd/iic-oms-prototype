import { CLAIM_REASON_LISTS } from "@/features/integrated-order-detail/modules/constants";

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
