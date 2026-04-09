import { ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import DataGridWrap from "@/features/integrated-order-list/components/DataGridWrap";
import SearchForm from "@/features/integrated-order-list/components/SearchForm";
import { useGetIntegratedOrderList } from "@/features/integrated-order-list/hooks/useGetIntegratedOrderList";

import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import { ExchangeSearchRequest } from "@/shared/generated/oms/types/Exchange";
import { OrderSearchRequest } from "@/shared/generated/oms/types/Order";
import { ReshipmentSearchRequest } from "@/shared/generated/oms/types/Reshipment";
import { ReturnSearchRequest } from "@/shared/generated/oms/types/Return";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface IntegratedOrderListProps {
  group: "order" | "return" | "exchange" | "reshipment";
}

export default function IntegratedOrderList({
  group,
}: IntegratedOrderListProps) {
  const { timezone } = useTimezoneStore();
  const { selectedPermission } = useUserPermissionStore();
  const channelTypes = useMemo(
    () =>
      selectedPermission.flatMap((item) => {
        return item.corporations.flatMap((corp) => {
          return corp.channels.map((channel) => {
            return {
              label: channel.description,
              value: channel.name,
            };
          });
        });
      }),
    [selectedPermission],
  );

  // useForm 초기값
  const defaultValues = useMemo(
    () => ({
      searchKeyType: "originOrderNos",
      searchKeyword: "",
      statusFilter: [],
      shippingStatusFilter: [],
      channelTypes: [],
      period: [
        dayjs().tz(timezone).startOf("day"),
        dayjs().tz(timezone).endOf("day"),
      ],

      orderAttributeFilter: {
        receiveMethods: [],
        types: [],
        tags: [],
      },
      labelPrint: "all",
    }),
    [timezone],
  );

  // 각 타입별 초기 파라미터 정의 - 타입 안정성 보장
  const getInitialParams = (
    group: "order" | "return" | "exchange" | "reshipment",
  ) => {
    const common = {
      page: 0,
      size: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
      from: defaultValues.period[0].toISOString(),
      to: defaultValues.period[1].toISOString(),
      channelTypes: defaultValues.channelTypes,
      originOrderNos: [],
    };

    if (group === "order") {
      return {
        ...common,
        shipmentNos: [],
        skus: [],
        orderStatuses: [],
        shipmentStatuses: [],
      };
    }
    if (group === "return") {
      return {
        ...common,
        returnStatuses: [],
        returnNos: [],
      };
    }
    if (group === "reshipment") {
      return {
        ...common,
        reshipmentStatuses: [],
        reshipmentNos: [],
      };
    }
    // exchange
    return {
      ...common,
      exchangeStatuses: [],
      exchangeNos: [],
    };
  };

  const [params, setParams] = useState<
    | OrderSearchRequest
    | ReturnSearchRequest
    | ExchangeSearchRequest
    | ReshipmentSearchRequest
  >(() => getInitialParams(group));

  // useForm 초기화
  const methods = useForm({ defaultValues });

  // 📍 대시보드 데이터 그리드 리스트 API
  const { data, isSuccess, isFetching, refetch } = useGetIntegratedOrderList(
    group,
    params,
  );

  // period 변경 시 검색 폼 업데이트
  useEffect(() => {
    methods.setValue("period", [
      dayjs().tz(timezone).startOf("day"),
      dayjs().tz(timezone).endOf("day"),
    ]);
  }, [timezone, methods]);

  // channelTypes 변경 시 검색 폼 업데이트
  useEffect(() => {
    methods.setValue(
      "channelTypes",
      channelTypes.map((channel) => channel.value) as never[],
    );

    setParams((prev) => ({
      ...prev,
      channelTypes: channelTypes.map((channel) => channel.value) as never[],
    }));
  }, [channelTypes, methods, setParams]);

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-[24px]">
          <div className="border-b border-outlined bg-white">
            <div className="px-[24px]">
              <SearchForm
                group={group}
                params={params}
                setParams={setParams}
                refetch={refetch}
              />
            </div>
          </div>

          <DataGridWrap
            dashboardGroup={group}
            params={params}
            setParams={setParams}
            data={data || null}
            isSuccess={isSuccess}
            isFetching={isFetching}
            refetchList={refetch}
          />
        </div>
      </FormProvider>
    </ThemeProvider>
  );
}
