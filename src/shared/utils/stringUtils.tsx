export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 문자열 모든 문자 대문자로 변환
 * @param str 문자열
 * @returns 대문자로 변환된 문자열, 띄어쓰기는 _로 대체
 */
export const capitalizeAllLetters = (str: string) => {
  return str.replaceAll(" ", "_").toUpperCase();
};

/**
 * 스네이크 케이스를 타이틀 케이스로 변환
 * 예) SHIPMENT_REQUESTED -> Shipment Requested
 * @param str 문자열
 * @returns 타이틀 케이스로 변환된 문자열
 */
export const snakeToTitleCase = (str: string) => {
  const lowerCaseStr = str.replaceAll("_", " ").toLowerCase();
  const words = lowerCaseStr.split(" ");
  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  return titleCasedWords.join(" ");
};

/**
 * 카멜 케이스를 타이틀 케이스로 변환
 * 예) shipmentRequested -> Shipment Requested
 * @param str 문자열
 * @returns 타이틀 케이스로 변환된 문자열
 */
export const camelToTitleCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * 텍스트 조건에 맞춰 비활성화 색상 변경
 * @param text 텍스트
 * @param matchText 조건
 * @returns 비활성화 색상 변경된 텍스트
 */
export const getDisabledText = (text: string, matchText: string) => {
  return text === matchText ? "text-text-disabled" : "";
};

/**
 * 주소 파트 배열을 필터링 후 콤마로 이어 붙이기
 * @param postcode 우편번호
 * @param countryRegion 국가
 * @param stateProvince 시/도
 * @param city 시/군/구
 * @param address1 주소1
 * @param address2 주소2
 * @returns 주소 파트 배열을 필터링 후 콤마로 이어 붙인 문자열
 */
export const formatAddress = (
  postcode: string,
  countryRegion: string,
  stateProvince: string,
  city: string,
  address1: string,
  address2: string,
): string => {
  // countryRegion 제외 나머지가 모두 "-"인지 체크
  const addressValues = [postcode, stateProvince, city, address1, address2];
  const isAllDash = addressValues.every(
    (v) => v.trim() === "-" || v.trim() === "",
  );

  if (isAllDash) {
    return "-";
  }

  const krOrder = [stateProvince, city, address1, address2];
  const defaultOrder = [address1, address2, city, stateProvince];

  const addressParts = (countryRegion === "KR" ? krOrder : defaultOrder)
    .filter((part) => !!part && part.trim() !== "" && part.trim() !== "-")
    .join(", ");

  return `(${postcode}) ${addressParts}${countryRegion ? `, ${countryRegion}` : ""}`;
};

/**
 * 주소 라인1 포맷팅
 * @param address line1 주소
 * @param state 시/도
 * @param city 시/군/구
 * @returns 주소 라인1 포맷팅된 문자열
 */
export const formatLine1 = (
  address: string,
  state: string | null,
  city: string | null,
) => {
  let result = address;

  [state, city].forEach((item) => {
    if (item) {
      result = result.replace(item, "");
    }
  });

  result = result.trim();
  return result === "" ? "-" : result;
};

/**
 * 문자열을 줄바꿈 문자열로 변환
 * @param str 문자열
 * @returns 줄바꿈 문자열로 변환된 문자열
 */
export const convertToLineBreak = (str: string) => {
  if (!str) return "";
  return str.split("\n").map((line, index) => (
    <span key={index}>
      {/* {index !== 0 && <br />} */}
      {line}
      <br />
    </span>
  ));
};

/**
 * \n 기준으로 문자열을 배열로 변환
 * @param str 문자열
 * @returns 배열
 */
export const convertToArray = (str: string) => {
  return str
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

/**
 * 빈 문자열을 "-"로 치환
 * @param obj 객체
 * @returns 빈 문자열을 "-"로 치환된 객체
 */
export const fillEmptyWithDash = <
  T extends Record<string, string | number | boolean | null | undefined>,
>(
  obj: T,
): T => {
  const result: Record<string, string | number | boolean | null | undefined> =
    {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // null, undefined, 빈 문자열 처리
      if (value === null || value === undefined || value === "") {
        result[key] = "-";
      } else {
        result[key] = value;
      }
    }
  }

  return result as T;
};

/**
 * 가격 포맷팅
 * @param value 가격
 * @param currency 통화
 * @param isNumberFirst 숫자 앞에 통화 표시할지 여부
 * @returns 가격 포맷팅된 문자열
 */
export const convertToPrice = (
  value: number | null,
  currency: string | undefined = "KRW",
  isNumberFirst: boolean = false,
) => {
  return (
    <span
      className={`flex gap-1 ${isNumberFirst ? "flex-row" : "flex-row-reverse"}`}
    >
      <span>{isNaN(Number(value)) ? "-" : value?.toLocaleString()} </span>
      <span>{currency}</span>
    </span>
  );
};

/**
 * 결제 정보에서 통화 코드 추출
 * @param payments 결제 정보
 * @returns 통화 코드
 */
export function getCurrencyFromPayments(
  payments: { currency?: string }[] = [],
) {
  return payments?.[0]?.currency;
}
