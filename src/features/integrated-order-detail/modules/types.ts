import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { FieldValues } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form";

import {
  JusoApiResponse,
  OpenCageResponse,
} from "@/features/integrated-order-detail/models/types";

export type ClaimModalType = "DEFAULT" | "LOST";

export interface TAddressForm {
  // recipientName: string;
  recipientFirstName: string;
  recipientLastName: string;
  phoneCountryNo?: string;
  recipientPhone: string;
  address1: string;
  address2: string;
  city: string;
  stateProvince: string;
  postcode: string;
  countryRegion: string;
}

export interface FormField {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export interface AddressFormProps {
  title?: string;
  disabled?: boolean;
  syncButton?: React.ReactNode;
}

export interface AddressAutocompleteProps {
  field: ControllerRenderProps<FieldValues, "address1">;
  inputValue: string;
  onInputChange: (
    event: React.SyntheticEvent,
    newValue: string,
    reason: string,
  ) => void;
  options: (JusoApiResponse | OpenCageResponse)[];
  loading: boolean;
  renderAddressInput: (
    params: AutocompleteRenderInputParams,
  ) => React.ReactNode;
  onAddressSelect?: (
    selectedResult: JusoApiResponse | OpenCageResponse | null,
  ) => void;
  disabled?: boolean;
}
