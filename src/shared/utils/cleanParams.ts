/**
 * 빈 파라미터 제거 유틸리티 함수
 * @param params - 파라미터 객체
 * @returns 빈 파라미터가 제거된 객체
 */
export function cleanEmptyParams<T extends object>(params: T): Partial<T> {
  const cleanedParams = { ...params };

  (Object.keys(cleanedParams) as (keyof T)[]).forEach((key) => {
    const value = cleanedParams[key];

    if (
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && (value.length === 0 || value[0] === ""))
    ) {
      delete cleanedParams[key];
    }
  });

  return cleanedParams;
}
