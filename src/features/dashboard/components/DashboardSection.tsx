import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { DashboardTitle } from "@/features/dashboard/components/DashboardTitle";
import { StatusCards } from "@/features/dashboard/components/StatusCards";
import { StatusTotalTitle } from "@/features/dashboard/components/StatusTotalTitle";
import {
  DashboardState,
  DashboardStatus,
  getDashboardSection,
  GroupType,
} from "@/features/dashboard/models/types";
import {
  CATEGORY_DATA,
  CATEGORY_LABEL_DATA,
} from "@/features/dashboard/modules/constants";

interface DashboardSectionProps {
  section: {
    group: GroupType;
    icon: JSX.Element;
  };
  data: DashboardState | undefined;
  isMore: boolean;
  dashboardStatus: DashboardStatus | null;
  setDashboardStatus: (status: DashboardStatus | null) => void;
}

export const DashboardSection = ({
  section,
  data,
  isMore,
  dashboardStatus,
  setDashboardStatus,
}: DashboardSectionProps) => {
  return (
    <Grid key={section.group} size={4} className="divide-y divide-[#E0E0E0]">
      <DashboardTitle
        title={section.group}
        color={section.group}
        icon={section.icon}
      />

      {CATEGORY_DATA[section.group].map((category) => {
        // if (!isMore && category === "finalized") {
        //   return null;
        // }

        return (
          <Stack key={category} className="p-[16px]">
            <StatusTotalTitle
              label={
                CATEGORY_LABEL_DATA[
                  category as keyof typeof CATEGORY_LABEL_DATA
                ]
              }
              color={section.group}
              count={
                getDashboardSection(data, section.group, category)?.totalCount
              }
            />
            {
              <StatusCards
                isMore={isMore}
                group={section.group}
                category={category}
                dashboardStatus={dashboardStatus}
                setDashboardStatus={setDashboardStatus}
                items={
                  getDashboardSection(data, section.group, category)?.items
                }
              />
            }
          </Stack>
        );
      })}
    </Grid>
  );
};
