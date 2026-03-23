import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";
import {
  CHANNEL_SEND_STATUS_LIST,
  CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES,
} from "@/features/stock/overview/modules/constants";

import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import {
  StockDashboardRequestBrandEnum,
  StockDashboardRequestChannelTypesEnum,
  StockDashboardRequestCorporationEnum,
  StockDashboardRequestProductTypeEnum,
} from "@/shared/generated/oms/types/Stock";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export default function useStockOverviewFilterForm() {
  // Zustand store에서 selectedPermission 가져오기
  const { selectedPermission } = useUserPermissionStore();

  // selectedPermission이 변경될 때마다 channelList와 defaultValues 재계산
  const channelList: {
    label: string;
    value: StockDashboardRequestChannelTypesEnum;
  }[] = useMemo(() => {
    if (!selectedPermission[0]?.corporations[0]?.channels) return [];
    return selectedPermission[0].corporations[0].channels.map((channel) => ({
      label: channel.description ?? "",
      value: channel.name as StockDashboardRequestChannelTypesEnum,
    }));
  }, [selectedPermission]);

  const defaultValues: StockDashboardRequestForm = useMemo(
    () => ({
      brand: selectedPermission[0]?.brand
        ?.name as StockDashboardRequestBrandEnum,
      channelTypes: ["All", ...channelList.map((channel) => channel.value)],
      corporation: selectedPermission[0]?.corporations[0]
        ?.name as StockDashboardRequestCorporationEnum,
      hasPreorderQuantity: "All",
      hasSafetyQuantity: "All",
      page: 0,
      productTypes: [StockDashboardRequestProductTypeEnum.SINGLE],
      productCodes: [],
      size: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
      skus: [],
      currentSearchKeyType: CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODES,
      searchKeyword: "",
      channelSendStatus: [
        "All",
        ...CHANNEL_SEND_STATUS_LIST.map((status) => status.value),
      ],
    }),
    [selectedPermission, channelList],
  );

  const form = useForm<StockDashboardRequestForm>({
    defaultValues,
    mode: "onChange",
  });

  // selectedPermission이 변경되면 form 업데이트
  // 단, pagination(page, size)은 유지
  useEffect(() => {
    const currentPage = form.getValues("page");
    const currentSize = form.getValues("size");

    form.reset({
      ...defaultValues,
      page: currentPage,
      size: currentSize,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPermission]);

  return {
    selectedPermission,
    defaultValues,
    channelList,
    form,
  };
}
