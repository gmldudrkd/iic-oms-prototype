import { Chip } from "@mui/material";

export const renderCellProductType = (params: { value: string }) => {
  const isBundle = params.value === "Bundle";
  return (
    <div className="w-full divide-y divide-solid divide-[#E0E0E0]">
      <Chip
        label={params.value}
        color={isBundle ? "primary" : "default"}
        variant="outlined"
        size="small"
      />
    </div>
  );
};

export const renderCellStatus = (params: { value: boolean }) => {
  return (
    <div className="w-full divide-y divide-solid divide-[#E0E0E0]">
      <Chip
        label={params.value ? "Complete" : "Incomplete"}
        color={params.value ? "default" : "error"}
        size="small"
      />
    </div>
  );
};
