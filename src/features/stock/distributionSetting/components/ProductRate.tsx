import { ThemeProvider } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import SearchForm from "@/features/stock/distributionSetting/components/SearchForm";
import useGetChannelStockSetting from "@/features/stock/distributionSetting/hooks/useGetChannelStockSetting";
import { transformChannelStockSetting } from "@/features/stock/distributionSetting/models/transform";
import { ProductRateSearchForm } from "@/features/stock/distributionSetting/models/types";
import {
  COLUMNS_PRODUCT,
  GROUPING_PRODUCT,
} from "@/features/stock/distributionSetting/modules/columns";

import Title from "@/shared/components/text/Title";
import { useSingleBrandAndCorp } from "@/shared/hooks/useSingleBrandAndCorp";
import { MUIDataGridOrderDetailTheme } from "@/shared/styles/theme";

export default function ProductRate() {
  const { brand, corporation } = useSingleBrandAndCorp();
  const defaultValues = useMemo(
    () => ({
      brand,
      corporation,
      searchKeyType: "productCodes",
      searchKeyword: "",
    }),
    [brand, corporation],
  );
  const methods = useForm<ProductRateSearchForm>({
    defaultValues,
    mode: "onChange",
  });

  const [params, setParams] = useState(defaultValues);

  // 📍 Channel Stock Setting API
  const { data, refetch, isFetching } = useGetChannelStockSetting(params);
  const rows = useMemo(() => transformChannelStockSetting(data), [data]);

  useEffect(() => {
    methods.reset();
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <Title text="Product Rate" variant="bordered" />
      <SearchForm setParams={setParams} data={data} refetch={refetch} />
      <ThemeProvider theme={MUIDataGridOrderDetailTheme}>
        <DataGridPro
          rows={rows}
          columns={COLUMNS_PRODUCT}
          columnGroupingModel={GROUPING_PRODUCT}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
          disableColumnResize
          disableDensitySelector
          hideFooter
          loading={isFetching}
          getRowHeight={() => "auto"}
          sx={{ minHeight: 400 }}
        />
      </ThemeProvider>
    </FormProvider>
  );
}
