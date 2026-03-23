import { Button, FormControl } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, useFormContext } from "react-hook-form";

import ProductRatioEdit from "@/features/stock/distributionSetting/components/ModalEdit";
import SearchField from "@/features/stock/distributionSetting/components/SearchField";

import { ChannelStockSettingResponse } from "@/shared/generated/oms/types/Stock";
import { useSingleBrandAndCorp } from "@/shared/hooks/useSingleBrandAndCorp";

interface Props {
  setParams: Dispatch<
    SetStateAction<{
      brand: string;
      corporation: string;
      searchKeyType: string;
      searchKeyword: string;
    }>
  >;
  data: ChannelStockSettingResponse[];
  refetch: () => void;
}

export default function SearchForm({ setParams, data, refetch }: Props) {
  const { brand, corporation } = useSingleBrandAndCorp();
  const { handleSubmit } = useFormContext();

  const handleSearch = ({ searchKeyType, searchKeyword }: FieldValues) => {
    setParams({ brand, corporation, searchKeyType, searchKeyword });
  };

  return (
    <div className="flex items-center justify-between p-[24px]">
      <FormControl fullWidth>
        <SearchField />
      </FormControl>

      <div className="flex items-center gap-[8px]">
        <ProductRatioEdit data={data} refetch={refetch} />
        <Button
          onClick={handleSubmit(handleSearch)}
          variant="contained"
          // startIcon={<SearchIcon fontSize="small" />}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
