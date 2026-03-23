import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMemo, useState } from "react";

import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { useDashboardParams } from "@/features/dashboard/hooks/useDashboardParams";
import { useGetDashboard } from "@/features/dashboard/hooks/useGetDashboard";
import { transformDashboardData } from "@/features/dashboard/models/transforms";
import { DashboardStatus } from "@/features/dashboard/models/types";
import { SECTION_DATA } from "@/features/dashboard/modules/constants";
import DataGridWrap from "@/features/integrated-order-list/components/DataGridWrap";
import { useGetIntegratedOrderList } from "@/features/integrated-order-list/hooks/useGetIntegratedOrderList";

import { ExchangeSearchRequest } from "@/shared/generated/oms/types/Exchange";
import { OrderSearchRequest } from "@/shared/generated/oms/types/Order";
import { OrderSummaryRequestChannelTypesEnum } from "@/shared/generated/oms/types/OrderDashboard";
import { ReturnSearchRequest } from "@/shared/generated/oms/types/Return";
import useCurrentTime from "@/shared/hooks/useCurrentTime";

import IconArrow from "@/assets/icons/IconArrow";

const _dataIntegratedOrderList = {
  data: [
    {
      orderId: "751798973689087458",
      originOrderNo: "NF2509050AIOM1DOSY",
      channelType: {
        name: "NUFLAAT_OFFICIAL",
        description: "OWN_KR",
      },
      orderedAt: "2025-09-05T13:37:57Z",
      status: {
        name: "COMPLETED",
        description: "Completed",
      },
      shipments: [
        {
          shipmentId: "a",
          shipmentNo: "a",
          status: {
            name: "DELIVERED",
            description: "Delivered",
          },
          trackingNo: "1,2",
        },
        {
          shipmentId: "b",
          shipmentNo: null,
          status: {
            name: "DELIVERED2",
            description: "Delivered2",
          },
          trackingNo: "1",
        },
      ],
    },
  ],
};

export default function OrderDashboard() {
  const [isMore, setIsMore] = useState(true);

  const [dashboardStatus, setDashboardStatus] =
    useState<DashboardStatus | null>(null);

  // 대시보드 파라미터 관리
  const { params, setParams } = useDashboardParams(dashboardStatus);

  // 📍 대시보드 summary API
  const {
    data,
    isFetching,
    isSuccess,
    refetch: refetchDashboard,
  } = useGetDashboard(
    {
      channelTypes:
        params.channelTypes as unknown as OrderSummaryRequestChannelTypesEnum[],
    },
    {
      enabled: (params.channelTypes?.length || 0) > 0,
    },
  );

  const dataDashboard = useMemo(
    () => data && transformDashboardData(data),
    [data],
  );

  // 📍 대시보드 목록 API
  const {
    data: dataIntegratedOrderList,
    isSuccess: isSuccessIntegratedOrderList,
    isFetching: isFetchingIntegratedOrderList,
    refetch: refetchList,
  } = useGetIntegratedOrderList(dashboardStatus?.group || null, params);

  const { UpdatedAt } = useCurrentTime({
    isFetching,
    isSuccess,
  });

  // 새로고침 핸들러
  const handleRefresh = () => refetchDashboard();

  return (
    <>
      <div className="relative mb-[24px] border-b border-outlined bg-white px-[24px] pb-[24px]">
        <div className="absolute right-[24px] top-[-48px] flex items-center gap-[8px]">
          <UpdatedAt />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isFetching}
          >
            {isFetching ? "Updating" : "Refresh"}
          </Button>
        </div>

        {/* 대시보드 */}
        <div className="rounded-[6px] border-[1px] border-solid border-[#E0E0E0]">
          <Grid container className="divide-x divide-[#E0E0E0]">
            {SECTION_DATA.map((section) => (
              <DashboardSection
                key={section.group}
                section={section}
                data={dataDashboard}
                isMore={isMore}
                dashboardStatus={dashboardStatus}
                setDashboardStatus={setDashboardStatus}
              />
            ))}
          </Grid>

          <div className="border-t-[1px] border-solid border-[#E0E0E0] px-[16px] text-center font-medium">
            <Button
              variant="text"
              className="w-full text-[15px] text-order hover:bg-transparent"
              size="medium"
              disableRipple
              onClick={() => setIsMore(!isMore)}
            >
              <span className="flex w-full items-center justify-center py-[10px]">
                {isMore ? "Show less" : "Show more"}
                {isMore ? <IconArrow /> : <IconArrow className="rotate-180" />}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* 데이터 그리드 */}
      {dashboardStatus !== null && (
        <DataGridWrap
          dashboardGroup={dashboardStatus.group}
          params={
            params as
              | OrderSearchRequest
              | ReturnSearchRequest
              | ExchangeSearchRequest
          }
          setParams={setParams}
          data={dataIntegratedOrderList || null}
          isSuccess={isSuccessIntegratedOrderList}
          isFetching={isFetchingIntegratedOrderList}
          refetchList={refetchList}
          refetchDashboard={refetchDashboard}
        />
      )}
    </>
  );
}
