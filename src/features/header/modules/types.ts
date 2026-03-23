import { SelectChangeEvent } from "@mui/material";

import { UserResponse } from "@/shared/generated/auth/types/User";
import { EnumResponse } from "@/shared/generated/oms/types/common";

export interface BrandCorpOption {
  label: string;
  value: {
    brand: EnumResponse;
    corporation: string;
  };
}

export interface UseBrandCorpFilterProps {
  data: UserResponse;
}

export interface UseBrandCorpFilterReturn {
  selected: string[];
  options: BrandCorpOption[];
  isShowError: boolean;
  open: boolean;
  isAllSelected: boolean;
  handleChange: (event: SelectChangeEvent<unknown>) => void;
  handleClose: (event: React.SyntheticEvent) => void;
  handleOpen: () => void;
}
