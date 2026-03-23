import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { DashboardStatus } from "@/features/dashboard/models/types";
import { IntegratedOrderRequest } from "@/features/integrated-order-list/models/types";

import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import { OrderSearchRequestChannelTypesEnum } from "@/shared/generated/oms/types/Order";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

interface DefaultParams {
  page: number;
  size: number;
  channelTypes: string[];
}

const _selectedPermission = [
  {
    brand: {
      name: "GENTLE_MONSTER",
      description: "GM",
    },
    corporations: [
      {
        name: "JP",
        channels: [
          { name: "GM_ONLINE", description: "공식 온라인몰" },
          { name: "GM_HAUS_OFFLINE", description: "오프라인 스토어" },
          { name: "GM_SNS", description: "인스타그램 / 소셜 채널" },
          { name: "GM_WHOLESALE", description: "도매 / 리테일 파트너" },
        ],
      },
    ],
  },
  {
    brand: {
      name: "TAMBURINS",
      description: "TAM",
    },
    corporations: [
      {
        name: "JP",
        channels: [
          { name: "TAM_ONLINE", description: "공식 온라인몰" },
          { name: "TAM_HAUS_OFFLINE", description: "오프라인 스토어" },
          { name: "TAM_SNS", description: "인스타그램 / 소셜 채널" },
          { name: "TAM_WHOLESALE", description: "도매 / 리테일 파트너" },
        ],
      },
    ],
  },
];

// 파라미터 업데이트 로직을 위한 커스텀 훅
export const useDashboardParams = (dashboardStatus: DashboardStatus | null) => {
  const { selectedPermission } = useUserPermissionStore();

  const channelTypes = useMemo(() => {
    return selectedPermission.flatMap((permission) =>
      permission.corporations.flatMap((corporation) =>
        corporation.channels.map((channel) => channel.name),
      ),
    );
  }, [selectedPermission]);

  const defaultParams = useMemo<DefaultParams>(
    () => ({
      page: 0,
      size: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
      channelTypes,
    }),
    [channelTypes],
  );

  const [params, setParams] = useState<IntegratedOrderRequest>(
    defaultParams as IntegratedOrderRequest,
  );

  // channelTypes 변경 시 파라미터 업데이트
  useEffect(() => {
    setParams({
      ...defaultParams,
      channelTypes: channelTypes as OrderSearchRequestChannelTypesEnum[],
    });
  }, [channelTypes, defaultParams]);

  // 상태별 파라미터 생성 함수
  const getStatusParams = (
    group: string,
    category: string,
    status: string[],
  ) => {
    switch (group) {
      case "order":
        if (category === "shippingClosed" || category === "shipping") {
          return { shipmentStatuses: status };
        }
        return { orderStatuses: status };
      case "return":
        return { returnStatuses: status };
      case "exchange":
        return { exchangeStatuses: status };
      default:
        return {};
    }
  };

  // 기간별 파라미터 생성 함수
  const getPeriodParams = (category: string) => {
    if (category === "finalized" || category === "shippingClosed") {
      return {
        from: dayjs().startOf("day").subtract(30, "day").toISOString(),
        to: dayjs().endOf("day").toISOString(),
      };
    }
    return {};
  };

  // 대시보드 상태 변경 시 파라미터 업데이트
  useEffect(() => {
    if (!dashboardStatus) return;

    const { group, category, status } = dashboardStatus;
    const newParams = {
      ...defaultParams,
      ...getStatusParams(group, category, status),
      ...getPeriodParams(category),
    };

    setParams(newParams as IntegratedOrderRequest);
  }, [dashboardStatus, defaultParams, channelTypes]);

  return {
    params,
    setParams,
    defaultParams,
  };
};
