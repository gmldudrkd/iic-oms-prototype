import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import SearchField from "@/features/stock/overview/components/shared/SearchField";
import { StockDashboardRequestForm } from "@/features/stock/overview/models/types";
import {
  PRODUCT_TYPE_LIST,
  SHOW_ONLY_SAFETY_STOCK_LIST,
} from "@/features/stock/overview/modules/constants";

import CustomSelectCheckbox from "@/shared/components/form-elements/CustomSelectCheckbox";
import FormActions from "@/shared/components/form-elements/FormActions";

interface OnlineStockSearchFilterProps {
  control: Control<StockDashboardRequestForm>;
  channelList: { label: string; value: string }[];
  onSearch: () => void;
  onReset: () => void;
}

export default function OnlineStockSearchFilter({
  control,
  channelList,
  onSearch,
  onReset,
}: OnlineStockSearchFilterProps) {
  return (
    <Box
      border="1px solid #E0E0E0"
      borderRight="0px"
      borderLeft="0px"
      bgcolor="white"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        padding="24px 40px"
      >
        <Box display="flex" gap="10px" flexWrap="wrap">
          <FormControl sx={{ width: "200px" }}>
            <CustomSelectCheckbox
              control={control}
              selectList={channelList}
              placeholder="Select"
              labelName="Channel"
              name="channelTypes"
              enableAllOption={true}
              selectProps={{
                multiple: true,
              }}
            />
          </FormControl>

          <FormControl sx={{ width: "150px" }}>
            <CustomSelectCheckbox
              control={control}
              selectList={PRODUCT_TYPE_LIST}
              placeholder="Select"
              labelName="Product Type"
              name="productTypes"
              enableAllOption={true}
              selectProps={{
                multiple: true,
              }}
            />
          </FormControl>

          <FormControl sx={{ width: "200px" }}>
            <Controller
              control={control}
              name="hasSafetyQuantity"
              render={({ field }) => (
                <>
                  <InputLabel shrink={true}>Safety Stock Filter</InputLabel>
                  <Select {...field} label="Safety Stock Filter">
                    {SHOW_ONLY_SAFETY_STOCK_LIST.map((item) => (
                      <MenuItem
                        key={String(item.value ?? "")}
                        value={String(item.value ?? "")}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
          </FormControl>

          <FormControl>
            <SearchField />
          </FormControl>
        </Box>

        <FormActions
          onReset={onReset}
          onSubmitClick={onSearch}
          hasStartIcon={false}
        />
      </Box>
    </Box>
  );
}
