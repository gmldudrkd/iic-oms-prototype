export type GroupType = "order" | "return" | "exchange";
export type CategoryType =
  | "awaiting"
  | "inProgress"
  | "shipping"
  | "shippingClosed"
  | "finalized";

// 대시보드 아이템
export interface DashboardItem {
  label: string;
  count: number;
}

// 대시보드 섹션
export interface DashboardSection {
  items: DashboardItem[];
  totalCount?: number;
}

// 기본 그룹 구조
export interface BaseDashboardGroup {
  awaiting: DashboardSection;
  inProgress: DashboardSection;
  finalized: DashboardSection;
}

// Order 그룹만 shipping 관련 카테고리 추가
export interface OrderDashboardGroup extends BaseDashboardGroup {
  shipping: DashboardSection;
  shippingClosed: DashboardSection;
}

export interface DashboardState {
  order: OrderDashboardGroup;
  return: BaseDashboardGroup;
  exchange: BaseDashboardGroup;
}

export interface DashboardStatus {
  group: GroupType;
  category: CategoryType;
  status: string[];
}

// 타입 가드로 단순화
export const isOrderGroup = (group: GroupType): group is "order" =>
  group === "order";

// 대시보드 상태 카드 데이터 조회 함수
export const getDashboardSection = (
  data: DashboardState | undefined,
  group: GroupType,
  category: CategoryType,
): DashboardSection | undefined => {
  if (!data) return undefined;

  const groupData = data[group];

  if (isOrderGroup(group)) {
    // Order 그룹은 모든 카테고리를 가짐
    return (groupData as OrderDashboardGroup)[category];
  } else {
    // Return/Exchange 그룹은 shipping 관련 카테고리 제외
    if (category === "shipping" || category === "shippingClosed") {
      return undefined;
    }
    return groupData[category as keyof BaseDashboardGroup] as DashboardSection;
  }
};
