import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { StockHistorySearchFilterForm } from "@/features/stock/history/models/types";
import { CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE } from "@/features/stock/history/modules/constants";

import {
  StockHistorySearchRequestBrandEnum,
  StockHistorySearchRequestCorporationEnum,
  StockHistorySearchRequestPeriodTypeEnum,
} from "@/shared/generated/oms/types/Stock";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export default function useStockHistorySearchFilterForm() {
  const { timezone } = useTimezoneStore();
  const { selectedPermission } = useUserPermissionStore();

  const defaultValues: StockHistorySearchFilterForm = useMemo(
    () => ({
      brand: selectedPermission[0]?.brand
        ?.name as StockHistorySearchRequestBrandEnum,
      corporation: selectedPermission[0]?.corporations[0]
        ?.name as StockHistorySearchRequestCorporationEnum,
      sku: "",
      productCode: "",
      productName: "",
      from: dayjs().startOf("day").toISOString(),
      to: dayjs().endOf("day").toISOString(),
      periodType: StockHistorySearchRequestPeriodTypeEnum.HOURLY,
      zoneId: timezone,
      currentSearchKeyType: CURRENT_SEARCH_KEY_TYPE_PRODUCT_CODE,
      searchKeyword: "",
    }),
    [selectedPermission, timezone],
  );

  const form = useForm<StockHistorySearchFilterForm>({
    defaultValues,
    mode: "onChange",
  });

  // selectedPermission이 변경되면 form 업데이트
  useEffect(() => {
    form.reset(defaultValues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPermission]);

  const [searchParams, setSearchParams] =
    useState<StockHistorySearchFilterForm | null>(null);

  return { form, defaultValues, searchParams, setSearchParams };
}
