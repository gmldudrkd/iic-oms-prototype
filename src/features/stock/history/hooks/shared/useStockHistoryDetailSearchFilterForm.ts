import dayjs from "dayjs";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { StockHistoryDetailParamsForm } from "@/features/stock/history/models/types";

import {
  OnlineStockHistoryRequestBrandEnum,
  OnlineStockHistoryRequestCorporationEnum,
} from "@/shared/generated/oms/types/Stock";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export default function useStockHistoryDetailSearchFilterForm() {
  const { selectedPermission } = useUserPermissionStore();

  const defaultValues: StockHistoryDetailParamsForm =
    useMemo<StockHistoryDetailParamsForm>(
      () => ({
        onlineStockHistory: {
          brand: selectedPermission[0]?.brand
            ?.name as OnlineStockHistoryRequestBrandEnum,
          corporation: selectedPermission[0]?.corporations[0]
            ?.name as OnlineStockHistoryRequestCorporationEnum,
          events: [],
          from: dayjs().startOf("day").toISOString(),
          to: dayjs().endOf("day").toISOString(),
        },
        channelStockHistory: {
          channelTypes: "",
          events: [],
          from: dayjs().startOf("day").toISOString(),
          to: dayjs().endOf("day").toISOString(),
        },
        sku: "",
        productName: "",
      }),
      [selectedPermission],
    );

  const form = useForm<StockHistoryDetailParamsForm>({
    defaultValues,
    mode: "onChange",
  });

  return { form, defaultValues };
}
