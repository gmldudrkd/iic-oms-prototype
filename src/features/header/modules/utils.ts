/**
 * 선택된 값들을 표시용 문자열로 변환
 */
export const formatSelectedValue = (selected: string[]): string => {
  const selectedArray = selected as string[];
  if (!Array.isArray(selectedArray) || selectedArray.length === 0) return "";
  if (selectedArray.length <= 2) return selectedArray.join(", ");
  return `${selectedArray.slice(0, 2).join(", ")} ...`;
};
