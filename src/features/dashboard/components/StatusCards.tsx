// 대시보드 카드 컴포넌트
import { Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";

import {
  CategoryType,
  GroupType,
  DashboardStatus,
  DashboardItem,
} from "@/features/dashboard/models/types";

import {
  capitalizeAllLetters,
  snakeToTitleCase,
} from "@/shared/utils/stringUtils";

export function StatusCards({
  isMore,
  group,
  category,
  items,
  dashboardStatus,
  setDashboardStatus,
}: {
  isMore: boolean;
  group: GroupType;
  category: CategoryType;
  items: DashboardItem[] | undefined;
  dashboardStatus: DashboardStatus | null;
  setDashboardStatus: (status: DashboardStatus) => void;
}) {
  // 각 아이템에 대한 클릭 핸들러
  const handleClick = (itemLabel: string) => {
    console.log("group", group, "category", category, "itemLabel", itemLabel);
    setDashboardStatus({
      group,
      category,
      // capitalizeAllLetters 함수를 사용하여 상태 이름 형식 통일
      status: [capitalizeAllLetters(itemLabel)],
    });
  };

  // isMore가 false이면 아무것도 렌더링하지 않음
  if (!isMore) {
    return null;
  }

  return (
    <Grid container className="mt-[16px] !gap-y-[12px]">
      {!items && (
        <Grid size={6}>
          <div>
            <p>
              <Skeleton width={80} height={24} variant="text" />
            </p>
            <p className="mt-[4px]">
              <Skeleton width={60} height={28} variant="text" />
            </p>
          </div>
        </Grid>
      )}
      {items &&
        items.map((item) => {
          // 현재 아이템이 활성 상태인지 확인
          const itemStatusIdentifier = capitalizeAllLetters(item.label);
          const isActive =
            dashboardStatus?.group === group &&
            dashboardStatus?.category === category &&
            dashboardStatus?.status?.includes(itemStatusIdentifier);

          return (
            <Grid
              key={`${group}-${category}-${item.label}`}
              size={{ md: 12, lg: 6 }}
            >
              <div>
                <p>
                  <button
                    className={`text-left text-[14px] capitalize text-[rgba(0,0,0,0.60)] ${
                      isActive
                        ? "font-bold text-primary underline"
                        : "font-medium hover:text-text-primary hover:underline"
                    }`}
                    onClick={() => handleClick(item.label)}
                  >
                    {snakeToTitleCase(item.label)}:
                  </button>
                </p>
                <p className="mt-[4px] text-[16px] font-bold">
                  {item.count || 0}
                </p>
              </div>
            </Grid>
          );
        })}
    </Grid>
  );
}
