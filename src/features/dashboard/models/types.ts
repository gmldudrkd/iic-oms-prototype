export type GroupType =
  | "order"
  | "shipment"
  | "storePickup"
  | "return"
  | "exchange"
  | "reshipment";
export type CategoryType = "awaiting" | "inProgress" | "finalized";

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
  inProgress: DashboardSection;
  finalized: DashboardSection;
}

// Order 그룹만 shipping 관련 카테고리 추가
export interface AddAwaitDashboardGroup extends BaseDashboardGroup {
  awaiting: DashboardSection;
}

export interface DashboardState {
  order: AddAwaitDashboardGroup;
  shipment: BaseDashboardGroup;
  storePickup: BaseDashboardGroup;
  return: AddAwaitDashboardGroup;
  exchange: AddAwaitDashboardGroup;
  reshipment: BaseDashboardGroup;
}

export interface DashboardStatus {
  group: GroupType;
  category: CategoryType;
  status: string[];
}

// 대시보드 상태 카드 데이터 조회 함수
export const getDashboardSection = (
  data: DashboardState | undefined,
  group: GroupType,
  category: CategoryType,
): DashboardSection | undefined => {
  if (!data) return undefined;

  const groupData = data[group as keyof DashboardState];
  return groupData[category as keyof typeof groupData];
};
