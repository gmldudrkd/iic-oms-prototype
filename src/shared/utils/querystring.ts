/**
 * 쿼리 파라미터 생성 유틸리티 함수
 * @param params - 쿼리 파라미터 객체
 * @returns 쿼리 파라미터 문자열
 */
export const createQueryParams = (params: unknown): string => {
  if (typeof params !== "object" || params === null) {
    return "";
  }
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val === "All") {
            return;
          }
          queryParams.append(key, String(val).trim());
        });
      } else {
        queryParams.append(key, String(value).trim());
      }
    }
  });

  return queryParams.toString();
};

/**
 * 배열 정규화 유틸리티 함수
 * @param input - 문자열
 * @returns 문자열을 "\n" | "," | ", " 기준으로 분리하고 공백 제거 후 빈 항목 제거하여 배열 반환
 */
export const normalizeToArray = (input: string): string[] => {
  if (!input) return [];

  const array = input
    .split(/[\n,]+/) // \n, , 또는 ,(공백 포함) 기준으로 분리
    .map((item) => item.trim()) // 앞뒤 공백 제거
    .filter((item) => item.length > 0); // 빈 문자열 제거

  return array;
};
